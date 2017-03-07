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
var RichText = (function (_super) {
    __extends(RichText, _super);
    function RichText() {
        _super.apply(this, arguments);
    }
    RichText.prototype.ready = function () {
        //this.contentChanged();
        this.isIE = window.navigator.userAgent.indexOf("MSIE ") > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;
    };
    RichText.prototype.focus = function () {
        if (this.editable) {
            this.focusButton();
        }
    };
    RichText.prototype.blur = function () {
        if (this.editable)
            this.content = this.immediateContent; //TODO: also on inactivity....?
    };
    RichText.prototype.focusButton = function () {
        $(this.$.content).focus();
    };
    RichText.prototype.keypress = function (e) {
        if (this.maxlength)
            if (this.$.content.innerText.length >= this.maxlength)
                e.preventDefault();
    };
    RichText.prototype.input = function () {
        var elem = this.$.content;
        this.immediateContent = elem.innerHTML;
        //this.length = elem.innerText.length;
    };
    RichText.prototype.paste = function (e) {
        var _this = this;
        setTimeout(function () { return _this.cleanHtml(); }, 0);
    };
    RichText.prototype.cleanHtml = function () {
        var elem = this.$.content;
        //elem.innerHTML = '<div>' + elem.innerHTML + '</div>';
        //elem.innerHTML = elem.innerHTML.replace(/<o:p>\s*<\/o:p>/g, "");
        //elem.innerHTML = elem.innerHTML.replace(/<o:p>.*?<\/o:p>/g, "&nbsp;");
        var html = elem.innerHTML;
        html = html.replace(/>\n+?</gi, '><'); //removes linebreaks between tags
        html = html.replace(/\n/gi, ' '); //converts all other linebreaks to a space
        html = html.replace(/<\s*p[^>]*>(.*?)<\s*\/\s*p\s*>/gi, '$1<br>'); //converts p's to br's
        html = html.replace(/<b [^>]*>/gi, '<b>'); //removes styles from b (IE fix)
        html = html.replace(/<i [^>]*>/gi, '<i>'); //removes styles from i (IE fix)
        var text = Common.html2rich(html);
        text = text.replace(/<[^>]*>/gi, '');
        elem.innerHTML = Common.rich2html(text);
        this.input();
    };
    RichText.prototype.contentChanged = function () {
        if (this.content == null)
            return;
        var content;
        if (window.App)
            content = this.content.replace(RichText.matchGeoLink, function (g1, g2, g3, g4, g5) {
                return '<a href="javascript:void(0);" onclick="Common.geoClick(' + g2 + ')">' + g3 + '</a>';
            });
        else
            content = this.content;
        this.immediateContent = content;
    };
    RichText.prototype.immediateContentChanged = function (newVal, oldVal) {
        var element = this.$.content;
        //if (this.placeholder && this.editable && !oldVal)
        //    this.showPlaceholder = this.immediateContent == '';
        if (element.innerHTML != this.immediateContent)
            element.innerHTML = this.immediateContent;
        if (element.innerText.trim() == '')
            this.immediateContent = '';
        this.length = element.innerText.length;
    };
    //@observe('editable')
    //editableChanged() {
    //    if (this.editable)
    //        if (this.placeholder && this.immediateContent == '')
    //            this.showPlaceholder = true;;
    //}
    RichText.prototype.boldTap = function () { this.exec('bold'); };
    ;
    RichText.prototype.italicTap = function () { this.exec('italic'); };
    ;
    RichText.prototype.linkTap = function () {
        var n = window.getSelection().anchorNode;
        (n.nodeType === 3) && (n = n.parentNode);
        if (n.nodeName.toLowerCase() == "a") {
            this.selectElementContents(n);
            this.exec('unlink');
        }
        else {
            this.saveSelection();
            this.$$('#linkUrlDialog').open();
        }
    };
    ;
    RichText.prototype.undoTap = function () { this.exec('undo'); };
    ;
    RichText.prototype.redoTap = function () { this.exec('redo'); };
    ;
    RichText.prototype.exec = function (com, opts) {
        //var elem = window.getSelection().anchorNode.parentNode; //Was parentElement
        if (opts === void 0) { opts = null; }
        //while (elem != this.$.content) {
        //    if (elem == document.documentElement)
        //        return;
        //    elem = elem.parentElement;
        //}
        //var test = document.getSelection().getRangeAt(0);
        document.execCommand(com, false, opts);
    };
    RichText.prototype.linkUrlConfirmed = function (e) {
        this.restoreSelection();
        var url = e.detail;
        if (url.toLowerCase().indexOf('http') == -1)
            url = 'http://' + url;
        this.exec('createlink', url);
    };
    RichText.prototype.selectElementContents = function (el) {
        var range = document.createRange();
        range.selectNodeContents(el);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    };
    RichText.prototype.saveSelection = function () {
        if (window.getSelection) {
            var sel = window.getSelection();
            if (sel.getRangeAt && sel.rangeCount)
                this.savedSelectionRange = sel.getRangeAt(0);
        }
        //else if ((<any>document).selection && (<any>document).selection.createRange)
        //    this.savedSelectionRange = (<any>document).selection.createRange();
    };
    RichText.prototype.restoreSelection = function () {
        if (window.getSelection) {
            var sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(this.savedSelectionRange);
        }
        //else if ((<any>document).selection && (<any>this.savedSelectionRange).select)
        //    (<any>this.savedSelectionRange).select();
    };
    RichText.matchGeoLink = new RegExp('<a href=["\']http:\/\/historiskatlas\.dk\/.*?_\\((.*?)\\)["\']>(.*?)<\/a>', 'g');
    __decorate([
        property({ type: String, notify: true }), 
        __metadata('design:type', String)
    ], RichText.prototype, "content", void 0);
    __decorate([
        property({ type: Boolean, value: false }), 
        __metadata('design:type', Boolean)
    ], RichText.prototype, "editable", void 0);
    __decorate([
        property({ type: Number }), 
        __metadata('design:type', Number)
    ], RichText.prototype, "maxlength", void 0);
    __decorate([
        //TODO: Should not be possible to set maxlength.......... because it screws up with formatting.....
        property({ type: Number }), 
        __metadata('design:type', Number)
    ], RichText.prototype, "length", void 0);
    __decorate([
        property({ type: Boolean, notify: true }), 
        __metadata('design:type', String)
    ], RichText.prototype, "immediateContent", void 0);
    __decorate([
        property({ type: String }), 
        __metadata('design:type', String)
    ], RichText.prototype, "placeholder", void 0);
    __decorate([
        property({ type: Boolean }), 
        __metadata('design:type', Boolean)
    ], RichText.prototype, "isIE", void 0);
    __decorate([
        observe('content'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], RichText.prototype, "contentChanged", null);
    __decorate([
        observe('immediateContent'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [String, String]), 
        __metadata('design:returntype', void 0)
    ], RichText.prototype, "immediateContentChanged", null);
    __decorate([
        listen('link-url-confirmed'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', void 0)
    ], RichText.prototype, "linkUrlConfirmed", null);
    RichText = __decorate([
        component("rich-text"), 
        __metadata('design:paramtypes', [])
    ], RichText);
    return RichText;
}(polymer.Base));
RichText.register();
//# sourceMappingURL=rich-text.js.map