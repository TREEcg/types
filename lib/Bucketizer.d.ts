import type * as RDF from '@rdfjs/types';
export declare abstract class Bucketizer {
    readonly propertyPath: string;
    propertyPathQuads: RDF.Quad[];
    readonly factory: RDF.DataFactory;
    private readonly bucketHypermediaControlsMap;
    constructor(propertyPath: string);
    init: () => Promise<void>;
    /**
     * Adds extra triples to the array of quads indicating
     * the buckets in which the version object must be placed
     */
    abstract bucketize: (quads: RDF.Quad[], memberId: string) => void;
    /**
     * Selects the bucket for the LDES member based on the value of the property path object
     */
    abstract createBuckets: (propertyPathObject: RDF.Term[]) => string[];
    /**
     * Returns the RDF Term that matches the property path and will be used to create a bucket triple
     * @param memberQuads an array of quads representing a member
     * @param memberId identifier of the member
     * @returns an RDF Term
     */
    extractPropertyPathObject: (memberQuads: RDF.Quad[], memberId: string) => RDF.Term[];
    createBucketTriple: (bucket: string, memberId: string) => RDF.Quad;
    private readonly getEntryBlanknode;
    getBucketHypermediaControlsMap: () => Map<string, string[]>;
    getHypermediaControls: (bucket: string) => string[] | undefined;
    addHypermediaControls: (bucket: string, controls: string[]) => void;
}
