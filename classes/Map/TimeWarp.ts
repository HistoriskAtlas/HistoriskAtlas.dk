enum TimeWarpModes { CIRCLE, MORPH, SPLIT, OPENING, CLOSING_FROM_CIRCLE, CLOSING_FROM_SPLIT };
enum TimeWarpDragModes { NONE, CIRCLE_RADIUS, CIRCLE_MOVE, SPLIT };

class TimeWarp extends TileLayer {
    //private splitIndex: number;
    public radius: number;
    private togglingRadius: number;
    private minRadius: number = 100;
    private lineWidth: number = 6.0;
    public mode: TimeWarpModes = TimeWarpModes.MORPH;
    private morph: number = 0.0;
    private width: number;
    public position: Array<number>;
    private positionOpen: Array<number>;
    private togglingPosition: Array<number>;
    private mouseDisplace: Array<number>;
    private radiusDisplace: number;
    private radiusOpen: number;
    private lastTouchDist: number;
    private rectWidth: number = 2;
    private rectX: number;
    public dragMode: TimeWarpDragModes = TimeWarpDragModes.NONE;
    private x1: number;
    private y1: number;
    private pixelRatio: number
    private mapmenu: MapMenu;
    private timerID: number = 0;

    //private listenerKeyMouseDown: any
    //private listenerKeyMouseUp: any;
    private listenerKeyPointerDrag: any
    private listenerKeyPointerMove: any;

    private static pi1div2: number = Math.PI * (1 / 2); 
    private static pi2div2: number = Math.PI * (2 / 2);
    private static pi3div2: number = Math.PI * (3 / 2);

    private intervalHandle: number;
    private panCounter: number;
    
    constructor(mainMap: MainMap, mapID: number) {
        super(mainMap, mapID ? mapID : HaMaps.initTimeWarpMapId);
        this.bindEvents();
        
        this.setVisible(false);
        this.position = [mainMap.getSize()[0] - this.closedPositionRight, this.closedPositionTop];
        this.radius = this.closedRadius;

        mainMap.addLayer(this);
        this.toggleMode();

        $(window).resize(() => TimeWarpButton.updateTimeWarpUI());

        if (App.haMaps.timeWarpMap)
            this.HaMap = App.haMaps.timeWarpMap;
    }

    public toggle(show: boolean) {
        if (this.getVisible() == show)
            return;

        if (show) {
            this.show(App.map);
        } else {
            this.hide();
            TimeWarpButton.hideTimeWarpUI();
        }

        TimeWarpButton.updateTimeWarpUI();
    }

    public trackOpen(e) {
        if (this.mode == TimeWarpModes.CIRCLE)
            return;

        this.setMode(TimeWarpModes.CIRCLE);

        if (this.timerID)
            clearInterval(this.timerID);
        this.morph = 0.0;
        this.timerID = setInterval(() => {
            this.timerTrackOpen();
        }, 1000 / 60);

        var size = App.map.getSize();
        this.position = [size[0] - this.closedPositionRight, this.closedPositionTop];
        this.radius = this.closedRadius

        this._show(App.map);

        this.down([e.detail.x - e.detail.dx, e.detail.y - e.detail.dy], true);

        this.listenerKeyPointerDrag = App.map.on('pointermove', (event) => { this.pointerDrag(event); });
        App.map.once('pointerup', (event) => { ol.Observable.unByKey(this.listenerKeyPointerMove); });

        //Try to get drag on track working on touch.... didnt work...
        //$('#map').on('mousemove.timewarp', (event) => { this.pointerDrag(event) });
        //App.map.once('pointerup', (event) => { $('#map').off('mousemove.timewarp'); });
    }

    public get isVisible(): boolean {
        return this.getVisible();
    }

    private show(mainMap: MainMap) {
        this.setMode(TimeWarpModes.OPENING);
        var size = mainMap.getSize();
        this.positionOpen = [size[0] / 2, size[1] / 2];
        this.radiusOpen = Math.min(size[0], size[1]) * 0.3;
        if (this.timerID)
            clearInterval(this.timerID);
        this.morph = 0.0;
        this.timerID = setInterval(() => {
            this.timerOpen();
        }, 1000 / 60);
        this.position = [size[0] - this.closedPositionRight, this.closedPositionTop];
        this.radius = this.closedRadius;
        this._show(mainMap);
    }
    private _show(mainMap: MainMap) {
        if (this.HaMap) {
            App.map.updateExtentTimeWarp();
            if (!this.HaMap.inViewTimeWarp) {
                var newMap: HaMap = HaMaps.defaultMap;
                for (var map of App.haMaps.maps)
                    if (map.orgEndYear < newMap.orgEndYear)
                        if (map.inViewTimeWarp)
                            newMap = map;
                App.haMaps.set('timeWarpMap', newMap);
            }
        }

        $('#map').on('touchstart.timewarp', (event) => this.touchDown(<TouchEvent>event.originalEvent));
        $(window).on('touchend.timewarp', (event) => this.touchUp(<TouchEvent>event.originalEvent));
        $('#map').on('mousedown.timewarp', (event) => this.down([event.pageX, event.pageY]));
        $(window).on('mouseup.timewarp', (event) => this.up());
        $('#map').on('touchmove.timewarp', (event) => this.touchMove(event.originalEvent));
        this.listenerKeyPointerDrag = mainMap.on('pointerdrag', (event) => { this.pointerDrag(event); });
        this.setVisible(true);
        this.setOpacity(1);

        App.timeWarpClosed.hide();
        LocalStorage.showTimeWarp = true;
        UrlState.secondaryMapChanged();
    }


    private hide() {
        if (this.mode == TimeWarpModes.SPLIT) {
            this.setMode(TimeWarpModes.CLOSING_FROM_SPLIT);
            var size = App.map.getSize();
            this.togglingPosition = [size[0] / 2, size[1] / 2];
            this.togglingRadius = (Math.min(size[0], size[1]) * 0.3);
        } else {
            this.setMode(TimeWarpModes.CLOSING_FROM_CIRCLE);
            this.togglingPosition = this.position;            
            this.togglingRadius = this.radius;
        }
        if (this.timerID)
            clearInterval(this.timerID);
        this.morph = 1.0;
        this.timerID = setInterval(() => {
            this.timerClose();
        }, 1000 / 60);

        $('#map').off('touchstart.timewarp');
        $('#map').off('touchend.timewarp');
        $('#map').off('mousedown.timewarp');
        $('#map').off('mouseup.timewarp');
        $('#map').off('touchmove.timewarp');
        ol.Observable.unByKey(this.listenerKeyPointerDrag);
        LocalStorage.showTimeWarp = false;
    }

    private precomposeTimeWarp(event): void { //ol.render.Event
        var ctx = <CanvasRenderingContext2D>event.context;
        this.pixelRatio = event.frameState.pixelRatio;
        //ctx.globalCompositeOperation = 'source-over'; //TODO: needed?
        this.applyPath(ctx);
        ctx.save();
        ctx.clip();
    }

    private postcomposeTimeWarp(event): void {
        var ctx = <CanvasRenderingContext2D>event.context;
        ctx.restore();
        this.applyPath(ctx);
        if (this.position) {
            ctx.strokeStyle = '#fece00'; //WAS 005b9c
            ctx.lineWidth = this.lineWidth * this.pixelRatio;
            ctx.stroke();

            if (this.mode == TimeWarpModes.OPENING || this.mode == TimeWarpModes.CLOSING_FROM_CIRCLE || this.mode == TimeWarpModes.CLOSING_FROM_SPLIT) {
                ctx.fillStyle = 'rgba(254,206,0,' + (1 - this.easeFromMorph) + ')';
                ctx.fill();
            }
        }
    }

    private applyPath(ctx: CanvasRenderingContext2D) {
        //TODO: when Path2D object becomes widely supported, used this instead... only needed to update path when changed...
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
        //ctx.closePath(); //TODO: not needed?
    }

    public toggleMode(): void {
        if (this.timerID)
            clearInterval(this.timerID);
        if (this.mode == TimeWarpModes.CIRCLE) {
            //this.morph = 0.0;
            this.setMode(TimeWarpModes.MORPH);
            //this.splitIndex = Math.floor((event.pageX * 2.0) / App.map.getSize()[0]);
            //this.splitIndex = 1;
            this.rectWidth = App.map.getSize()[0] / 2.0 + this.lineWidth / 2.0;
            //this.rectX = this.splitIndex * (App.map.getSize()[0] / 2.0);
            this.rectX = App.map.getSize()[0] / 2.0;
            this.timerID = setInterval(() => {
                this.timerMorphToSplit();
            }, 1000 / 60);
        } else {
            //this.morph = 1.0;
            this.setMode(TimeWarpModes.MORPH);
            this.timerID = setInterval(() => {
                this.timerMorphToCircle();
            }, 1000 / 60);
        }
        TimeWarpButton.updateTimeWarpUI();
    }

    private timerMorphToSplit(): void {
        this.morph += 0.05;
        App.map.render();
        if (this.morph >= 1.0) {
            this.morph = 1.0;
            clearInterval(this.timerID);
            this.timerID = 0;
            this.setMode(TimeWarpModes.SPLIT);
            App.map.renderSync();
            TimeWarpButton.updateTimeWarpUI();
        }
    }

    private timerMorphToCircle(): void {
        this.morph -= 0.05;
        App.map.render();
        if (this.morph <= 0.0) {
            this.morph = 0.0;
            clearInterval(this.timerID);
            this.timerID = 0;
            this.setMode(TimeWarpModes.CIRCLE);
            App.map.renderSync();
            TimeWarpButton.updateTimeWarpUI();
        }
    }

    private timerOpen(): void {
        this.morph += 0.05;
        var ease = this.easeFromMorph;
        var ease2 = 1 - ease;
        var size = App.map.getSize();
        var closedPosition = [size[0] - this.closedPositionRight, this.closedPositionTop];
        //var openPosition = [size[0] / 2, size[1] / 2];
        this.position = [this.positionOpen[0] * ease + closedPosition[0] * ease2, this.positionOpen[1] * ease + closedPosition[1] * ease2];
        //this.radius = (Math.min(size[0], size[1]) * 0.3) * ease + this.closedRadius * ease2;
        this.radius = this.radiusOpen * ease + this.closedRadius * ease2;
        App.map.render();

        if (this.morph >= 1.0) {
            this.morph = 0.0;
            clearInterval(this.timerID);
            this.timerID = 0;
            this.setMode(TimeWarpModes.CIRCLE);
            App.map.renderSync();
            TimeWarpButton.updateTimeWarpUI();
            TimeWarpButton.showTimeWarpUI();
        }
    }

    private timerTrackOpen(): void {
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
    }

    private timerClose(): void {
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
            this.setVisible(false); //TODO: Remove layer instead?
            App.timeWarpClosed.show();
            UrlState.secondaryMapChanged();
        }
    }

    private get easeFromMorph() {
        return this.morph < .5 ? 2 * this.morph * this.morph : -1 + (4 - 2 * this.morph) * this.morph;
    }

    private get closedPositionRight(): number {
        return this.closedRadius + 16;
    }
    private get closedPositionTop(): number {
        return this.closedRadius + 16;
    }
    private get closedRadius(): number {
        return 28; //56 / 2
    }

    public touchDown(event: TouchEvent): void {
        this.lastTouchDist = 0;
        this.lastTouchDist = this.touchDistFromTouches(event.touches);
        this.down(this.centerCoordFromTouches(event.touches));
    }

    public down(coord: Array<number>, forceMove: boolean = false): void {
        var offset: JQueryCoordinates = $('#map').offset()
        var mouseDownCoords = [coord[0] - offset.left, coord[1] - offset.top];
        var dist: number = Math.sqrt(Math.pow(this.position[0] - mouseDownCoords[0], 2) + Math.pow(this.position[1] - mouseDownCoords[1], 2));
        if (this.position && this.mode == TimeWarpModes.CIRCLE) {
            if (dist < (this.radius + 8) && dist > (this.radius - 8) && !forceMove) {
                this.dragMode = TimeWarpDragModes.CIRCLE_RADIUS;
                this.radiusDisplace = this.radius - dist;
            }
            else if (dist < this.radius) {
                this.dragMode = TimeWarpDragModes.CIRCLE_MOVE;
                this.mouseDisplace = [this.position[0] - mouseDownCoords[0], this.position[1] - mouseDownCoords[1]]
                if (!this.intervalHandle)
                    this.intervalHandle = setInterval(() => this.pan(), 1000 / 60);
                this.panCounter = 0;
            }
            else
                this.dragMode = TimeWarpDragModes.NONE;
        }
        else if (this.position && this.mode == TimeWarpModes.SPLIT) {
            //var displace = this.splitIndex == 0 ? this.rectWidth - mouseDownCoords[0] : this.rectX - mouseDownCoords[0];
            var displace = this.rectX - mouseDownCoords[0];
            if (Math.abs(displace) < 8) {
                this.dragMode = TimeWarpDragModes.SPLIT;
                this.mouseDisplace = [displace, 0]
            }
        } else
            this.dragMode = TimeWarpDragModes.NONE;
    }

    private pan() {
        var size: ol.Size = App.map.getSize();
        var deltaX = this.position[0] / size[0] - .5;
        var deltaY = this.position[1] / size[1] - .5;
        var dist = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
        if (this.panCounter < 1)
            this.panCounter += .01;
        if (dist < .4)
            return;

        var modifier = 25 * (dist - .4) * this.panCounter;
        App.map.pan(deltaX * modifier, -deltaY * modifier);
    }

    public pointerDrag(event) {
        //var newposition = event.originalEvent.type == 'touchmove' ? this.centerCoordFromTouches(event.originalEvent.touches, true) : (event.pixel ? event.pixel : [event.offsetX, event.offsetY]);
        var newposition = event.pixel ? event.pixel : [event.offsetX, event.offsetY];
        switch (this.dragMode) {
            case TimeWarpDragModes.CIRCLE_RADIUS:
                var dist: number = Math.sqrt(Math.pow(this.position[0] - newposition[0], 2) + Math.pow(this.position[1] - newposition[1], 2));
                dist += this.radiusDisplace;
                this.radius = dist > this.minRadius ? dist : this.minRadius;
                App.map.preventDrag(event);
                break;
            case TimeWarpDragModes.CIRCLE_MOVE:
                if (event.originalEvent.pointerType != 'touch')
                    this.position = [newposition[0] + this.mouseDisplace[0], newposition[1] + this.mouseDisplace[1]];
                //if (event.originalEvent.type == 'touchmove') {
                //    var touchDist = this.touchDistFromTouches(event.originalEvent.touches);
                //    this.radius += touchDist - this.lastTouchDist;
                //    this.radius = this.radius < this.minRadius ? this.minRadius : this.radius;
                //    this.lastTouchDist = touchDist;
                //}
                App.map.preventDrag(event);
                break;
            case TimeWarpDragModes.SPLIT:
                //if (this.splitIndex == 0) {
                //    this.rectWidth = newposition[0] + this.mouseDisplace[0];
                //}
                //else {
                    this.rectX = newposition[0] + this.mouseDisplace[0];
                    this.rectWidth = App.map.getSize()[0] - this.rectX + this.lineWidth / 2.0;
                //}
                App.map.preventDrag(event);
                break;
        }
        if (!App.haGeos.updateYears()) //TODO: maybe only every 10 frames?
            App.map.renderSync();
        TimeWarpButton.updateTimeWarpUI();
        App.map.changeTimeWarp();
    }

    public touchMove(event) {
        if (this.dragMode != TimeWarpDragModes.CIRCLE_MOVE)
            return;

        var newposition = this.centerCoordFromTouches(event.touches, true);
        this.position = [newposition[0] + this.mouseDisplace[0], newposition[1] + this.mouseDisplace[1]];

        var touchDist = this.touchDistFromTouches(event.touches);
        this.radius += touchDist - this.lastTouchDist;
        this.radius = this.radius < this.minRadius ? this.minRadius : this.radius;
        this.lastTouchDist = touchDist;
    }

    public centerCoordFromTouches(touches: TouchList, relative: boolean = false): Array<number> {
        var center: Array<number> = [0, 0];
        var offset: JQueryCoordinates = $('#map').offset()
        var count = 0;
        for (var i = 0; i < touches.length; i++) {
            var x = relative ? touches[i].pageX - offset.left : touches[i].pageX;
            var y = relative ? touches[i].pageY - offset.top : touches[i].pageY;

            if (this.dragMode == TimeWarpDragModes.CIRCLE_MOVE || this.dragMode == TimeWarpDragModes.NONE) {
                var dist: number = Math.sqrt(Math.pow(this.position[0] - x, 2) + Math.pow(this.position[1] - y, 2));
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
    }

    public touchDistFromTouches(touches: TouchList): number {
        if (touches.length < 2)
            return this.lastTouchDist;

        if (Math.sqrt(Math.pow(this.position[0] - touches[0].pageX, 2) + Math.pow(this.position[1] - touches[0].pageY, 2)) > this.radius + 8)
            return this.lastTouchDist;

        if (Math.sqrt(Math.pow(this.position[0] - touches[1].pageX, 2) + Math.pow(this.position[1] - touches[1].pageY, 2)) > this.radius + 8)
            return this.lastTouchDist;

        return Math.sqrt(Math.pow(touches[0].pageX - touches[1].pageX, 2) + Math.pow(touches[0].pageY - touches[1].pageY, 2));
    }

    private touchUp(event: TouchEvent)
    {
        if(event.touches.length == 0)
            this.up();
        else
            this.touchDown(event);
    }

    public up(): void {
        clearInterval(this.intervalHandle);
        this.intervalHandle = null;
        this.dragMode = TimeWarpDragModes.NONE;
        TimeWarpButton.updateTimeWarpUI();
    }

    private bindEvents() {
        this.on('precompose', this.precomposeTimeWarp);
        this.on('postcompose', this.postcomposeTimeWarp);
    }

    private unbindEvents() {
        this.un('precompose', this.precomposeTimeWarp);
        this.un('postcompose', this.postcomposeTimeWarp);
    }

    //private getMouseCoordinates(event) {
    //    var mouseCoordinates = App.map.getEventPixel(event.originalEvent);
    //    return mouseCoordinates;
    //}

    public getHoverInterface(pixel: ol.Pixel): string {
        //var displace = this.splitIndex == 0 ? Math.abs(this.rectWidth - pixel[0]) : Math.abs(this.rectX - pixel[0]);
        if (this.mode == TimeWarpModes.SPLIT)
            //return (this.splitIndex == 0 ? Math.abs(this.rectWidth - pixel[0]) : Math.abs(this.rectX - pixel[0]) < 8) ? 'ew-resize' : null;
            return Math.abs(this.rectX - pixel[0]) < 8 ? 'ew-resize' : null;

        if (this.mode == TimeWarpModes.CIRCLE) {
            var dist: number = Math.sqrt(Math.pow(this.position[0] - pixel[0], 2) + Math.pow(this.position[1] - pixel[1], 2));
            if ((dist < (this.radius + 8) && dist > (this.radius - 8)) || this.dragMode == TimeWarpDragModes.CIRCLE_RADIUS) {
                var radiusX = this.position[0] * this.pixelRatio;
                var radiusY = this.position[1] * this.pixelRatio;
                if (pixel[0] < (radiusY + 40) && pixel[1] > (radiusY - 40)) return 'ew-resize'; //TODO: not fixed number "40"
                if (pixel[0] < (radiusX + 40) && pixel[0] > (radiusX - 40)) return 'n-resize';
                if (pixel[0] < radiusX && pixel[1] > radiusY) return 'sw-resize';
                if (pixel[0] > radiusX && pixel[1] < radiusY) return 'sw-resize';
                //if (pixel[0] < radiusX && pixel[1] < radiusY) return 'se-resize';
                //if (pixel[0] > radiusX && pixel[1] > radiusY) return 'se-resize';
                return 'se-resize';
            }
            if (dist < this.radius)
                return 'move';
        }

        return null;
    }

    public inside(coord: ol.Coordinate): boolean {
        var pixel = App.map.getPixelFromCoordinate(coord);

        if (this.mode == TimeWarpModes.SPLIT)
            return this.rectX < pixel[0]; //TODO: not tested!

        return Math.sqrt(Math.pow(this.position[0] - pixel[0], 2) + Math.pow(this.position[1] - pixel[1], 2)) < this.radius;
    }

    public get extent(): ol.Extent {
        //var coords: Array<ol.Coordinate> = [];
        var pixel1: Array<number>;
        var pixel2: Array<number>;

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
        //if (this.mode == TimeWarpModes.SPLIT) {
        //    coords.push(App.map.getCoordinateFromPixel([this.rectX, 0]));
        //    coords.push(App.map.getCoordinateFromPixel([this.rectX + this.rectWidth, App.map.getSize()[1]]));
        //} else {
        //    coords.push(App.map.getCoordinateFromPixel([this.position[0] - this.radius, this.position[1] - this.radius]));
        //    coords.push(App.map.getCoordinateFromPixel([this.position[0] + this.radius, this.position[1] + this.radius]));
        //}
        return ol.extent.boundingExtent([App.map.getCoordinateFromPixel(pixel1), App.map.getCoordinateFromPixel(pixel2)]);
    }

    public setMode(mode: TimeWarpModes) {
        this.mode = mode;
        App.global.setTimeWarpMode(mode);
    }

    //public mouseCursor(event) {
    //    var mouseDownCoords = this.getMouseCoordinates(event);
    //    var mouseX = mouseDownCoords[0];
    //    var mouseY = mouseDownCoords[1];
    //    var dist: number = Math.sqrt(Math.pow(this.position[0] - mouseDownCoords[0], 2) + Math.pow(this.position[1] - mouseDownCoords[1], 2));
    //    var displace = this.splitIndex == 0 ? Math.abs(this.rectWidth - mouseDownCoords[0]) : Math.abs(this.rectX - mouseDownCoords[0]);
    //    if (((dist < (this.radius + 8) && dist > (this.radius - 8)) || this.dragMode == 'circleRadius') && this.mode == 'circle') {
    //        var radiusX = this.position[0] * this.pixelRatio;
    //        var radiusY = this.position[1] * this.pixelRatio;
    //        if (mouseY < (radiusY + 40) && mouseY > (radiusY - 40)) { $("#map").css({ "cursor": "ew-resize" }); } //TODO: not fixed number "40"
    //        else if (mouseX < (radiusX + 40) && mouseX > (radiusX - 40)) { $("#map").css({ "cursor": "n-resize" }); }
    //        else if (mouseX < radiusX && mouseY < radiusY) { $("#map").css({ "cursor": "se-resize" }); }
    //        else if (mouseX < radiusX && mouseY > radiusY) {  $("#map").css({ "cursor": "sw-resize" }); } 
    //        else if (mouseX > radiusX && mouseY < radiusY) { $("#map").css({ "cursor": "sw-resize" }); } 
    //        else if (mouseX > radiusX && mouseY > radiusY) { $("#map").css({ "cursor": "se-resize" }); } 
    //    }
    //    else if (this.mode == 'split' && displace < 8) { $("#map").css({ "cursor": "ew-resize" }); }
    //    //else { $("#map").css({ "cursor": "default" }); }     <-TODO: 
    //}
}


