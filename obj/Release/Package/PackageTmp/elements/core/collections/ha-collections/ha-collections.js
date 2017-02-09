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
        this.allCollectionsFetched = false;
    }
    HaCollections.prototype.getPublishedCollections = function () {
        if (this.allCollectionsFetched)
            return;
        this.allCollectionsFetched = true;
        App.map.showRouteLayer();
        this.getCollections({ count: 'all', schema: '{collection:[collectionid,title,ugc,distance,type,userid,{collection_geos:[geoid,ordering]}]}', online: true });
        if (!App.haUsers.user.isDefault)
            this.getCollectionsFromUser();
    };
    HaCollections.prototype.getCollectionsFromUser = function () {
        App.map.showRouteLayer();
        this.getCollections({ count: 'all', schema: '{collection:[collectionid,title,ugc,distance,type,{userid:' + App.haUsers.user.id + '},{collection_geos:[geoid,ordering]}]}', online: false });
    };
    HaCollections.prototype.getCollectionsByTagId = function (tagId) {
        App.map.showRouteLayer();
        this.getCollections({ count: 'all', schema: '{collection:{fields:[collectionid,title,ugc,distance,type,userid,{collection_geos:[geoid,ordering]}],filters:[{content:[{tag_contents:[{id:' + tagId + '}]}]}]}}', online: true });
    };
    HaCollections.prototype.getCollections = function (sendData) {
        var _this = this;
        Services.get('collection', sendData, function (result) {
            var collections = _this.collections;
            for (var _i = 0, _a = result.data; _i < _a.length; _i++) {
                var data = _a[_i];
                data.online = sendData.online;
                collections.push(new HaCollection(data));
            }
            _this.set('collections', collections);
            _this.notifySplices('collections', [{ index: 0, removed: [], addedCount: collections.length, object: _this.collections }]);
        });
    };
    HaCollections.prototype.collectionsChanged = function (changeRecord) {
        var path = changeRecord.path.split('.');
        if (path.length == 3) {
            if (path[2] == 'selected') {
                var collection = this.collections[path[1].substring(1)];
                if (changeRecord.value)
                    this.drawRoute(collection);
                else
                    this.eraseRoute(collection);
            }
        }
    };
    HaCollections.prototype.select = function (collection, addGeo) {
        var _this = this;
        App.map.showRouteLayer();
        this.$.selector.select(collection);
        this.set('collection.selected', true);
        if (addGeo) {
            this.push('collection.geos', addGeo);
            collection.saveNewGeo(addGeo);
        }
        Services.get('geo', { count: 'all', schema: '{geo:{fields:[geoid,title],filters:[{collection_geos:[{collectionid:' + collection.id + '}]}]}}' }, function (result) {
            var geos = [];
            for (var _i = 0, _a = result.data; _i < _a.length; _i++) {
                var data = _a[_i];
                for (var _b = 0, _c = collection.geos; _b < _c.length; _b++) {
                    var geo = _c[_b];
                    if (geo.id == data.geoid)
                        _this.set('collection.geos.' + _this.collection.geos.indexOf(geo) + '.title', data.title);
                }
            }
        });
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
        var collection = new HaCollection({ title: title, userid: App.haUsers.user.id, ugc: !App.haUsers.user.isPro, online: false, distance: 0, type: 0 });
        collection.save(function () {
            _this.push('collections', collection);
            _this.select(collection);
            if (geo) {
                _this.push('collection.geos', geo);
                collection.saveNewGeo(geo);
            }
        });
    };
    HaCollections.prototype.collectionChanged = function (newVal, oldVal) {
        var _this = this;
        if (oldVal) {
            for (var _i = 0, _a = oldVal.geos; _i < _a.length; _i++) {
                var geo = _a[_i];
                geo.isPartOfCurrentCollection = false;
            }
            if (!newVal)
                App.map.routeLayer.redraw();
        }
        if (!newVal)
            return;
        App.map.routeLayer.redraw();
        this.initTags('collection', 'content');
        for (var _b = 0, _c = newVal.geos; _b < _c.length; _b++) {
            var geo = _c[_b];
            geo.isPartOfCurrentCollection = true;
        }
        if (!this.collection.content) {
            Services.get('collection', { schema: '{collection:[' + ContentViewer.contentSchema + ']}', collectionid: this.collection.id }, function (result) {
                if (result.data[0].content) {
                    _this.set('collection.content', new HaContent(result.data[0].content));
                    if (result.data[0].content.tag_contents)
                        for (var _i = 0, _a = result.data[0].content.tag_contents; _i < _a.length; _i++) {
                            var tagid = _a[_i];
                            _this.addTag(App.haTags.byId[tagid], true, false);
                        }
                }
                else {
                    var content = new HaContent({ contenttypeid: 0, ordering: 0, texts: [{ headline: '', text1: '' }] });
                    _this.set('collection.content', content);
                    content.insert(function () {
                        Services.update('collection', { collectionid: _this.collection.id, contentid: content.id });
                    });
                }
            });
        }
        this.updateMarkers();
    };
    HaCollections.prototype.updateMarkers = function () {
        var _this = this;
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
    HaCollections.prototype.typeChanged = function (changeRecord) {
        if (!this.collection)
            return;
        var path = changeRecord.path.split('.');
        if (path.length != 2)
            return;
        var prop = path[1];
        if (prop == 'type')
            this.drawRoute();
        if (prop == 'online')
            App.map.routeLayer.redraw();
        if (prop == 'title' || prop == 'online' || prop == 'type')
            this.collection.saveProp(prop);
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
            if (keySplice.removed.length > 0 || keySplice.added.length > 0) {
                this.drawRoute();
                this.updateMarkers();
            }
        }
    };
    HaCollections.prototype.drawRoute = function (collection) {
        var _this = this;
        if (!collection)
            collection = this.collection;
        App.map.routeLayer.removeFeatures(collection.features);
        if (collection.geos.length < 2) {
            this.set('collections.' + this.collections.indexOf(collection) + '.distance', 0);
        }
        var lastGeo;
        var totalDistance = 0;
        this.waitingForCallbackCount = collection.geos.length - 1;
        for (var _i = 0, _a = collection.geos; _i < _a.length; _i++) {
            var geo = _a[_i];
            if (lastGeo) {
                App.map.routeLayer.addPath(geo.icon.coord4326, lastGeo.icon.coord4326, collection, function (feature, distance) {
                    collection.features.push(feature);
                    totalDistance += Math.round(distance);
                    _this.waitingForCallbackCount--;
                    if (_this.waitingForCallbackCount == 0) {
                        _this.set('collections.' + _this.collections.indexOf(collection) + '.distance', totalDistance);
                    }
                });
            }
            lastGeo = geo;
        }
    };
    HaCollections.prototype.eraseRoute = function (collection) {
        App.map.routeLayer.removeFeatures(collection.features);
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
        observe('collections.*'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', void 0)
    ], HaCollections.prototype, "collectionsChanged", null);
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
}(Tags));
HaCollections.register();
