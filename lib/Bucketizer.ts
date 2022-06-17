import type * as RDF from '@rdfjs/types';

export interface Bucketizer {
  bucketize(quads: RDF.Quad[], memberId: string): void;
  importState: (state: any) => void;
  exportState: () => any;
}
