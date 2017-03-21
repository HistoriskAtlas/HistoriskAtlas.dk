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
        if (this.route) {
            this.route.saveProp('distance');
            App.haCollections.deselect(this.route);
        }
    };
    WindowRoute.prototype.renameTap = function () {
        var _this = this;
        Common.dom.append(DialogText.create('Angiv ny titel på turforslag', function (title) { return _this.set('route.title', title); }));
    };
    WindowRoute.prototype.editorialTap = function () {
        this.windowEditorialShown = !this.windowEditorialShown;
    };
    WindowRoute.prototype.windowEditorialClosed = function () {
        this.windowEditorialShown = false;
    };
    WindowRoute.prototype.togglePublishText = function (online) {
        return (online ? 'Afp' : 'P') + 'ublicér turforslag';
    };
    WindowRoute.prototype.togglePublishedTap = function () {
        this.set('route.online', !this.route.online);
    };
    WindowRoute.prototype.deleteTap = function () {
        $(this).append(DialogConfirm.create('delete-route', 'Er du sikker på at du vil slette dette turforslag?'));
    };
    WindowRoute.prototype.deleteRouteConfirmed = function () {
        var route = this.route;
        this.set('route.selected', false);
        App.haCollections.deselect(this.route);
        App.haCollections.deleteRoute(route);
        this.$.windowbasic.close();
    };
    WindowRoute.prototype.getAutosuggestSchema = function (collection_geos) {
        var existingIds = [];
        for (var _i = 0, collection_geos_1 = collection_geos; _i < collection_geos_1.length; _i++) {
            var cg = collection_geos_1[_i];
            existingIds.push(cg.geo.id);
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
        var collection_geo = new HaCollectionGeo({ geoid: geo.id, ordering: this.route.collection_geos[this.route.collection_geos.length - 1].ordering + HaCollectionGeo.orderingGap });
        this.push('route.collection_geos', collection_geo);
        this.route.saveNewCollectionGeo(collection_geo);
    };
    WindowRoute.prototype.geoRemoved = function (e) {
        var collection_geo = e.detail;
        this.route.removeCollectionGeo(collection_geo);
        this.splice('route.collection_geos', this.route.collection_geos.indexOf(collection_geo), 1);
    };
    WindowRoute.prototype.geoSortableListUpdate = function (e) {
        if (e.detail) {
            this.route.updateOrdering(e.detail.newIndex);
        }
    };
    WindowRoute.prototype.formatDistance = function (distance) {
        return HaCollection.formatDistance(distance);
    };
    WindowRoute.prototype.iconType = function (type) {
        return HaCollection.iconTypes[type];
    };
    WindowRoute.prototype.iconTypes = function () {
        return HaCollection.iconTypes;
    };
    WindowRoute.prototype.typeTap = function (e) {
        this.set('route.type', HaCollection.iconTypes.indexOf(e.model.item));
        this.$$('#paperMenuButtonType').close();
    };
    WindowRoute.prototype.showPeriodTags = function (length, editing) {
        return editing || length > 0;
    };
    WindowRoute.prototype.tagsService = function () {
        return App.haCollections;
    };
    __decorate([
        property({ type: Object, notify: true }), 
        __metadata('design:type', HaCollection)
    ], WindowRoute.prototype, "route", void 0);
    __decorate([
        property({ type: Array }), 
        __metadata('design:type', Array)
    ], WindowRoute.prototype, "subjects", void 0);
    __decorate([
        property({ type: Array }), 
        __metadata('design:type', Array)
    ], WindowRoute.prototype, "periods", void 0);
    __decorate([
        property({ type: Boolean }), 
        __metadata('design:type', Boolean)
    ], WindowRoute.prototype, "editing", void 0);
    __decorate([
        property({ type: Boolean, value: false }), 
        __metadata('design:type', Boolean)
    ], WindowRoute.prototype, "windowEditorialShown", void 0);
    __decorate([
        property({ type: Array, notify: true }), 
        __metadata('design:type', Array)
    ], WindowRoute.prototype, "destinations", void 0);
    __decorate([
        property({ type: Array }), 
        __metadata('design:type', Array)
    ], WindowRoute.prototype, "institutions", void 0);
    __decorate([
        listen('windowbasic.closed'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], WindowRoute.prototype, "windowBasicClosed", null);
    __decorate([
        listen('delete-route-confirmed'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], WindowRoute.prototype, "deleteRouteConfirmed", null);
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
        listen('update'), 
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
