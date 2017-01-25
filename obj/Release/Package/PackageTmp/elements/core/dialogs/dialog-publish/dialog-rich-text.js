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
var DialogRichText = (function (_super) {
    __extends(DialogRichText, _super);
    function DialogRichText(headline, placeholder, confirmCallback) {
        _super.call(this);
        this.headline = headline;
        this.placeholder = placeholder;
        this._confirmCallback = confirmCallback;
    }
    DialogRichText.prototype.dialogIronOverlayClosed = function (e) {
        this.closeDialog(e.detail.confirmed);
    };
    DialogRichText.prototype.closeDialog = function (confirmed) {
        if (confirmed) {
            if (this._confirmCallback)
                this._confirmCallback(this.input);
        }
    };
    __decorate([
        property({ type: String }), 
        __metadata('design:type', String)
    ], DialogRichText.prototype, "headline", void 0);
    __decorate([
        property({ type: String }), 
        __metadata('design:type', String)
    ], DialogRichText.prototype, "placeholder", void 0);
    __decorate([
        property({ type: String }), 
        __metadata('design:type', String)
    ], DialogRichText.prototype, "input", void 0);
    __decorate([
        listen('dialog.iron-overlay-closed'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', void 0)
    ], DialogRichText.prototype, "dialogIronOverlayClosed", null);
    DialogRichText = __decorate([
        component("dialog-rich-text"), 
        __metadata('design:paramtypes', [String, String, Function])
    ], DialogRichText);
    return DialogRichText;
}(polymer.Base));
DialogRichText.register();
