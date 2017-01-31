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
var MapControls = (function (_super) {
    __extends(MapControls, _super);
    function MapControls() {
        _super.apply(this, arguments);
    }
    MapControls.prototype.liftChanged = function (newVal) {
        $(this).css('margin-bottom', newVal ? '79px' : '15px'); /*64 + 15*/
    };
    MapControls.prototype.mapRotationChanged = function (newVal) {
        $(this.$.compass).css('display', Math.abs(newVal) < 0.05 ? 'none' : 'initial');
    };
    MapControls.prototype.compassTap = function () {
        App.map.toggleRotation();
    };
    MapControls.prototype.myLocationTap = function () {
        var _this = this;
        App.toast.show("Finder din position...");
        navigator.geolocation.getCurrentPosition(function (pos) {
            App.toast.show("Din position blev fundet.");
            App.map.centerAnim([pos.coords.longitude, pos.coords.latitude], Math.max(pos.coords.accuracy, 200));
            _this.timeWarpActive = false;
        }, function (error) {
            App.toast.show("Din position blev IKKE fundet. Har du husket at give tilladelse til, at vi må bruge din position?");
        });
    };
    MapControls.prototype.zoomInTap = function () {
        App.map.zoomAnim(0.5);
    };
    MapControls.prototype.zoomOutTap = function () {
        App.map.zoomAnim(2);
    };
    __decorate([
        property({ type: Boolean }), 
        __metadata('design:type', Boolean)
    ], MapControls.prototype, "lift", void 0);
    __decorate([
        property({ type: Number }), 
        __metadata('design:type', Number)
    ], MapControls.prototype, "mapRotation", void 0);
    __decorate([
        property({ type: Boolean, notify: true }), 
        __metadata('design:type', Boolean)
    ], MapControls.prototype, "timeWarpActive", void 0);
    __decorate([
        observe("lift"), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Boolean]), 
        __metadata('design:returntype', void 0)
    ], MapControls.prototype, "liftChanged", null);
    __decorate([
        observe("mapRotation"), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Number]), 
        __metadata('design:returntype', void 0)
    ], MapControls.prototype, "mapRotationChanged", null);
    __decorate([
        listen("compass.tap"), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], MapControls.prototype, "compassTap", null);
    __decorate([
        listen("myLocation.tap"), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], MapControls.prototype, "myLocationTap", null);
    __decorate([
        listen("zoomIn.tap"), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], MapControls.prototype, "zoomInTap", null);
    __decorate([
        listen("zoomOut.tap"), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], MapControls.prototype, "zoomOutTap", null);
    MapControls = __decorate([
        component("map-controls"), 
        __metadata('design:paramtypes', [])
    ], MapControls);
    return MapControls;
}(polymer.Base));
MapControls.register();
//# sourceMappingURL=map-controls.js.map