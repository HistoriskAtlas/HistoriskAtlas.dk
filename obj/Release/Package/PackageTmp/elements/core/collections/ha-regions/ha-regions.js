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
var HaRegions = (function (_super) {
    __extends(HaRegions, _super);
    function HaRegions() {
        _super.apply(this, arguments);
        this.regions = [];
    }
    HaRegions.prototype.ready = function () {
        this.$.ajax.url = Common.api + 'region.json';
    };
    HaRegions.prototype.regionTypeChanged = function (regionType) {
        if (!regionType)
            return;
        if (regionType.regionsLoaded)
            return;
        regionType.regionsLoaded = true;
        this.set('params', {
            'v': 1,
            'schema': '{region:[regionid,name]}',
            'count': 'all',
            'regiontypeid': regionType.id
        });
        this.$.ajax.generateRequest();
    };
    HaRegions.prototype.handleResponse = function () {
        var _this = this;
        this.$.ajax.lastResponse.data.forEach(function (data) {
            var region = new HaRegion(data);
            _this.regions[region.id] = region;
        });
    };
    __decorate([
        property({ type: Object }), 
        __metadata('design:type', Object)
    ], HaRegions.prototype, "type", void 0);
    __decorate([
        observe("type"), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [HARegionType]), 
        __metadata('design:returntype', void 0)
    ], HaRegions.prototype, "regionTypeChanged", null);
    HaRegions = __decorate([
        component("ha-regions"), 
        __metadata('design:paramtypes', [])
    ], HaRegions);
    return HaRegions;
}(polymer.Base));
HaRegions.register();
