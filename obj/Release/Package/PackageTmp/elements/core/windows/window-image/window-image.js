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
var WindowImage = (function (_super) {
    __extends(WindowImage, _super);
    function WindowImage(windowGeo, width, height, left, top) {
        var _this = this;
        _super.call(this);
        this.windowGeo = windowGeo;
        this.set('width', width);
        this.set('height', height);
        this.set('left', left);
        this.set('top', top);
        this.set('editing', windowGeo.editing);
        this.set('geo', windowGeo.geo);
        this.set('contents', windowGeo.contents);
        $('.inner-container').css('width', (((this.youTubeEmbedUrl(this.contents) ? 1 : 0) + windowGeo.geo.images.length) * 100) + '%');
        this.image = windowGeo.geo.images[0];
        this.scroll(0);
        setTimeout(function () { _this.set('fullscreen', true); }, 10);
        $('.overlay').on('swipeleft', function (event) { return _this.arrowRightTap(); });
        $('.overlay').on('swiperight', function (event) { return _this.arrowLeftTap(); });
        if (this.youTubeEmbedUrl(this.contents))
            $('.overlay').css('pointer-events', 'none');
        $(window).resize(function () { return $(_this.$.container).scrollLeft(_this.geo.images.indexOf(_this.image) * $(_this.$.container).width()); });
    }
    WindowImage.prototype.imageStyle = function (image) {
        return "background-image: url('" + image.urlLowRes + "')";
    };
    WindowImage.prototype.showHighRes = function (image, curImage) {
        return Math.abs(this.geo.images.indexOf(image) - this.geo.images.indexOf(curImage)) < 2;
    };
    WindowImage.prototype.imageload = function (e) {
        var image = e.target;
        image.parentElement.style.backgroundImage = "url('" + image.src + "')";
    };
    WindowImage.prototype.externalContent = function (contents) {
        if (!contents)
            return null;
        for (var _i = 0, contents_1 = contents; _i < contents_1.length; _i++) {
            var content = contents_1[_i];
            if (content.isExternal)
                return content;
        }
        return null;
    };
    WindowImage.prototype.youTubeEmbedUrl = function (contents) {
        var content = this.externalContent(contents);
        return content ? content.externals[0].embedUrl : null;
    };
    WindowImage.prototype.isFirstImage = function (image) {
        return this.geo.images[0] == image;
    };
    WindowImage.prototype.isLastImage = function (image) {
        return this.geo.images[this.geo.images.length - 1] == image;
    };
    WindowImage.prototype.arrowRightTap = function () {
        this.scroll(1);
    };
    WindowImage.prototype.arrowLeftTap = function () {
        this.scroll(-1);
    };
    WindowImage.prototype.licensChanged = function (e) {
        this.$.haImageService.addTagById(e.detail.tagID, true, true);
    };
    WindowImage.prototype.scroll = function (delta) {
        var i = this.geo.images.indexOf(this.image) + delta;
        this.image = this.geo.images[i];
        $(this.$.container).animate({ scrollLeft: i * $('#container').width() }, 250, 'easeOutQuad');
    };
    WindowImage.prototype.deleteImage = function () {
        $(this).append(DialogConfirm.create('delete-image', 'Er du sikker på at du vil slette dette billede?'));
    };
    WindowImage.prototype.deleteImageConfirmed = function () {
        this.$.windowbasic.close();
        this.$.haImageService.deleteImage();
    };
    __decorate([
        property({ type: Object }), 
        __metadata('design:type', Object)
    ], WindowImage.prototype, "geo", void 0);
    __decorate([
        property({ type: Array }), 
        __metadata('design:type', Array)
    ], WindowImage.prototype, "contents", void 0);
    __decorate([
        property({ type: Boolean, notify: true }), 
        __metadata('design:type', Boolean)
    ], WindowImage.prototype, "fullscreen", void 0);
    __decorate([
        property({ type: Number }), 
        __metadata('design:type', Number)
    ], WindowImage.prototype, "width", void 0);
    __decorate([
        property({ type: Number }), 
        __metadata('design:type', Number)
    ], WindowImage.prototype, "height", void 0);
    __decorate([
        property({ type: Number }), 
        __metadata('design:type', Number)
    ], WindowImage.prototype, "left", void 0);
    __decorate([
        property({ type: Number }), 
        __metadata('design:type', Number)
    ], WindowImage.prototype, "top", void 0);
    __decorate([
        property({ type: Object }), 
        __metadata('design:type', Object)
    ], WindowImage.prototype, "image", void 0);
    __decorate([
        property({ type: Boolean }), 
        __metadata('design:type', Boolean)
    ], WindowImage.prototype, "editing", void 0);
    __decorate([
        listen('licens-changed'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', void 0)
    ], WindowImage.prototype, "licensChanged", null);
    __decorate([
        listen('delete-image-confirmed'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], WindowImage.prototype, "deleteImageConfirmed", null);
    WindowImage = __decorate([
        component("window-image"), 
        __metadata('design:paramtypes', [WindowGeo, Number, Number, Number, Number])
    ], WindowImage);
    return WindowImage;
}(polymer.Base));
WindowImage.register();
