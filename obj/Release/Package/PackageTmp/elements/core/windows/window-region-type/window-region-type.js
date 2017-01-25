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
var WindowRegionType = (function (_super) {
    __extends(WindowRegionType, _super);
    function WindowRegionType(regionType) {
        _super.call(this);
        this.$.ajax.url = Common.api + 'regiontype.json';
        this.regionType = regionType;
    }
    WindowRegionType.prototype.ready = function () {
        var _this = this;
        setTimeout(function () {
            $(_this.$.about).load('html/RegionTypeAbouts/' + _this.regionType.id + '.html');
        }, 100);
    };
    WindowRegionType.prototype.years = function (start, end) {
        return Common.years(start, end);
    };
    WindowRegionType.prototype.isDefined = function (val) {
        return !!val ? val.length > 0 : false;
    };
    __decorate([
        property({ type: Object }), 
        __metadata('design:type', Object)
    ], WindowRegionType.prototype, "regionType", void 0);
    WindowRegionType = __decorate([
        component("window-region-type"), 
        __metadata('design:paramtypes', [HARegionType])
    ], WindowRegionType);
    return WindowRegionType;
}(polymer.Base));
WindowRegionType.register();
