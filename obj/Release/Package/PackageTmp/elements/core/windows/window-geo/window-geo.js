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
var WindowGeo = (function (_super) {
    __extends(WindowGeo, _super);
    function WindowGeo(geo) {
        var _this = this;
        _super.call(this);
        this.standalone = !geo;
        this.dev = this.standalone ? window.passed.dev : App.isDev;
        this.geo = this.standalone ? new HaGeo(window.passed.geo, false, false) : geo;
        this.editing = typeof App == 'undefined' ? false : App.haUsers.user.canEdit(this.geo);
        this.touchDevice = 'ontouchstart' in window || !!navigator.maxTouchPoints;
        var target = this.$.windowbasic;
        target.ondrop = function (e) {
            if (!_this.editing)
                return;
            _this.startUpload();
            _this.fileUpload.dropFile(e);
            e.preventDefault();
        };
        target.ondragover = function (e) {
            if (!_this.editing)
                return;
            e.stopPropagation();
            return false;
        };
        target.ondragleave = function (e) {
            if (!_this.editing)
                return;
            event.stopPropagation();
            return false;
        };
        if (typeof App != 'undefined')
            if (App.haGeos.firstGeoTour) {
                App.haGeos.firstGeoTour.close();
                App.haGeos.firstGeoTour = null;
            }
    }
    WindowGeo.prototype.tabTap = function (e) {
        var repeater = this.$$('#templateContentTabs');
        this.curContent = repeater.modelForElement(e.target).content;
    };
    WindowGeo.prototype.togglePublishText = function (online) {
        return (online ? 'Afp' : 'P') + 'ublicér fortælling';
    };
    WindowGeo.prototype.togglePublishedTap = function () {
        var _this = this;
        if (this.geo.online) {
            $(this).append(DialogRichText.create('Du er ved at afpublicere fortællingen.', 'Skriv evt. en kommentar her...', function (message) {
                _this.set('geo.online', false);
                _this.insertEditorialText('<b>Afpubliceret</b><br>' + message);
            }));
            return;
        }
        if (App.haUsers.user.isEditor) {
            this.set('geo.online', true);
            this.insertEditorialText('<b>Publiceret</b>');
            this.$.haGeoService.removeTagById(730);
            return;
        }
        $(this).append(DialogRichText.create('Du er ved at sende fortællingen til redaktionel gennemgang og publicering.', 'Skriv en kommentar til redaktøren her...', function (message) {
            _this.$.haGeoService.addTagById(730, true, true);
            _this.insertEditorialText('<b>Sendt til publicering</b><br>' + message);
            Services.proxy('sendgeotopublish', {
                geoid: _this.geo.id,
                remark: Common.html2rich(message)
            });
        }));
    };
    WindowGeo.prototype.insertEditorialText = function (text) {
        if (!this.editorialContent)
            this.push('contents', new HaContent({ geoid: this.geo.id, ordering: 0, contenttypeid: 3 }));
        this.push('editorialContent.texts', new HaSubContentText({ headline: '', text1: Common.html2rich(text) }, this.editorialContent));
    };
    WindowGeo.prototype.addTextContentTap = function () {
        this.$$('#contentTitleDialog').open('content-title-confirmed');
    };
    WindowGeo.prototype.contentTitleConfirmed = function (e) {
        var ordering = this.contents.length == 0 ? 1 : Math.max.apply(Math, this.contents.map(function (o) { return o.ordering; })) + 1;
        var content = new HaContent({ geoid: this.geo.id, ordering: ordering, contenttypeid: 0, texts: [{ headline: e.detail, text1: '' }] });
        this.push('contents', content);
        this.selectedTab = ordering;
    };
    WindowGeo.prototype.addBiblioContentTap = function () {
        var ordering = this.contents.length == 0 ? 1 : Math.max.apply(Math, this.contents.map(function (o) { return o.ordering; })) + 1;
        var content = new HaContent({ geoid: this.geo.id, ordering: ordering, contenttypeid: 1, biblios: [{ cql: this.geo.title }] });
        this.push('contents', content);
        this.selectedTab = ordering;
    };
    WindowGeo.prototype.toggleAddContentSubmenu = function (e) {
        this.$$('#addContentDialog').open();
    };
    WindowGeo.prototype.editorialTap = function () {
        this.windowEditorialShown = !this.windowEditorialShown;
    };
    WindowGeo.prototype.windowEditorialClosed = function () {
        this.windowEditorialShown = false;
    };
    WindowGeo.prototype.tabMenuButtonTap = function (e) {
        var tab = $(e.currentTarget).parents('paper-tab.window-geo');
        this.$$('#tabMenu').positionTarget = tab[0];
        this.$$('#tabMenu').open();
    };
    WindowGeo.prototype.closeTabMenu = function () {
        this.$$('#tabMenu').close();
    };
    WindowGeo.prototype.deleteContent = function () {
        $(this).append(DialogConfirm.create('delete-content', 'Er du sikker på at du vil slette fanebladet?'));
    };
    WindowGeo.prototype.deleteContentConfirmed = function (e) {
        var _this = this;
        this.splice('contents', this.contents.indexOf(this.curContent), 1);
        setTimeout(function () { _this.selectedTab = 0; }, 100);
    };
    WindowGeo.prototype.renameContent = function () {
        this.$$('#contentTitleDialog').open('rename-content-confirmed', this.curContent.headline);
    };
    WindowGeo.prototype.renameContentConfirmed = function (e) {
        var _this = this;
        this.set('contents.' + this.contents.indexOf(this.curContent) + '.headline', e.detail);
        setTimeout(function () { return _this.$$('#tabs').notifyResize(); }, 0);
    };
    WindowGeo.prototype.moveLeftContent = function () { this.moveContent(-1); };
    WindowGeo.prototype.moveRightContent = function () { this.moveContent(1); };
    WindowGeo.prototype.moveContent = function (delta) {
        var _this = this;
        var curIndex = this.contents.indexOf(this.curContent);
        var otherIndex;
        for (var _i = 0, _a = this.contents; _i < _a.length; _i++) {
            var content = _a[_i];
            if (content.ordering == this.curContent.ordering + delta) {
                otherIndex = this.contents.indexOf(content);
                break;
            }
        }
        var temp = this.contents[otherIndex].ordering;
        this.set('contents.' + otherIndex + '.ordering', this.curContent.ordering);
        this.set('contents.' + curIndex + '.ordering', temp);
        this.notifyPath('curContent.ordering', this.curContent.ordering);
        setTimeout(function () { return _this.selectedTab = parseInt(_this.selectedTab) + delta; }, 0);
    };
    WindowGeo.prototype.shareLink = function () {
        this.$$('#shareLinkDialog').open();
    };
    WindowGeo.prototype.shareFB = function () {
        FB.ui({
            method: 'share',
            href: this.geo.link,
        }, function (response) {
        });
    };
    WindowGeo.prototype.shareQR = function () {
        window.open('https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=http://historiskatlas.dk/_(' + this.geo.id + ')', '_blank');
    };
    WindowGeo.prototype.addToFavouritesTap = function () {
        App.global.showFavourites();
        if (App.haUsers.user.favourites.geos.indexOf(this.geo) == -1)
            App.haUsers.push('user.favourites.geos', this.geo);
    };
    WindowGeo.prototype.addToRouteTap = function () {
        Common.dom.append(DialogRouteSelection.create('Tilføj til rute...', this.geo));
    };
    WindowGeo.prototype.deleteGeo = function () {
        $(this).append(DialogConfirm.create('delete-geo', 'Er du sikker på at du vil slette denne fortælling?'));
    };
    WindowGeo.prototype.deleteGeoConfirmed = function () {
        this.$.windowbasic.close();
        App.haGeos.deleteGeo(this.geo);
    };
    WindowGeo.prototype.reportTap = function (e) {
        this.$$('#reportDialog').open();
    };
    WindowGeo.prototype.imageUrl = function (images) {
        if (!images)
            return '';
        return images.length == 0 ? '' : images[0].urlLowRes;
    };
    WindowGeo.prototype.toolbarMode = function (selectedTab) {
        return selectedTab == 0 ? 'seamed' : 'standard';
    };
    WindowGeo.prototype.externalContent = function (contents) {
        for (var _i = 0, contents_1 = contents; _i < contents_1.length; _i++) {
            var content = contents_1[_i];
            if (content.isExternal)
                return content;
        }
        return null;
    };
    WindowGeo.prototype.youTubeThumbnailUrl = function (contents) {
        var content = this.externalContent(contents);
        return content ? content.externals[0].thumbnailUrl : null;
    };
    WindowGeo.prototype.windowClosing = function (e) {
        var _this = this;
        if (this.editing && !this.geo.title) {
            this.$.windowbasic.cancelClose = true;
            Common.dom.append(DialogAlert.create('Giv fortællingen en titel, før du lukker den.', function () {
                _this.$$('#plainTextTitle').setFocus();
            }));
        }
    };
    WindowGeo.prototype.windowClosed = function () {
        if (this.standalone) {
            var coord = Common.fromMapCoord(this.geo.coord);
            location.href = location.href.replace(/[^\/]*_\(([0-9]+)\)/g, '') + '@' + coord[1].toFixed(6) + ',' + coord[0].toFixed(6) + ',16z';
        }
    };
    WindowGeo.prototype.imageTap = function () {
        if (this.geo.images.length == 0) {
            if (this.editing)
                this.addImageTap();
            return;
        }
        var width = this.$.windowbasic.width;
        var height = ($('#imageContainer').offset().top + $('#imageContainer').height() / 2 - this.$.windowbasic.top) * 2;
        Common.dom.append(WindowImage.create(this, width, height, this.$.windowbasic.left, this.$.windowbasic.top));
    };
    WindowGeo.prototype.addImageTap = function () {
        this.startUpload();
        this.fileUpload.uploadClick();
    };
    WindowGeo.prototype.licensChanged = function (e) {
        this.$.haGeoService.addTagById(e.detail.tagID, true, true);
    };
    WindowGeo.prototype.readMoreTapped = function () {
        if (this.contents.length > 0)
            this.selectedTab = 1;
    };
    WindowGeo.prototype.startUpload = function () {
        this.uploading = true;
        if (!this.fileUpload) {
            this.fileUpload = FileUpload.create(true, '*.jpg,*.png', 'target');
            this.listen(this.fileUpload, 'success', 'uploadSuccess');
            $(this.$.imageContainer).append(this.fileUpload);
        }
    };
    WindowGeo.prototype.uploadSuccess = function (result) {
        this.uploading = false;
        this.push('geo.images', result.detail.image);
    };
    WindowGeo.prototype.isProUser = function () {
        return typeof App == 'undefined' ? false : App.haUsers.user.isPro;
    };
    WindowGeo.prototype.isWriter = function () {
        return typeof App == 'undefined' ? false : App.haUsers.user.isWriter;
    };
    WindowGeo.prototype.notNull = function (object) {
        return !!object;
    };
    WindowGeo.prototype.showPeriodTags = function (length, editing) {
        return editing || length > 0;
    };
    WindowGeo.prototype.canReport = function (isUGC) {
        return isUGC && !Common.standalone;
    };
    WindowGeo.prototype.tabsTrack = function (e) {
        e.cancelBubble = true;
    };
    WindowGeo.prototype.sortContents = function (a, b) {
        return a.ordering - b.ordering;
    };
    WindowGeo.prototype.contentIsFirst = function (ordering) {
        return ordering == 1;
    };
    WindowGeo.prototype.contentIsLast = function (ordering) {
        return ordering == this.contents.length;
    };
    WindowGeo.prototype.tagsService = function () {
        return this.$.haGeoService;
    };
    __decorate([
        property({ type: Object }), 
        __metadata('design:type', Object)
    ], WindowGeo.prototype, "geo", void 0);
    __decorate([
        property({ type: Array }), 
        __metadata('design:type', Array)
    ], WindowGeo.prototype, "contents", void 0);
    __decorate([
        property({ type: Object }), 
        __metadata('design:type', HaContent)
    ], WindowGeo.prototype, "editorialContent", void 0);
    __decorate([
        property({ type: Number, value: 0 }), 
        __metadata('design:type', Number)
    ], WindowGeo.prototype, "selectedTab", void 0);
    __decorate([
        property({ type: Boolean, value: false }), 
        __metadata('design:type', Boolean)
    ], WindowGeo.prototype, "windowEditorialShown", void 0);
    __decorate([
        property({ type: Boolean }), 
        __metadata('design:type', Boolean)
    ], WindowGeo.prototype, "standalone", void 0);
    __decorate([
        property({ type: Boolean }), 
        __metadata('design:type', Boolean)
    ], WindowGeo.prototype, "dev", void 0);
    __decorate([
        property({ type: Boolean }), 
        __metadata('design:type', Boolean)
    ], WindowGeo.prototype, "editing", void 0);
    __decorate([
        property({ type: Boolean, value: false }), 
        __metadata('design:type', Boolean)
    ], WindowGeo.prototype, "uploading", void 0);
    __decorate([
        property({ type: Boolean }), 
        __metadata('design:type', Boolean)
    ], WindowGeo.prototype, "touchDevice", void 0);
    __decorate([
        property({ type: Object }), 
        __metadata('design:type', HaContent)
    ], WindowGeo.prototype, "curContent", void 0);
    __decorate([
        listen('content-title-confirmed'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', void 0)
    ], WindowGeo.prototype, "contentTitleConfirmed", null);
    __decorate([
        listen('delete-content-confirmed'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', void 0)
    ], WindowGeo.prototype, "deleteContentConfirmed", null);
    __decorate([
        listen('rename-content-confirmed'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', void 0)
    ], WindowGeo.prototype, "renameContentConfirmed", null);
    __decorate([
        listen('delete-geo-confirmed'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], WindowGeo.prototype, "deleteGeoConfirmed", null);
    __decorate([
        listen("windowbasic.closing"), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Event]), 
        __metadata('design:returntype', void 0)
    ], WindowGeo.prototype, "windowClosing", null);
    __decorate([
        listen("windowbasic.closed"), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], WindowGeo.prototype, "windowClosed", null);
    __decorate([
        listen("imageContainer.tap"),
        listen("imageCount.tap"), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], WindowGeo.prototype, "imageTap", null);
    __decorate([
        listen('licens-changed'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', void 0)
    ], WindowGeo.prototype, "licensChanged", null);
    __decorate([
        listen('read-more-tapped'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], WindowGeo.prototype, "readMoreTapped", null);
    WindowGeo = __decorate([
        component("window-geo"), 
        __metadata('design:paramtypes', [HaGeo])
    ], WindowGeo);
    return WindowGeo;
}(polymer.Base));
WindowGeo.register();
