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
var DialogText = (function (_super) {
    __extends(DialogText, _super);
    function DialogText(text, confirmCallbackFunction, prefilled) {
        if (prefilled === void 0) { prefilled = null; }
        _super.call(this);
        if (!text)
            return;
        this.text = text;
        this.confirmCallbackFunction = confirmCallbackFunction;
        this.open(null, prefilled);
    }
    DialogText.prototype.open = function (confirmCallback, prefilled) {
        if (confirmCallback === void 0) { confirmCallback = null; }
        if (prefilled === void 0) { prefilled = null; }
        if (confirmCallback)
            this.confirmCallback = confirmCallback;
        if (prefilled)
            this.input = prefilled;
        this.$.dialog.open();
    };
    DialogText.prototype.dialogIronOverlayClosed = function (e) {
        this.closeDialog(e.detail.confirmed);
    };
    DialogText.prototype.checkForEnter = function (e) {
        if (e.which === 13) {
            this.$.dialog.close();
            this.closeDialog(true);
        }
    };
    DialogText.prototype.closeDialog = function (confirmed) {
        if (confirmed) {
            if (this.confirmCallback)
                this.fire(this.confirmCallback, this.input);
            if (this.confirmCallbackFunction)
                this.confirmCallbackFunction(this.input);
        }
        this.input = '';
    };
    __decorate([
        property({ type: String }), 
        __metadata('design:type', String)
    ], DialogText.prototype, "input", void 0);
    __decorate([
        property({ type: String }), 
        __metadata('design:type', String)
    ], DialogText.prototype, "confirmCallback", void 0);
    __decorate([
        property({ type: String }), 
        __metadata('design:type', String)
    ], DialogText.prototype, "text", void 0);
    __decorate([
        listen('dialog.iron-overlay-closed'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', void 0)
    ], DialogText.prototype, "dialogIronOverlayClosed", null);
    DialogText = __decorate([
        component("dialog-text"), 
        __metadata('design:paramtypes', [String, Function, String])
    ], DialogText);
    return DialogText;
}(polymer.Base));
DialogText.register();
