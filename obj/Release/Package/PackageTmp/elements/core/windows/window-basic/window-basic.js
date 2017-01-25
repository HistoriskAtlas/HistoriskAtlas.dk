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
var WindowBasic = (function (_super) {
    __extends(WindowBasic, _super);
    function WindowBasic() {
        var _this = this;
        _super.call(this);
        this.dom = $(this.domHost);
        if (this.right)
            this.set('left', Common.dom.width() - this.width - this.right);
        if (this.bottom)
            this.set('top', Common.dom.height() - this.height - this.bottom);
        if (!this.left)
            this.set('left', Math.max(0, Math.floor((Common.dom.width() - this.width) / 2)));
        if (!this.top)
            this.set('top', Math.max(0, Math.floor((Common.dom.height() - this.height) / 2)));
        this.dom.css('position', 'fixed');
        this.dom.css('opacity', 0);
        this.dom.offset({ left: this.left, top: this.top });
        this.dom.width(this.width);
        this.dom.height(this.height);
        this.dom.css('display', 'block');
        this.dom.addClass('fullscreen-when-narrow');
        this.bringToFront();
        setTimeout(function () {
            _this.elevation = 2;
            _this.dom.css('transition', 'opacity 0.2s');
            _this.dom.css('opacity', 1);
        }, 0);
    }
    WindowBasic.prototype.toolbarClass = function (secColor, lightbox, toolbarHeight) {
        return 'noselect' + (toolbarHeight ? ' ' + toolbarHeight : '') + (lightbox ? ' lightbox' : (secColor ? ' HASecColor' : ' HAPrimColor'));
    };
    WindowBasic.prototype.materialClass = function (lightbox) {
        return lightbox ? 'lightbox' : '';
    };
    WindowBasic.prototype.fullscreenButtonClass = function (allowFullscreen) {
        return allowFullscreen ? 'hide-when-narrow' : 'hidden';
    };
    WindowBasic.prototype.fullscreenIcon = function (fullscreen) {
        return fullscreen ? 'fullscreen-exit' : 'fullscreen';
    };
    WindowBasic.prototype.fullscreenTap = function () {
        this.set('fullscreen', !this.fullscreen);
    };
    WindowBasic.prototype.fullscreenChanged = function () {
        var _this = this;
        if (!this.dom)
            return;
        this.dom.css('transition', WindowBasic.defaultTransition);
        setTimeout(function () { return _this.dom.css('transition', 'opacity 0.2s'); }, 500);
        this.dom.toggleClass('fullscreen');
    };
    WindowBasic.prototype.leftChanged = function () {
        if (this.dom)
            this.dom.css('left', this.left);
    };
    WindowBasic.prototype.topChanged = function () {
        if (this.dom)
            this.dom.css('top', this.top);
    };
    WindowBasic.prototype.widthChanged = function () {
        if (this.dom)
            this.dom.width(this.width);
    };
    WindowBasic.prototype.heightChanged = function () {
        if (this.dom)
            this.dom.height(this.height);
    };
    WindowBasic.prototype.bringToFront = function () {
        if (parseInt(this.dom.css('zIndex')) == WindowBasic.biggestZindex)
            return;
        this.dom.css('zIndex', ++WindowBasic.biggestZindex);
    };
    WindowBasic.prototype.close = function () {
        var _this = this;
        var test = this.fire('closing');
        if (this.cancelClose) {
            this.cancelClose = false;
            return;
        }
        this.elevation = 0;
        this.dom.css('transition', WindowBasic.defaultTransition);
        this.dom.css('opacity', 0);
        setTimeout(function () {
            _this.fire('closed');
            _this.dom.remove();
        }, 200);
    };
    WindowBasic.prototype.track = function (e) {
        switch (e.detail.state) {
            case 'start':
                this.elevation = 4;
                break;
            case 'track':
                this.set('left', this.left + e.detail.ddx);
                this.set('top', this.top + e.detail.ddy);
                break;
            case 'end':
                this.elevation = 2;
                break;
        }
    };
    WindowBasic.biggestZindex = 10;
    WindowBasic.defaultTransition = 'left 0.4s, right 0.4s, top 0.4s, bottom 0.4s, width 0.4s, height 0.4s, opacity 0.2s';
    __decorate([
        property({ type: Number, notify: true }), 
        __metadata('design:type', Number)
    ], WindowBasic.prototype, "left", void 0);
    __decorate([
        property({ type: Number, notify: true }), 
        __metadata('design:type', Number)
    ], WindowBasic.prototype, "top", void 0);
    __decorate([
        property({ type: Number, notify: true }), 
        __metadata('design:type', Number)
    ], WindowBasic.prototype, "right", void 0);
    __decorate([
        property({ type: Number, notify: true }), 
        __metadata('design:type', Number)
    ], WindowBasic.prototype, "bottom", void 0);
    __decorate([
        property({ type: Number, notify: true, value: 500 }), 
        __metadata('design:type', Number)
    ], WindowBasic.prototype, "width", void 0);
    __decorate([
        property({ type: Number, notify: true, value: 550 }), 
        __metadata('design:type', Number)
    ], WindowBasic.prototype, "height", void 0);
    __decorate([
        property({ type: Number, value: 0 }), 
        __metadata('design:type', Number)
    ], WindowBasic.prototype, "elevation", void 0);
    __decorate([
        property({ type: Object, value: false }), 
        __metadata('design:type', Object)
    ], WindowBasic.prototype, "secColor", void 0);
    __decorate([
        property({ type: Object, value: false }), 
        __metadata('design:type', Object)
    ], WindowBasic.prototype, "lightbox", void 0);
    __decorate([
        property({ type: Boolean, value: false, notify: true }), 
        __metadata('design:type', Boolean)
    ], WindowBasic.prototype, "fullscreen", void 0);
    __decorate([
        property({ type: Boolean, value: false }), 
        __metadata('design:type', Boolean)
    ], WindowBasic.prototype, "allowFullscreen", void 0);
    __decorate([
        property({ type: String, value: 'seamed' }), 
        __metadata('design:type', String)
    ], WindowBasic.prototype, "toolbarMode", void 0);
    __decorate([
        property({ type: String, value: '' }), 
        __metadata('design:type', String)
    ], WindowBasic.prototype, "toolbarHeight", void 0);
    __decorate([
        listen("fullscreen.tap"), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], WindowBasic.prototype, "fullscreenTap", null);
    __decorate([
        observe('fullscreen'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], WindowBasic.prototype, "fullscreenChanged", null);
    __decorate([
        observe('left'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], WindowBasic.prototype, "leftChanged", null);
    __decorate([
        observe('top'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], WindowBasic.prototype, "topChanged", null);
    __decorate([
        observe('width'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], WindowBasic.prototype, "widthChanged", null);
    __decorate([
        observe('height'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], WindowBasic.prototype, "heightChanged", null);
    __decorate([
        listen("down"), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], WindowBasic.prototype, "bringToFront", null);
    __decorate([
        listen("close.tap"),
        listen("back.tap"), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], WindowBasic.prototype, "close", null);
    __decorate([
        listen("toolbar.track"), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', void 0)
    ], WindowBasic.prototype, "track", null);
    WindowBasic = __decorate([
        component("window-basic"), 
        __metadata('design:paramtypes', [])
    ], WindowBasic);
    return WindowBasic;
}(polymer.Base));
WindowBasic.register();
