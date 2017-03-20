class HaCollectionGeo {

    private _geo: HaGeo;

    constructor(data: any) {
        if (data.geoid)
            this._geo = App.haGeos.geos[data.geoid];
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

    get straight(): boolean {
        return true; //TODO:
    }

}
