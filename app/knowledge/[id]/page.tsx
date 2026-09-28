import KnowledgeDocument from '@/components/ai/knowledge-document';
export default async function Page({params}:{params:Promise<{id:string}>}){return <KnowledgeDocument id={(await params).id}/>}
