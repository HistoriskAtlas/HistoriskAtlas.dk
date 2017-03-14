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
var HaGeoSearch = (function (_super) {
    __extends(HaGeoSearch, _super);
    function HaGeoSearch() {
        _super.apply(this, arguments);
    }
    HaGeoSearch.prototype.ready = function () {
        this.$.ajax.url = Common.api + 'geo.json';
    };
    HaGeoSearch.prototype.searchChanged = function () {
        this.doSearch();
    };
    HaGeoSearch.prototype.tagChanged = function () {
        this.doSearch();
    };
    HaGeoSearch.prototype.doSearch = function () {
        var params = {
            'v': 1,
            'count': 'all',
            'schema': '{geo:{fields:[id,title],filters:[{tag_geo:{tagid:530}}]}}'
        };
        if (this.search)
            params.title = '{like:' + this.search + '}';
        if (this.tag)
            params.tag_geo = '{tagid:' + this.tag.id + '}';
        this.set('params', params);
        this.$.ajax.generateRequest();
    };
    HaGeoSearch.prototype.handleResponse = function () {
        var result = [];
        for (var _i = 0, _a = this.$.ajax.lastResponse.data; _i < _a.length; _i++) {
            var data = _a[_i];
            var geo = App.haGeos.geos[data.id];
            if (!geo)
                continue;
            geo.title = data.title;
            result.push(geo);
        }
        this.geos = result;
    };
    __decorate([
        property({ type: String }), 
        __metadata('design:type', String)
    ], HaGeoSearch.prototype, "search", void 0);
    __decorate([
        property({ type: Object }), 
        __metadata('design:type', HaTag)
    ], HaGeoSearch.prototype, "tag", void 0);
    __decorate([
        property({ type: Array, notify: true }), 
        __metadata('design:type', Array)
    ], HaGeoSearch.prototype, "geos", void 0);
    __decorate([
        property({ type: Object }), 
        __metadata('design:type', Object)
    ], HaGeoSearch.prototype, "params", void 0);
    __decorate([
        observe("search"), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], HaGeoSearch.prototype, "searchChanged", null);
    __decorate([
        observe("tag"), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], HaGeoSearch.prototype, "tagChanged", null);
    HaGeoSearch = __decorate([
        component("ha-geos-search"), 
        __metadata('design:paramtypes', [])
    ], HaGeoSearch);
    return HaGeoSearch;
}(polymer.Base));
HaGeoSearch.register();
//# sourceMappingURL=ha-geos-search.js.map