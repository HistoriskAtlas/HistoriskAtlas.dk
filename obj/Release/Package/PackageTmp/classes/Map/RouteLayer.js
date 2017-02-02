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
                    color: [153, 0, 0, 1],
                    width: 5
                })
            })
        });
        this.cache = {};
        this.source = source;
    }
    RouteLayer.prototype.addPath = function (loc1, loc2, type, callback) {
        var _this = this;
        var cacheIndex = (loc1.toString() + 'x' + loc2.toString() + 't' + type).replace(/\./g, 'd').replace(/,/g, 'c');
        if (this.cache[cacheIndex]) {
            callback(this.cache[cacheIndex].distance);
            this.source.addFeature(this.cache[cacheIndex]);
            return;
        }
        $.getJSON("proxy/route.json?type=" + type + "&loc=" + loc1[0] + "," + loc1[1] + "&loc=" + loc2[0] + "," + loc2[1], function (data) {
            var route = new ol.format.Polyline({
                factor: 1e5
            }).readGeometry(data.geometry, {
                dataProjection: 'EPSG:4326',
                featureProjection: 'EPSG:3857'
            });
            var feature = new ol.Feature(route);
            feature.distance = data.distance;
            _this.source.addFeature(feature);
            _this.cache[cacheIndex] = feature;
            callback(data.distance);
        });
    };
    RouteLayer.prototype.clear = function () {
        this.source.clear();
    };
    return RouteLayer;
}(ol.layer.Vector));
