import type * as RDF from '@rdfjs/types';

export interface Bucketizer {
  bucketize(quads: RDF.Quad[], memberId: string): RDF.Quad[];
  importState: (state: any) => void;
  exportState: () => any;
}

