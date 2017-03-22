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
        var _this = this;
        if (this.allCollectionsFetched)
            return;
        if (this.awaitGeos(function () { return _this.getPublishedCollections(); }))
            return;
        this.allCollectionsFetched = true;
        App.map.showRouteLayer();
        this.getCollections({ count: 'all', schema: '{collection:[collectionid,title,ugc,distance,type,userid,' + HaCollections.collectionGeosAPISchema + ']}', online: true });
        if (!App.haUsers.user.isDefault)
            this.getCollectionsFromUser();
    };
    HaCollections.prototype.getCollectionsFromUser = function () {
        var _this = this;
        if (this.awaitGeos(function () { return _this.getCollectionsFromUser(); }))
            return;
        App.map.showRouteLayer();
        this.getCollections({ count: 'all', schema: '{collection:[collectionid,title,ugc,distance,type,{userid:' + App.haUsers.user.id + '},' + HaCollections.collectionGeosAPISchema + ']}', online: false });
    };
    HaCollections.prototype.getCollectionsByTagId = function (tagId) {
        var _this = this;
        if (this.awaitGeos(function () { return _this.getCollectionsByTagId(tagId); }))
            return;
        App.map.showRouteLayer();
        this.getCollections({ count: 'all', schema: '{collection:{fields:[collectionid,title,ugc,distance,type,userid,' + HaCollections.collectionGeosAPISchema + ',{content:[{tag_contents:[{collapse:id}]}]}],filters:[{content:[{tag_contents:[{id:' + tagId + '}]}]}]}}', online: true });
    };
    HaCollections.prototype.awaitGeos = function (callback) {
        if (App.haGeos.geos.length == 0) {
            HaCollections.awitingGeos.push(callback);
            return true;
        }
        return false;
    };
    HaCollections.prototype.geosLengthChanged = function (changeRecord) {
        if (this.geos.length == 0 || HaCollections.awitingGeos.length == 0)
            return;
        while (HaCollections.awitingGeos.length > 0)
            HaCollections.awitingGeos.shift()();
    };
    HaCollections.prototype.getCollections = function (sendData, options) {
        var _this = this;
        Services.get('collection', sendData, function (result) {
            var collections = _this.collections;
            for (var _i = 0, _a = result.data; _i < _a.length; _i++) {
                var data = _a[_i];
                data.online = sendData.online;
                var collection = new HaCollection(data);
                if (data.content)
                    for (var _b = 0, _c = data.content.tag_contents; _b < _c.length; _b++) {
                        var tagId = _c[_b];
                        collection.tags.push(App.haTags.byId[tagId]);
                    }
                collections.push(collection);
            }
            _this.set('collections', collections);
            _this.notifySplices('collections', [{ index: 0, removed: [], addedCount: collections.length, object: _this.collections }]);
        });
    };
    HaCollections.prototype.collectionsChanged = function (changeRecord) {
        var path = changeRecord.path.split('.');
        if (path.length == 3) {
            if (path[2] == 'selected') {
                var collection = this.get(path[0] + '.' + path[1]);
                if (changeRecord.value)
                    this.drawRoute(collection);
                else
                    this.eraseRoute(collection);
            }
        }
    };
    HaCollections.prototype.select = function (collection, addGeo, mapClick) {
        var _this = this;
        if (mapClick === void 0) { mapClick = false; }
        App.map.showRouteLayer();
        this.$.selector.select(collection);
        this.set('collection.selected', true);
        if (addGeo) {
            var ordering = collection.collection_geos.length == 0 ? HaCollectionGeo.orderingGap : collection.collection_geos[collection.collection_geos.length - 1].ordering + HaCollectionGeo.orderingGap;
            var collection_geo = new HaCollectionGeo({ geoid: addGeo.id, ordering: ordering });
            this.push('collection.collection_geos', collection_geo);
            collection.saveNewCollectionGeo(collection_geo);
        }
        if (!mapClick)
            collection.showOnMap();
        Services.get('geo', { count: 'all', schema: '{geo:{fields:[geoid,title],filters:[{collection_geos:[{collectionid:' + collection.id + '}]}]}}' }, function (result) {
            var geos = [];
            for (var _i = 0, _a = result.data; _i < _a.length; _i++) {
                var data = _a[_i];
                for (var _b = 0, _c = collection.collection_geos; _b < _c.length; _b++) {
                    var cg = _c[_b];
                    if (cg.geo.id == data.geoid)
                        _this.set('collection.collection_geos.' + _this.collection.collection_geos.indexOf(cg) + '.geo.title', data.title);
                }
            }
        });
        Services.get('content', { count: 'all', schema: ContentViewer.contentSchema, collection_geos: '[{collection:[{collectionid:' + collection.id + '}]}]' }, function (result) {
            for (var _i = 0, _a = result.data; _i < _a.length; _i++) {
                var data = _a[_i];
                for (var _b = 0, _c = collection.collection_geos; _b < _c.length; _b++) {
                    var cg = _c[_b];
                    if (cg.contentID == data.id)
                        _this.set('collection.collection_geos.' + _this.collection.collection_geos.indexOf(cg) + '.content', new HaContent(data));
                }
            }
        });
    };
    HaCollections.prototype.deselect = function (collection) {
        this.$.selector.deselect(collection);
    };
    HaCollections.prototype.newRoute = function (geo) {
        var _this = this;
        Common.dom.append(DialogText.create('Angiv titel på turforslaget', function (title) { return _this.newCollection(title, geo); }));
    };
    HaCollections.prototype.newCollection = function (title, geo) {
        var _this = this;
        var collection = new HaCollection({ title: title, userid: App.haUsers.user.id, ugc: !App.haUsers.user.isPro, online: false, distance: 0, type: 0 });
        collection.save(function () {
            _this.push('collections', collection);
            _this.select(collection);
            if (geo) {
                var collection_geo = new HaCollectionGeo({ geoid: geo.id, ordering: HaCollectionGeo.orderingGap });
                _this.push('collection.collection_geos', collection_geo);
                collection.saveNewCollectionGeo(collection_geo);
            }
            var content = new HaContent({ contenttypeid: 0, ordering: 0, texts: [{ headline: '', text1: '' }] });
            _this.set('collection.content', content);
            content.insert(function () {
                Services.update('collection', { collectionid: _this.collection.id, contentid: content.id });
                if (App.haUsers.user.isPro)
                    _this.addTag(App.haUsers.user.currentInstitution.tag, true, true);
            });
        });
    };
    HaCollections.prototype.collectionChanged = function (newVal, oldVal) {
        var _this = this;
        if (oldVal) {
            for (var _i = 0, _a = oldVal.collection_geos; _i < _a.length; _i++) {
                var cg = _a[_i];
                cg.geo.isPartOfCurrentCollection = false;
            }
            var viaPoints = [];
            for (var _b = 0, _c = oldVal.features; _b < _c.length; _b++) {
                var feature = _c[_b];
                if (feature.loc)
                    viaPoints.push(feature);
            }
            App.map.routeLayer.removeFeatures(viaPoints);
            if (!newVal)
                App.map.routeLayer.redraw();
        }
        if (!newVal)
            return;
        this.drawRoute(newVal, App.haUsers.user.canEditCollection(newVal));
        this.initTags('collection', 'content');
        for (var _d = 0, _e = newVal.collection_geos; _d < _e.length; _d++) {
            var cg = _e[_d];
            cg.geo.isPartOfCurrentCollection = true;
        }
        if (!this.collection.content) {
            Services.get('collection', { schema: '{collection:[{user:[id,firstname,lastname]},' + ContentViewer.contentSchema + ']}', collectionid: this.collection.id }, function (result) {
                if (result.data[0].user.id != App.haUsers.user.id)
                    _this.set('collection.user', new HAUser(result.data[0].user));
                if (result.data[0].content) {
                    _this.set('collection.content', new HaContent(result.data[0].content));
                    if (result.data[0].content.tag_contents)
                        for (var _i = 0, _a = result.data[0].content.tag_contents; _i < _a.length; _i++) {
                            var tagid = _a[_i];
                            _this.addTag(App.haTags.byId[tagid], true, false);
                        }
                }
                else {
                }
            });
        }
        this.updateMarkers();
    };
    HaCollections.prototype.updateMarkers = function () {
        var _this = this;
        setTimeout(function () {
            for (var _i = 0, _a = _this.collection.collection_geos; _i < _a.length; _i++) {
                var cg = _a[_i];
                _this.notifyPath('collection.collection_geos.' + _this.collection.collection_geos.indexOf(cg) + '.geo.icon.marker', cg.geo.icon.marker);
            }
        }, 10);
        setTimeout(function () {
            for (var _i = 0, _a = _this.collection.collection_geos; _i < _a.length; _i++) {
                var cg = _a[_i];
                cg.geo.icon.updateStyle();
            }
        }, 100);
    };
    HaCollections.prototype.collectionPropChanged = function (changeRecord) {
        var _this = this;
        if (!this.collection)
            return;
        var path = changeRecord.path.split('.');
        var prop = path[path.length - 1];
        if (path.length == 4 && path[1] == 'collection_geos') {
            var cgPath = path[0] + '.' + path[1] + '.' + path[2];
            var collection_geo = this.get(cgPath);
            if (prop == 'calcRoute') {
                this.drawRoute();
                Services.update('collection_geo', { id: collection_geo.id, calcroute: collection_geo.calcRoute }, function () { });
            }
            if (prop == 'showOnMap') {
                this.drawRoute();
                this.updateMarkers();
                Services.update('collection_geo', { id: collection_geo.id, showonmap: collection_geo.showOnMap }, function () { });
            }
            if (prop == 'showText') {
                if (this.get(changeRecord.path)) {
                    if (!collection_geo.content) {
                        var content = new HaContent({ contenttypeid: 0, ordering: 0, texts: [{ headline: '', text1: '' }] });
                        this.set(cgPath + '.content', content);
                        content.insert(function () {
                            Services.update('collection_geo', { id: collection_geo.id, contentid: content.id });
                            _this.set(cgPath + '.contentID', content.id);
                        });
                    }
                }
                else {
                    $(this).append(DialogConfirm.create('delete-cg-text', 'Er du sikker på at du vil slette denne tekst?', cgPath));
                }
            }
        }
        if (path.length != 2)
            return;
        if (prop == 'type')
            this.drawRoute();
        if (prop == 'online')
            App.map.routeLayer.redraw();
        if (prop == 'title' || prop == 'online' || prop == 'type')
            this.collection.saveProp(prop);
    };
    HaCollections.prototype.deleteCGTextConfirmed = function (e) {
        var _this = this;
        var collection_geo = this.get(e.detail);
        Services.delete('content', { id: collection_geo.id, contentid: collection_geo.content.id }, function () {
            _this.set(e.detail + '.content', null);
            _this.set(e.detail + '.contentID', null);
        });
    };
    HaCollections.prototype.deleteCGTextDismissed = function (e) {
        this.set(e.detail + '.showText', true);
    };
    HaCollections.prototype.routeGeosSplices = function (changeRecord) {
        if (!changeRecord)
            return;
        for (var _i = 0, _a = changeRecord.indexSplices; _i < _a.length; _i++) {
            var indexSplice = _a[_i];
            for (var _b = 0, _c = indexSplice.removed; _b < _c.length; _b++) {
                var cg = _c[_b];
                cg.geo.isPartOfCurrentCollection = false;
                if (!cg.isViaPoint)
                    cg.geo.icon.updateStyle();
            }
            for (var i = indexSplice.index; i < indexSplice.index + indexSplice.addedCount; i++)
                this.collection.collection_geos[i].geo.isPartOfCurrentCollection = true;
        }
        for (var _d = 0, _e = changeRecord.keySplices; _d < _e.length; _d++) {
            var keySplice = _e[_d];
            if (keySplice.removed.length > 0 || keySplice.added.length > 0) {
                this.drawRoute(this.collection, true, keySplice.added.length > 0 ? indexSplice.index : null);
                this.updateMarkers();
            }
        }
    };
    HaCollections.prototype.drawRoute = function (collection, drawViaPoints, addedPointIndex) {
        var _this = this;
        if (drawViaPoints === void 0) { drawViaPoints = true; }
        if (!collection)
            collection = this.collection;
        if (drawViaPoints)
            App.map.routeLayer.removeFeatures(collection.features);
        else {
            var nonViaPoints = [];
            for (var _i = 0, _a = collection.features; _i < _a.length; _i++) {
                var feature = _a[_i];
                if (feature.locs)
                    nonViaPoints.push(feature);
            }
            App.map.routeLayer.removeFeatures(nonViaPoints);
        }
        if (collection.collection_geos.length < 2) {
            this.set('collections.' + this.collections.indexOf(collection) + '.distance', 0);
        }
        var lastCG;
        var totalDistance = 0;
        this.waitingForCallbackCount = collection.collection_geos.length - 1;
        var canEdit = App.haUsers.user.canEditCollection(collection);
        for (var _b = 0, _c = collection.collection_geos; _b < _c.length; _b++) {
            var cg = _c[_b];
            if (lastCG) {
                var viaPoint = App.map.routeLayer.addPath(cg.geo.icon.coord4326, lastCG.geo.icon.coord4326, collection, drawViaPoints && cg.isViaPoint && (canEdit || cg.showOnMap), lastCG.calcRoute, function (feature, distance) {
                    collection.features.push(feature);
                    totalDistance += Math.round(distance);
                    _this.waitingForCallbackCount--;
                    if (_this.waitingForCallbackCount == 0) {
                        _this.set('collections.' + _this.collections.indexOf(collection) + '.distance', totalDistance);
                    }
                });
                if (viaPoint) {
                    viaPoint.collection_geo = cg;
                    if (addedPointIndex == collection.collection_geos.indexOf(cg))
                        App.map.curHoverFeature = viaPoint;
                }
            }
            lastCG = cg;
        }
    };
    HaCollections.prototype.deleteRoute = function (route) {
        route.delete();
        this.splice('collections', this.collections.indexOf(route), 1);
        this.eraseRoute(route);
    };
    HaCollections.prototype.eraseRoute = function (collection) {
        App.map.routeLayer.removeFeatures(collection.features);
    };
    HaCollections.awitingGeos = [];
    HaCollections.collectionGeosAPISchema = '{collection_geos:[id,geoid,ordering,showonmap,calcroute,contentid,longitude,latitude]}';
    __decorate([
        property({ type: Array, notify: true }), 
        __metadata('design:type', Array)
    ], HaCollections.prototype, "collections", void 0);
    __decorate([
        property({ type: Array }), 
        __metadata('design:type', Array)
    ], HaCollections.prototype, "geos", void 0);
    __decorate([
        property({ type: Object, notify: true }), 
        __metadata('design:type', HaCollection)
    ], HaCollections.prototype, "collection", void 0);
    __decorate([
        observe('geos.length'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', void 0)
    ], HaCollections.prototype, "geosLengthChanged", null);
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
    ], HaCollections.prototype, "collectionPropChanged", null);
    __decorate([
        listen('delete-cg-text-confirmed'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', void 0)
    ], HaCollections.prototype, "deleteCGTextConfirmed", null);
    __decorate([
        listen('delete-cg-text-dismissed'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', void 0)
    ], HaCollections.prototype, "deleteCGTextDismissed", null);
    __decorate([
        observe('collection.collection_geos.splices'), 
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
