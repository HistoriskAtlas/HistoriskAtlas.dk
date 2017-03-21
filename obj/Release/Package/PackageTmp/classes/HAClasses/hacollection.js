var HaCollection = (function () {
    function HaCollection(data) {
        this._collection_geos = [];
        this.tags = [];
        this.features = [];
        if (!data)
            return;
        this._id = data.collectionid;
        this._title = data.title;
        this._online = data.online;
        this._ugc = data.ugc;
        this._distance = data.distance;
        this._type = data.type;
        if (data.userid == App.haUsers.user.id) {
            this._user = App.haUsers.user;
        }
        else
            this._user = new HAUser({ id: data.userid });
        if (data.collection_geos) {
            var collection_geos = data.collection_geos.sort(function (a, b) { return a.ordering - b.ordering; });
            for (var _i = 0, collection_geos_1 = collection_geos; _i < collection_geos_1.length; _i++) {
                var collection_geo = collection_geos_1[_i];
                this._collection_geos.push(new HaCollectionGeo(collection_geo));
            }
        }
    }
    Object.defineProperty(HaCollection.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HaCollection.prototype, "title", {
        get: function () {
            return this._title;
        },
        set: function (val) {
            this._title = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HaCollection.prototype, "online", {
        get: function () {
            return this._online;
        },
        set: function (val) {
            this._online = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HaCollection.prototype, "ugc", {
        get: function () {
            return this._ugc;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HaCollection.prototype, "distance", {
        get: function () {
            return this._distance;
        },
        set: function (val) {
            this._distance = val;
        },
        enumerable: true,
        configurable: true
    });
    HaCollection.formatDistance = function (distance) {
        return distance < 1000 ? distance + ' m' : (distance / 1000).toFixed(1) + ' km';
    };
    Object.defineProperty(HaCollection.prototype, "content", {
        get: function () {
            return this._content;
        },
        set: function (val) {
            this._content = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HaCollection.prototype, "type", {
        get: function () {
            return this._type;
        },
        set: function (val) {
            this._type = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HaCollection.prototype, "user", {
        get: function () {
            return this._user;
        },
        set: function (val) {
            this._user = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HaCollection.prototype, "selected", {
        get: function () {
            return this._selected;
        },
        set: function (val) {
            this._selected = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HaCollection.prototype, "collection_geos", {
        get: function () {
            return this._collection_geos;
        },
        enumerable: true,
        configurable: true
    });
    HaCollection.prototype.collectionGeoOrdering = function (geo) {
        var i = 0;
        for (var _i = 0, _a = this._collection_geos; _i < _a.length; _i++) {
            var cg = _a[_i];
            if (cg.geo == geo)
                return i;
            if (!cg.isViaPoint)
                i++;
        }
    };
    HaCollection.prototype.viaPointOrdering = function (geo) {
        var i = 0;
        for (var _i = 0, _a = this._collection_geos; _i < _a.length; _i++) {
            var cg = _a[_i];
            if (cg.geo == geo) {
                return cg.showOnMap ? i : -1;
            }
            if (cg.isViaPoint && cg.showOnMap)
                i++;
        }
    };
    Object.defineProperty(HaCollection.prototype, "viaPointCount", {
        get: function () {
            var i = 0;
            for (var _i = 0, _a = this._collection_geos; _i < _a.length; _i++) {
                var cg = _a[_i];
                if (!cg.geo)
                    i++;
            }
            return i;
        },
        enumerable: true,
        configurable: true
    });
    HaCollection.prototype.save = function (callback) {
        var _this = this;
        var data = {
            title: this._title,
        };
        if (this._id) {
            data.collectionid = this._id;
            Services.update('collection', data, function () {
                if (callback)
                    callback();
            });
        }
        else {
            data.userid = this.user.id;
            data.ugc = this._ugc;
            data.online = this._online;
            data.type = this._type;
            data.distance = this._distance;
            Services.insert('collection', data, function (result) {
                _this._id = result.data[0].collectionid;
                if (callback)
                    callback();
            });
        }
    };
    HaCollection.prototype.saveNewCollectionGeo = function (collection_geo) {
        var coord = Common.fromMapCoord(collection_geo.coord);
        var send = { collectionid: this._id, ordering: collection_geo.ordering, showonmap: collection_geo.showOnMap, calcroute: collection_geo.calcRoute, latitude: coord[1], longitude: coord[0] };
        if (!collection_geo.isViaPoint)
            send.geoid = collection_geo.geo.id;
        Services.insert('collection_geo', send, function (result) {
            collection_geo.id = result.data[0].collectiongeoid;
        });
    };
    HaCollection.prototype.saveProp = function (prop) {
        var _this = this;
        var data = { collectionid: this._id };
        data[prop] = this['_' + prop];
        Services.update('collection', data, function (result) {
            if (prop == 'online')
                App.toast.show('Turforslaget er nu ' + (_this._online ? '' : 'af') + 'publiceret');
        });
    };
    HaCollection.prototype.removeCollectionGeo = function (collection_geo) {
        var data = {
            collectiongeoid: collection_geo.id,
            deletemode: 'permanent'
        };
        Services.delete('collection_geo', data, function (result) { });
    };
    HaCollection.prototype.updateOrdering = function (indexEnd) {
        var collection_Geo = this.collection_geos[indexEnd];
        if (indexEnd == 0) {
            collection_Geo.ordering = Math.round(this.collection_geos[1].ordering / 2);
        }
        else {
            if (indexEnd == this.collection_geos.length - 1)
                collection_Geo.ordering = this.collection_geos[this.collection_geos.length - 1].ordering + Math.round(HaCollectionGeo.orderingGap / 2);
            else
                collection_Geo.ordering = Math.round((this.collection_geos[indexEnd - 1].ordering + this.collection_geos[indexEnd + 1].ordering) / 2);
        }
        Services.update('collection_geo', { id: collection_Geo.id, ordering: collection_Geo.ordering }, function (result) { });
    };
    HaCollection.prototype.showOnMap = function () {
        if (this._collection_geos.length == 0)
            return;
        if (this._collection_geos.length == 1) {
            App.map.centerAnim(this.collection_geos[0].coord, 10000, true);
            return;
        }
        var minLon = Number.MAX_VALUE;
        var maxLon = Number.MIN_VALUE;
        var minLat = Number.MAX_VALUE;
        var maxLat = Number.MIN_VALUE;
        for (var _i = 0, _a = this._collection_geos; _i < _a.length; _i++) {
            var cg = _a[_i];
            if (cg.coord[1] < minLat)
                minLat = cg.coord[1];
            if (cg.coord[1] > maxLat)
                maxLat = cg.coord[1];
            if (cg.coord[0] < minLon)
                minLon = cg.coord[0];
            if (cg.coord[0] > maxLon)
                maxLon = cg.coord[0];
        }
        App.map.centerAnim([(minLon + maxLon) / 2, (minLat + maxLat) / 2], Math.max((maxLon - minLon) * 1.8, (maxLat - minLat) * 1.5) / 2, true);
    };
    HaCollection.prototype.delete = function () {
        Services.delete('collection', { collectionid: this._id, deletemode: 'permanent' }, function (result) {
            App.toast.show('Turforslaget er slettet.');
        });
    };
    HaCollection.types = ['Kørsel', 'Cykling', 'Til fods'];
    HaCollection.iconTypes = ['maps:directions-car', 'maps:directions-bike', 'maps:directions-walk'];
    return HaCollection;
}());
