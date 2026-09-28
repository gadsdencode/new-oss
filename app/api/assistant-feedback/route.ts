import {recordFeedback} from '@/lib/assistant/shared/library';
import {libraryQuery} from '@/lib/assistant/shared/database';
export async function POST(request:Request){
 try{const body=await request.text();if(Buffer.byteLength(body)>12000)return new Response(null,{status:413});
 return Response.json(await recordFeedback(libraryQuery,JSON.parse(body)));
 }catch{return Response.json({error:'Could not save review request'},{status:400});}
}
