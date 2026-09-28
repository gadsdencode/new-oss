import {neon} from '@neondatabase/serverless';
import {resolveDatabaseUrl} from '../../database-url';
import type {Query} from './library';
export const libraryQuery:Query=async(text,values)=>{
 const url=resolveDatabaseUrl();if(!url)throw new Error('Database unavailable');
 return await neon(url).query(text,values??[]) as Record<string,unknown>[];
};
