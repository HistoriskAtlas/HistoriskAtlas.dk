var HaCollection = (function () {
    function HaCollection(data) {
        this._geos = [];
        if (!data)
            return;
        this._id = data.collectionid;
        this._title = data.title;
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
    Object.defineProperty(HaCollection.prototype, "geos", {
        get: function () {
            return this._geos;
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
        Services.insert('collection_geo', data, function (result) {
        });
    };
    HaCollection.prototype.removeGeo = function (geo) {
        var data = {
            collectionid: this._id,
            geoid: geo.id,
            deletemode: 'permanent'
        };
        Services.delete('collection_geo', data, function (result) {
        });
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
            Services.update('collection_geo', data, function (result) {
            });
        }
    };
    return HaCollection;
}());
