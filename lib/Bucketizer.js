"use strict";
exports.__esModule = true;
exports.Bucketizer = void 0;
var clownface_shacl_path_1 = require("clownface-shacl-path");
var rdf_data_factory_1 = require("rdf-data-factory");
var dataset = require('@rdfjs/dataset').dataset;
var clownface = require('clownface');
var N3 = require('n3');
var Bucketizer = /** @class */ (function () {
    function Bucketizer(propertyPath) {
        var _this = this;
        this.init = function () { return new Promise(function (resolve, reject) {
            var fullPath = "_:b0 <https://w3id.org/tree#path> " + _this.propertyPath + " .";
            _this.propertyPathQuads = [];
            var parser = new N3.Parser();
            parser.parse(fullPath, function (error, quad, prefixes) {
                if (error) {
                    reject(error.stack);
                }
                if (quad) {
                    _this.propertyPathQuads.push(quad);
                }
                else {
                    resolve();
                }
            });
        }); };
        /**
         * Returns the RDF Term that matches the property path and will be used to create a bucket triple
         * @param memberQuads an array of quads representing a member
         * @param memberId identifier of the member
         * @returns an RDF Term
         */
        this.extractPropertyPathObject = function (memberQuads, memberId) {
            var entryBlankNode = _this.getEntryBlanknode().object;
            var data = clownface({ dataset: dataset(memberQuads) }).namedNode(memberId);
            var path = clownface({ dataset: dataset(_this.propertyPathQuads) }).blankNode(entryBlankNode);
            return (0, clownface_shacl_path_1.findNodes)(data, path).terms;
        };
        this.createBucketTriple = function (bucket, memberId) { return _this.factory.quad(_this.factory.namedNode(memberId), _this.factory.namedNode('https://w3id.org/ldes#bucket'), _this.factory.literal(bucket, _this.factory.namedNode('http://www.w3.org/2001/XMLSchema#string'))); };
        this.getEntryBlanknode = function () {
            return _this.propertyPathQuads.find(function (quad) { return quad.predicate.value === 'https://w3id.org/tree#path'; });
        };
        this.getBucketHypermediaControlsMap = function () { return _this.bucketHypermediaControlsMap; };
        this.getHypermediaControls = function (bucket) { return _this.bucketHypermediaControlsMap.get(bucket); };
        this.addHypermediaControls = function (bucket, controls) {
            _this.bucketHypermediaControlsMap.set(bucket, controls);
        };
        this.factory = new rdf_data_factory_1.DataFactory();
        this.propertyPath = propertyPath;
        this.bucketHypermediaControlsMap = new Map();
        this.propertyPathQuads = [];
    }
    return Bucketizer;
}());
exports.Bucketizer = Bucketizer;
