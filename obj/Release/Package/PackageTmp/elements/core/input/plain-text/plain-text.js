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
var PlainText = (function (_super) {
    __extends(PlainText, _super);
    function PlainText() {
        _super.apply(this, arguments);
    }
    PlainText.prototype.ready = function () {
        this.contentChanged();
    };
    PlainText.prototype.setFocus = function () {
        if (this.editable)
            this.$$('#content').textarea.focus();
    };
    PlainText.prototype.focus = function () {
        if (!this.editable || !this.enableEditorPanel)
            return;
        $(this.$$('#editorPanel')).css('opacity', 1);
        $(this.$$('#editorPanel')).css('pointer-events', 'auto');
        $(this.$$('#editorPanel')).css('padding-top', '5px');
    };
    PlainText.prototype.blur = function () {
        if (this.editable) {
            this.content = this.immediateContent;
            if (this.enableEditorPanel) {
                $(this.$$('#editorPanel')).css('opacity', 0);
                $(this.$$('#editorPanel')).css('pointer-events', 'none');
                $(this.$$('#editorPanel')).css('padding-top', '0px');
            }
        }
    };
    PlainText.prototype.contentChanged = function () {
        if (!this.content && this.showPlaceholderWhenNotEditing && !this.editable)
            this.content = this.placeholder;
        this.immediateContent = this.content;
    };
    PlainText.prototype.immediateContentChanged = function () {
        this.length = this.immediateContent.length + (this.immediateContent.match(/\n/g) || []).length;
    };
    PlainText.prototype.keydown = function (e) {
        if (e.which === 13 && !this.allowLinebreaks)
            e.preventDefault();
        if (this.numeric)
            if (!this.keyCodeIsNumeric(e.which) && !this.keyCodeIsControl(e.which))
                e.preventDefault();
    };
    PlainText.prototype.keyCodeIsNumeric = function (code) {
        return (code >= 48 && code <= 57) || (code >= 96 && code <= 105);
    };
    PlainText.prototype.keyCodeIsControl = function (code) {
        return (code == 37 || code == 39 || code == 8 || code == 46);
    };
    PlainText.prototype.showReadMore = function (content) {
        if (!this.enableReadMore)
            return;
        return content.lastIndexOf('...') == content.length - 3;
    };
    PlainText.prototype.readMore = function () {
        this.fire('read-more-tapped');
    };
    __decorate([
        property({ type: String, notify: true }), 
        __metadata('design:type', String)
    ], PlainText.prototype, "content", void 0);
    __decorate([
        property({ type: Boolean, value: false }), 
        __metadata('design:type', Boolean)
    ], PlainText.prototype, "editable", void 0);
    __decorate([
        property({ type: Number }), 
        __metadata('design:type', Number)
    ], PlainText.prototype, "maxlength", void 0);
    __decorate([
        property({ type: Number }), 
        __metadata('design:type', Number)
    ], PlainText.prototype, "length", void 0);
    __decorate([
        property({ type: Boolean, notify: true }), 
        __metadata('design:type', String)
    ], PlainText.prototype, "immediateContent", void 0);
    __decorate([
        property({ type: String }), 
        __metadata('design:type', String)
    ], PlainText.prototype, "placeholder", void 0);
    __decorate([
        property({ type: Boolean, value: false }), 
        __metadata('design:type', Boolean)
    ], PlainText.prototype, "allowLinebreaks", void 0);
    __decorate([
        property({ type: Boolean }), 
        __metadata('design:type', Boolean)
    ], PlainText.prototype, "numeric", void 0);
    __decorate([
        property({ type: Boolean, value: false }), 
        __metadata('design:type', Boolean)
    ], PlainText.prototype, "showPlaceholderWhenNotEditing", void 0);
    __decorate([
        property({ type: Boolean, value: false }), 
        __metadata('design:type', Boolean)
    ], PlainText.prototype, "enableEditorPanel", void 0);
    __decorate([
        property({ type: Boolean, value: false }), 
        __metadata('design:type', Boolean)
    ], PlainText.prototype, "enableReadMore", void 0);
    __decorate([
        observe('content'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], PlainText.prototype, "contentChanged", null);
    __decorate([
        observe('immediateContent'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], PlainText.prototype, "immediateContentChanged", null);
    PlainText = __decorate([
        component("plain-text"), 
        __metadata('design:paramtypes', [])
    ], PlainText);
    return PlainText;
}(polymer.Base));
PlainText.register();
