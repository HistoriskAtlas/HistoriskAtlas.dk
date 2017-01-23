class TimelineMap extends ol.Map {
    private view: ol.View;
    private extent: number;
    private curHoverObject: ol.Feature;
    private oldHoverObject: ol.Feature;
    private color: string;
    private fillColor: string;
    private textColor: string;
    private static minYear: number = 1660; //WAS -1000
    private static maxYear: number = 2016;
    private static yearWidth: number = 1000;
    private static offsetY: number = 0; //TODO: not working..... scales with zoom...
    private static sourceTickmark: ol.source.Vector;
    private selectedTickmark: ol.Feature;
    private timeline: TimeLine;
    private lastPixel: ol.Pixel;

    constructor(elem: HTMLElement, timeline: TimeLine) {
        var view = new ol.View({
            center: [timeline.year * TimelineMap.yearWidth, TimelineMap.offsetY],
            zoom: 10,
            minZoom: 6,
            maxZoom: 13,
            extent: [TimelineMap.minYear * TimelineMap.yearWidth, TimelineMap.offsetY, TimelineMap.maxYear * TimelineMap.yearWidth, TimelineMap.offsetY],
            enableRotation: false
        });
        view.on('change:center', (event) => {
            var center = view.getCenter();
            if (center[1] != TimelineMap.offsetY)
                view.setCenter([center[0], TimelineMap.offsetY]);
            if (center[0] < TimelineMap.minYear * TimelineMap.yearWidth)
                view.setCenter([TimelineMap.minYear * TimelineMap.yearWidth, TimelineMap.offsetY]);
            if (center[0] > TimelineMap.maxYear * TimelineMap.yearWidth)
                view.setCenter([TimelineMap.maxYear * TimelineMap.yearWidth, TimelineMap.offsetY]);
        });
        view.on('change:resolution', (event) => {
            timeline.set('zoom', view.getZoom());
        });


        super({
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
            geometry: new (<any>ol.geom.LineString)([[-this.extent, 0], [this.extent, 0]])
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
        })
        this.addLayer(layerLine);

        if (!TimelineMap.sourceTickmark) {
            TimelineMap.sourceTickmark = new ol.source.Vector({
                wrapX: false
            });
            for (var year = TimelineMap.minYear; year <= TimelineMap.maxYear; year++) {
                var tickmark = new ol.Feature({
                    geometry: new ol.geom.Point([year * TimelineMap.yearWidth, 0])
                });
                (<any>tickmark).year = year;

                if (year % 5 != 0)
                    (<any>tickmark).level = 60;
                else
                    if (year % 10 != 0)
                        (<any>tickmark).level = 240;
                    else
                        if (year % 50 != 0)
                            (<any>tickmark).level = 600;
                        else
                            if (year % 100 != 0)
                                (<any>tickmark).level = 2400;
                            else
                                (<any>tickmark).level = 6000;

                TimelineMap.sourceTickmark.addFeature(tickmark);
            }
        }

        var layerTickmark = new ol.layer.Vector({
            source: TimelineMap.sourceTickmark,
            style:(feature: ol.Feature, resolution: number) => {
                if ((<any>feature).level < resolution)
                    return [];

                var radius = (<any>feature).level > 2 * resolution ? 10 : (1 - resolution / (<any>feature).level) * 20;

                if ((<any>feature).year == this.timeline.year)
                    return [];

                return [new ol.style.Style({
                    image: new ol.style.Circle(({
                        radius: radius,
                        stroke: new ol.style.Stroke({
                            color: this.color,
                            width: 1.5
                        }),
                        fill: new ol.style.Fill({
                            color: '#ffffff'
                        }),
                        snapToPixel: false
                    })),
                    text: radius < 10 ? null : new ol.style.Text({
                        text: (<any>feature).year.toString(),
                        offsetY: 18,
                        font: '12px Roboto',
                        fill: new ol.style.Fill({
                            color: this.color
                        })
                    })
                })]
            },
            updateWhileAnimating: true,
            updateWhileInteracting: true
        })

        this.addLayer(layerTickmark);



        var sourceDynamic = new ol.source.Vector();

        this.selectedTickmark = new ol.Feature({
            geometry: new ol.geom.Point([timeline.year * TimelineMap.yearWidth, 0])
        });
        this.selectedTickmark.setStyle(
            (resolution: number) => {
                return [new ol.style.Style({
                    image: new ol.style.Circle(({
                        radius: 18,
                        stroke: new ol.style.Stroke({
                            color: this.color,
                            width: 1.5
                        }),
                        fill: new ol.style.Fill({
                            color: this.fillColor
                        }),
                        snapToPixel: false
                    })),
                    text: new ol.style.Text({
                        text: this.timeline.year.toString(),
                        offsetY: 0,
                        font: '12px Roboto', //Bold?
                        fill: new ol.style.Fill({
                            color: this.textColor
                        })
                    })
                })]
            }
        )
        sourceDynamic.addFeature(this.selectedTickmark);

        var layerDynamic = new ol.layer.Vector({
            source: sourceDynamic,
            updateWhileAnimating: true,
            updateWhileInteracting: true
        })
        this.addLayer(layerDynamic);




        this.on('pointermove', (event) => {
            var pixel = this.getEventPixel(event.originalEvent);

            if (event.dragging)
                return;

            this.getHoverObject(pixel);

            if (this.curHoverObject) {
                $(elem).css('cursor', 'pointer');
            } else
                $(elem).css('cursor', 'ew-resize');

        })

        this.on('click', (event) => {
            //if (!!('ontouchstart' in window))
                this.getHoverObject(this.getEventPixel(event.originalEvent));

            if (this.curHoverObject) { //TODO: And is a "year feature"
                timeline.set('year', (<any>this.curHoverObject).year);
                this.curHoverObject.changed();
            }

        });
    }

    private getHoverObject(pixel: ol.Pixel) {
        this.lastPixel = pixel;
        this.oldHoverObject = this.curHoverObject;

        if (this.curHoverObject = this.getHoverYear(pixel))
            return;
    }

    private getHoverYear(pixel: ol.Pixel): ol.Feature {
        var result: ol.Feature = null;
        this.forEachFeatureAtPixel(pixel, (feature) => {
            if ((<any>feature).year) {
                result = feature;
                return true;
            }
        });
        return result;
    }

    public updateYear() {
        (<ol.geom.Point>this.selectedTickmark.getGeometry()).setCoordinates([this.timeline.year * TimelineMap.yearWidth, 0]);
        this.center();
    }

    public zoom(z: number) {
        if (this.view.getZoom() == z)
            return;

        var anim = ol.animation.zoom({
            resolution: this.view.getResolution(),
            duration: 250,
        });
        (<any>this).beforeRender(anim);

        this.view.setZoom(z);
    }

    public center() {
        var pan = ol.animation.pan({
            source: this.view.getCenter(),
            duration: 500,
            easing: ol.easing.inAndOut
        });
        (<any>this).beforeRender(pan);

        this.view.setCenter([this.timeline.year * TimelineMap.yearWidth, 0]);

        //setTimeout(() => this.getHoverObject(this.lastPixel), 510);
    }
}