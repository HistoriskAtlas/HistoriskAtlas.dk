var HaMap = (function () {
    function HaMap(data) {
        this.id = data.id;
        if (data.minlat) {
            var coord = Common.toMapCoord([data.minlon, data.minlat]);
            this.minLon = coord[0];
            this.minLat = coord[1];
            coord = Common.toMapCoord([data.maxlon, data.maxlat]);
            this.maxLon = coord[0];
            this.maxLat = coord[1];
        }
        this.minZ = data.minz;
        this.maxZ = data.maxz;
        this.inView = false;
        this.inViewTimeWarp = false;
        this.title = data.name;
        this.orgStartYear = data.orgproductionstartyear;
        this.orgEndYear = data.orgproductionendyear;
        if (data.iconcoords) {
            var coords = data.iconcoords.split('|');
            this._previewUrl = 'http://tile.historiskatlas.dk/' + this.id + '/' + coords[2] + '/' + coords[0] + '/' + coords[1] + '.jpg';
        }
    }
    HaMap.getTileUrlFromMapID = function (id) {
        switch (id) {
            case 42000:
                return 'http://otile1.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png';
            case 42001:
                return 'http://c.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg';
            case 42002:
                return 'http://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png';
            case 42003:
                return 'http://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png';
            case 42004:
                return 'http://a.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png';
            case 42005:
                return 'http://1.base.maps.cit.api.here.com/maptile/2.1/maptile/newest/normal.day/{z}/{x}/{y}/256/png?app_id=8ULuzJVtMXlpZU6FXGMn&app_code=Hz7S4nhSy6orPnR1KKOHYw&lg=dan';
            case 42006:
                return 'http://1.base.maps.cit.api.here.com/maptile/2.1/maptile/newest/normal.day/{z}/{x}/{y}/256/png?app_id=8ULuzJVtMXlpZU6FXGMn&app_code=Hz7S4nhSy6orPnR1KKOHYw&lg=dan&style=fleet';
            case 42007:
                return 'http://1.base.maps.cit.api.here.com/maptile/2.1/maptile/newest/normal.day/{z}/{x}/{y}/256/png?app_id=8ULuzJVtMXlpZU6FXGMn&app_code=Hz7S4nhSy6orPnR1KKOHYw&lg=dan&style=flame';
            case 42008:
                return 'http://1.base.maps.cit.api.here.com/maptile/2.1/maptile/newest/normal.day/{z}/{x}/{y}/256/png?app_id=8ULuzJVtMXlpZU6FXGMn&app_code=Hz7S4nhSy6orPnR1KKOHYw&lg=dan&style=mini';
            case 42009:
                return 'http://1.aerial.maps.cit.api.here.com/maptile/2.1/maptile/newest/satellite.day/{z}/{x}/{y}/256/png?app_id=8ULuzJVtMXlpZU6FXGMn&app_code=Hz7S4nhSy6orPnR1KKOHYw&lg=dan';
        }
        return location.protocol + "//tile.historiskatlas.dk/tile/" + id + "/{z}/{x}/{y}.jpg";
    };
    Object.defineProperty(HaMap.prototype, "source", {
        get: function () {
            if (!this._source)
                this._source = HaMap.getNewSource(this.tileUrl);
            return this._source;
        },
        enumerable: true,
        configurable: true
    });
    HaMap.getNewSource = function (tileUrl) {
        return new ol.source.XYZ({
            url: tileUrl,
            crossOrigin: 'Anonymous'
        });
    };
    Object.defineProperty(HaMap.prototype, "tileUrl", {
        get: function () {
            return HaMap.getTileUrlFromMapID(this.id);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HaMap.prototype, "previewUrl", {
        get: function () {
            return this._previewUrl;
        },
        enumerable: true,
        configurable: true
    });
    return HaMap;
}());
