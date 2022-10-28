import { Quad } from "@rdfjs/types";

/**
 * All bucketizers need these options
 * Some bucketizers like simple paging bucketizer only need these options
 */
export interface BucketizerCoreOptions {
  /** property to create with bucket index */
  bucketProperty: string,
  /** amount of members per bucket */
  pageSize: number,
  /** bucket prefix   */
  bucketBase: string
}

/**
 * Most bucketizers will also need these options
 */
export interface BucketizerCoreExtOptions extends BucketizerCoreOptions {
  /** name of root bucket  */
  root: string;
  /** path to bucketize on */
  propertyPath: string | Quad[];
}
