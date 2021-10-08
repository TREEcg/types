/* Data Model Interface */
import * as RDF from "@rdfjs/types";

export interface Member {
    uri: RDF.Term;
    quads: Array<RDF.Quad>;
}