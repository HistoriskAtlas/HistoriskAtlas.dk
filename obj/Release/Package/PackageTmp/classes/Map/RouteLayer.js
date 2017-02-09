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
            style: RouteLayer.styleFunction
        });
        this.cache = {};
        this.source = source;
    }
    RouteLayer.prototype.addPath = function (loc1, loc2, collection, callback) {
        var _this = this;
        var cacheIndex = (loc1.toString() + 'x' + loc2.toString() + 't' + collection.type).replace(/\./g, 'd').replace(/,/g, 'c');
        if (this.cache[cacheIndex]) {
            var feature = this.cache[cacheIndex];
            callback(feature, feature.distance);
            this.source.addFeature(feature);
            return;
        }
        $.getJSON("proxy/route.json?type=" + collection.type + "&loc=" + loc1[0] + "," + loc1[1] + "&loc=" + loc2[0] + "," + loc2[1], function (data) {
            var route = new ol.format.Polyline({
                factor: 1e5
            }).readGeometry(data.geometry, {
                dataProjection: 'EPSG:4326',
                featureProjection: 'EPSG:3857'
            });
            var feature = new ol.Feature({
                geometry: route
            });
            feature.distance = data.distance;
            feature.collection = collection;
            _this.source.addFeature(feature);
            _this.cache[cacheIndex] = feature;
            callback(feature, data.distance);
        });
    };
    RouteLayer.styleFunction = function (feature, res) {
        var collection = feature.collection;
        return [
            new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: [153, 0, 0, collection.online ? 1 : 0.5],
                    width: 5,
                    lineDash: collection == App.haCollections.collection ? null : [5, 15]
                })
            })
        ];
    };
    RouteLayer.prototype.removeFeatures = function (features) {
        var existingFeatures = this.source.getFeatures();
        var newFeatures = [];
        for (var _i = 0, existingFeatures_1 = existingFeatures; _i < existingFeatures_1.length; _i++) {
            var feature = existingFeatures_1[_i];
            if (features.indexOf(feature) == -1)
                newFeatures.push(feature);
        }
        this.source.clear();
        this.source.addFeatures(newFeatures);
    };
    RouteLayer.prototype.redraw = function () {
        var existingFeatures = this.source.getFeatures();
        this.source.clear();
        this.source.addFeatures(existingFeatures);
    };
    return RouteLayer;
}(ol.layer.Vector));
