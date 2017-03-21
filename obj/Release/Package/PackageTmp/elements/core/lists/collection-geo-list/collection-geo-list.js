var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var CollectionGeoList = (function (_super) {
    __extends(CollectionGeoList, _super);
    function CollectionGeoList() {
        _super.apply(this, arguments);
    }
    CollectionGeoList.prototype.cgTap = function (e) {
        var collection_geo = e.model.cg;
        Common.dom.append(WindowGeo.create(collection_geo.geo));
        App.map.centerAnim(collection_geo.geo.coord, 1000, true);
    };
    __decorate([
        property({ type: Array }), 
        __metadata('design:type', Array)
    ], CollectionGeoList.prototype, "collectionGeos", void 0);
    CollectionGeoList = __decorate([
        component("collection-geo-list"), 
        __metadata('design:paramtypes', [])
    ], CollectionGeoList);
    return CollectionGeoList;
}(polymer.Base));
CollectionGeoList.register();
