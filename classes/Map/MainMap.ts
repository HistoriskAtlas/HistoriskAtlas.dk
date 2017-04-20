class MainMap extends ol.Map {
    private static mouseHover: Object;
    public digDagLayer: DigDagLayer;
    public routeLayer: RouteLayer;
    private curHoverObject: HaRegion | HaGeo | Array<HaGeo> | HaCollection | string;
    private oldHoverObject: HaRegion | HaGeo | Array<HaGeo> | HaCollection | string;
    public curHoverFeature: ol.Feature;
    public backLayer: BackLayer;
    public timeWarp: TimeWarp;
    public hillshade: Hillshade;
    public iconLayer: IconLayer;
    public iconLayerNonClustered: IconLayerNonClustered;
    public popup: ol.Overlay;
    public showPopup: boolean;
    private _HaMap: HaMap;
    private mapmenu: MapMenu;
    private longtitude: number;
    private latitude: number;
    private zoom: number;
    private static maxZoom: number = 19;
    private static minZoom: number = 2;
    public runAnimation: boolean;
    public dom: JQuery;
    private view: ol.View;
    private extentIsDirty: boolean;
    private extentTimeWarpIsDirty: boolean;
    private _moving: boolean;
    private mousePixel: ol.Pixel;
    private dragPan: ol.interaction.DragPan;
    //public static defaultCoord: Array<number> = [10.0, 56.0]; 
    //public static defaultZoom: number = 7; 

    constructor(coord: ol.Coordinate, zoom: number) { //TODO: Create as element instead... so events like change:rotation can fire directly to the DOM
        /*Layers: 
        -1?: DigDagHelper
        0: Back
        1: TimeWarp
        2: Hillshade(?)
        3: IconLayer
        4: NonClustered IconLayer(?)
        5: DigDag
        */
        var view = new ol.View({ center: Common.toMapCoord([coord[1], coord[0]]), zoom: zoom, minZoom: MainMap.minZoom, maxZoom: MainMap.maxZoom });
        var dragPan = new ol.interaction.DragPan();
        super({
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
                //new ol.interaction.KeyboardPan(),
                //new ol.interaction.KeyboardZoom(),
                new ol.interaction.MouseWheelZoom()
                //new ol.interaction.DragZoom()
            ],
            loadTilesWhileAnimating: true,
            loadTilesWhileInteracting: true,
            pixelRatio: 1.0 //TODO: good idea?
        });
        this.dragPan = dragPan;
        this.view = view;
        this.longtitude = 0;
        this.latitude = 0;
        this.zoom = 0;
        this.showPopup = true;
        this.dom = $(document.getElementById('map'))
        this.backLayer = new BackLayer(this, App.global.theme.mapid ? App.global.theme.mapid : Global.defaultTheme.mapid);
        this.addLayer(this.backLayer);

        $(document).ready(() => this.ready());

        //this.timeWarp = new TimeWarp({ source: new ol.source.XYZ({ url: HaMap.getTileUrlFromMapID(timeWarpMapID) }), preload: Infinity }, this, timeWarpMapID);
        //this.iconLayer = new IconLayer();
        //this.addLayer(this.iconLayer);
        //this.mapEvents();

        //this.curHaMap = App.maps()[mapID] //TODO: this instead
        //App.maps.subscribe(() => {
        //    App.maps().forEach((map: HaMap, i: number) => {
        //        if (map.id == mapID)
        //            this.HaMap = map;
        //    })
        //});

    }

    public set draggable(value: boolean) {
        (<any>this.dragPan).setActive(value);
    }

    private ready() {
        this.timeWarp = new TimeWarp(this, HaMaps.initTimeWarpMapId);
        this.hillshade = new Hillshade(this);
        this.addLayer(this.iconLayer = new IconLayer());
        this.addLayer(this.iconLayerNonClustered = new IconLayerNonClustered());

        this.mapEvents();
        //setTimeout(() => this.updateExtent(), 1000);
        //setTimeout(() => this.updateExtentTimeWarp(), 1100);

        setTimeout(() => App.global.set('timeWarpActive', LocalStorage.showTimeWarp), 0); //make sure the timewarp opens if it should (IE workaround).
    }

    public updateExtent() {
        App.haMaps.updateInView(this.view.calculateExtent(this.getSize()));
        this.extentIsDirty = false;
    }
    public updateExtentTimeWarp() {
        App.haMaps.updateInView(this.timeWarp.extent, '.inViewTimeWarp');
        this.extentTimeWarpIsDirty = false;
    }

        //public pointerDrag(event): void {
    //    this.curTimeWarpLayer.pointerdrag(event);
    //}

    //public mouseCursor(event): void {
    //    this.curTimeWarpLayer.mouseCursor(event)
    //}

    //public mouseDown(event): void {
    //    this.curTimeWarpLayer.mouseDown(event);
    //}


    private mapEvents() {
        ////this.mapView.on('click', (event) => { this.mapView.stopAnimation(); });
        //this.on('pointerdrag', (event) => { this.curTimeWarpLayer.pointerDrag(event); });//this.mapView.stopAnimation();
        //this.on('pointermove', (event) => { this.curTimeWarpLayer.mouseCursor(event); this.featuresHighlight(event); this.featuresHighlight(event); }); //this.mapView.setextent(event);
        //this.mapView.mainMapLayer.on('change', (event) => { window.setTimeout(() => { this.mapView.zoomPanMap(event.frameState, this.mapView); }, 250); });
        //this.mapView.getView().on('change:resolution', (event) => { this.mapView.setextent(event); });
        ////this.mapView.on('moveend', (event) => { this.mapView.setextent(event); });

        this.view.on('change:center', (event) => this.change());
        this.view.on('change:resolution', (event) => {
            //if (!App.useClustering) {
            //    IconLayer.updateScale();
            //    IconLayer.updateShown();
            //}
            this.change();
        });
        this.view.on('change:rotation', (event) => {
            App.global.setMapRotation(this.view.getRotation());
        });
        
        //this.view.on('propertychange', (event) => console.debug('change'));
        //this.on('postrender', (event) => console.debug('postrender'));
        this.on('moveend', (event) => {
            this._moving = false;
            if (this.mousePixel)
                this.getHoverObject(this.getCoordinateFromPixel(this.mousePixel), this.mousePixel);
        });

        this.on('pointermove', (event) => {
            var pixel = this.getEventPixel(event.originalEvent);

            //TODO: Only if shown?
            App.mapTooltip.setPosition([pixel[0] + $("#map").offset().left, pixel[1] + 20]);

            if (event.dragging)
                return;

            this.iconLayer.moveEvent(event);
            if (this.routeLayer)
                this.routeLayer.moveEvent(event);
            this.getHoverObject(event.coordinate, pixel);

            if (this.curHoverObject) {

                //if (!this.oldHoverObject)
                //    $("#map").css("cursor", 'pointer');

                if (this.curHoverObject != this.oldHoverObject) {
                    if (typeof (this.curHoverObject) === 'string') {
                        $("#map").css("cursor", (<string>this.curHoverObject));
                        App.mapTooltip.hide();
                        return;
                    }
                    $("#map").css("cursor", 'pointer');
                    if (this.curHoverObject instanceof HaGeo)
                        (<HaGeo>this.curHoverObject).showToolTip(); //TODO: Cancel this, if mapTooltip is hidden......................................
                    //if (this.curHoverObject instanceof Array)
                    //    this.showMultipleGeosToolTip(<Array<HaGeo>>this.curHoverObject);
                    if (this.curHoverObject instanceof HaRegion)
                        App.mapTooltip.setText((<HaRegion>this.curHoverObject).name);
                    //if (this.curHoverObject instanceof HaCollection)
                    //    alert('hover collection')
                }

                return;
            }

            if (!this.curHoverObject && this.oldHoverObject) {
                $("#map").css("cursor", 'default');
                App.mapTooltip.hide();
            }
        });

        this.on('pointerdrag', (event) => {
            this._moving = true; //TODO: Not always so.....................................
            if (this.curHoverObject instanceof HaGeo)
                this.iconLayer.dragEvent(event, <HaGeo>this.curHoverObject);
            if (this.curHoverObject instanceof HaCollection) {
                //var curHoverFeature: ol.Feature;

                //this.forEachFeatureAtPixel(event.pixel, (feature) => {
                //    this.curHoverFeature = feature;
                //    return true;
                //}, null, (layer) => layer == this.routeLayer);

                //if (curHoverFeature)
                //    this.curHoverFeature = curHoverFeature;

                this.routeLayer.dragEvent(event, <HaCollection>this.curHoverObject, this.curHoverFeature);
                //var viaPoint = this.routeLayer.dragEvent(event, <HaCollection>this.curHoverObject, this.curHoverFeature);
                //if (viaPoint)
                //    this.curHoverFeature = viaPoint;
            }
        });

        this.on('click', (event) => {
            var eventPixel = this.getEventPixel(event.originalEvent);
            if (!!('ontouchstart' in window))
                this.getHoverObject(event.coordinate, eventPixel);

            App.mapTooltip.hide();

            if (this.curHoverObject instanceof HaGeo) {
                var geo = <HaGeo>this.curHoverObject;
                if (geo.isMoving) {
                    var geoPixel = this.getPixelFromCoordinate(geo.coord);
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

            if (this.curHoverObject instanceof Array) { //assumes Array<HaGeo>
                var coord: Array<number> = [0, 0]; //avg. center coord
                var geos = <Array<HaGeo>>this.curHoverObject;
                for (var geo of geos) {
                    coord[0] += geo.coord[0];
                    coord[1] += geo.coord[1];
                }
                coord[0] /= geos.length;
                coord[1] /= geos.length;

                var minDist: number = Number.MAX_VALUE;
                var centerGeo: HaGeo; //geo closest to center coord
                for (var geo of geos) {
                    var dist: number = (geo.coord[0] - coord[0]) ** 2 + (geo.coord[1] - coord[1]) ** 2;
                    if (dist < minDist) {
                        minDist = dist;
                        centerGeo = geo;
                    }
                }

                this.centerAnim(centerGeo.coord, this.view.getResolution() / 8, true, false);
                //this.centerAnim(coord, this.view.getResolution() / 8, true, false);
            }

            if (this.curHoverObject instanceof HaCollection)
                App.haCollections.select(<HaCollection>this.curHoverObject, null, true);

            if (this.curHoverObject instanceof HaRegion)
                Common.dom.append(WindowRegion.create(<HaRegion>this.curHoverObject));

        });

        //$(window).mouseup(() => { //TODO: only when accepting end poisition.... in isMoving setter
        //    if (this.curHoverObject instanceof HaGeo) {
        //        var geo = <HaGeo>this.curHoverObject;
        //        if (App.haUsers.user.canEdit(geo))
        //            geo.saveCoords();
        //    }
        //})
    }

    //private showMultipleGeosToolTip(geos: Array<HaGeo>, dotDotDot: string = null) { //TODO: calls the API multiple times while waiting for response..
    //    if (geos.length > 3) {
    //        dotDotDot = ' og ' + (geos.length - 3) + ' andre fortællinger...';
    //        geos = geos.slice(0, 3);
    //    }
    //    var missingTitleGeoIDs: Array<number> = [];
    //    for (var geo of geos)
    //        if (!geo.title)
    //            missingTitleGeoIDs.push(geo.id);

    //    if (missingTitleGeoIDs.length > 1)
    //    {
    //        Services.get('geo',
    //            {
    //                count: '*',
    //                schema: JSON.stringify({
    //                    geo: {
    //                        fields: ['geoid', 'title'],
    //                        filters: [{
    //                            geoid: missingTitleGeoIDs
    //                        }]
    //                    }
    //                })
    //            },
    //            (result) => {
    //                for (var data of result.data)
    //                    App.haGeos.geos[data.geoid].title = data.title;
    //                this.showMultipleGeosToolTip(geos, dotDotDot);
    //            }
    //        );
    //        return;
    //    }

    //    var titles: Array<string> = [];
    //    for (var geo of geos)
    //        titles.push(geo.title);

    //    App.mapTooltip.setText(titles.join(', ') + (dotDotDot ? dotDotDot : ''));
    //}

    private change() {
        if (!this.extentIsDirty) {
            this.extentIsDirty = true;
            setTimeout(() => this.updateExtent(), 1000);
        }
        this.changeTimeWarp();
        if (this.digDagLayer)
            this.digDagLayer.change();

        if (App.haGeos.firstGeoTour)
            setTimeout(() => App.haGeos.updateFirstGeoTour(), 500);
    }

    public changeTimeWarp() {
        if (!this.extentTimeWarpIsDirty) {
            this.extentTimeWarpIsDirty = true;
            setTimeout(() => this.updateExtentTimeWarp(), 1100);
        }
    }

    public get moving() {
        return this._moving;
    }

    public preventDrag(event) {
        event.preventDefault();
        this._moving = false;
    }

    private getHoverObject(coord: ol.Coordinate, pixel: ol.Pixel)
    {
        this.mousePixel = pixel;
        this.oldHoverObject = this.curHoverObject;

        if (this.curHoverObject = this.getHoverHaGeo(pixel))
            return;

        //if (routeLayerVisible)
        if (this.curHoverObject = this.getHoverHaCollection(pixel))
            return;

        var digDagLayerVisible = !!this.digDagLayer;
        if (digDagLayerVisible)
            digDagLayerVisible = this.digDagLayer.isVisible;
        

        if (this.timeWarp.isVisible) {
            this.curHoverObject = this.timeWarp.getHoverInterface(pixel)
            if ((this.curHoverObject != 'move' && this.curHoverObject) || !digDagLayerVisible)
                return;
        }

        if (digDagLayerVisible)
            if (this.digDagLayer.isVisible)
                if ((this.curHoverObject = this.digDagLayer.getRegion(coord)) == DigDagLayer.borderRegion)
                    this.curHoverObject = this.oldHoverObject;
                else
                    var b = 42;

        //this.curHoverObject = null;
    }

    public showDigDagLayer(type: string): void {
        if (this.digDagLayer)
            this.digDagLayer.show(type);
        else
            (<ol.Collection<ol.layer.Base>>this.getLayers()).insertAt(4, this.digDagLayer = new DigDagLayer(type, App.timeline.year));
    }
    public hideDigDagLayer(): void {
        if (this.digDagLayer)
            this.digDagLayer.hide();
    }

    public showRouteLayer(): void {
        if (!this.routeLayer)
            (<ol.Collection<ol.layer.Base>>this.getLayers()).insertAt(3, this.routeLayer = new RouteLayer());
        //else
        //    this.routeLayer..... //todo
    }

    public setextent(event): void {
        this.backLayer.setExtent(this.getView().calculateExtent(this.getSize()));
    }

    public getHoverHaCollection(pixel: ol.Pixel): HaCollection {
        var collection: HaCollection = null;
        this.forEachFeatureAtPixel(pixel, (feature) => {
            collection = (<any>feature).collection;
            this.curHoverFeature = feature;
            return true;
        }, null, (layer) => layer == this.routeLayer);
        return collection;
    }


    public getHoverHaGeo(pixel: ol.Pixel): HaGeo | Array<HaGeo> {
        var icons: Array<Icon> = [];
        this.forEachFeatureAtPixel(pixel, (feature) => {
            //icons = <Icon[]>feature.get('features');
            //icons = App.useClustering ? <Icon[]>feature.get('features') : [<Icon>feature]; //TODO: do without array
            icons = feature instanceof Icon ? [<Icon>feature] : <Icon[]>feature.get('features');
            return true;
        }, null, (layer) => layer == this.iconLayer || layer == this.iconLayerNonClustered);

        if (!icons)
            return null;

        if (icons.length == 0)
            return null;

        if (icons.length == 1)
            return icons[0].geo;

        var geos: Array<HaGeo> = [];
        for (var icon of icons)
            geos.push(icon.geo)
        return geos;

        //return null;
    }

    get HaMap(): HaMap {
        return this.backLayer.HaMap;
    }

    set HaMap(map: HaMap) {
        if (!map.inView && this.backLayer.HaMap && map.minLat)
            this.centerAnim([(map.minLon + map.maxLon) / 2, (map.minLat + map.maxLat) / 2], Math.max(map.maxLon - map.minLon, map.maxLat - map.minLat) / 2, true);
        
        this.backLayer.HaMap = map;
    }

    //private geoHover(icon: Icon) {
    //    if (this.showPopup == true) {
    //        //this.initiateGeoHover();
    //        this.addOverlay(this.popup);
    //        var coordinates = icon.getGeometry().getCoordinates();
    //        var lonlat = ol.proj.transform(coordinates, 'EPSG:3857', 'EPSG:4326');
    //        var pos = ol.proj.transform([lonlat[0], lonlat[1]], 'EPSG:4326', 'EPSG:3857')
    //        this.popup.setPosition(pos);
    //        this.popup.setPositioning('center-center');
    //        this.popup.setOffset([0, -25]);
    //        this.geoHoverTextModel = new geoHoverTextModel(icon.geo._title);
    //        $('#popup').hide().fadeIn(250);
    //        this.showPopup = false;
    //    }
    //}

    //public initiateGeoHover() {
    //    $('<p id="popup" class="ol-popup" data-bind="text: geoTitle"></p>').appendTo('body');
    //    this.popup = new ol.Overlay({
    //        element: document.getElementById('popup')
    //    });
    //    var pos = ol.proj.transform([10.0, 56.0], 'EPSG:4326', 'EPSG:3857')
    //    this.popup.setPosition(pos);
    //    this.popup.setPositioning('center-center');
    //}

    public zoomPanMap(frameState, map) {
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

        this.beforeRender((map, frameState) => {
            pan(this, frameState);
            zoomAnimation(this, frameState);
            return this.runAnimation;
        });

        this._moving = true;
        this.view.setCenter(center);
        this.view.setZoom(this.zoom);
    }

    public stopAnimation() {
        this.runAnimation = false;
        //Zoom & Center skal sættes til det punkt, hvor animationen stoppes! 
        //getZoom & getCenter kan ikke bruges, da de ikke returnerer nuværende zoom & center

        //var view = this.getView();
        //var zoom = 
        //var center = 
        //view.setZoom(zoom);
        //view.setCenter(center);
    }

    public zoomAnim(delta: number) {
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
    }

    public pan(deltaX: number, deltaY: number) {
        var center = this.view.getCenter();
        this.view.setCenter([center[0] + deltaX * this.view.getResolution(), center[1] + deltaY * this.view.getResolution()]);
    }

    public centerAnim(coord: ol.Coordinate, radiusOrResoultionValue: number, inMapCoords: boolean = false, valueIsRadius = true) {
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
        (<any>this).beforeRender(pan, zoom);

        this.center(coord, radiusOrResoultionValue, inMapCoords, valueIsRadius, false);
        
        setTimeout(() => { this.updateExtent(); this.updateExtentTimeWarp(); }, 2100);
    }

    public center(coord: ol.Coordinate, radiusOrResoultionValue: number, inMapCoords: boolean = false, valueIsRadius = true, updateExtent = true) {
        coord = inMapCoords ? coord : Common.toMapCoord(coord);
        this.view.setCenter(coord);
        this.view.setResolution(valueIsRadius ? this.view.constrainResolution(Math.max(radiusOrResoultionValue * 2, 100) / Math.min(this.getSize()[0], this.getSize()[1])) : radiusOrResoultionValue);
        if (updateExtent) {
            //this.renderSync();
            this.updateExtent();
        }
    }

    public static getResolutionFromZoom(zoom: number): number {
        var size = App.map.getSize();
        return ((800 / (size[0] > size[1] ? size[1] : size[0])) * 800 * 256) / Math.pow(2, zoom);
    }

    public toggleRotation() {
        (<any>this).beforeRender(ol.animation.rotate({
            rotation: this.view.getRotation()
        }));
        this.view.setRotation(0);
    }

    public saveAsPng() {

        //polyfill for IE and Safari
        if (!HTMLCanvasElement.prototype.toBlob) {
            Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
                value: function (callback, type, quality) {

                    var binStr = atob(this.toDataURL(type, quality).split(',')[1]),
                        len = binStr.length,
                        arr = new Uint8Array(len);

                    for (var i = 0; i < len; i++) {
                        arr[i] = binStr.charCodeAt(i);
                    }

                    callback(new Blob([arr], { type: type || 'image/png' }));
                }
            });
        }

        this.once('postcompose', (event: any) => {
            var canvas = event.context.canvas;

            //TODO: Draw logo first?................................................

            var toBlob = canvas.msToBlob ? canvas.msToBlob : canvas.toBlob;
            canvas.toBlob((blob) => Common.saveBlob(blob, "HistoriskAtlas.dk_kortudsnit.png"));            
        });
        this.renderSync();
    }
}