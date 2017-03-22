var HaCollectionGeo = (function () {
    function HaCollectionGeo(data) {
        this.uiOpen = false;
        this._id = data.id;
        this._ordering = data.ordering;
        this._contentID = data.contentid;
        this._calcRoute = data.calcroute == null ? true : data.calcroute;
        this._showOnMap = data.showonmap == null ? true : data.showonmap;
        this.showText = !!this._contentID;
        if (data.geoid)
            this._geo = App.haGeos.geos[data.geoid];
        else
            this._geo = new HaGeo({ id: 0, lng: data.longitude, lat: data.latitude }, false, false);
    }
    Object.defineProperty(HaCollectionGeo.prototype, "id", {
        get: function () {
            return this._id;
        },
        set: function (val) {
            this._id = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HaCollectionGeo.prototype, "geo", {
        get: function () {
            return this._geo;
        },
        set: function (geo) {
            this._geo = geo;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HaCollectionGeo.prototype, "coord", {
        get: function () {
            return this._geo.coord;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HaCollectionGeo.prototype, "isViaPoint", {
        get: function () {
            return this._geo.id < 1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HaCollectionGeo.prototype, "calcRoute", {
        get: function () {
            return this._calcRoute;
        },
        set: function (val) {
            this._calcRoute = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HaCollectionGeo.prototype, "showOnMap", {
        get: function () {
            return this._showOnMap;
        },
        set: function (val) {
            this._showOnMap = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HaCollectionGeo.prototype, "ordering", {
        get: function () {
            return this._ordering;
        },
        set: function (val) {
            this._ordering = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HaCollectionGeo.prototype, "contentID", {
        get: function () {
            return this._contentID;
        },
        set: function (val) {
            this._contentID = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HaCollectionGeo.prototype, "content", {
        get: function () {
            return this._content;
        },
        set: function (val) {
            this._content = val;
        },
        enumerable: true,
        configurable: true
    });
    HaCollectionGeo.prototype.saveCoords = function () {
        var coord = Common.fromMapCoord(this.coord);
        Services.update('collection_geo', { id: this._id, latitude: coord[1], longitude: coord[0] }, function () { });
    };
    HaCollectionGeo.orderingGap = 21000000;
    return HaCollectionGeo;
}());
