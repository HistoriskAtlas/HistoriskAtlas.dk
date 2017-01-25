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
var GeoList = (function (_super) {
    __extends(GeoList, _super);
    function GeoList() {
        _super.apply(this, arguments);
    }
    GeoList.prototype.geoTap = function (e) {
        var geo = e.model.geo;
        Common.dom.append(WindowGeo.create(geo));
        App.map.centerAnim(geo.coord, 1000, true);
    };
    GeoList.prototype.sortByTitle = function (geo1, geo2) {
        return geo1.title.localeCompare(geo2.title);
    };
    __decorate([
        property({ type: Array }), 
        __metadata('design:type', Array)
    ], GeoList.prototype, "geos", void 0);
    __decorate([
        property({ type: Array }), 
        __metadata('design:type', Array)
    ], GeoList.prototype, "addresses", void 0);
    __decorate([
        property({ type: String }), 
        __metadata('design:type', String)
    ], GeoList.prototype, "compareFunction", void 0);
    GeoList = __decorate([
        component("geo-list"), 
        __metadata('design:paramtypes', [])
    ], GeoList);
    return GeoList;
}(polymer.Base));
GeoList.register();
