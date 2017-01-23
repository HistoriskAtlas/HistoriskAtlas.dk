class TileLayer extends ol.layer.Tile {
    protected _HaMap: HaMap;

    constructor(mainMap: MainMap, mapID: number) {
        super({
            source: HaMap.getNewSource(HaMap.getTileUrlFromMapID(mapID)),
            preload: 15
        });
    }

    get HaMap(): HaMap {
        return this._HaMap;
    }

    set HaMap(newCurHaMap: HaMap) {
        if (this._HaMap == newCurHaMap)
            return;

        this._HaMap = newCurHaMap;
        var source = (<ol.source.XYZ>this.getSource());

        if (source.getUrls()[0] == this.HaMap.tileUrl)
            return;

        //source.setUrl(this.HaMap.tileUrl);

        this.setSource(this._HaMap.source);
    }
}


