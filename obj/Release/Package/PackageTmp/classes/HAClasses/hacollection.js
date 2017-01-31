var HaCollection = (function () {
    function HaCollection(data) {
        this._geos = [];
        //this._geoIds = [];
        if (!data)
            return;
        this._id = data.collectionid;
        this._title = data.title;
        this._ugc = data.ugc;
        this._distance = data.distance;
        this._type = data.type;
        //if (data.collection_geos)
        //    for (var geoid of data.collection_geos) {
        //        var geo = App.haGeos.geos[geoid];
        //        if (geo)
        //            this._geos.push(geo);
        //        else
        //            this._geoIds.push(geoid);
        //    }
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
            data.userid = App.haUsers.user.id;
            Services.insert('collection', data, function (result) {
                _this._id = result.data[0].collectionid;
                if (callback)
                    callback();
            });
        }
    };
    HaCollection.prototype.saveNewGeo = function (geo) {
        var data = {
            collectionid: this._id,
            geoid: geo.id,
            ordering: this.geos.indexOf(geo)
        };
        Services.insert('collection_geo', data, function (result) { });
    };
    HaCollection.prototype.saveDistance = function () {
        var data = {
            collectionid: this._id,
            distance: this._distance
        };
        Services.update('collection', data, function (result) { });
    };
    HaCollection.prototype.removeGeo = function (geo) {
        var data = {
            collectionid: this._id,
            geoid: geo.id,
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
    };
    //private maps: Array<HaGeo>;
    //private _geoIds: Array<number>;
    HaCollection.types = ['Kørsel', 'Cykling', 'Til fods'];
    return HaCollection;
}());
//# sourceMappingURL=hacollection.js.map