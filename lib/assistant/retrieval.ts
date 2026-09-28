import {cachedRetrieval,overlayData,recordFeedback,hash} from './shared/library';
import {libraryQuery} from './shared/database';
import type {RankedPassage} from './knowledge/retrieve';
import { embedIcdUTexts } from "./embeddings";
import { searchKnowledgeByVector } from "./knowledge-store";
import {
  keywordRetrieval,
  mergePassages,
  type RetrievalPacket,
} from "./knowledge/retrieve";
import { logAssistantEvent } from "./logging";

const KEYWORD_LIMITATION =
  "Embedding search was unavailable, so these matches are keyword matches from published Overture pages.";
const INDEX_LIMITATION =
  "The vector index is not available, so these matches are keyword matches from published Overture pages.";

/**
 * Retrieve a few published passages before generation.
 * Ingestion never runs here. A failed embedding call falls back to keyword search.
 */
async function retrieveUncached(
  query: string,
  options: {
    embed: boolean;
    apiKey?: string;
    baseUrl?: string;
    signal?: AbortSignal;
    parentSignal?: AbortSignal;
  }
): Promise<RetrievalPacket> {
  let keyword = keywordRetrieval(query, 4);
  let exclude:string[]=[];
  try{const overlay=await overlayData(libraryQuery,'overture',query);exclude=overlay.exclude;
    const extra:RankedPassage[]=overlay.hits.map(r=>({chunkId:r.id,documentId:r.document_id,title:r.title,sourceUrl:r.sourceUrl,content:r.content,contentHash:hash(r.content),score:Number(r.score)+1,match:'keyword'}));
    const passages=mergePassages(extra,keyword.passages.filter(p=>!exclude.includes(p.documentId)),4);
    keyword={...keyword,passages,sourceIds:passages.map(p=>p.chunkId)};
  }catch(error){
    // Old deployments can run before the additive migration. Other database failures
    // cannot safely resurrect a document the editor may have retired.
    if((error as {code?:string}).code!=='42P01' && process.env.DATABASE_URL)
      return {passages:[],mode:'keyword',limitation:'The knowledge library is temporarily unavailable.',sourceIds:[]};
  }
  if (!options.embed || !options.apiKey || !options.baseUrl || !query.trim()) {
    return keyword;
  }

  let vectorQuery: number[] | null = null;
  try {
    const [vector] = await embedIcdUTexts([query.slice(0, 2_000)], {
      apiKey: options.apiKey,
      baseUrl: options.baseUrl,
      signal: options.signal,
      priority: "interactive",
      maxAttempts: 1,
    });
    vectorQuery = vector ?? null;
  } catch (error) {
    if (options.parentSignal?.aborted) {
      throw error;
    }
    const packet: RetrievalPacket = {
      ...keyword,
      limitation: KEYWORD_LIMITATION,
    };
    logAssistantEvent("assistant.retrieval", {
      source: "overture-knowledge",
      mode: packet.mode,
      sourceIds: packet.sourceIds.join(","),
      vector: "unavailable",
    });
    return packet;
  }

  const vectorHits = vectorQuery ? await searchKnowledgeByVector(vectorQuery, 4) : null;
  if (!vectorHits) {
    const packet: RetrievalPacket = { ...keyword, limitation: INDEX_LIMITATION };
    logAssistantEvent("assistant.retrieval", {
      source: "overture-knowledge",
      mode: "keyword",
      sourceIds: packet.sourceIds.join(","),
      vector: "index-unavailable",
    });
    return packet;
  }

  let managed:RankedPassage[]=[];
  if(vectorQuery)try{const overlay=await overlayData(libraryQuery,'overture',query,vectorQuery);exclude=overlay.exclude;
    managed=overlay.hits.map(r=>({chunkId:r.id,documentId:r.document_id,title:r.title,sourceUrl:r.sourceUrl,content:r.content,contentHash:hash(r.content),score:Number(r.score),match:'vector'}));
  }catch{}
  const passages = mergePassages(keyword.passages, [...managed,...vectorHits.filter(p=>!exclude.includes(p.documentId))], 4);
  const packet: RetrievalPacket = {
    passages,
    mode: "keyword+vector",
    limitation: null,
    sourceIds: passages.map((passage) => passage.chunkId),
  };
  logAssistantEvent("assistant.retrieval", {
    source: "overture-knowledge",
    mode: packet.mode,
    sourceIds: packet.sourceIds.join(","),
    vector: "used",
  });
  return packet;
}

export async function retrieveForVisitor(query:string,options:Parameters<typeof retrieveUncached>[1]):Promise<RetrievalPacket>{
 const packet=await cachedRetrieval(libraryQuery,'overture',`${options.embed?'vector':'keyword'}:${query}`,()=>retrieveUncached(query,options),p=>p.mode==='keyword+vector'&&!p.limitation);
 if(query.trim().length>=12&&!packet.passages.length&&!packet.limitation)
  await recordFeedback(libraryQuery,{question:query,reason:'no-matching-reference'}).catch(()=>undefined);
 return packet;
}
