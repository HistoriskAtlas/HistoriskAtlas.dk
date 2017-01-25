var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var RouteLayer = (function (_super) {
    __extends(RouteLayer, _super);
    function RouteLayer() {
        var source = new ol.source.Vector();
        _super.call(this, {
            source: source,
            style: new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: [0, 93, 154, 1],
                    width: 5
                })
            })
        });
        this.cache = {};
        this.source = source;
    }
    RouteLayer.prototype.addPath = function (loc1, loc2) {
        var _this = this;
        var cacheIndex = (loc1.toString() + 'x' + loc2.toString()).replace(/\./g, 'd').replace(/,/g, 'c');
        if (this.cache[cacheIndex]) {
            this.source.addFeature(this.cache[cacheIndex]);
            return;
        }
        $.getJSON("proxy/route.json?loc=" + loc1[0] + "," + loc1[1] + "&loc=" + loc2[0] + "," + loc2[1], function (data) {
            var route = new ol.format.Polyline({
                factor: 1e5
            }).readGeometry(data.geometry, {
                dataProjection: 'EPSG:4326',
                featureProjection: 'EPSG:3857'
            });
            var feature = new ol.Feature(route);
            _this.source.addFeature(feature);
            _this.cache[cacheIndex] = feature;
        });
    };
    RouteLayer.prototype.clear = function () {
        this.source.clear();
    };
    return RouteLayer;
}(ol.layer.Vector));
