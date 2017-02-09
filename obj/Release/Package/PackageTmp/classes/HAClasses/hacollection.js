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
        this._userid = data.userid;
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
    Object.defineProperty(HaCollection.prototype, "userid", {
        get: function () {
            return this._userid;
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
            return this._geos;
        },
        set: function (val) {
            this._geos = val;
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
            data.userid = this._userid;
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
                App.toast.show('Ruten er nu ' + (_this._online ? '' : 'af') + 'publiceret');
        });
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
    HaCollection.types = ['Kørsel', 'Cykling', 'Til fods'];
    return HaCollection;
}());
