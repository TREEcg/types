import type * as RDF from '@rdfjs/types';
import {Bucket} from "./Bucket";
import {RelationType} from "./RelationParameters";
import {BlankNode, NamedNode} from "@rdfjs/types";

/**
 * Tree relation interface
 * todo: merge with RelationParameters
 */
export interface Relation {
    /** relation URI */
    nodeId: NamedNode | BlankNode
    /** relation type see sds:relationType */
    type: RelationType
    /** target bucket for a relation see: sds:relationBucket*/
    relation_bucket?: NamedNode | BlankNode | Bucket | Bucket[]
    /** relation value see: sds:relationValue and tree:value */
    value?: string | any[] | RDF.Term[] | RDF.Term
    /** relation (property) path(s) see sds:relationPath or tree:path */
    path?: RDF.Term | RDF.Term[]
    /** remaining items underneath a relation */
    remainingItems?: number
    countRemainingItems():number
}

export interface SubstringRelation extends Relation{
    /** constant Substring type relation */
    type: RelationType.Substring
    /** a regular expression to match the string against see sh:pattern */
    pattern?: string
    /** an optional string of flags e.g. "i" for case-insensitive */
    flag?:string
}
