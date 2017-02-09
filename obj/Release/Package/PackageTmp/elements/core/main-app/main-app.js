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
var App = (function (_super) {
    __extends(App, _super);
    function App() {
        _super.apply(this, arguments);
    }
    App.prototype.leftPanelDraggingChanged = function () {
        if (!App.map)
            return;
        App.map.draggable = !this.leftPanelDragging;
    };
    App.prototype.panelSelectedChanged = function () {
        this.drawerOpen = this.panelSelected == 'drawer';
    };
    App.prototype.drawerOpenChanged = function () {
        this.panelSelected = this.drawerOpen ? 'drawer' : 'main';
    };
    App.prototype.notNull = function (object) {
        return !!object;
    };
    App.prototype.showThemeTitle = function (theme) {
        return theme.id != 'default';
    };
    App.prototype.openCookiesWindow = function () {
        Common.dom.append(WindowPrivacy.create());
    };
    App.prototype.openLoginWindow = function () {
        Common.dom.append(WindowLogin.create());
    };
    App.prototype.cookieConcentGiven = function () {
        localStorage.setItem("cookieConcent", "true");
        Common.dom.append(DialogTourIntro.create());
    };
    App.prototype.timeWarpActiveChanged = function (newVal, oldVal) {
        if (App.map)
            App.map.timeWarp.toggle(newVal);
    };
    App.prototype.mainMapChanged = function (newVal, oldVal) {
        if (App.map)
            App.map.HaMap = newVal;
        this.year = newVal.orgEndYear;
    };
    App.prototype.timeWarpMapChanged = function (newVal, oldVal) {
        if (App.map)
            App.map.timeWarp.HaMap = newVal;
        this.timeWarpYear = newVal.orgEndYear;
    };
    App.prototype.yearChanged = function (newVal) {
        if (App.map)
            if (App.map.digDagLayer)
                App.map.digDagLayer.year = newVal;
    };
    App.prototype.instanceIsDev = function () {
        return App.isDev;
    };
    Object.defineProperty(App, "isDev", {
        get: function () {
            return this.passed.dev;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "useClustering", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    App.prototype.disableLeftPanelSwipe = function (touchDevice, narrow) {
        return !touchDevice || !narrow;
    };
    App.prototype.mainMenuClass = function (theme, showMainMenu) {
        if (this.theme.id == 'hod2017' && !showMainMenu)
            return 'menu-style-theme-HoD2017';
        else
            return '';
    };
    App.prototype.canEditCollection = function (collection) {
        return App.haUsers.user.canEditCollection(collection);
    };
    App.prototype.created = function () {
        App.passed = window.passed;
        if (!App.passed.theme)
            App.passed.theme = Global.defaultTheme;
    };
    App.prototype.ready = function () {
        if (localStorage.getItem("sessionID"))
            document.sid = localStorage.getItem("sessionID");
        this.cookieConcent = localStorage.getItem("cookieConcent") == 'true';
        App.global = document.querySelector('global-app');
        App.mainMenu = document.querySelector('main-menu');
        App.toast = document.querySelector('toast-wrapper');
        App.loading = document.querySelector('dialog-loading');
        App.timeline = document.querySelector('#mainTimeLine');
        App.mapTooltip = document.querySelector('map-tooltip');
        App.haTags = document.querySelector('ha-tags');
        App.haGeos = document.querySelector('ha-geos');
        App.haMaps = document.querySelector('ha-maps');
        App.haRegions = document.querySelector('ha-regions');
        App.haUsers = document.querySelector('ha-users');
        App.haCollections = document.querySelector('ha-collections');
        App.haLicenses = document.querySelector('ha-licenses');
        App.timeWarpClosed = document.querySelector('time-warp-closed');
        document.querySelector('ha-digdag').getData();
        this.touchDevice = 'ontouchstart' in window || !!navigator.maxTouchPoints;
        if (App.passed.theme.id != 'default') {
            this.drawerOpen = true;
            App.mainMenu.showMainMenu = false;
            App.mainMenu.showMenuThemes = true;
        }
        if (App.passed.redribbon) {
            this.showRedRibbon = true;
        }
        if (this.cookieConcent)
            AppMode.showPopup();
        var path = window.location.pathname;
        if (path.substr(-8) == '/welcome') {
            window.history.replaceState({}, null, window.location.href.substr(0, window.location.href.length - 8));
            this.userJustActivated = true;
        }
        if (path.substr(0, 2) == '/@') {
            var atArr = path.substr(2).split(',');
            App.passed.theme.maplatitude = parseFloat(atArr[0]);
            App.passed.theme.maplongitude = parseFloat(atArr[1]);
            App.passed.theme.mapzoom = parseInt(atArr[2]);
        }
    };
    App.init = function () {
        var theme = App.passed.theme;
        App.map = new MainMap([theme.maplatitude ? theme.maplatitude : Global.defaultTheme.maplatitude, theme.maplongitude ? theme.maplongitude : Global.defaultTheme.maplongitude], theme.mapzoom ? theme.mapzoom : Global.defaultTheme.mapzoom);
        FB.init({ appId: '876939902336614', xfbml: true, version: 'v2.2' });
    };
    __decorate([
        property({ type: Boolean }), 
        __metadata('design:type', Boolean)
    ], App.prototype, "drawerOpen", void 0);
    __decorate([
        property({ type: String }), 
        __metadata('design:type', String)
    ], App.prototype, "panelSelected", void 0);
    __decorate([
        property({ type: Boolean, notify: true }), 
        __metadata('design:type', Boolean)
    ], App.prototype, "timeWarpActive", void 0);
    __decorate([
        property({ type: Boolean, notify: true }), 
        __metadata('design:type', Boolean)
    ], App.prototype, "timeLineActive", void 0);
    __decorate([
        property({ type: Number }), 
        __metadata('design:type', Number)
    ], App.prototype, "year", void 0);
    __decorate([
        property({ type: Number }), 
        __metadata('design:type', Number)
    ], App.prototype, "timeWarpYear", void 0);
    __decorate([
        property({ type: Boolean }), 
        __metadata('design:type', Boolean)
    ], App.prototype, "touchDevice", void 0);
    __decorate([
        property({ type: Boolean }), 
        __metadata('design:type', Boolean)
    ], App.prototype, "narrow", void 0);
    __decorate([
        property({ type: Boolean }), 
        __metadata('design:type', Boolean)
    ], App.prototype, "cookieConcent", void 0);
    __decorate([
        property({ type: Number }), 
        __metadata('design:type', Number)
    ], App.prototype, "mapRotation", void 0);
    __decorate([
        property({ type: Boolean }), 
        __metadata('design:type', Boolean)
    ], App.prototype, "leftPanelDragging", void 0);
    __decorate([
        property({ type: Boolean }), 
        __metadata('design:type', Boolean)
    ], App.prototype, "showRedRibbon", void 0);
    __decorate([
        property({ type: Boolean }), 
        __metadata('design:type', Boolean)
    ], App.prototype, "userJustActivated", void 0);
    __decorate([
        property({ type: Boolean, value: false }), 
        __metadata('design:type', Boolean)
    ], App.prototype, "userCreators", void 0);
    __decorate([
        property({ type: Boolean, value: true }), 
        __metadata('design:type', Boolean)
    ], App.prototype, "profCreators", void 0);
    __decorate([
        property({ type: Object }), 
        __metadata('design:type', Object)
    ], App.prototype, "theme", void 0);
    __decorate([
        observe("leftPanelDragging.changed"), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], App.prototype, "leftPanelDraggingChanged", null);
    __decorate([
        observe('panelSelected'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], App.prototype, "panelSelectedChanged", null);
    __decorate([
        observe('drawerOpen'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], App.prototype, "drawerOpenChanged", null);
    __decorate([
        observe("timeWarpActive"), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Boolean, Boolean]), 
        __metadata('design:returntype', void 0)
    ], App.prototype, "timeWarpActiveChanged", null);
    __decorate([
        observe("mainMap"), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [HaMap, HaMap]), 
        __metadata('design:returntype', void 0)
    ], App.prototype, "mainMapChanged", null);
    __decorate([
        observe("timeWarpMap"), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [HaMap, HaMap]), 
        __metadata('design:returntype', void 0)
    ], App.prototype, "timeWarpMapChanged", null);
    __decorate([
        observe("year"), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Number]), 
        __metadata('design:returntype', void 0)
    ], App.prototype, "yearChanged", null);
    App = __decorate([
        component("main-app"), 
        __metadata('design:paramtypes', [])
    ], App);
    return App;
}(polymer.Base));
ol.source.XYZ.prototype.setCanvasTileClass = function () {
    this.tileClass = ol.CanvasTile;
};
App.register();
