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
var DialogVideoIntro = (function (_super) {
    __extends(DialogVideoIntro, _super);
    function DialogVideoIntro() {
        _super.apply(this, arguments);
    }
    DialogVideoIntro.prototype.dialogClosed = function (e) {
        $(this).remove();
    };
    __decorate([
        listen('dialog.iron-overlay-closed'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', void 0)
    ], DialogVideoIntro.prototype, "dialogClosed", null);
    DialogVideoIntro = __decorate([
        component("dialog-video-intro"), 
        __metadata('design:paramtypes', [])
    ], DialogVideoIntro);
    return DialogVideoIntro;
}(polymer.Base));
DialogVideoIntro.register();
//# sourceMappingURL=dialog-video-intro.js.map