var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BackLayer = (function (_super) {
    __extends(BackLayer, _super);
    function BackLayer(mainMap, mapID) {
        _super.call(this, mainMap, mapID);
    }
    return BackLayer;
}(TileLayer));
