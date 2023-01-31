import {BlankNode, NamedNode, Quad} from "@rdfjs/types";
import {BucketizerCoreExtOptions, BucketizerCoreOptions} from "./BucketizerOptions";
import {Member} from "./Member";
import {Relation} from "./Relation";
import {RelationType} from "./RelationParameters";

/** Bucket interface */
export interface Bucket {
    /** bucket URI */
    nodeID: NamedNode | BlankNode
    /** members that were bucketized in a bucket */
    members: Member[]
    /** relation that describes a bucket */
    relation: Relation
    /** bucketizer option adheres to a bucket */
    bucketOpt: BucketizerCoreOptions | BucketizerCoreExtOptions
    /** add members to a bucket */
    addMember():Quad[]
}

export interface SubstringBucket extends Bucket {
    /** constant Substring type Bucket */
    type: RelationType.Substring
}
