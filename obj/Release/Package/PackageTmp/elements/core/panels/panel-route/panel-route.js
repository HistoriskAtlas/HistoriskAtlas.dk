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
var PanelRoute = (function (_super) {
    __extends(PanelRoute, _super);
    //@property({ type: String })
    //public newTitle: string;
    function PanelRoute() {
        _super.call(this);
        //App.windowRoutes = this;
        //this.collections = App.haCollections.collections;
        //this.$.templateCollections.render();
        //this.geos = App.haUsers.user.favourites.geos;
        //App.haUsers.addEventListener('userFavouritesGeosChanged', () => this.$.templateGeos.render())
    }
    //@listen('windowbasic.closed') 
    //windowBasicClosed() {
    //    App.windowRoutes = null;
    //    App.global.routesActive = false;
    //    this.geoToAdd = null;
    //}
    PanelRoute.prototype.collectionTap = function (e) {
        //this.openRoute(<HaCollection>e.model.collection);
        //(<HaCollection>e.model.collection).open();
        App.haCollections.select(e.model.collection);
        //App.haCollections.set('collection', e.model.collection);
    };
    //private openRoute(route: HaCollection) {
    //    if (App.windowRoute) {
    //        App.windowRoute.setRoute(route);
    //        (<WindowBasic>App.windowRoute.$.windowbasic).bringToFront();
    //    } else
    //        Common.dom.append(WindowRoute.create(route));
    //    //if (this.geoToAdd) {
    //    //    App.windowRoute.addGeo(this.geoToAdd);
    //    //    this.geoToAdd = null;
    //    //}
    //}
    // newRoute() {
    //     //this.$.routeTitleDialog.open();
    //     Common.dom.append(DialogText.create('Angiv titel på rute', (title) => this.routeTitleConfirmed(title)));
    //}
    //@listen('route-title-confirmed')
    //routeTitleConfirmed(title: string) {
    //    var route: HaCollection = App.haCollections.newCollection(title);
    //    this.push('collections', route);
    //    this.openRoute(route);
    //}
    //public addGeo(geo: HaGeo) {
    //    this.geoToAdd = geo;
    //    this.drawerOpen = true;
    //    //this.$.windowbasic.bringToFront();
    //    if (this.collections.length == 0)
    //        this.newRoute();
    //    else
    //        App.toast.show("Vælg rute eller opret ny")
    //}
    PanelRoute.prototype.formatDistance = function (distance) {
        return HaCollection.formatDistance(distance);
    };
    __decorate([
        property({ type: Boolean, notify: true }), 
        __metadata('design:type', Boolean)
    ], PanelRoute.prototype, "drawerOpen", void 0);
    __decorate([
        property({ type: Array, notify: true }), 
        __metadata('design:type', Array)
    ], PanelRoute.prototype, "collections", void 0);
    PanelRoute = __decorate([
        component("panel-route"), 
        __metadata('design:paramtypes', [])
    ], PanelRoute);
    return PanelRoute;
}(polymer.Base));
PanelRoute.register();
//# sourceMappingURL=panel-route.js.map