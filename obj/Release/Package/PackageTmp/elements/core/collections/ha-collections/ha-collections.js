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
var HaCollections = (function (_super) {
    __extends(HaCollections, _super);
    function HaCollections() {
        _super.apply(this, arguments);
        this.collections = [];
        this.waitingForCallbackCount = 0;
        this.updateRouteLayerRequestCount = 0;
    }
    HaCollections.prototype.getCollectionsFromUser = function () {
        var _this = this;
        Services.get('collection', { count: 'all', schema: '{collection:[collectionid,title,ugc,distance,type,{userid:' + App.haUsers.user.id + '}]}' }, function (result) {
            for (var _i = 0, _a = result.data; _i < _a.length; _i++) {
                var data = _a[_i];
                _this.push('collections', new HaCollection(data));
            }
        });
    };
    HaCollections.prototype.select = function (collection, addGeo) {
        this.$.selector.select(collection);
        if (addGeo) {
            this.push('collection.geos', addGeo);
            collection.saveNewGeo(addGeo);
        }
    };
    HaCollections.prototype.deselect = function (collection) {
        this.$.selector.deselect(collection);
    };
    HaCollections.prototype.newRoute = function (geo) {
        var _this = this;
        Common.dom.append(DialogText.create('Angiv titel på rute', function (title) { return _this.newCollection(title, geo); }));
    };
    HaCollections.prototype.newCollection = function (title, geo) {
        var _this = this;
        var collection = new HaCollection({ title: title });
        this.push('collections', collection);
        this.select(collection);
        collection.save(function () {
            if (geo) {
                _this.push('collection.geos', geo);
                collection.saveNewGeo(geo);
            }
        });
        return collection;
    };
    HaCollections.prototype.collectionChanged = function (newVal, oldVal) {
        var _this = this;
        if (oldVal) {
            App.map.routeLayer.clear();
            for (var _i = 0, _a = oldVal.geos; _i < _a.length; _i++) {
                var geo = _a[_i];
                geo.isPartOfCurrentCollection = false;
            }
        }
        if (!newVal)
            return;
        for (var _b = 0, _c = newVal.geos; _b < _c.length; _b++) {
            var geo = _c[_b];
            geo.isPartOfCurrentCollection = true;
        }
        App.map.showRouteLayer();
        if (!this.collection.content) {
            Services.get('collection', { schema: '{collection:[' + ContentViewer.contentSchema + ']}', collectionid: this.collection.id }, function (result) {
                if (result.data[0].content)
                    _this.set('collection.content', new HaContent(result.data[0].content));
                else {
                    var content = new HaContent({ contenttypeid: 0, ordering: 0, texts: [{ headline: '', text1: '' }] });
                    _this.set('collection.content', content);
                    content.insert(function () {
                        Services.update('collection', { collectionid: _this.collection.id, contentid: content.id });
                    });
                }
            });
        }
        if (this.collection.geos.length > 0 || !this.collection.id) {
            this.updateRouteLayer();
            return;
        }
        Services.get('geo', { count: 'all', schema: '{geo:{fields:[geoid,title],filters:[{collection_geos:[{collectionid:' + this.collection.id + '}]}]}}', sort: '{collection_geos:[ordering]}' }, function (result) {
            var geos = [];
            for (var _i = 0, _a = result.data; _i < _a.length; _i++) {
                var data = _a[_i];
                var geo = App.haGeos.geos[data.geoid];
                if (!geo)
                    continue;
                geo.title = data.title;
                geos.push(geo);
            }
            _this.set('collection.geos', geos);
            _this.updateRouteLayer();
            for (var _b = 0, _c = _this.collection.geos; _b < _c.length; _b++) {
                var geo = _c[_b];
                geo.isPartOfCurrentCollection = true;
            }
        });
    };
    HaCollections.prototype.typeChanged = function (changeRecord) {
        if (!this.collection)
            return;
        if (changeRecord.path == 'collection.type')
            this.updateRouteLayer();
        if (changeRecord.path == 'collection.title')
            this.collection.saveTitle();
    };
    HaCollections.prototype.routeGeosSplices = function (changeRecord) {
        if (!changeRecord)
            return;
        for (var _i = 0, _a = changeRecord.indexSplices; _i < _a.length; _i++) {
            var indexSplice = _a[_i];
            for (var _b = 0, _c = indexSplice.removed; _b < _c.length; _b++) {
                var geo = _c[_b];
                geo.isPartOfCurrentCollection = false;
                geo.icon.updateStyle();
            }
            for (var i = indexSplice.index; i < indexSplice.index + indexSplice.addedCount; i++)
                this.collection.geos[i].isPartOfCurrentCollection = true;
        }
        for (var _d = 0, _e = changeRecord.keySplices; _d < _e.length; _d++) {
            var keySplice = _e[_d];
            if (keySplice.removed.length > 0 || keySplice.added.length > 0)
                this.updateRouteLayer();
        }
    };
    HaCollections.prototype.updateRouteLayer = function () {
        var _this = this;
        if (this.waitingForCallbackCount > 0) {
            this.updateRouteLayerRequestCount++;
            return;
        }
        App.map.routeLayer.clear();
        if (!this.collection)
            return;
        if (this.collection.geos.length < 2) {
            this.set('collections.' + this.collections.indexOf(this.collection) + '.distance', 0);
            this.nextUpdateRouteLayerRequest();
        }
        var lastGeo;
        var totalDistance = 0;
        this.waitingForCallbackCount = this.collection.geos.length - 1;
        for (var _i = 0, _a = this.collection.geos; _i < _a.length; _i++) {
            var geo = _a[_i];
            if (lastGeo) {
                App.map.routeLayer.addPath(geo.icon.coord4326, lastGeo.icon.coord4326, this.collection.type, function (distance) {
                    totalDistance += Math.round(distance);
                    _this.waitingForCallbackCount--;
                    if (_this.waitingForCallbackCount == 0) {
                        _this.set('collections.' + _this.collections.indexOf(_this.collection) + '.distance', totalDistance);
                        _this.nextUpdateRouteLayerRequest();
                    }
                });
            }
            lastGeo = geo;
        }
        setTimeout(function () {
            for (var _i = 0, _a = _this.collection.geos; _i < _a.length; _i++) {
                var geo = _a[_i];
                _this.notifyPath('collection.geos.' + _this.collection.geos.indexOf(geo) + '.icon.marker', geo.icon.marker);
            }
        }, 10);
        setTimeout(function () {
            for (var _i = 0, _a = _this.collection.geos; _i < _a.length; _i++) {
                var geo = _a[_i];
                geo.icon.updateStyle();
            }
        }, 100);
    };
    HaCollections.prototype.nextUpdateRouteLayerRequest = function () {
        if (this.updateRouteLayerRequestCount > 0) {
            this.updateRouteLayerRequestCount--;
            this.updateRouteLayer();
        }
    };
    __decorate([
        property({ type: Array, notify: true }), 
        __metadata('design:type', Array)
    ], HaCollections.prototype, "collections", void 0);
    __decorate([
        property({ type: Object, notify: true }), 
        __metadata('design:type', HaCollection)
    ], HaCollections.prototype, "collection", void 0);
    __decorate([
        observe('collection'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [HaCollection, HaCollection]), 
        __metadata('design:returntype', void 0)
    ], HaCollections.prototype, "collectionChanged", null);
    __decorate([
        observe('collection.*'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', void 0)
    ], HaCollections.prototype, "typeChanged", null);
    __decorate([
        observe('collection.geos.splices'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [ChangeRecord]), 
        __metadata('design:returntype', void 0)
    ], HaCollections.prototype, "routeGeosSplices", null);
    HaCollections = __decorate([
        component("ha-collections"), 
        __metadata('design:paramtypes', [])
    ], HaCollections);
    return HaCollections;
}(polymer.Base));
HaCollections.register();
