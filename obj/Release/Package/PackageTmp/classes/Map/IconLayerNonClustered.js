var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var IconLayerNonClustered = (function (_super) {
    __extends(IconLayerNonClustered, _super);
    function IconLayerNonClustered() {
        var source = new ol.source.Vector();
        _super.call(this, source, function (feature, resolution) {
            return feature.getStyle();
        });
        this.source = source;
    }
    IconLayerNonClustered.prototype.addIcon = function (icon) {
        this.source.addFeature(icon);
    };
    IconLayerNonClustered.prototype.removeIcon = function (icon) {
        this.source.removeFeature(icon);
    };
    return IconLayerNonClustered;
}(IconLayerBase));
