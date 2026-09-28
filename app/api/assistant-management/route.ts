import {authorized,management} from '@/lib/assistant/shared/library';
import {libraryQuery} from '@/lib/assistant/shared/database';
export const runtime='nodejs';
export const maxDuration=60;
export async function POST(request:Request){
 if(!authorized(request.headers.get('authorization'),process.env.ICDU_API_KEY))return new Response(null,{status:401});
 try{const body=await request.text();if(Buffer.byteLength(body)>4*1024*1024)return new Response(null,{status:413});
 return Response.json(await management(libraryQuery,'overture',JSON.parse(body)),{headers:{'Cache-Control':'no-store'}});
 }catch(error){return Response.json({error:error instanceof Error&&/Document|Invalid|Unknown|HTTPS|chunks/.test(error.message)?error.message:'Library operation failed'},{status:409});}
}
