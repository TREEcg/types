import * as RDF from "@rdfjs/types";
export interface Member {
    id: RDF.Term;
    quads: Array<RDF.Quad>;
}
