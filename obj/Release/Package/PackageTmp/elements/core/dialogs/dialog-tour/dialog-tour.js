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
var DialogTour = (function (_super) {
    __extends(DialogTour, _super);
    function DialogTour(title, text, left, right, top, bottom, arrowLeft, arrowRight, arrowTop, arrowBottom, buttonOK, localStorageKey) {
        if (buttonOK === void 0) { buttonOK = false; }
        if (localStorageKey === void 0) { localStorageKey = null; }
        _super.call(this);
        this.title = title;
        this.text = text;
        this.buttonOK = buttonOK;
        this.localStorageKey = localStorageKey;
        if (left != null)
            this.left = left;
        if (right != null)
            this.right = right;
        if (top != null)
            this.top = top;
        if (bottom != null)
            this.bottom = bottom;
        if (arrowLeft != null)
            $(this.$.arrow).css('left', arrowLeft);
        if (arrowRight != null)
            $(this.$.arrow).css('right', arrowRight);
        if (arrowTop != null)
            $(this.$.arrow).css('top', arrowTop);
        if (arrowBottom != null)
            $(this.$.arrow).css('bottom', arrowBottom);
    }
    DialogTour.prototype.ready = function () {
        this.opened = true;
    };
    DialogTour.prototype.close = function () {
        this.opened = false;
    };
    DialogTour.prototype.closed = function () {
        $(this).remove();
    };
    DialogTour.prototype.closeTap = function () {
        if (this.localStorageKey)
            LocalStorage.set(this.localStorageKey, 'true');
    };
    DialogTour.prototype.nextTap = function () {
        this.fire('next');
    };
    Object.defineProperty(DialogTour.prototype, "left", {
        set: function (value) {
            this.setCSS('left', value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DialogTour.prototype, "right", {
        set: function (value) {
            this.setCSS('right', value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DialogTour.prototype, "top", {
        set: function (value) {
            this.setCSS('top', value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DialogTour.prototype, "bottom", {
        set: function (value) {
            this.setCSS('bottom', value);
        },
        enumerable: true,
        configurable: true
    });
    DialogTour.prototype.setCSS = function (attribute, value) {
        $(this.$.container).css(attribute, value);
        $(this.$.dialog).addClass('dialog-' + attribute);
    };
    DialogTour.prototype.nextText = function (buttonOK) {
        return buttonOK ? 'OK' : 'Næste';
    };
    __decorate([
        property({ type: String }), 
        __metadata('design:type', String)
    ], DialogTour.prototype, "title", void 0);
    __decorate([
        property({ type: String }), 
        __metadata('design:type', String)
    ], DialogTour.prototype, "text", void 0);
    __decorate([
        property({ type: Boolean }), 
        __metadata('design:type', Boolean)
    ], DialogTour.prototype, "opened", void 0);
    __decorate([
        property({ type: Boolean }), 
        __metadata('design:type', Boolean)
    ], DialogTour.prototype, "buttonOK", void 0);
    __decorate([
        listen('iron-overlay-closed'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], DialogTour.prototype, "closed", null);
    DialogTour = __decorate([
        component("dialog-tour"), 
        __metadata('design:paramtypes', [String, String, Number, Number, Number, Number, Number, Number, Number, Number, Boolean, String])
    ], DialogTour);
    return DialogTour;
}(polymer.Base));
DialogTour.register();
//# sourceMappingURL=dialog-tour.js.map