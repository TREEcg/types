import type * as RDF from '@rdfjs/types';
import { findNodes } from 'clownface-shacl-path';
import { DataFactory } from 'rdf-data-factory';
import { BucketizerOptions } from '..';
import { RelationParameters } from './RelationParameters';
const { dataset } = require('@rdfjs/dataset');
const clownface = require('clownface');
const N3 = require('n3');

export abstract class Bucketizer {
  public readonly factory: RDF.DataFactory;
  public propertyPathQuads: RDF.Quad[];
  private bucketHypermediaControlsMap: Map<string, RelationParameters[]>;

  public constructor(propertyPathQuads: any[]) {
    this.factory = new DataFactory();
    this.bucketHypermediaControlsMap = new Map<string, RelationParameters[]>();
    this.propertyPathQuads = propertyPathQuads;
  }

  public parsePropertyPath = (propertyPath: string): Promise<any[]> => new Promise((resolve, reject) => {
    const fullPath = `_:b0 <https://w3id.org/tree#path> ${propertyPath} .`;
    const propertyPathQuads: any[] = [];

    const parser = new N3.Parser();
    parser.parse(fullPath, (error: any, quad: any, prefixes: any) => {
      if (error) {
        reject(error.stack);
      }

      if (quad) {
        propertyPathQuads.push(quad);
      } else {
        resolve(propertyPathQuads);
      }
    });
  });

  /**
   * Adds extra triples to the array of quads indicating
   * the buckets in which the version object must be placed
   */
  public abstract bucketize: (quads: RDF.Quad[], memberId: string) => void;

  /**
   * Selects the bucket for the LDES member based on the value of the property path object
   */
  protected abstract createBuckets: (propertyPathObject: RDF.Term[]) => string[];

  /**
   * Returns the RDF Term that matches the property path and will be used to create a bucket triple
   * @param memberQuads an array of quads representing a member
   * @param memberId identifier of the member
   * @returns an RDF Term
   */
  protected extractPropertyPathObject = (memberQuads: RDF.Quad[], memberId: string): RDF.Term[] => {
    const entryBlankNode = this.getEntryBlanknode().object;
    const data = clownface({ dataset: dataset(memberQuads) }).namedNode(memberId);
    const path = clownface({ dataset: dataset(this.propertyPathQuads) }).blankNode(entryBlankNode);
    return findNodes(data, path).terms;
  };

  protected createBucketTriple = (bucket: string, memberId: string): RDF.Quad => this.factory.quad(
    this.factory.namedNode(memberId),
    this.factory.namedNode('https://w3id.org/ldes#bucket'),
    this.factory.literal(bucket, this.factory.namedNode('http://www.w3.org/2001/XMLSchema#string')),
  );

  private readonly getEntryBlanknode = (): RDF.Quad =>
    this.propertyPathQuads.find(quad => quad.predicate.value === 'https://w3id.org/tree#path')!;

  public getBucketHypermediaControlsMap = (): Map<string, RelationParameters[]> => this.bucketHypermediaControlsMap;

  public getHypermediaControls = (bucket: string): RelationParameters[] | undefined => this.bucketHypermediaControlsMap.get(bucket);

  public addHypermediaControls = (bucket: string, controls: RelationParameters[]): void => {
    this.bucketHypermediaControlsMap.set(bucket, controls);
  };

  public getPropertyPathQuads = (): RDF.Quad[] => this.propertyPathQuads;

  public exportState(): any {
    return {
      hypermediaControls: Array.from(this.bucketHypermediaControlsMap.entries()),
      propertyPathQuads: this.propertyPathQuads
    }
  }

  public importState(state: any): void {
    this.bucketHypermediaControlsMap = new Map(state.hypermediaControls);
    this.propertyPathQuads = state.propertyPathQuads;
  }
}