import {libraryQuery} from '@/lib/assistant/shared/database';
export async function GET(_request:Request,{params}:{params:Promise<{id:string}>}){
 try{const {id}=await params;const rows=await libraryQuery("SELECT id,title,content,source_url,revision,updated_at FROM assistant_documents WHERE id=$1 AND status='published'",[id]);
 return rows[0]?Response.json(rows[0],{headers:{'Cache-Control':'no-store'}}):new Response(null,{status:404});
 }catch{return new Response(null,{status:503});}
}
