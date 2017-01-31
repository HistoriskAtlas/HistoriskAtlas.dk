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
var TimeWarpMapButton = (function (_super) {
    __extends(TimeWarpMapButton, _super);
    function TimeWarpMapButton() {
        _super.call(this);
        this.update();
    }
    TimeWarpMapButton.prototype.mapsDeepChanged = function (changeRecord) {
        if (!App.map.timeWarp.isVisible)
            return;
        if (App.map.timeWarp.mode == TimeWarpModes.CLOSING_FROM_CIRCLE || App.map.timeWarp.mode == TimeWarpModes.CLOSING_FROM_SPLIT || App.map.timeWarp.mode == TimeWarpModes.OPENING)
            return;
        var props = changeRecord.path.split('.');
        var property = props.pop();
        if (property != 'inViewTimeWarp')
            return;
        var i = props[1].substring(1);
        var map = changeRecord.base[props[1].substring(1)];
        if (map == this.map && !changeRecord.value)
            App.toast.show('Kortet i tidsluppen er ikke længere aktuelt. Vælg et nyt.'); //TODO: Message inside timewarp instead.
    };
    TimeWarpMapButton.prototype.mapChanged = function () {
        this.update();
    };
    TimeWarpMapButton.prototype.update = function () {
        this.mode = App.map.timeWarp.mode;
        this.$.button.update();
    };
    TimeWarpMapButton.prototype.show = function () {
        this.$.button.show();
    };
    TimeWarpMapButton.prototype.hide = function () {
        this.$.button.hide();
    };
    __decorate([
        property({ type: Number }), 
        __metadata('design:type', Object)
    ], TimeWarpMapButton.prototype, "mode", void 0);
    __decorate([
        property({ type: Object, notify: true }), 
        __metadata('design:type', Object)
    ], TimeWarpMapButton.prototype, "map", void 0);
    __decorate([
        property({ type: Array }), 
        __metadata('design:type', Array)
    ], TimeWarpMapButton.prototype, "maps", void 0);
    __decorate([
        property({ type: Number, notify: true }), 
        __metadata('design:type', Number)
    ], TimeWarpMapButton.prototype, "selected", void 0);
    __decorate([
        property({ type: Number }), 
        __metadata('design:type', Number)
    ], TimeWarpMapButton.prototype, "selectedIndex", void 0);
    __decorate([
        property({ type: String }), 
        __metadata('design:type', String)
    ], TimeWarpMapButton.prototype, "placeholder", void 0);
    __decorate([
        observe("maps.*"), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', void 0)
    ], TimeWarpMapButton.prototype, "mapsDeepChanged", null);
    __decorate([
        observe("map"), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], TimeWarpMapButton.prototype, "mapChanged", null);
    TimeWarpMapButton = __decorate([
        component("time-warp-map-button"), 
        __metadata('design:paramtypes', [])
    ], TimeWarpMapButton);
    return TimeWarpMapButton;
}(polymer.Base));
TimeWarpMapButton.register();
//# sourceMappingURL=time-warp-map-button.js.map