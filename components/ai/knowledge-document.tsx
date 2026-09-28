"use client";
import Link from 'next/link';
import {useEffect,useState} from 'react';
export default function KnowledgeDocument({id}:{id:string}){
 const [doc,setDoc]=useState<{title:string;content:string;source_url:string;revision:number}|null>(null),[error,setError]=useState('');
 useEffect(()=>{const controller=new AbortController();fetch('/api/knowledge/'+encodeURIComponent(id),{signal:controller.signal}).then(async r=>{if(!r.ok)throw Error(r.status===404?'This reference is no longer published.':'This reference is temporarily unavailable.');setDoc(await r.json())}).catch(e=>{if(!controller.signal.aborted)setError(e.message)});return()=>controller.abort()},[id]);
 return <article className="mx-auto max-w-3xl px-6 py-20"><Link href="/" className="underline">Back to the website</Link>{doc?<><p className="mt-8 text-sm">Published assistant reference · Revision {doc.revision}</p><h1 className="my-6 text-3xl font-semibold">{doc.title}</h1><div className="whitespace-pre-wrap leading-relaxed">{doc.content}</div>{doc.source_url?<p className="mt-8"><a href={doc.source_url} className="underline">Original source</a></p>:null}</>:<p role="status" className="mt-8">{error||'Loading reference…'}</p>}</article>;
}
