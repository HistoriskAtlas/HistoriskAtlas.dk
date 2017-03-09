var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var IconLayer = (function (_super) {
    __extends(IconLayer, _super);
    function IconLayer() {
        var _this = this;
        IconLayer.updateDisabled = false;
        IconLayer.source = new ol.source.Vector();
        IconLayer.clusterSource = new ol.source.Cluster({
            distance: 40,
            source: IconLayer.source,
        });
        var canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        var context = canvas.getContext("2d");
        context.arc(16, 16, 15.25, 0, Math.PI * 2);
        context.strokeStyle = '#ffffff';
        context.fillStyle = '#005d9a';
        context.lineWidth = 1.5;
        context.fill();
        context.stroke();
        IconLayer.backStyle = new ol.style.Style({
            image: new ol.style.Icon({
                src: canvas.toDataURL()
            })
        });
        var canvas = IconLayer.circleCanvas(false);
        IconLayer.ugcBackStyle = new ol.style.Style({
            image: new ol.style.Icon({
                src: canvas.toDataURL()
            })
        });
        var ugcCanvas = IconLayer.circleCanvas(true);
        IconLayer.ugcBackStyle = new ol.style.Style({
            image: new ol.style.Icon({
                src: ugcCanvas.toDataURL()
            })
        });
        context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height / 2);
        context.drawImage(ugcCanvas, 0, 0, canvas.width, canvas.height / 2, 0, 0, canvas.width, canvas.height / 2);
        IconLayer.mixedBackStyle = new ol.style.Style({
            image: new ol.style.Icon({
                src: canvas.toDataURL()
            })
        });
        _super.call(this, IconLayer.clusterSource, function (feature, resolution) {
            var icons = feature.get('features');
            return icons.length == 1 ? icons[0].getStyle() : _this.getMultipleStyle(icons);
        });
    }
    IconLayer.prototype.getMultipleStyle = function (icons) {
        var ugcCount = 0;
        var proCount = 0;
        for (var _i = 0, icons_1 = icons; _i < icons_1.length; _i++) {
            var icon = icons_1[_i];
            if (icon.geo.isUGC)
                ugcCount++;
            else
                proCount++;
        }
        if (ugcCount && proCount)
            return [
                IconLayer.mixedBackStyle,
                new ol.style.Style({
                    text: new ol.style.Text({
                        text: ugcCount.toString(),
                        font: '10px Roboto',
                        offsetY: -5,
                        fill: new ol.style.Fill({
                            color: '#005d9a'
                        })
                    })
                }),
                new ol.style.Style({
                    text: new ol.style.Text({
                        text: proCount.toString(),
                        font: '10px Roboto',
                        offsetY: 6,
                        fill: new ol.style.Fill({
                            color: '#ffffff'
                        })
                    })
                })
            ];
        return [
            ugcCount ? IconLayer.ugcBackStyle : IconLayer.backStyle,
            new ol.style.Style({
                text: new ol.style.Text({
                    text: icons.length.toString(),
                    font: '12px Roboto',
                    fill: new ol.style.Fill({
                        color: ugcCount ? '#005d9a' : '#ffffff'
                    })
                })
            })
        ];
    };
    IconLayer.updateShown = function () {
        if (IconLayer.updateDisabled || !this.source)
            return;
        this.source.clear(true);
        var show = [];
        for (var _i = 0, _a = this.iconsShown; _i < _a.length; _i++) {
            var icon = _a[_i];
            if (!icon.geo.isMoving)
                show.push(icon);
        }
        this.source.addFeatures(show);
    };
    IconLayer.circleCanvas = function (isUGC) {
        var canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        var context = canvas.getContext("2d");
        context.arc(16, 16, 15.25, 0, Math.PI * 2);
        context.strokeStyle = isUGC ? '#005d9a' : '#ffffff';
        context.fillStyle = isUGC ? '#ffffff' : '#005d9a';
        context.lineWidth = 1.5;
        context.fill();
        context.stroke();
        return canvas;
    };
    IconLayer.iconsShown = [];
    IconLayer.iconsSmall = [];
    return IconLayer;
}(IconLayerBase));
