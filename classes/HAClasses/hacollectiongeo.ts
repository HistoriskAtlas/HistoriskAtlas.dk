class HaCollectionGeo {

    private _id;
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
        this._id = data.id;
        this._ordering = data.ordering;
        this._contentID = data.contentid;
        this._calcRoute = data.calcroute == null ? true : data.calcroute;
        this._showOnMap = data.showonmap == null ? true : data.showonmap;

        this.showText = !!this._contentID;

        if (data.geoid)
            this._geo = App.haGeos.geos[data.geoid];
        else
            this._geo = new HaGeo({ id: 0, lng: data.longitude, lat: data.latitude }, false, false)
    }

    get id(): number {
        return this._id;
    }
    set id(val: number) {
        this._id = val;
    }

    get geo(): HaGeo {
        return this._geo;
    }
    set geo(geo: HaGeo) {
        this._geo = geo;
    }

    get coord(): ol.Coordinate {
        return this._geo.coord;
    }

    get isViaPoint(): boolean {
        return this._geo.id < 1;
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
}
