var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TimelineMap = (function (_super) {
    __extends(TimelineMap, _super);
    function TimelineMap(elem, timeline) {
        var _this = this;
        var view = new ol.View({
            center: [timeline.year * TimelineMap.yearWidth, TimelineMap.offsetY],
            zoom: 10,
            minZoom: 6,
            maxZoom: 13,
            extent: [TimelineMap.minYear * TimelineMap.yearWidth, TimelineMap.offsetY, TimelineMap.maxYear * TimelineMap.yearWidth, TimelineMap.offsetY],
            enableRotation: false
        });
        view.on('change:center', function (event) {
            var center = view.getCenter();
            if (center[1] != TimelineMap.offsetY)
                view.setCenter([center[0], TimelineMap.offsetY]);
            if (center[0] < TimelineMap.minYear * TimelineMap.yearWidth)
                view.setCenter([TimelineMap.minYear * TimelineMap.yearWidth, TimelineMap.offsetY]);
            if (center[0] > TimelineMap.maxYear * TimelineMap.yearWidth)
                view.setCenter([TimelineMap.maxYear * TimelineMap.yearWidth, TimelineMap.offsetY]);
        });
        view.on('change:resolution', function (event) {
            timeline.set('zoom', view.getZoom());
        });
        _super.call(this, {
            target: elem,
            view: view,
            renderer: 'canvas',
            controls: [],
            interactions: [
                new ol.interaction.DoubleClickZoom(),
                new ol.interaction.DragPan(),
                new ol.interaction.PinchZoom(),
                new ol.interaction.MouseWheelZoom({ duration: 500 })
            ]
        });
        this.view = view;
        this.timeline = timeline;
        this.extent = 20037508.34;
        this.color = '#000000'; //timeline.main ? '#005d9a' : '#000000';
        this.fillColor = timeline.main ? '#005d9a' : '#ffcc00';
        this.textColor = timeline.main ? '#ffffff' : '#000000';
        var sourceLine = new ol.source.Vector();
        var line = new ol.Feature({
            geometry: new ol.geom.LineString([[-this.extent, 0], [this.extent, 0]])
        });
        sourceLine.addFeature(line);
        //var zeroTickmark = new ol.Feature({
        //    geometry: new (<any>ol.geom.LineString)([[0, -10000], [0, 10000]])
        //});
        //sourceLine.addFeature(zeroTickmark);
        var layerLine = new ol.layer.Vector({
            source: sourceLine,
            style: new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: this.color,
                    width: 1.5
                })
            }),
            updateWhileAnimating: true,
            updateWhileInteracting: true
        });
        this.addLayer(layerLine);
        if (!TimelineMap.sourceTickmark) {
            TimelineMap.sourceTickmark = new ol.source.Vector({
                wrapX: false
            });
            for (var year = TimelineMap.minYear; year <= TimelineMap.maxYear; year++) {
                var tickmark = new ol.Feature({
                    geometry: new ol.geom.Point([year * TimelineMap.yearWidth, 0])
                });
                tickmark.year = year;
                if (year % 5 != 0)
                    tickmark.level = 60;
                else if (year % 10 != 0)
                    tickmark.level = 240;
                else if (year % 50 != 0)
                    tickmark.level = 600;
                else if (year % 100 != 0)
                    tickmark.level = 2400;
                else
                    tickmark.level = 6000;
                TimelineMap.sourceTickmark.addFeature(tickmark);
            }
        }
        var layerTickmark = new ol.layer.Vector({
            source: TimelineMap.sourceTickmark,
            style: function (feature, resolution) {
                if (feature.level < resolution)
                    return [];
                var radius = feature.level > 2 * resolution ? 10 : (1 - resolution / feature.level) * 20;
                if (feature.year == _this.timeline.year)
                    return [];
                return [new ol.style.Style({
                        image: new ol.style.Circle(({
                            radius: radius,
                            stroke: new ol.style.Stroke({
                                color: _this.color,
                                width: 1.5
                            }),
                            fill: new ol.style.Fill({
                                color: '#ffffff'
                            }),
                            snapToPixel: false
                        })),
                        text: radius < 10 ? null : new ol.style.Text({
                            text: feature.year.toString(),
                            offsetY: 18,
                            font: '12px Roboto',
                            fill: new ol.style.Fill({
                                color: _this.color
                            })
                        })
                    })];
            },
            updateWhileAnimating: true,
            updateWhileInteracting: true
        });
        this.addLayer(layerTickmark);
        var sourceDynamic = new ol.source.Vector();
        this.selectedTickmark = new ol.Feature({
            geometry: new ol.geom.Point([timeline.year * TimelineMap.yearWidth, 0])
        });
        this.selectedTickmark.setStyle(function (resolution) {
            return [new ol.style.Style({
                    image: new ol.style.Circle(({
                        radius: 18,
                        stroke: new ol.style.Stroke({
                            color: _this.color,
                            width: 1.5
                        }),
                        fill: new ol.style.Fill({
                            color: _this.fillColor
                        }),
                        snapToPixel: false
                    })),
                    text: new ol.style.Text({
                        text: _this.timeline.year.toString(),
                        offsetY: 0,
                        font: '12px Roboto',
                        fill: new ol.style.Fill({
                            color: _this.textColor
                        })
                    })
                })];
        });
        sourceDynamic.addFeature(this.selectedTickmark);
        var layerDynamic = new ol.layer.Vector({
            source: sourceDynamic,
            updateWhileAnimating: true,
            updateWhileInteracting: true
        });
        this.addLayer(layerDynamic);
        this.on('pointermove', function (event) {
            var pixel = _this.getEventPixel(event.originalEvent);
            if (event.dragging)
                return;
            _this.getHoverObject(pixel);
            if (_this.curHoverObject) {
                $(elem).css('cursor', 'pointer');
            }
            else
                $(elem).css('cursor', 'ew-resize');
        });
        this.on('click', function (event) {
            //if (!!('ontouchstart' in window))
            _this.getHoverObject(_this.getEventPixel(event.originalEvent));
            if (_this.curHoverObject) {
                timeline.set('year', _this.curHoverObject.year);
                _this.curHoverObject.changed();
            }
        });
    }
    TimelineMap.prototype.getHoverObject = function (pixel) {
        this.lastPixel = pixel;
        this.oldHoverObject = this.curHoverObject;
        if (this.curHoverObject = this.getHoverYear(pixel))
            return;
    };
    TimelineMap.prototype.getHoverYear = function (pixel) {
        var result = null;
        this.forEachFeatureAtPixel(pixel, function (feature) {
            if (feature.year) {
                result = feature;
                return true;
            }
        });
        return result;
    };
    TimelineMap.prototype.updateYear = function () {
        this.selectedTickmark.getGeometry().setCoordinates([this.timeline.year * TimelineMap.yearWidth, 0]);
        this.center();
    };
    TimelineMap.prototype.zoom = function (z) {
        if (this.view.getZoom() == z)
            return;
        var anim = ol.animation.zoom({
            resolution: this.view.getResolution(),
            duration: 250,
        });
        this.beforeRender(anim);
        this.view.setZoom(z);
    };
    TimelineMap.prototype.center = function () {
        var pan = ol.animation.pan({
            source: this.view.getCenter(),
            duration: 500,
            easing: ol.easing.inAndOut
        });
        this.beforeRender(pan);
        this.view.setCenter([this.timeline.year * TimelineMap.yearWidth, 0]);
        //setTimeout(() => this.getHoverObject(this.lastPixel), 510);
    };
    TimelineMap.minYear = 1660; //WAS -1000
    TimelineMap.maxYear = 2016;
    TimelineMap.yearWidth = 1000;
    TimelineMap.offsetY = 0; //TODO: not working..... scales with zoom...
    return TimelineMap;
}(ol.Map));
//# sourceMappingURL=TimelineMap.js.map