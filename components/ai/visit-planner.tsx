"use client";
import Link from 'next/link';
import {useState} from 'react';
import {useCopilotAction} from '@copilotkit/react-core';
const goals=[{id:'strategy',title:'Choose an AI starting point',href:'/ai-center-of-excellence/getting-started'},{id:'delivery',title:'Explore implementation support',href:'/consulting'},{id:'knowledge',title:'Turn expertise into specialized AI',href:'/ai'}] as const;
function VisitPlanner({respond}:{respond:(value:Record<string,unknown>)=>void}){
 const [goal,setGoal]=useState('strategy'),[role,setRole]=useState('Business leader'),[stage,setStage]=useState('Exploring options');
 const selected=goals.find(g=>g.id===goal)!;
 return <form className="rounded-lg border p-4 space-y-3" onSubmit={e=>{e.preventDefault();respond({ok:true,goal:selected.title,role,stage,suggestedPage:selected.href,instruction:'Use published references to explain a suitable next step. Ask a focused follow-up if information is missing.'})}}><h3 className="font-semibold">Plan your visit</h3><p className="text-sm">Choose your priorities so the assistant can tailor its next answer.</p><label className="block text-sm">Your role<select className="block w-full bg-background p-2 border rounded" value={role} onChange={e=>setRole(e.target.value)}>{['Business leader','Technical leader','Project team'].map(x=><option key={x}>{x}</option>)}</select></label><label className="block text-sm">Your goal<select className="block w-full bg-background p-2 border rounded" value={goal} onChange={e=>setGoal(e.target.value)}>{goals.map(g=><option key={g.id} value={g.id}>{g.title}</option>)}</select></label><label className="block text-sm">Where you are now<select className="block w-full bg-background p-2 border rounded" value={stage} onChange={e=>setStage(e.target.value)}>{['Exploring options','Planning a pilot','Scaling existing work'].map(x=><option key={x}>{x}</option>)}</select></label><Link href={selected.href} className="block rounded border p-3 text-sm underline">Explore: {selected.title} →</Link><div className="flex gap-4"><button type="submit" className="underline text-sm">Ask the assistant for a next step</button><button type="button" className="text-sm" onClick={()=>respond({ok:false,cancelled:true})}>Cancel</button></div></form>;
}
export function VisitPlannerTool(){
 useCopilotAction({name:'planVisit',description:'When a visitor asks for a guided visit or help choosing a starting point, offer a short role, goal and stage selector. The visitor chooses; then use published references to explain the next step.',parameters:[],renderAndWaitForResponse:({status,respond})=>status==='complete'?<p className="text-sm">Visit planner closed. See the conversation for the selected next step.</p>:<VisitPlanner respond={value=>respond?.(value)}/>});
 return null;
}
