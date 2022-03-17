import { Member } from './Member';
import { RelationParameters } from './RelationParameters';

// To be determined
export type CacheDirectives = any; 

// To be determined
export type Metadata = any;

// A fragment encapsulating multiple members
// and relations to other Fragments.
// Also indicating some metadata and cache directives 
export interface Fragment {
    metadata: Metadata;
    cache: CacheDirectives;
    members: Array<Member>;
    relations: Array<RelationParameters>
}

// Fetches a fragment beloning to the identifier
export interface FragmentFetcher {
    fetch(id: string): Promise<Fragment>;
}
