class HaCollectionGeo {

    private _id;
    private geoid: number;
    private _geoIsPlaceholder: boolean;
    private _geo: HaGeo;
    private _calcRoute: boolean;
    private _showOnMap: boolean;
    private _ordering: number;
    private _contentID: number;
    private _content: HaContent;

    public static orderingGap = 21000000;

    public uiOpen: boolean = false;
    public showText: boolean;

    constructor(data: any) {
        this._id = data.id || data.collectiongeoid;
        this._ordering = data.ordering;
        this._contentID = data.contentid;
        this._calcRoute = data.calcroute == null ? true : data.calcroute;
        this._showOnMap = data.showonmap == null ? true : data.showonmap;

        this.showText = !!this._contentID;

        if (data.geoid) {
            this.geoid = data.geoid;
            if (App.haGeos.geos[data.geoid]) {
                this._geo = App.haGeos.geos[data.geoid];
                this._geoIsPlaceholder = false;
            }
        }

        if (!this._geo) {
            this._geo = new HaGeo({ geoid: data.geoid ? data.geoid : 0, lng: data.longitude, lat: data.latitude, title: '' }, false, false)
            this._geoIsPlaceholder = true;
        }
    }

    get id(): number {
        return this._id;
    }
    set id(val: number) {
        this._id = val;
    }

    get geo(): HaGeo {
        if (this._geoIsPlaceholder && this.geoid)
            if (App.haGeos.geos[this.geoid]) {
                var icon = this._geo.icon;
                this._geo = App.haGeos.geos[this.geoid];
                this._geo.icon = icon;
                icon.geo = this._geo;
                this._geoIsPlaceholder = false;
            }

        return this._geo;
    }
    set geo(geo: HaGeo) {
        this._geo = geo;
        this._geoIsPlaceholder = false;
    }

    get coord(): ol.Coordinate {
        return this._geo.coord;
    }

    get isViaPoint(): boolean {
        return this._geo.id < 1;
    }
    get geoIsPlaceholder(): boolean {
        return this._geoIsPlaceholder;
    }

    get calcRoute(): boolean {
        return this._calcRoute;
    }
    set calcRoute(val: boolean) {
        this._calcRoute = val;
    }

    get showOnMap(): boolean {
        return this._showOnMap;
    }
    set showOnMap(val: boolean) {
        this._showOnMap = val;
    }

    get ordering(): number {
        return this._ordering;
    }
    set ordering(val: number) {
        this._ordering = val;
    }

    get contentID(): number {
        return this._contentID;
    }
    set contentID(val: number) {
        this._contentID = val;
    }

    get content(): HaContent {
        return this._content;
    }
    set content(val: HaContent) {
        this._content = val;
    }

    public saveCoords() {
        var coord = Common.fromMapCoord(this.coord);
        Services.update('collection_geo', { id: this._id, latitude: coord[1], longitude: coord[0] }, () => { });
    }

    public followExternalLink(): boolean {
        if (!this.content)
            return false;

        var externals = this.content.externals;
        if (externals.length == 0)
            return false;

        //var win = Common.embed ? window.parent : window;
        if (Common.embed) {
            var match = /point\/(.*?)\//gm.exec(this.content.externals[0].link); //digterruter
            if (match && match.length > 0) {
                window.parent.postMessage({ event: 'pointclick', point: parseInt(match[1]) }, "*");
                return true;
            }
        }

        window.open(this.content.externals[0].link, '_blank');
        return true;
    }
}
