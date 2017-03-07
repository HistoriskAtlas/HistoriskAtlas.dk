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
var TimeLine = (function (_super) {
    __extends(TimeLine, _super);
    function TimeLine() {
        _super.apply(this, arguments);
    }
    TimeLine.prototype.ready = function () {
        var _this = this;
        $(this).attr("tabindex", -1);
        $(this).on('blur', function () {
            _this.timelineMap.center();
        });
    };
    TimeLine.prototype.activeChanged = function () {
        var _this = this;
        if (this.active && !this.timelineMap) {
            this.timelineMap = new TimelineMap(this.$.mapDiv, this);
            var observer = new MutationObserver(function (mutation) {
                return _this.fire('domChanged');
            });
            observer.observe(this, { attributes: true });
        }
    };
    TimeLine.prototype.yearChanged = function () {
        if (this.timelineMap)
            this.timelineMap.updateYear();
    };
    TimeLine.prototype.timeWarpActiveChanged = function () {
        $(this).css('width', this.timeWarpActive ? '50%' : (this.main ? '100%' : '0%'));
    };
    TimeLine.prototype.zoomChanged = function () {
        if (this.timelineMap)
            this.timelineMap.zoom(this.zoom);
    };
    TimeLine.prototype.updateSize = function () {
        this.timelineMap.updateSize();
    };
    TimeLine.prototype.showSlider = function (active) {
        if (this.touchDevice)
            return false;
        if (active)
            this.sliderCreated = true;
        return this.sliderCreated;
    };
    __decorate([
        property({ type: Boolean }), 
        __metadata('design:type', Boolean)
    ], TimeLine.prototype, "active", void 0);
    __decorate([
        property({ type: Boolean, value: false }), 
        __metadata('design:type', Boolean)
    ], TimeLine.prototype, "main", void 0);
    __decorate([
        property({ type: Object, notify: true }), 
        __metadata('design:type', Object)
    ], TimeLine.prototype, "map", void 0);
    __decorate([
        property({ type: Number, notify: true }), 
        __metadata('design:type', Number)
    ], TimeLine.prototype, "year", void 0);
    __decorate([
        property({ type: Number }), 
        __metadata('design:type', Number)
    ], TimeLine.prototype, "immediateYear", void 0);
    __decorate([
        property({ type: Boolean }), 
        __metadata('design:type', Boolean)
    ], TimeLine.prototype, "timeWarpActive", void 0);
    __decorate([
        property({ type: Number }), 
        __metadata('design:type', Number)
    ], TimeLine.prototype, "zoom", void 0);
    __decorate([
        property({ type: Boolean }), 
        __metadata('design:type', Boolean)
    ], TimeLine.prototype, "touchDevice", void 0);
    __decorate([
        observe('active'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], TimeLine.prototype, "activeChanged", null);
    __decorate([
        observe('year'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], TimeLine.prototype, "yearChanged", null);
    __decorate([
        observe('timeWarpActive'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], TimeLine.prototype, "timeWarpActiveChanged", null);
    __decorate([
        observe('zoom'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], TimeLine.prototype, "zoomChanged", null);
    TimeLine = __decorate([
        component("time-line"), 
        __metadata('design:paramtypes', [])
    ], TimeLine);
    return TimeLine;
}(polymer.Base));
TimeLine.register();
//# sourceMappingURL=time-line.js.map