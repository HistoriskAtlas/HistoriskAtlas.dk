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
var MapTooltip = (function (_super) {
    __extends(MapTooltip, _super);
    function MapTooltip() {
        _super.apply(this, arguments);
        this.shown = false;
    }
    ;
    MapTooltip.prototype.setText = function (text, ifShown) {
        if (ifShown && !this.shown)
            return;
        this.shown = true;
        this.set('tooltipText', text);
        this.$.tooltip.show();
    };
    MapTooltip.prototype.hide = function () {
        this.shown = false;
        this.$.tooltip.hide();
    };
    MapTooltip.prototype.setPosition = function (pixel) {
        $(this).offset({ left: pixel[0], top: pixel[1] });
    };
    __decorate([
        property({ type: String }), 
        __metadata('design:type', String)
    ], MapTooltip.prototype, "tooltipText", void 0);
    MapTooltip = __decorate([
        component("map-tooltip"), 
        __metadata('design:paramtypes', [])
    ], MapTooltip);
    return MapTooltip;
}(polymer.Base));
MapTooltip.register();
