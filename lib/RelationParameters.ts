import type * as RDF from '@rdfjs/types';

/**
 * Object containing the parameters needed to describe the TREE relations
 */
export interface RelationParameters {
  nodeId: string;
  type: RelationType;
  value: RDF.Term[];
  remainingItems?: number;
}

export enum RelationType {
  Substring = 'https://w3id.org/tree#SubstringRelation',
  Prefix = 'https://w3id.org/tree#PrefixRelation',
  Suffix = 'https://w3id.org/tree#SuffixRelation',
  GreaterThan = 'https://w3id.org/tree#GreaterThanRelation',
  GreaterThanOrEqualTo = 'https://w3id.org/tree#GreaterThanOrEqualToRelation',
  LessThan = 'https://w3id.org/tree#LessThanRelation',
  LessThanOrEqualTo = 'https://w3id.org/tree#LessThanOrEqualToRelation',
  EqualThan = 'https://w3id.org/tree#EqualThanRelation',
  GeospatiallyContains = 'https://w3id.org/tree#GeospatiallyContainsRelation'
}
