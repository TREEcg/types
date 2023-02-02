/* eslint-disable function-paren-newline */
import { NamedNode } from '@rdfjs/types';
import { DataFactory } from 'rdf-data-factory';

type RecordOf<TKey extends any[], TValue> = Record<TKey[number], TValue>;

const factory = new DataFactory();
export type Namespace<TKey extends any[], TValue, IValue> =
  { namespace: TValue, custom: (input: IValue) => TValue } & RecordOf<TKey, TValue>;

/**
 * Creates a function that expands local names from the given base URI,
 * and exports the given local names as properties on the returned object.
 */
export function createNamespace<TKey extends string, TValue, IValue extends string>(
  baseUri: string,
  toValue: (expanded: string) => TValue,
  ...localNames: TKey[]):
  Namespace<typeof localNames, TValue, IValue> {
  const expanded: Namespace<typeof localNames, TValue, IValue> = {} as any;
  // Expose the main namespace
  expanded.namespace = toValue(baseUri);
  expanded.custom = (v) => toValue(baseUri + v);
  // Expose the listed local names as properties
  for (const localName of localNames) {
    (expanded as RecordOf<TKey[], TValue>)[localName] = toValue(`${baseUri}${localName}`);
  }
  return expanded;
}

/**
 * Creates a function that expands local names from the given base URI into strings,
 * and exports the given local names as properties on the returned object.
 */
export function createUriNamespace<T extends string>(baseUri: string, ...localNames: T[]):
Namespace<typeof localNames, string, string> {
  return createNamespace(baseUri, (expanded): string => expanded, ...localNames);
}

/**
 * Creates a function that expands local names from the given base URI into named nodes,
 * and exports the given local names as properties on the returned object.
 */
export function createTermNamespace<T extends string>(baseUri: string, ...localNames: T[]):
Namespace<typeof localNames, NamedNode, string> {
  return createNamespace(baseUri, factory.namedNode, ...localNames);
}

/**
 * Creates a function that expands local names from the given base URI into string,
 * and exports the given local names as properties on the returned object.
 * Under the `terms` property, it exposes the expanded local names as named nodes.
 */
export function createUriAndTermNamespace<T extends string>(baseUri: string, ...localNames: T[]):
Namespace<typeof localNames, string, string> & { terms: Namespace<typeof localNames, NamedNode, string> } {
  return Object.assign(createUriNamespace(baseUri, ...localNames),
    { terms: createTermNamespace(baseUri, ...localNames) });
}


export const DC = createUriAndTermNamespace('http://purl.org/dc/terms/',
  'description',
  'modified',
  'title',
);

export const FOAF = createUriAndTermNamespace('http://xmlns.com/foaf/0.1/',
  'Agent',
);

export const RDF = createUriAndTermNamespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#',
  'type',
  'Class',
  'Property',
  'nil',
  'rest',
  'first',
);

export const RDFS = createUriAndTermNamespace('http://www.w3.org/2000/01/rdf-schema#',
    'label',
    'comment',
    'domain',
    'range',
    'isDefinedBy',
    'Class',
    'subClassOf'
);

export const XSD = createUriAndTermNamespace('http://www.w3.org/2001/XMLSchema#',
  'dateTime',
  'integer',
  'string',
);

export const TREE = createUriAndTermNamespace('https://w3id.org/tree#',
  'Collection',
  'member',
  'view',
  'value',
  'relation',
  'PrefixRelation',
  'SubstringRelation',
  'SuffixRelation',
  'GreaterThanRelation',
  'GreaterThanOrEqualRelation',
  'LessThanRelation',
  'LessThanOrEqualToRelation',
  'EqualToRelation',
  'GeospatiallyContainsRelation',
  'path',
  'node',
  'shape',
  'search',
  'ConditionalImport',
  'import',
  'importStream',
  'remainingItems',
  'zoom',
  'latitudeTile',
  'longitudeTile',
);

export const LDES = createUriAndTermNamespace('https://w3id.org/ldes#',
  'EventStream',
  'timestampPath',
  'versionOfPath',
  'DurationAgoPolicy',
  'Bucketization',
  'retentionPolicy',
  'amount',
  'bucket',
  'bucketProperty',
  'bucketType',
  'LatestVersionSubset',
  'BucketizeStrategy',
);

export const SDS = createUriAndTermNamespace('https://w3id.org/sds#',
  'Member',
  'Record',
  'ImmutableMember',
  'shape',
  'carries',
  'dataset',
  'Stream',

  'payload',
  'bucket',
  'relationType',
  'relationBucket',
  'relationValue',
  'relationPath',
  'stream',
  'relation',
);

export const PROV = createUriAndTermNamespace('http://www.w3.org/ns/prov#',
  'used',
  'startedAtTime',
  'wasGeneratedBy',
);
export const PPLAN = createUriAndTermNamespace('http://purl.org/net/p-plan#',
  'Activity',
);
export const SHACL = createUriAndTermNamespace('http://www.w3.org/ns/shacl#',
  'NodeShape',
  'targetClass',
  'property',
  'path',
  'name',
  ':alternativePath',
  'datatype',
  'nodeKind',
  'pattern',
  'flags',
  'minExclusive',
  'minInclusive',
  'maxExclusive',
  'maxInclusive',
  'not',
  'and',
  'or',
  'xone',
  'in',
  'hasValue',
  'defaultValue',
  'minCount',
  'maxCount'
);
export const EX = createUriAndTermNamespace('http://example.org/ns#',
);
