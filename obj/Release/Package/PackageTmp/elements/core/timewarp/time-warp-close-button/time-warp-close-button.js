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
var TimeWarpCloseButton = (function (_super) {
    __extends(TimeWarpCloseButton, _super);
    function TimeWarpCloseButton() {
        _super.call(this);
        this.update();
    }
    TimeWarpCloseButton.prototype.buttonTap = function () {
        this.timeWarpActive = false;
    };
    TimeWarpCloseButton.prototype.update = function () {
        this.mode = App.map.timeWarp.mode;
        this.$.button.update();
    };
    TimeWarpCloseButton.prototype.show = function () {
        this.$.button.show();
    };
    TimeWarpCloseButton.prototype.hide = function () {
        this.$.button.hide();
    };
    __decorate([
        property({ type: Number }), 
        __metadata('design:type', Object)
    ], TimeWarpCloseButton.prototype, "mode", void 0);
    __decorate([
        property({ type: Boolean, notify: true }), 
        __metadata('design:type', Boolean)
    ], TimeWarpCloseButton.prototype, "timeWarpActive", void 0);
    __decorate([
        listen("button.tap"), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], TimeWarpCloseButton.prototype, "buttonTap", null);
    TimeWarpCloseButton = __decorate([
        component("time-warp-close-button"), 
        __metadata('design:paramtypes', [])
    ], TimeWarpCloseButton);
    return TimeWarpCloseButton;
}(polymer.Base));
TimeWarpCloseButton.register();
//# sourceMappingURL=time-warp-close-button.js.map