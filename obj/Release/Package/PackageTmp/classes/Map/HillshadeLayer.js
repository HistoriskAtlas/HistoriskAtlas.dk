var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Hillshade = (function (_super) {
    __extends(Hillshade, _super);
    function Hillshade(mainMap) {
        _super.call(this, {
            source: new ol.source.XYZ({
                url: location.protocol + '//tile.historiskatlas.dk/tile/hillshade/{z}/{x}/{y}.png',
                crossOrigin: 'Anonymous'
            })
        });
        this.setVisible(false);
        mainMap.addLayer(this);
    }
    Hillshade.prototype.update = function (opacity) {
        if (opacity == 0) {
            this.setVisible(false);
            return;
        }
        if (!this.isVisible)
            this.setVisible(true);
        this.setOpacity(opacity);
    };
    Object.defineProperty(Hillshade.prototype, "isVisible", {
        get: function () {
            return this.getVisible();
        },
        enumerable: true,
        configurable: true
    });
    return Hillshade;
}(ol.layer.Tile));
