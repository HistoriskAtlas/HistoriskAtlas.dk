var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var MainMap = (function (_super) {
    __extends(MainMap, _super);
    function MainMap(coord, zoom) {
        var _this = this;
        var view = new ol.View({ center: Common.toMapCoord([coord[1], coord[0]]), zoom: zoom, minZoom: MainMap.minZoom, maxZoom: MainMap.maxZoom });
        var dragPan = new ol.interaction.DragPan();
        _super.call(this, {
            target: document.getElementById('map'),
            view: view,
            renderer: 'canvas',
            controls: [],
            interactions: [
                new ol.interaction.DragRotate(),
                new ol.interaction.DoubleClickZoom(),
                dragPan,
                new ol.interaction.PinchRotate(),
                new ol.interaction.PinchZoom(),
                new ol.interaction.MouseWheelZoom()
            ],
            loadTilesWhileAnimating: true,
            loadTilesWhileInteracting: true,
            pixelRatio: 1.0
        });
        this.dragPan = dragPan;
        this.view = view;
        this.longtitude = 0;
        this.latitude = 0;
        this.zoom = 0;
        this.showPopup = true;
        this.dom = $(document.getElementById('map'));
        this.backLayer = new BackLayer(this, App.global.theme.mapid ? App.global.theme.mapid : Global.defaultTheme.mapid);
        this.addLayer(this.backLayer);
        $(document).ready(function () { return _this.ready(); });
    }
    Object.defineProperty(MainMap.prototype, "draggable", {
        set: function (value) {
            this.dragPan.setActive(value);
        },
        enumerable: true,
        configurable: true
    });
    MainMap.prototype.ready = function () {
        var _this = this;
        this.timeWarp = new TimeWarp(this, HaMaps.initTimeWarpMapId);
        this.hillshade = new Hillshade(this);
        this.addLayer(this.iconLayer = new IconLayer());
        this.addLayer(this.iconLayerNonClustered = new IconLayerNonClustered());
        this.mapEvents();
        setTimeout(function () { return _this.updateExtent(); }, 1000);
        setTimeout(function () { return _this.updateExtentTimeWarp(); }, 1100);
        setTimeout(function () { return App.global.set('timeWarpActive', LocalStorage.showTimeWarp); }, 0);
    };
    MainMap.prototype.updateExtent = function () {
        App.haMaps.updateInView(this.view.calculateExtent(this.getSize()));
        this.extentIsDirty = false;
    };
    MainMap.prototype.updateExtentTimeWarp = function () {
        App.haMaps.updateInView(this.timeWarp.extent, '.inViewTimeWarp');
        this.extentTimeWarpIsDirty = false;
    };
    MainMap.prototype.mapEvents = function () {
        var _this = this;
        this.view.on('change:center', function (event) { return _this.change(); });
        this.view.on('change:resolution', function (event) {
            _this.change();
        });
        this.view.on('change:rotation', function (event) {
            App.global.setMapRotation(_this.view.getRotation());
        });
        this.on('moveend', function (event) {
            _this._moving = false;
            if (_this.mousePixel)
                _this.getHoverObject(_this.getCoordinateFromPixel(_this.mousePixel), _this.mousePixel);
        });
        this.on('pointermove', function (event) {
            var pixel = _this.getEventPixel(event.originalEvent);
            App.mapTooltip.setPosition([pixel[0] + $("#map").offset().left, pixel[1] + 20]);
            if (event.dragging)
                return;
            _this.iconLayer.moveEvent(event);
            _this.getHoverObject(event.coordinate, pixel);
            if (_this.curHoverObject) {
                if (_this.curHoverObject != _this.oldHoverObject) {
                    if (typeof (_this.curHoverObject) === 'string') {
                        $("#map").css("cursor", _this.curHoverObject);
                        App.mapTooltip.hide();
                        return;
                    }
                    $("#map").css("cursor", 'pointer');
                    if (_this.curHoverObject instanceof HaGeo)
                        _this.curHoverObject.showToolTip();
                    if (_this.curHoverObject instanceof HaRegion)
                        App.mapTooltip.setText(_this.curHoverObject.name);
                }
                return;
            }
            if (!_this.curHoverObject && _this.oldHoverObject) {
                $("#map").css("cursor", 'default');
                App.mapTooltip.hide();
            }
        });
        this.on('pointerdrag', function (event) {
            _this._moving = true;
            if (_this.curHoverObject instanceof HaGeo)
                _this.iconLayer.dragEvent(event, _this.curHoverObject);
        });
        this.on('click', function (event) {
            var eventPixel = _this.getEventPixel(event.originalEvent);
            if (!!('ontouchstart' in window))
                _this.getHoverObject(event.coordinate, eventPixel);
            App.mapTooltip.hide();
            if (_this.curHoverObject instanceof HaGeo) {
                var geo = _this.curHoverObject;
                if (geo.isMoving) {
                    var geoPixel = _this.getPixelFromCoordinate(geo.coord);
                    var diff = [eventPixel[0] - geoPixel[0], eventPixel[1] - geoPixel[1]];
                    if (diff[1] > -5) {
                        if (diff[0] < -15) {
                            geo.saveCoords();
                            geo.zoomUntilUnclustered();
                            return;
                        }
                        if (diff[0] > 15) {
                            geo.revertCoords();
                            return;
                        }
                    }
                    App.toast.show('Godkend eller afvis placeringen først.');
                    return;
                }
                Common.dom.append(WindowGeo.create(geo));
            }
            if (_this.curHoverObject instanceof Array) {
                var coord = [0, 0];
                var geos = _this.curHoverObject;
                for (var _i = 0, geos_1 = geos; _i < geos_1.length; _i++) {
                    var geo = geos_1[_i];
                    coord[0] += geo.coord[0];
                    coord[1] += geo.coord[1];
                }
                coord[0] /= geos.length;
                coord[1] /= geos.length;
                var minDist = Number.MAX_VALUE;
                var centerGeo;
                for (var _a = 0, geos_2 = geos; _a < geos_2.length; _a++) {
                    var geo = geos_2[_a];
                    var dist = Math.pow((geo.coord[0] - coord[0]), 2) + Math.pow((geo.coord[1] - coord[1]), 2);
                    if (dist < minDist) {
                        minDist = dist;
                        centerGeo = geo;
                    }
                }
                _this.centerAnim(centerGeo.coord, _this.view.getResolution() / 8, true, false);
            }
            if (_this.curHoverObject instanceof HaRegion)
                Common.dom.append(WindowRegion.create(_this.curHoverObject));
        });
    };
    MainMap.prototype.change = function () {
        var _this = this;
        if (!this.extentIsDirty) {
            this.extentIsDirty = true;
            setTimeout(function () { return _this.updateExtent(); }, 1000);
        }
        this.changeTimeWarp();
        if (this.digDagLayer)
            this.digDagLayer.change();
        if (App.haGeos.firstGeoTour)
            setTimeout(function () { return App.haGeos.updateFirstGeoTour(); }, 500);
    };
    MainMap.prototype.changeTimeWarp = function () {
        var _this = this;
        if (!this.extentTimeWarpIsDirty) {
            this.extentTimeWarpIsDirty = true;
            setTimeout(function () { return _this.updateExtentTimeWarp(); }, 1100);
        }
    };
    Object.defineProperty(MainMap.prototype, "moving", {
        get: function () {
            return this._moving;
        },
        enumerable: true,
        configurable: true
    });
    MainMap.prototype.preventDrag = function (event) {
        event.preventDefault();
        this._moving = false;
    };
    MainMap.prototype.getHoverObject = function (coord, pixel) {
        this.mousePixel = pixel;
        this.oldHoverObject = this.curHoverObject;
        if (this.curHoverObject = this.getHoverHaGeo(pixel))
            return;
        var digDagLayerVisible = !!this.digDagLayer;
        if (digDagLayerVisible)
            digDagLayerVisible = this.digDagLayer.isVisible;
        if (this.timeWarp.isVisible) {
            this.curHoverObject = this.timeWarp.getHoverInterface(pixel);
            if ((this.curHoverObject != 'move' && this.curHoverObject) || !digDagLayerVisible)
                return;
        }
        if (digDagLayerVisible)
            if (this.digDagLayer.isVisible)
                if ((this.curHoverObject = this.digDagLayer.getRegion(coord)) == DigDagLayer.borderRegion)
                    this.curHoverObject = this.oldHoverObject;
                else
                    var b = 42;
    };
    MainMap.prototype.showDigDagLayer = function (type) {
        if (this.digDagLayer)
            this.digDagLayer.show(type);
        else
            this.getLayers().insertAt(4, this.digDagLayer = new DigDagLayer(type, App.timeline.year));
    };
    MainMap.prototype.hideDigDagLayer = function () {
        if (this.digDagLayer)
            this.digDagLayer.hide();
    };
    MainMap.prototype.showRouteLayer = function () {
        if (!this.routeLayer)
            this.getLayers().insertAt(3, this.routeLayer = new RouteLayer());
    };
    MainMap.prototype.setextent = function (event) {
        this.backLayer.setExtent(this.getView().calculateExtent(this.getSize()));
    };
    MainMap.prototype.getHoverHaGeo = function (pixel) {
        var icons = [];
        this.forEachFeatureAtPixel(pixel, function (feature) {
            icons = feature instanceof Icon ? [feature] : feature.get('features');
            return true;
        });
        if (!icons)
            return null;
        if (icons.length == 0)
            return null;
        if (icons.length == 1)
            return icons[0].geo;
        var geos = [];
        for (var _i = 0, icons_1 = icons; _i < icons_1.length; _i++) {
            var icon = icons_1[_i];
            geos.push(icon.geo);
        }
        return geos;
    };
    Object.defineProperty(MainMap.prototype, "HaMap", {
        get: function () {
            return this.backLayer.HaMap;
        },
        set: function (map) {
            if (!map.inView && this.backLayer.HaMap && map.minLat)
                this.centerAnim([(map.minLon + map.maxLon) / 2, (map.minLat + map.maxLat) / 2], Math.max(map.maxLon - map.minLon, map.maxLat - map.minLat) / 2, true);
            this.backLayer.HaMap = map;
        },
        enumerable: true,
        configurable: true
    });
    MainMap.prototype.zoomPanMap = function (frameState, map) {
        var _this = this;
        this.runAnimation = true;
        if (this.HaMap.minLat) {
            this.longtitude = (this.HaMap.minLon + this.HaMap.maxLon) / 2;
            this.latitude = (this.HaMap.minLat + this.HaMap.maxLat) / 2;
            this.zoom = 14;
        }
        else {
            this.longtitude = 10.0;
            this.latitude = 56.0;
            this.zoom = 7;
        }
        var center = ol.proj.transform([this.longtitude, this.latitude], 'EPSG:4326', 'EPSG:3857');
        var duration = 10000;
        var pan = ol.animation.pan({
            duration: duration,
            source: (this.view.getCenter())
        });
        var zoomAnimation = ol.animation.zoom({
            resolution: this.view.getResolution(),
            duration: duration
        });
        this.beforeRender(function (map, frameState) {
            pan(_this, frameState);
            zoomAnimation(_this, frameState);
            return _this.runAnimation;
        });
        this._moving = true;
        this.view.setCenter(center);
        this.view.setZoom(this.zoom);
    };
    MainMap.prototype.stopAnimation = function () {
        this.runAnimation = false;
    };
    MainMap.prototype.zoomAnim = function (delta) {
        if (delta < 1)
            if (this.view.getZoom() >= MainMap.maxZoom)
                return;
        if (delta > 1)
            if (this.view.getZoom() <= MainMap.minZoom)
                return;
        var zoom = ol.animation.zoom({
            resolution: this.view.getResolution(),
            duration: 200
        });
        this._moving = true;
        this.beforeRender(zoom);
        this.view.setResolution(this.view.constrainResolution(this.getView().getResolution() * delta));
    };
    MainMap.prototype.pan = function (deltaX, deltaY) {
        var center = this.view.getCenter();
        this.view.setCenter([center[0] + deltaX * this.view.getResolution(), center[1] + deltaY * this.view.getResolution()]);
    };
    MainMap.prototype.centerAnim = function (coord, radiusOrResoultionValue, inMapCoords, valueIsRadius) {
        var _this = this;
        if (inMapCoords === void 0) { inMapCoords = false; }
        if (valueIsRadius === void 0) { valueIsRadius = true; }
        var pan = ol.animation.pan({
            source: this.view.getCenter(),
            duration: 2000,
            easing: ol.easing.easeOut
        });
        var zoom = ol.animation.zoom({
            resolution: this.view.getResolution(),
            duration: 2000
        });
        this._moving = true;
        this.beforeRender(pan, zoom);
        this.center(coord, radiusOrResoultionValue, inMapCoords, valueIsRadius, false);
        setTimeout(function () { _this.updateExtent(); _this.updateExtentTimeWarp(); }, 2100);
    };
    MainMap.prototype.center = function (coord, radiusOrResoultionValue, inMapCoords, valueIsRadius, updateExtent) {
        if (inMapCoords === void 0) { inMapCoords = false; }
        if (valueIsRadius === void 0) { valueIsRadius = true; }
        if (updateExtent === void 0) { updateExtent = true; }
        coord = inMapCoords ? coord : Common.toMapCoord(coord);
        this.view.setCenter(coord);
        this.view.setResolution(valueIsRadius ? this.view.constrainResolution(Math.max(radiusOrResoultionValue * 2, 100) / Math.min(this.getSize()[0], this.getSize()[1])) : radiusOrResoultionValue);
        if (updateExtent) {
            this.updateExtent();
        }
    };
    MainMap.getResolutionFromZoom = function (zoom) {
        var size = App.map.getSize();
        return ((800 / (size[0] > size[1] ? size[1] : size[0])) * 800 * 256) / Math.pow(2, zoom);
    };
    MainMap.prototype.toggleRotation = function () {
        this.beforeRender(ol.animation.rotate({
            rotation: this.view.getRotation()
        }));
        this.view.setRotation(0);
    };
    MainMap.maxZoom = 19;
    MainMap.minZoom = 2;
    return MainMap;
}(ol.Map));
