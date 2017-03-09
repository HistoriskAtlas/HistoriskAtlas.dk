var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TileLayer = (function (_super) {
    __extends(TileLayer, _super);
    function TileLayer(mainMap, mapID) {
        _super.call(this, {
            source: HaMap.getNewSource(HaMap.getTileUrlFromMapID(mapID)),
            preload: 15
        });
    }
    Object.defineProperty(TileLayer.prototype, "HaMap", {
        get: function () {
            return this._HaMap;
        },
        set: function (newCurHaMap) {
            if (this._HaMap == newCurHaMap)
                return;
            this._HaMap = newCurHaMap;
            var source = this.getSource();
            if (source.getUrls()[0] == this.HaMap.tileUrl)
                return;
            this.setSource(this._HaMap.source);
        },
        enumerable: true,
        configurable: true
    });
    return TileLayer;
}(ol.layer.Tile));
