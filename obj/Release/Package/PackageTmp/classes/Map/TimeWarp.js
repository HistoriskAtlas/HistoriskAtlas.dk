var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TimeWarpModes;
(function (TimeWarpModes) {
    TimeWarpModes[TimeWarpModes["CIRCLE"] = 0] = "CIRCLE";
    TimeWarpModes[TimeWarpModes["MORPH"] = 1] = "MORPH";
    TimeWarpModes[TimeWarpModes["SPLIT"] = 2] = "SPLIT";
    TimeWarpModes[TimeWarpModes["OPENING"] = 3] = "OPENING";
    TimeWarpModes[TimeWarpModes["CLOSING_FROM_CIRCLE"] = 4] = "CLOSING_FROM_CIRCLE";
    TimeWarpModes[TimeWarpModes["CLOSING_FROM_SPLIT"] = 5] = "CLOSING_FROM_SPLIT";
})(TimeWarpModes || (TimeWarpModes = {}));
;
var TimeWarpDragModes;
(function (TimeWarpDragModes) {
    TimeWarpDragModes[TimeWarpDragModes["NONE"] = 0] = "NONE";
    TimeWarpDragModes[TimeWarpDragModes["CIRCLE_RADIUS"] = 1] = "CIRCLE_RADIUS";
    TimeWarpDragModes[TimeWarpDragModes["CIRCLE_MOVE"] = 2] = "CIRCLE_MOVE";
    TimeWarpDragModes[TimeWarpDragModes["SPLIT"] = 3] = "SPLIT";
})(TimeWarpDragModes || (TimeWarpDragModes = {}));
;
var TimeWarp = (function (_super) {
    __extends(TimeWarp, _super);
    function TimeWarp(mainMap, mapID) {
        _super.call(this, mainMap, mapID);
        this.minRadius = 100;
        this.lineWidth = 6.0;
        this.mode = TimeWarpModes.MORPH;
        this.morph = 0.0;
        this.rectWidth = 2;
        this.dragMode = TimeWarpDragModes.NONE;
        this.timerID = 0;
        this.bindEvents();
        this.setVisible(false);
        this.position = [mainMap.getSize()[0] - this.closedPositionRight, this.closedPositionTop];
        this.radius = this.closedRadius;
        mainMap.addLayer(this);
        this.toggleMode();
        $(window).resize(function () { return TimeWarpButton.updateTimeWarpUI(); });
    }
    TimeWarp.prototype.toggle = function (show) {
        if (this.getVisible() == show)
            return;
        if (show) {
            this.show(App.map);
        }
        else {
            this.hide();
            TimeWarpButton.hideTimeWarpUI();
        }
        TimeWarpButton.updateTimeWarpUI();
    };
    TimeWarp.prototype.trackOpen = function (e) {
        var _this = this;
        if (this.mode == TimeWarpModes.CIRCLE)
            return;
        this.mode = TimeWarpModes.CIRCLE;
        if (this.timerID)
            clearInterval(this.timerID);
        this.morph = 0.0;
        this.timerID = setInterval(function () {
            _this.timerTrackOpen();
        }, 1000 / 60);
        var size = App.map.getSize();
        this.position = [size[0] - this.closedPositionRight, this.closedPositionTop];
        this.radius = this.closedRadius;
        this._show(App.map);
        this.down([e.detail.x - e.detail.dx, e.detail.y - e.detail.dy], true);
        this.listenerKeyPointerDrag = App.map.on('pointermove', function (event) { _this.pointerDrag(event); });
        App.map.once('pointerup', function (event) { ol.Observable.unByKey(_this.listenerKeyPointerMove); });
    };
    Object.defineProperty(TimeWarp.prototype, "isVisible", {
        get: function () {
            return this.getVisible();
        },
        enumerable: true,
        configurable: true
    });
    TimeWarp.prototype.show = function (mainMap) {
        var _this = this;
        this.mode = TimeWarpModes.OPENING;
        var size = mainMap.getSize();
        this.positionOpen = [size[0] / 2, size[1] / 2];
        this.radiusOpen = Math.min(size[0], size[1]) * 0.3;
        if (this.timerID)
            clearInterval(this.timerID);
        this.morph = 0.0;
        this.timerID = setInterval(function () {
            _this.timerOpen();
        }, 1000 / 60);
        this.position = [size[0] - this.closedPositionRight, this.closedPositionTop];
        this.radius = this.closedRadius;
        this._show(mainMap);
    };
    TimeWarp.prototype._show = function (mainMap) {
        var _this = this;
        if (this.HaMap) {
            App.map.updateExtentTimeWarp();
            if (!this.HaMap.inViewTimeWarp) {
                var newMap = HaMaps.defaultMap;
                for (var _i = 0, _a = App.haMaps.maps; _i < _a.length; _i++) {
                    var map = _a[_i];
                    if (map.orgEndYear < newMap.orgEndYear)
                        if (map.inViewTimeWarp)
                            newMap = map;
                }
                App.haMaps.set('timeWarpMap', newMap);
            }
        }
        $('#map').on('touchstart.timewarp', function (event) { return _this.touchDown(event.originalEvent); });
        $(window).on('touchend.timewarp', function (event) { return _this.touchUp(event.originalEvent); });
        $('#map').on('mousedown.timewarp', function (event) { return _this.down([event.pageX, event.pageY]); });
        $(window).on('mouseup.timewarp', function (event) { return _this.up(); });
        this.listenerKeyPointerDrag = mainMap.on('pointerdrag', function (event) { _this.pointerDrag(event); });
        this.setVisible(true);
        this.setOpacity(1);
        App.timeWarpClosed.hide();
        LocalStorage.showTimeWarp = true;
    };
    TimeWarp.prototype.hide = function () {
        var _this = this;
        if (this.mode == TimeWarpModes.SPLIT) {
            this.mode = TimeWarpModes.CLOSING_FROM_SPLIT;
            var size = App.map.getSize();
            this.togglingPosition = [size[0] / 2, size[1] / 2];
            this.togglingRadius = (Math.min(size[0], size[1]) * 0.3);
        }
        else {
            this.mode = TimeWarpModes.CLOSING_FROM_CIRCLE;
            this.togglingPosition = this.position;
            this.togglingRadius = this.radius;
        }
        if (this.timerID)
            clearInterval(this.timerID);
        this.morph = 1.0;
        this.timerID = setInterval(function () {
            _this.timerClose();
        }, 1000 / 60);
        $('#map').off('touchstart.timewarp');
        $('#map').off('touchend.timewarp');
        $('#map').off('mousedown.timewarp');
        $('#map').off('mouseup.timewarp');
        ol.Observable.unByKey(this.listenerKeyPointerDrag);
        LocalStorage.showTimeWarp = false;
    };
    TimeWarp.prototype.precomposeTimeWarp = function (event) {
        var ctx = event.context;
        this.pixelRatio = event.frameState.pixelRatio;
        this.applyPath(ctx);
        ctx.save();
        ctx.clip();
    };
    TimeWarp.prototype.postcomposeTimeWarp = function (event) {
        var ctx = event.context;
        ctx.restore();
        this.applyPath(ctx);
        if (this.position) {
            ctx.strokeStyle = '#fece00';
            ctx.lineWidth = this.lineWidth * this.pixelRatio;
            ctx.stroke();
            if (this.mode == TimeWarpModes.OPENING || this.mode == TimeWarpModes.CLOSING_FROM_CIRCLE || this.mode == TimeWarpModes.CLOSING_FROM_SPLIT) {
                ctx.fillStyle = 'rgba(254,206,0,' + (1 - this.easeFromMorph) + ')';
                ctx.fill();
            }
        }
    };
    TimeWarp.prototype.applyPath = function (ctx) {
        var x = this.position[0] * this.pixelRatio;
        var y = this.position[1] * this.pixelRatio;
        ctx.beginPath();
        var rectY = -10.0;
        var rectHeight = $(window).height() + 20.0;
        switch (this.mode) {
            case TimeWarpModes.CIRCLE:
            case TimeWarpModes.OPENING:
            case TimeWarpModes.CLOSING_FROM_CIRCLE:
                this.x1 = this.position[0] + this.radius * Math.cos(300 * (Math.PI / 180));
                this.y1 = this.position[1] + this.radius * Math.sin(300 * (Math.PI / 180));
                var x2 = this.position[0] + this.radius * Math.cos(330 * (Math.PI / 180)) - 10;
                var y2 = this.position[1] + this.radius * Math.sin(330 * (Math.PI / 180)) - 10;
                var slideX = this.position[0] + this.radius * Math.cos(90 * (Math.PI / 180));
                var slideY = this.position[1] + this.radius * Math.sin(90 * (Math.PI / 180));
                ctx.arc(x, y, this.radius * this.pixelRatio, 0, 2 * Math.PI);
                break;
            case TimeWarpModes.MORPH:
            case TimeWarpModes.CLOSING_FROM_SPLIT:
                var ease = this.easeFromMorph;
                var ease2 = 1.0 - ease;
                var rectX2 = this.rectX * ease * this.pixelRatio + (x - this.radius * this.pixelRatio) * ease2;
                var rectY2 = rectY * ease * this.pixelRatio + (y - this.radius * this.pixelRatio) * ease2;
                var rectWidth2 = this.rectWidth * ease * this.pixelRatio + (this.radius * 2.0 * this.pixelRatio) * ease2;
                var rectHeight2 = rectHeight * ease * this.pixelRatio + (this.radius * 2.0 * this.pixelRatio) * ease2;
                var r = (rectWidth2 / 2) * ease2;
                ctx.arc(rectX2 + r, rectY2 + r, r, TimeWarp.pi2div2, TimeWarp.pi3div2);
                ctx.arc(rectX2 + rectWidth2 - r, rectY2 + r, r, TimeWarp.pi3div2, 0);
                ctx.arc(rectX2 + rectWidth2 - r, rectY2 + rectHeight2 - r, r, 0, TimeWarp.pi1div2);
                ctx.arc(rectX2 + r, rectY2 + rectHeight2 - r, r, TimeWarp.pi1div2, TimeWarp.pi2div2);
                break;
            case TimeWarpModes.SPLIT:
                ctx.rect((this.rectX * this.pixelRatio), (rectY * this.pixelRatio), (this.rectWidth * this.pixelRatio), (rectHeight * this.pixelRatio));
                break;
        }
    };
    TimeWarp.prototype.toggleMode = function () {
        var _this = this;
        if (this.timerID)
            clearInterval(this.timerID);
        if (this.mode == TimeWarpModes.CIRCLE) {
            this.mode = TimeWarpModes.MORPH;
            this.rectWidth = App.map.getSize()[0] / 2.0 + this.lineWidth / 2.0;
            this.rectX = App.map.getSize()[0] / 2.0;
            this.timerID = setInterval(function () {
                _this.timerMorphToSplit();
            }, 1000 / 60);
        }
        else {
            this.mode = TimeWarpModes.MORPH;
            this.timerID = setInterval(function () {
                _this.timerMorphToCircle();
            }, 1000 / 60);
        }
        TimeWarpButton.updateTimeWarpUI();
    };
    TimeWarp.prototype.timerMorphToSplit = function () {
        this.morph += 0.05;
        App.map.render();
        if (this.morph >= 1.0) {
            this.morph = 1.0;
            clearInterval(this.timerID);
            this.timerID = 0;
            this.mode = TimeWarpModes.SPLIT;
            App.map.renderSync();
            TimeWarpButton.updateTimeWarpUI();
        }
    };
    TimeWarp.prototype.timerMorphToCircle = function () {
        this.morph -= 0.05;
        App.map.render();
        if (this.morph <= 0.0) {
            this.morph = 0.0;
            clearInterval(this.timerID);
            this.timerID = 0;
            this.mode = TimeWarpModes.CIRCLE;
            App.map.renderSync();
            TimeWarpButton.updateTimeWarpUI();
        }
    };
    TimeWarp.prototype.timerOpen = function () {
        this.morph += 0.05;
        var ease = this.easeFromMorph;
        var ease2 = 1 - ease;
        var size = App.map.getSize();
        var closedPosition = [size[0] - this.closedPositionRight, this.closedPositionTop];
        this.position = [this.positionOpen[0] * ease + closedPosition[0] * ease2, this.positionOpen[1] * ease + closedPosition[1] * ease2];
        this.radius = this.radiusOpen * ease + this.closedRadius * ease2;
        App.map.render();
        if (this.morph >= 1.0) {
            this.morph = 0.0;
            clearInterval(this.timerID);
            this.timerID = 0;
            this.mode = TimeWarpModes.CIRCLE;
            App.map.renderSync();
            TimeWarpButton.updateTimeWarpUI();
            TimeWarpButton.showTimeWarpUI();
        }
    };
    TimeWarp.prototype.timerTrackOpen = function () {
        this.morph += 0.05;
        var ease = this.easeFromMorph;
        var ease2 = 1 - ease;
        var size = App.map.getSize();
        this.radius = (Math.min(size[0], size[1]) * 0.2) * ease + this.closedRadius * ease2;
        App.map.render();
        if (this.morph >= 1.0) {
            this.morph = 0.0;
            clearInterval(this.timerID);
            this.timerID = 0;
            App.map.renderSync();
            TimeWarpButton.updateTimeWarpUI();
            TimeWarpButton.showTimeWarpUI();
        }
    };
    TimeWarp.prototype.timerClose = function () {
        this.morph -= 0.05;
        var ease = this.easeFromMorph;
        var ease2 = 1 - ease;
        var size = App.map.getSize();
        var closedPosition = [size[0] - this.closedPositionRight, this.closedPositionTop];
        this.position = [this.togglingPosition[0] * ease + closedPosition[0] * ease2, this.togglingPosition[1] * ease + closedPosition[1] * ease2];
        this.radius = this.togglingRadius * ease + this.closedRadius * ease2;
        App.map.render();
        if (this.morph <= 0.0) {
            clearInterval(this.timerID);
            this.timerID = 0;
            App.map.renderSync();
            this.setVisible(false);
            App.timeWarpClosed.show();
        }
    };
    Object.defineProperty(TimeWarp.prototype, "easeFromMorph", {
        get: function () {
            return this.morph < .5 ? 2 * this.morph * this.morph : -1 + (4 - 2 * this.morph) * this.morph;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TimeWarp.prototype, "closedPositionRight", {
        get: function () {
            return this.closedRadius + 16;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TimeWarp.prototype, "closedPositionTop", {
        get: function () {
            return this.closedRadius + 16;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TimeWarp.prototype, "closedRadius", {
        get: function () {
            return 28;
        },
        enumerable: true,
        configurable: true
    });
    TimeWarp.prototype.touchDown = function (event) {
        this.lastTouchDist = 0;
        this.lastTouchDist = this.touchDistFromTouches(event.touches);
        this.down(this.centerCoordFromTouches(event.touches));
    };
    TimeWarp.prototype.down = function (coord, forceMove) {
        var _this = this;
        if (forceMove === void 0) { forceMove = false; }
        var offset = $('#map').offset();
        var mouseDownCoords = [coord[0] - offset.left, coord[1] - offset.top];
        var dist = Math.sqrt(Math.pow(this.position[0] - mouseDownCoords[0], 2) + Math.pow(this.position[1] - mouseDownCoords[1], 2));
        if (this.position && this.mode == TimeWarpModes.CIRCLE) {
            if (dist < (this.radius + 8) && dist > (this.radius - 8) && !forceMove) {
                this.dragMode = TimeWarpDragModes.CIRCLE_RADIUS;
                this.radiusDisplace = this.radius - dist;
            }
            else if (dist < this.radius) {
                this.dragMode = TimeWarpDragModes.CIRCLE_MOVE;
                this.mouseDisplace = [this.position[0] - mouseDownCoords[0], this.position[1] - mouseDownCoords[1]];
                if (!this.intervalHandle)
                    this.intervalHandle = setInterval(function () { return _this.pan(); }, 1000 / 60);
                this.panCounter = 0;
            }
            else
                this.dragMode = TimeWarpDragModes.NONE;
        }
        else if (this.position && this.mode == TimeWarpModes.SPLIT) {
            var displace = this.rectX - mouseDownCoords[0];
            if (Math.abs(displace) < 8) {
                this.dragMode = TimeWarpDragModes.SPLIT;
                this.mouseDisplace = [displace, 0];
            }
        }
        else
            this.dragMode = TimeWarpDragModes.NONE;
    };
    TimeWarp.prototype.pan = function () {
        var size = App.map.getSize();
        var deltaX = this.position[0] / size[0] - .5;
        var deltaY = this.position[1] / size[1] - .5;
        var dist = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
        if (this.panCounter < 1)
            this.panCounter += .01;
        if (dist < .4)
            return;
        var modifier = 25 * (dist - .4) * this.panCounter;
        App.map.pan(deltaX * modifier, -deltaY * modifier);
    };
    TimeWarp.prototype.pointerDrag = function (event) {
        var newposition = event.originalEvent.type == 'touchmove' ? this.centerCoordFromTouches(event.originalEvent.touches, true) : (event.pixel ? event.pixel : [event.offsetX, event.offsetY]);
        switch (this.dragMode) {
            case TimeWarpDragModes.CIRCLE_RADIUS:
                var dist = Math.sqrt(Math.pow(this.position[0] - newposition[0], 2) + Math.pow(this.position[1] - newposition[1], 2));
                dist += this.radiusDisplace;
                this.radius = dist > this.minRadius ? dist : this.minRadius;
                App.map.preventDrag(event);
                break;
            case TimeWarpDragModes.CIRCLE_MOVE:
                this.position = [newposition[0] + this.mouseDisplace[0], newposition[1] + this.mouseDisplace[1]];
                if (event.originalEvent.type == 'touchmove') {
                    var touchDist = this.touchDistFromTouches(event.originalEvent.touches);
                    this.radius += touchDist - this.lastTouchDist;
                    this.radius = this.radius < this.minRadius ? this.minRadius : this.radius;
                    this.lastTouchDist = touchDist;
                }
                App.map.preventDrag(event);
                break;
            case TimeWarpDragModes.SPLIT:
                this.rectX = newposition[0] + this.mouseDisplace[0];
                this.rectWidth = App.map.getSize()[0] - this.rectX + this.lineWidth / 2.0;
                App.map.preventDrag(event);
                break;
        }
        if (!App.haGeos.updateYears())
            App.map.renderSync();
        TimeWarpButton.updateTimeWarpUI();
        App.map.changeTimeWarp();
    };
    TimeWarp.prototype.centerCoordFromTouches = function (touches, relative) {
        if (relative === void 0) { relative = false; }
        var center = [0, 0];
        var offset = $('#map').offset();
        var count = 0;
        for (var i = 0; i < touches.length; i++) {
            var x = relative ? touches[i].pageX - offset.left : touches[i].pageX;
            var y = relative ? touches[i].pageY - offset.top : touches[i].pageY;
            if (this.dragMode == TimeWarpDragModes.CIRCLE_MOVE || this.dragMode == TimeWarpDragModes.NONE) {
                var dist = Math.sqrt(Math.pow(this.position[0] - x, 2) + Math.pow(this.position[1] - y, 2));
                if (dist > this.radius + 8)
                    continue;
            }
            center[0] += x;
            center[1] += y;
            count++;
        }
        center[0] /= count;
        center[1] /= count;
        return center;
    };
    TimeWarp.prototype.touchDistFromTouches = function (touches) {
        if (touches.length < 2)
            return this.lastTouchDist;
        if (Math.sqrt(Math.pow(this.position[0] - touches[0].pageX, 2) + Math.pow(this.position[1] - touches[0].pageY, 2)) > this.radius + 8)
            return this.lastTouchDist;
        if (Math.sqrt(Math.pow(this.position[0] - touches[1].pageX, 2) + Math.pow(this.position[1] - touches[1].pageY, 2)) > this.radius + 8)
            return this.lastTouchDist;
        return Math.sqrt(Math.pow(touches[0].pageX - touches[1].pageX, 2) + Math.pow(touches[0].pageY - touches[1].pageY, 2));
    };
    TimeWarp.prototype.touchUp = function (event) {
        if (event.touches.length == 0)
            this.up();
        else
            this.touchDown(event);
    };
    TimeWarp.prototype.up = function () {
        clearInterval(this.intervalHandle);
        this.intervalHandle = null;
        this.dragMode = TimeWarpDragModes.NONE;
        TimeWarpButton.updateTimeWarpUI();
    };
    TimeWarp.prototype.bindEvents = function () {
        this.on('precompose', this.precomposeTimeWarp);
        this.on('postcompose', this.postcomposeTimeWarp);
    };
    TimeWarp.prototype.unbindEvents = function () {
        this.un('precompose', this.precomposeTimeWarp);
        this.un('postcompose', this.postcomposeTimeWarp);
    };
    TimeWarp.prototype.getHoverInterface = function (pixel) {
        if (this.mode == TimeWarpModes.SPLIT)
            return Math.abs(this.rectX - pixel[0]) < 8 ? 'ew-resize' : null;
        if (this.mode == TimeWarpModes.CIRCLE) {
            var dist = Math.sqrt(Math.pow(this.position[0] - pixel[0], 2) + Math.pow(this.position[1] - pixel[1], 2));
            if ((dist < (this.radius + 8) && dist > (this.radius - 8)) || this.dragMode == TimeWarpDragModes.CIRCLE_RADIUS) {
                var radiusX = this.position[0] * this.pixelRatio;
                var radiusY = this.position[1] * this.pixelRatio;
                if (pixel[0] < (radiusY + 40) && pixel[1] > (radiusY - 40))
                    return 'ew-resize';
                if (pixel[0] < (radiusX + 40) && pixel[0] > (radiusX - 40))
                    return 'n-resize';
                if (pixel[0] < radiusX && pixel[1] > radiusY)
                    return 'sw-resize';
                if (pixel[0] > radiusX && pixel[1] < radiusY)
                    return 'sw-resize';
                return 'se-resize';
            }
            if (dist < this.radius)
                return 'move';
        }
        return null;
    };
    TimeWarp.prototype.inside = function (coord) {
        var pixel = App.map.getPixelFromCoordinate(coord);
        if (this.mode == TimeWarpModes.SPLIT)
            return this.rectX < pixel[0];
        return Math.sqrt(Math.pow(this.position[0] - pixel[0], 2) + Math.pow(this.position[1] - pixel[1], 2)) < this.radius;
    };
    Object.defineProperty(TimeWarp.prototype, "extent", {
        get: function () {
            var pixel1;
            var pixel2;
            switch (this.mode) {
                case TimeWarpModes.SPLIT:
                    pixel1 = [this.rectX, 0];
                    pixel2 = [this.rectX + this.rectWidth, App.map.getSize()[1]];
                    break;
                case TimeWarpModes.OPENING:
                    pixel1 = [this.positionOpen[0] - this.radiusOpen, this.positionOpen[1] - this.radiusOpen];
                    pixel2 = [this.positionOpen[0] + this.radiusOpen, this.positionOpen[1] + this.radiusOpen];
                    break;
                default:
                    pixel1 = [this.position[0] - this.radius, this.position[1] - this.radius];
                    pixel2 = [this.position[0] + this.radius, this.position[1] + this.radius];
                    break;
            }
            return ol.extent.boundingExtent([App.map.getCoordinateFromPixel(pixel1), App.map.getCoordinateFromPixel(pixel2)]);
        },
        enumerable: true,
        configurable: true
    });
    TimeWarp.pi1div2 = Math.PI * (1 / 2);
    TimeWarp.pi2div2 = Math.PI * (2 / 2);
    TimeWarp.pi3div2 = Math.PI * (3 / 2);
    return TimeWarp;
}(TileLayer));
