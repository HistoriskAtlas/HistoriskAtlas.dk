var HaCollection = (function () {
    function HaCollection(data) {
        this._geos = [];
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
        //this._userid = data.userid;
        if (data.collection_geos) {
            var collection_geos = data.collection_geos.sort(function (a, b) { return a.ordering - b.ordering; });
            for (var _i = 0, collection_geos_1 = collection_geos; _i < collection_geos_1.length; _i++) {
                var collection_geo = collection_geos_1[_i];
                var geo = App.haGeos.geos[collection_geo.geoid];
                if (geo)
                    this._geos.push(geo);
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
    Object.defineProperty(HaCollection.prototype, "geos", {
        get: function () {
            //if (this._geoIds.length > 0) {
            //    var newGeoIds: Array<number> = [];
            //    for (var geoid of this._geoIds) {
            //        var geo = App.haGeos.geos[geoid];
            //        if (geo)
            //            this._geos.push(geo)
            //        else
            //            newGeoIds.push(geoid)
            //    }
            //    this._geoIds = newGeoIds;
            //}
            return this._geos;
        },
        set: function (val) {
            this._geos = val;
        },
        enumerable: true,
        configurable: true
    });
    //public open() {
    //    //if (this._geos.length > 0 || !this._id) {
    //        App.haCollections.select(this);
    //    //    return;
    //    //}
    //    //Services.get('geo', { count: 'all', schema: '{geo:{fields:[geoid,title],filters:[{collection_geos:[{collectionid:' + this._id + '}]}]}}', sort: '{collection_geos:[ordering]}' }, (result) => {
    //    //    for (var data of result.data) {
    //    //        var geo = App.haGeos.geos[data.geoid];
    //    //        if (!geo)
    //    //            continue;
    //    //        geo.title = data.title;
    //    //        this._geos.push(geo) //TODO: use notify system.............
    //    //    }
    //    //    App.haCollections.select(this);
    //    //})
    //}
    //private openRouteWindow() {
    //    if (App.windowRoute) {
    //        App.windowRoute.setRoute(this);
    //        (<WindowBasic>App.windowRoute.$.windowbasic).bringToFront();
    //    } else
    //        Common.dom.append(WindowRoute.create(this));
    //}
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
    HaCollection.prototype.saveNewGeo = function (geo) {
        Services.insert('collection_geo', { collectionid: this._id, geoid: geo.id, ordering: this.geos.indexOf(geo) }, function (result) { });
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
    HaCollection.prototype.removeGeo = function (geo) {
        var data = {
            collectionid: this._id,
            geoid: geo.id,
            ordering: this.geos.indexOf(geo),
            deletemode: 'permanent'
        };
        Services.delete('collection_geo', data, function (result) { });
    };
    HaCollection.prototype.updateOrdering = function (indexStart, indexEnd) {
        if (indexStart > indexEnd) {
            var temp = indexStart;
            indexStart = indexEnd;
            indexEnd = temp;
        }
        for (var i = indexStart; i <= indexEnd; i++) {
            var data = {
                collectionid: this._id,
                geoid: this._geos[i].id,
                ordering: i
            };
            Services.update('collection_geo', data, function (result) { });
        }
        //setTimeout(() => {
        //    for (var i = indexStart; i <= indexEnd; i++) {
        //        App.haCollections.updateIconStyle(this._geos[i]);
        //    }
        //}, 10)
        //Services.update('collection_geo', { collectionid: this._id, geoid: this._geos[indexStart].id, ordering: indexStart }, (result) => { });
        //Services.update('collection_geo', { collectionid: this._id, geoid: this._geos[indexEnd].id, ordering: indexEnd }, (result) => { });
    };
    HaCollection.prototype.showOnMap = function () {
        if (this.geos.length == 0)
            return;
        for (var _i = 0, _a = this.geos; _i < _a.length; _i++) {
            var geo = _a[_i];
        }
        if (this.geos.length == 1) {
            App.map.centerAnim(this.geos[0].coord, 10000, true);
            return;
        }
        var minLon = Number.MAX_VALUE;
        var maxLon = Number.MIN_VALUE;
        var minLat = Number.MAX_VALUE;
        var maxLat = Number.MIN_VALUE;
        for (var _b = 0, _c = this.geos; _b < _c.length; _b++) {
            var geo = _c[_b];
            if (geo.coord[1] < minLat)
                minLat = geo.coord[1];
            if (geo.coord[1] > maxLat)
                maxLat = geo.coord[1];
            if (geo.coord[0] < minLon)
                minLon = geo.coord[0];
            if (geo.coord[0] > maxLon)
                maxLon = geo.coord[0];
        }
        App.map.centerAnim([(minLon + maxLon) / 2, (minLat + maxLat) / 2], Math.max((maxLon - minLon) * 1.8, (maxLat - minLat) * 1.5) / 2, true);
    };
    HaCollection.prototype.delete = function () {
        Services.delete('collection', { collectionid: this._id, deletemode: 'permanent' }, function (result) {
            App.toast.show('Turforslaget er slettet.');
        });
    };
    HaCollection.types = ['Kørsel', 'Cykling', 'Til fods'];
    return HaCollection;
}());
//# sourceMappingURL=hacollection.js.map