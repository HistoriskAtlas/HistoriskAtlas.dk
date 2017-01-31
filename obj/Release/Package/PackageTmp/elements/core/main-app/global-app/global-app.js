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
var Global = (function (_super) {
    __extends(Global, _super);
    function Global() {
        _super.apply(this, arguments);
    }
    Global.prototype.ready = function () {
        this.theme = App.passed.theme ? App.passed.theme : Global.defaultTheme;
    };
    Global.prototype.showFavourites = function () {
        if (App.windowFavourites)
            App.windowFavourites.$.windowbasic.bringToFront();
        else
            Common.dom.append(App.windowFavourites = WindowFavourites.create());
    };
    Global.prototype.themeChanged = function () {
        if (!App.map)
            return;
        App.map.center(this.theme.maplatitude ? [this.theme.maplongitude, this.theme.maplatitude] : [Global.defaultTheme.maplongitude, Global.defaultTheme.maplatitude], MainMap.getResolutionFromZoom(this.theme.mapzoom ? this.theme.mapzoom : Global.defaultTheme.mapzoom), false, false);
        this.map = this.theme.mapid ? App.haMaps.byId[this.theme.mapid] : HaMaps.defaultMap;
    };
    //public showRoutes() {
    //    App.map.showRouteLayer();
    //    if (App.windowRoutes)
    //        (<WindowBasic>App.windowRoutes.$.windowbasic).bringToFront();
    //    else
    //        Common.dom.append(<WindowRoutes>WindowRoutes.create());
    //}
    //public hideRoutes() {
    //    if (App.windowRoutes) {
    //        (<WindowBasic>App.windowRoutes.$.windowbasic).close();
    //        App.windowRoutes = null;
    //    }
    //    if (App.windowRoute) {
    //        (<WindowBasic>App.windowRoute.$.windowbasic).close();
    //        App.windowRoute = null;
    //    }
    //}
    Global.prototype.setMapRotation = function (rotation) {
        this.mapRotation = rotation;
    };
    Global.defaultTheme = {
        id: 'default',
        name: 'default',
        mapzoom: 7,
        mapid: 161,
        maplatitude: 56.0,
        maplongitude: 10.0,
        tagid: 427,
        content: null
    };
    __decorate([
        property({ type: Boolean, notify: true }), 
        __metadata('design:type', Boolean)
    ], Global.prototype, "timeWarpActive", void 0);
    __decorate([
        property({ type: Boolean, notify: true }), 
        __metadata('design:type', Boolean)
    ], Global.prototype, "timeLineActive", void 0);
    __decorate([
        property({ type: Number, notify: true }), 
        __metadata('design:type', Number)
    ], Global.prototype, "year", void 0);
    __decorate([
        property({ type: Number, notify: true }), 
        __metadata('design:type', Number)
    ], Global.prototype, "timeWarpYear", void 0);
    __decorate([
        property({ type: Number, notify: true }), 
        __metadata('design:type', Number)
    ], Global.prototype, "mapRotation", void 0);
    __decorate([
        property({ type: Boolean }), 
        __metadata('design:type', Boolean)
    ], Global.prototype, "userCreators", void 0);
    __decorate([
        property({ type: Boolean }), 
        __metadata('design:type', Boolean)
    ], Global.prototype, "profCreators", void 0);
    __decorate([
        property({ type: Object, notify: true }), 
        __metadata('design:type', Object)
    ], Global.prototype, "theme", void 0);
    __decorate([
        property({ type: Object, notify: true }), 
        __metadata('design:type', HaMap)
    ], Global.prototype, "map", void 0);
    __decorate([
        observe('theme'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], Global.prototype, "themeChanged", null);
    Global = __decorate([
        component("global-app"), 
        __metadata('design:paramtypes', [])
    ], Global);
    return Global;
}(polymer.Base));
Global.register();
//# sourceMappingURL=global-app.js.map