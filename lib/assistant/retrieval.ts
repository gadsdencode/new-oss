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
export async function retrieveForVisitor(
  query: string,
  options: {
    embed: boolean;
    apiKey?: string;
    baseUrl?: string;
    signal?: AbortSignal;
  }
): Promise<RetrievalPacket> {
  const keyword = keywordRetrieval(query, 4);
  if (!options.embed || !options.apiKey || !options.baseUrl || !query.trim()) {
    return keyword;
  }

  let vectorQuery: number[] | null = null;
  try {
    const [vector] = await embedIcdUTexts([query.slice(0, 2_000)], {
      apiKey: options.apiKey,
      baseUrl: options.baseUrl,
      signal: options.signal,
    });
    vectorQuery = vector ?? null;
  } catch {
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

  const passages = mergePassages(keyword.passages, vectorHits, 4);
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
