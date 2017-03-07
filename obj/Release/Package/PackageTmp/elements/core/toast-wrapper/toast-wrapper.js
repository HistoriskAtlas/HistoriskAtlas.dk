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
var ToastWrapper = (function (_super) {
    __extends(ToastWrapper, _super);
    function ToastWrapper() {
        _super.apply(this, arguments);
    }
    ToastWrapper.prototype.show = function (text) {
        var _this = this;
        if (this.opened) {
            this.opened = false;
            setTimeout(function () { return _this._show(text); }, 300);
        }
        else
            this._show(text);
    };
    ToastWrapper.prototype._show = function (text) {
        this.set('text', text);
        this.opened = true;
    };
    __decorate([
        property({ type: String }), 
        __metadata('design:type', String)
    ], ToastWrapper.prototype, "text", void 0);
    __decorate([
        property({ type: Boolean }), 
        __metadata('design:type', Boolean)
    ], ToastWrapper.prototype, "opened", void 0);
    ToastWrapper = __decorate([
        component("toast-wrapper"), 
        __metadata('design:paramtypes', [])
    ], ToastWrapper);
    return ToastWrapper;
}(polymer.Base));
ToastWrapper.register();
//# sourceMappingURL=toast-wrapper.js.map