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
var TimeWarpShapeButton = (function (_super) {
    __extends(TimeWarpShapeButton, _super);
    function TimeWarpShapeButton() {
        _super.call(this);
        //this.dom = $(this);
        this.update();
    }
    //private dom: JQuery;
    TimeWarpShapeButton.prototype.buttonTap = function () {
        App.map.timeWarp.toggleMode();
    };
    TimeWarpShapeButton.prototype.icon = function (mode) {
        return mode == TimeWarpModes.SPLIT ? 'radio-button-unchecked' : 'check-box-outline-blank';
    };
    TimeWarpShapeButton.prototype.update = function () {
        this.mode = App.map.timeWarp.mode;
        this.$.button.update();
    };
    TimeWarpShapeButton.prototype.show = function () {
        this.$.button.show();
    };
    TimeWarpShapeButton.prototype.hide = function () {
        this.$.button.hide();
    };
    __decorate([
        property({ type: Number }), 
        __metadata('design:type', Object)
    ], TimeWarpShapeButton.prototype, "mode", void 0);
    __decorate([
        listen("button.tap"), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], TimeWarpShapeButton.prototype, "buttonTap", null);
    TimeWarpShapeButton = __decorate([
        component("time-warp-shape-button"), 
        __metadata('design:paramtypes', [])
    ], TimeWarpShapeButton);
    return TimeWarpShapeButton;
}(polymer.Base));
TimeWarpShapeButton.register();
//# sourceMappingURL=time-warp-shape-button.js.map