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
    };
    WindowRoute.prototype.renameTap = function () {
        var _this = this;
        Common.dom.append(DialogText.create('Angiv ny titel på rute', function (title) { return _this.set('route.title', title); }));
    };
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
        this.push('route.geos', geo);
        this.route.saveNewGeo(geo);
    };
    WindowRoute.prototype.geoRemoved = function (e) {
        var geo = App.haGeos.geos[e.detail.id];
        this.splice('route.geos', this.route.geos.indexOf(geo), 1);
        this.route.removeGeo(geo);
    };
    WindowRoute.prototype.geoSortableListUpdate = function (e) {
        if (e.detail) {
            this.route.updateOrdering(e.detail.oldIndex, e.detail.newIndex);
        }
    };
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
