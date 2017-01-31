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
var WindowRegion = (function (_super) {
    __extends(WindowRegion, _super);
    function WindowRegion(region) {
        _super.call(this);
        this.$.ajax.url = Common.api + 'region.json';
        this.region = region;
    }
    //ready() {
    //    setTimeout(() =>
    //        (<any>$(this.$.scroller)).mCustomScrollbar({
    //            theme: "minimal-dark"
    //        }), 100);
    //}
    WindowRegion.prototype.regionChanged = function () {
        if (this.region.type)
            return;
        this.set('params', {
            'v': 1,
            'regionid': this.region.id,
            'schema': '{region:[regiontypeid,periodstart,periodend,{parents:[empty,{region:[regionid,name,periodstart,periodend]}]},{children:[empty,{child:[regionid,name,periodstart,periodend]}]},{region_regionsources:[empty,{regionsource:[name]}]}]}'
        });
        this.$.ajax.generateRequest();
    };
    WindowRegion.prototype.handleResponse = function () {
        var data = this.$.ajax.lastResponse.data[0];
        this.set('region.periodStart', data.periodstart);
        this.set('region.periodEnd', data.periodend);
        this.set('region.type', App.haRegions.regionTypes[data.regiontypeid]);
        var sources = [];
        data.region_regionsources.forEach(function (source) {
            sources.push(source.regionsource.name);
        });
        this.set('region.sources', sources);
        var parents = [];
        data.parents.forEach(function (parent) {
            parents.push(new HaRegion(parent.region));
        });
        this.set('region.parents', parents);
        var children = [];
        data.children.forEach(function (child) {
            children.push(new HaRegion(child.child));
        });
        this.set('region.children', children);
    };
    WindowRegion.prototype.years = function (start, end) {
        return Common.years(start, end);
    };
    WindowRegion.prototype.isDefined = function (val) {
        return !!val ? val.length > 0 : false;
    };
    WindowRegion.prototype.regionTap = function (e) {
        Common.dom.append(WindowRegion.create(e.model.item));
        //(<any>$(this.$.scroller)).mCustomScrollbar({
        //    theme: "minimal-dark"
        //});
    };
    __decorate([
        property({ type: Object }), 
        __metadata('design:type', Object)
    ], WindowRegion.prototype, "region", void 0);
    __decorate([
        observe("region"), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], WindowRegion.prototype, "regionChanged", null);
    WindowRegion = __decorate([
        component("window-region"), 
        __metadata('design:paramtypes', [HaRegion])
    ], WindowRegion);
    return WindowRegion;
}(polymer.Base));
WindowRegion.register();
//# sourceMappingURL=window-region.js.map