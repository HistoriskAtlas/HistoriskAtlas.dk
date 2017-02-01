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
var WindowRoute = (function (_super) {
    __extends(WindowRoute, _super);
    function WindowRoute() {
        _super.apply(this, arguments);
    }
    WindowRoute.prototype.windowBasicClosed = function () {
        this.route.saveDistance();
        App.haCollections.deselect(this.route);
        App.map.routeLayer.clear();
    };
    WindowRoute.prototype.renameTap = function () {
        var _this = this;
        Common.dom.append(DialogText.create('Angiv ny titel på rute', function (title) { return _this.set('route.title', title); }));
    };
    //@observe('route')
    //routeChanged(val: HaCollection) {
    //    App.map.showRouteLayer()
    //    //this.updateRouteLayer();
    //}
    //public setRoute(route: HaCollection) {
    //    this.route = route;
    //    App.map.routeLayer.clear();
    //    for (var i = 1; i < route.geos.length; i++)
    //        App.map.routeLayer.addPath(route.geos[i].icon.coord4326, route.geos[i - 1].icon.coord4326);
    //}
    //public addGeo(geo: HaGeo) {
    //    this.push('route.geos', geo);
    //    this.route.saveNewGeo(geo)
    //    if (this.route.geos.length > 1) {
    //        var lastGeo: HaGeo = this.route.geos[this.route.geos.length - 2];
    //        App.map.routeLayer.addPath(geo.icon.coord4326, lastGeo.icon.coord4326);
    //    }
    //}
    //geoTap(e: any) {
    //    Common.dom.append(WindowGeo.create(<HaGeo>e.model.geo));
    //}
    WindowRoute.prototype.getAutosuggestSchema = function (geos) {
        var existingIds = [];
        for (var _i = 0, geos_1 = geos; _i < geos_1.length; _i++) {
            var geo = geos_1[_i];
            existingIds.push(geo.id);
        }
        return '{geo:{filters:{id:{not:{is:[' + existingIds.join(',') + ']}},title:{like:$input}},fields:[id,title]}}';
    };
    WindowRoute.prototype.geoSelected = function (e) {
        Common.dom.append(WindowGeo.create(e.detail));
    };
    WindowRoute.prototype.geoAdded = function (e) {
        var geo = App.haGeos.geos[e.detail.id];
        geo.title = e.detail.title;
        App.map.centerAnim(geo.coord, 3000, true, true);
        //geo.zoomUntilUnclustered
        this.push('route.geos', geo);
        this.route.saveNewGeo(geo);
        //if (this.route.geos.length > 1) {
        //    var lastGeo: HaGeo = this.route.geos[this.route.geos.length - 2];
        //    App.map.routeLayer.addPath(geo.icon.coord4326, lastGeo.icon.coord4326, (distance) => {
        //        this.route.distance += distance;
        //    });
        //}
    };
    WindowRoute.prototype.geoRemoved = function (e) {
        var geo = App.haGeos.geos[e.detail.id];
        this.splice('route.geos', this.route.geos.indexOf(geo), 1);
        this.route.removeGeo(geo);
        //this.updateRouteLayer();
    };
    WindowRoute.prototype.geoSortableListUpdate = function (e) {
        if (e.detail) {
            //this.updateRouteLayer();
            this.route.updateOrdering(e.detail.oldIndex, e.detail.newIndex); //TODO: wait for routelayer update so distance can also be saved, same in the two above.........?
        }
    };
    //@observe('route.geos.splices')
    //routeGeosSplices(changeRecord: ChangeRecord<HaGeo>) {
    //    if (!changeRecord)
    //        return;
    //    for (var indexSplice of changeRecord.indexSplices) {
    //        for (var geo of indexSplice.removed)
    //            this.route.removeGeo(geo);
    //        for (var i = indexSplice.index; i < indexSplice.index + indexSplice.addedCount; i++)
    //            this.route.saveNewGeo(this.route.geos[i]);
    //        if (indexSplice.addedCount > 0)
    //            this.route.updateOrdering();
    //    }
    //}
    WindowRoute.prototype.formatDistance = function (distance) {
        return HaCollection.formatDistance(distance);
    };
    WindowRoute.prototype.formatType = function (type) {
        return HaCollection.types[type];
    };
    WindowRoute.prototype.types = function () {
        return HaCollection.types;
    };
    WindowRoute.prototype.typeTap = function (e) {
        this.set('route.type', HaCollection.types.indexOf(e.model.item));
        this.$$('#paperMenuButtonType').close();
    };
    __decorate([
        property({ type: Object, notify: true }), 
        __metadata('design:type', HaCollection)
    ], WindowRoute.prototype, "route", void 0);
    __decorate([
        listen('windowbasic.closed'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], WindowRoute.prototype, "windowBasicClosed", null);
    __decorate([
        listen('geoAutosuggestSelected'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', void 0)
    ], WindowRoute.prototype, "geoSelected", null);
    __decorate([
        listen('geoAutosuggestAdded'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', void 0)
    ], WindowRoute.prototype, "geoAdded", null);
    __decorate([
        listen('geoAutosuggestRemoved'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', void 0)
    ], WindowRoute.prototype, "geoRemoved", null);
    __decorate([
        listen('geoSortableList.update'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', void 0)
    ], WindowRoute.prototype, "geoSortableListUpdate", null);
    WindowRoute = __decorate([
        component("window-route"), 
        __metadata('design:paramtypes', [])
    ], WindowRoute);
    return WindowRoute;
}(polymer.Base));
WindowRoute.register();
//# sourceMappingURL=window-route.js.map