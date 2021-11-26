import type * as RDF from '@rdfjs/types';
import { findNodes } from 'clownface-shacl-path';
import { DataFactory } from 'rdf-data-factory';
import { Logger } from 'winston';
import { BucketizerOptions, RelationType } from '..';
import { RelationParameters } from './RelationParameters';
const { dataset } = require('@rdfjs/dataset');
const clownface = require('clownface');
const N3 = require('n3');
import { getLogger } from './utils/Logger';

export abstract class Bucketizer {
  public readonly factory: RDF.DataFactory;
  public propertyPathQuads: RDF.Quad[];
  private bucketHypermediaControlsMap: Map<string, RelationParameters[]>;
  private bucketlessPageNumber: number;
  private bucketlessPageMemberCounter: number;
  public bucketizerOptions: BucketizerOptions;
  public logger: Logger;

  public constructor(bucketizerOptions: BucketizerOptions) {
    this.factory = new DataFactory();
    this.bucketHypermediaControlsMap = new Map<string, RelationParameters[]>();

    this.propertyPathQuads = [];
    this.bucketlessPageNumber = 0;
    this.bucketlessPageMemberCounter = 0;
    this.bucketizerOptions = bucketizerOptions;

    this.bucketizerOptions.root = this.bucketizerOptions.root || 'root';
    this.logger = getLogger('Bucketizer');
  }

  public setPropertyPathQuads = (propertyPath: string): Promise<void> => new Promise((resolve, reject) => {
    const fullPath = `_:b0 <https://w3id.org/tree#path> ${propertyPath} .`;

    const parser = new N3.Parser();
    parser.parse(fullPath, (error: any, quad: any, prefixes: any) => {
      if (error) {
        reject(error.stack);
      }

      if (quad) {
        this.propertyPathQuads.push(quad);
      } else {
        resolve();
      }
    });
  });

  /**
   * Adds extra triples to the array of quads indicating
   * the buckets in which the version object must be placed
   */
  public bucketize = (quads: RDF.Quad[], memberId: string): void => {
    const propertyPathObjects: RDF.Term[] = this.extractPropertyPathObject(quads, memberId);

    if (propertyPathObjects.length <= 0) {
      this.logger.warn(`No matches found for property path "${this.bucketizerOptions.propertyPath}" in member "${memberId}". Applying fallback.`);

      const bucketTriple = this.fallback(memberId);
      quads.push(bucketTriple);

      return;
    }

    let bucketTriples: RDF.Quad[] = [];
    try {
      const buckets = this.createBuckets(propertyPathObjects);
      bucketTriples.push(...buckets.map(bucket => this.createBucketTriple(bucket, memberId)));

    } catch (error: any) {
      this.logger.error(`Error while creating the buckets for member ${memberId}. Applying fallback.`);
      this.logger.info(error);

      bucketTriples.push(this.fallback(memberId));
    }

    quads.push(...bucketTriples);
  };

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
      propertyPathQuads: this.propertyPathQuads,
      bucketizerOptions: this.bucketizerOptions,
      bucketlessPageNumber: this.bucketlessPageNumber,
      bucketlessPageMemberCounter: this.bucketlessPageMemberCounter
    }
  }

  public importState(state: any): void {
    this.bucketHypermediaControlsMap = new Map(state.hypermediaControls);
    this.propertyPathQuads = state.propertyPathQuads;
    this.bucketizerOptions = state.bucketizerOptions;
    this.bucketlessPageNumber = state.bucketlessPageNumber;
    this.bucketlessPageMemberCounter = state.bucketlessPageMemberCounter;
  }

  public fallback = (memberId: string): RDF.Quad => {
    const pageSize = this.bucketizerOptions.pageSize;

    if (pageSize && this.bucketlessPageMemberCounter === pageSize) {
      const currentPage = this.bucketlessPageNumber;
      const relationParameters: RelationParameters = {
        nodeId: `bucketless-${currentPage}`,
        type: RelationType.Relation
      }

      this.addHypermediaControls(`${this.bucketizerOptions.root}`, [relationParameters]);

      this.bucketlessPageNumber++;
      this.bucketlessPageMemberCounter = 0;
    }

    this.bucketlessPageMemberCounter++;
    return this.createBucketTriple(`bucketless-${this.bucketlessPageNumber}`, memberId);
  }
}