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
var DialogLoading = (function (_super) {
    __extends(DialogLoading, _super);
    function DialogLoading() {
        _super.apply(this, arguments);
    }
    DialogLoading.prototype.ready = function () {
        this.texts = [];
    };
    DialogLoading.prototype.show = function (text) {
        if (this.texts.length == 0 && !this.text)
            this.text = text;
        else
            this.texts.push(text);
        this.elevation = 1;
    };
    DialogLoading.prototype.hide = function (text) {
        if (this.text == text) {
            if (this.texts.length == 0) {
                this.oldText = text;
                this.text = '';
            }
            else
                this.text = this.texts.pop();
        }
        else
            this.texts.splice(this.texts.indexOf(text), 1);
        if (!this.text)
            this.elevation = 0;
    };
    DialogLoading.prototype.shownText = function (text) {
        return text ? text : this.oldText;
    };
    __decorate([
        property({ type: String }), 
        __metadata('design:type', String)
    ], DialogLoading.prototype, "text", void 0);
    __decorate([
        property({ type: Number, value: 0 }), 
        __metadata('design:type', Number)
    ], DialogLoading.prototype, "elevation", void 0);
    DialogLoading = __decorate([
        component("dialog-loading"), 
        __metadata('design:paramtypes', [])
    ], DialogLoading);
    return DialogLoading;
}(polymer.Base));
DialogLoading.register();
