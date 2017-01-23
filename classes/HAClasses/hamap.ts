class HaMap {
    public id: number;
    public minLat: number;
    public maxLat: number;
    public minLon: number;
    public maxLon: number;
    public minZ: number;
    public maxZ: number;
    //private _textID: number;
    public title: string;
    public orgStartYear: number;
    public orgEndYear: number;
    private _previewUrl: string;
    private _source: ol.source.XYZ;

    public inView: boolean;
    public inViewTimeWarp: boolean;

    constructor(data: any) {
        this.id = data.id;

        if (data.minlat) {
            var coord = Common.toMapCoord([data.minlon, data.minlat]); //TODO convert on server instead?
            this.minLon = coord[0];
            this.minLat = coord[1];
            coord = Common.toMapCoord([data.maxlon, data.maxlat]);
            this.maxLon = coord[0];
            this.maxLat = coord[1];
        }

        this.minZ = data.minz
        this.maxZ = data.maxz

        this.inView = false;
        this.inViewTimeWarp = false;

        //this._textID = data.textid;
        this.title = data.name;
        this.orgStartYear = data.orgproductionstartyear;
        this.orgEndYear = data.orgproductionendyear;

        if (data.iconcoords) { //TODO: all should have?
            var coords: string[] = (<string>data.iconcoords).split('|');
            this._previewUrl = 'http://tile.historiskatlas.dk/' + this.id + '/' + coords[2] + '/' + coords[0] + '/' + coords[1] + '.jpg'
        }
    }

    //public get minRes(): number {
    //    
    //}

    public static getTileUrlFromMapID(id: number) {
        switch (id) {
            case 42000:
                return 'http://otile1.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png';
            case 42001:
                return 'http://c.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg'
            case 42002:
                return 'http://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'
            case 42003:
                return 'http://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'
            case 42004:
                return 'http://a.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'
            case 42005:
                return 'http://1.base.maps.cit.api.here.com/maptile/2.1/maptile/newest/normal.day/{z}/{x}/{y}/256/png?app_id=8ULuzJVtMXlpZU6FXGMn&app_code=Hz7S4nhSy6orPnR1KKOHYw&lg=dan'
            case 42006:
                return 'http://1.base.maps.cit.api.here.com/maptile/2.1/maptile/newest/normal.day/{z}/{x}/{y}/256/png?app_id=8ULuzJVtMXlpZU6FXGMn&app_code=Hz7S4nhSy6orPnR1KKOHYw&lg=dan&style=fleet'
            case 42007:
                return 'http://1.base.maps.cit.api.here.com/maptile/2.1/maptile/newest/normal.day/{z}/{x}/{y}/256/png?app_id=8ULuzJVtMXlpZU6FXGMn&app_code=Hz7S4nhSy6orPnR1KKOHYw&lg=dan&style=flame'
            case 42008:
                return 'http://1.base.maps.cit.api.here.com/maptile/2.1/maptile/newest/normal.day/{z}/{x}/{y}/256/png?app_id=8ULuzJVtMXlpZU6FXGMn&app_code=Hz7S4nhSy6orPnR1KKOHYw&lg=dan&style=mini'
            case 42009:
                return 'http://1.aerial.maps.cit.api.here.com/maptile/2.1/maptile/newest/satellite.day/{z}/{x}/{y}/256/png?app_id=8ULuzJVtMXlpZU6FXGMn&app_code=Hz7S4nhSy6orPnR1KKOHYw&lg=dan'
        }

        return "http://tile.historiskatlas.dk/" + id + "/{z}/{x}/{y}.jpg"
    }

    public get source(): ol.source.XYZ {
        if (!this._source)
            this._source = HaMap.getNewSource(this.tileUrl);

        return this._source;
    }

    public static getNewSource(tileUrl: string): ol.source.XYZ {
        return new ol.source.XYZ({
            url: tileUrl,
            crossOrigin: 'Anonymous'
            //tilePixelRatio: window.devicePixelRatio ???
        });
    }

    public get tileUrl(): string {
        return HaMap.getTileUrlFromMapID(this.id);
    }

    //get centerLat(): number {
    //    return this._centerLat;
    //}

    //get centerLng(): number {
    //    return this._centerLng;
    //}

    //get id(): number {
    //    return this._id;
    //}

    //get spanLat(): number {
    //    return this._spanLat;
    //}

    //get spanLng(): number {
    //    return this._spanLng;
    //}

    //get textID(): number {
    //    return this._textID;
    //}

    //get title(): string {
    //    return this._title;
    //}

    //get year(): number {
    //    return this._year;
    //}

    //public test(): string {
    //    return this._year.toString();
    //}

    get previewUrl(): string {
        return this._previewUrl;
    }
}
