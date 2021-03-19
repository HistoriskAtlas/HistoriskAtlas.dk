class IconLayer extends IconLayerBase {
    public static clusterSource: ol.source.Cluster;
    //public static backStyle: ol.style.Style;
    public static backStyles: Array<ol.style.Style>;
    //public static ugcBackStyle: ol.style.Style;
    public static ugcBackStyles: Array<ol.style.Style>;
    //public static mixedBackStyle: ol.style.Style;
    public static mixedBackStyles: Array<ol.style.Style>;
    //public static iconBackStyle: ol.style.Style;
    public static source: ol.source.Vector; //TODO: Make non static?
    public static iconsShown: Array<Icon> = [];
    private static iconsSmall: Array<Icon> = [];
    public static feature: ol.Feature;

    public static updateDisabled: boolean;

    private static backCanvas: Array<HTMLCanvasElement>;
    private static ugcBackCanvas: Array<HTMLCanvasElement>;
    private static mixedBackCanvas: Array<HTMLCanvasElement>;

    //private oldDragCoordinate: ol.Coordinate;
    //private dragDirtyGeo: HaGeo;

    //private pixelImageData: ImageData;

    
    constructor() {
        IconLayer.updateDisabled = false;
        IconLayer.source = new ol.source.Vector();

        IconLayer.backCanvas = [];
        IconLayer.ugcBackCanvas = [];
        IconLayer.mixedBackCanvas = [];

        //if (App.useClustering)
            IconLayer.clusterSource = new ol.source.Cluster({
                distance: 40, /*Was 50*/
                //geometryFunction: this.clusterFunction,
                source: IconLayer.source,
            });

        //var canvas = document.createElement('canvas');
        //canvas.width = 32;
        //canvas.height = 32;
        //var context = canvas.getContext("2d");

        //context.arc(16, 16, 15.25, 0, Math.PI * 2);
        //context.strokeStyle = '#ffffff';
        //context.fillStyle = '#005d9a';
        //context.lineWidth = 1.5;
        //context.fill();
        //context.stroke();

        //IconLayer.backStyle = new ol.style.Style({
        //    image: new ol.style.Icon({
        //        src: canvas.toDataURL()
        //    })
        //    //image: new ol.style.Circle(({
        //    //    radius: 16,
        //    //    stroke: new ol.style.Stroke({
        //    //        color: '#ffffff',
        //    //        width: 1.5
        //    //    }),
        //    //    fill: new ol.style.Fill({
        //    //        color: '#005d9a'
        //    //    }),
        //    //    snapToPixel: false
        //    //}))
        //});


        //var canvas = IconLayer.circleCanvas(false);
        //IconLayer.ugcBackStyle = new ol.style.Style({
        //    image: new ol.style.Icon({
        //        src: canvas.toDataURL()
        //    })
        //    //image: new ol.style.Circle(({
        //    //    radius: 16,
        //    //    stroke: new ol.style.Stroke({
        //    //        color: '#005d9a',
        //    //        width: 1.5
        //    //    }),
        //    //    fill: new ol.style.Fill({
        //    //        color: '#ffffff'
        //    //    }),
        //    //    snapToPixel: false
        //    //}))
        //});

        //var ugcCanvas = IconLayer.circleCanvas(true);
        //IconLayer.ugcBackStyle = new ol.style.Style({
        //    image: new ol.style.Icon({
        //        src: ugcCanvas.toDataURL()
        //    })
        //});

        //context = canvas.getContext('2d');
        //context.clearRect(0, 0, canvas.width, canvas.height / 2);
        //context.drawImage(ugcCanvas, 0, 0, canvas.width, canvas.height / 2, 0, 0, canvas.width, canvas.height / 2);
        //IconLayer.mixedBackStyle = new ol.style.Style({
        //    image: new ol.style.Icon({
        //        src: canvas.toDataURL()
        //    })
        //});

        super(IconLayer.clusterSource, (feature, resolution) => {
            var icons = <Icon[]>feature.get('features');
            if (icons.length > 1)
                return this.getMultipleStyle(icons);

            //icons[0].loadImage();
            return icons[0].getStyle();
        }, false)

        //if (!App.useClustering)
        //    this.on('precompose', (event: any) => {
        //        var context: CanvasRenderingContext2D = event.context;

        //        //if (!this.pixelImageData) {
        //        //    this.pixelImageData = context.createImageData(1, 1);
        //        //    var data = this.pixelImageData.data;
        //        //    data[0] = 0;
        //        //    data[1] = 93;
        //        //    data[2] = 154;
        //        //    data[3] = 1;
        //        //}

        //        context.fillStyle = "rgba(0,93,154,1)";
        //        IconLayer.iconsSmall.forEach((icon: Icon) => { //TODO: only thoose in view?
        //            var pixel = App.map.getPixelFromCoordinate(icon.coord3857);
        //            //context.fillStyle = "rgba(255,255,255,1)";
        //            //context.fillRect(pixel[0], pixel[1]-1, 1, 1);
        //            //context.fillStyle = "rgba(0,93,154,1)";
        //            context.fillRect(pixel[0] - icon.scale * 4, pixel[1] - 1 - icon.scale * 12, 1 + icon.scale * 8, 2 + icon.scale * 12); //TODO: precalc?
        //            //context.putImageData(this.pixelImageData, pixel[0], pixel[1]);
        //        }) 
            

        //    });


        IconLayer.backStyles = [];
        IconLayer.ugcBackStyles = [];
        IconLayer.mixedBackStyles = [];

        if (IconLayer.iconsShown)
            IconLayer.updateShown();
    }

    //private clusterFunction(icon: Icon) {
    //    return icon.geo.isMoving ? null : icon.getGeometry();
    //}

    private getMultipleStyle(icons: Array<Icon>): ol.style.Style{
        var ugcCount: number = 0;
        var proCount: number = 0;
        var opacity = .5;
        for (var icon of icons) {
            if (icon.geo.isUGC)
                ugcCount++;
            else
                proCount++;
            if (icon.geo.online)
                opacity = 1;
        }

        if (ugcCount && proCount) {
            var i = `${ugcCount}-${proCount}-${opacity}`; //ugcCount * 1000000 + proCount
            if (IconLayer.mixedBackStyles[i])
                return IconLayer.mixedBackStyles[i];

            var canvas = IconLayer.circleCanvasMixed(ugcCount + proCount)
            var context = canvas.getContext('2d');
            context.font = "10px Roboto";
            context.textAlign = 'center';
            context.fillStyle = '#005d9a';
            context.fillText('' + ugcCount, canvas.width / 2, canvas.width / 2 - 2);
            context.fillStyle = '#ffffff';
            context.fillText('' + proCount, canvas.width / 2, canvas.width / 2 + 9);
            IconLayer.mixedBackStyles[i] = new ol.style.Style({
                image: new ol.style.Icon({
                    src: canvas.toDataURL(),
                    opacity: opacity
                })
            });       

            return IconLayer.mixedBackStyles[i];
        }


        var ugc = !!ugcCount
        var styles = ugc ? IconLayer.ugcBackStyles : IconLayer.backStyles;
        var count = ugc ? ugcCount : proCount;
        var i = `${count}-${opacity}`;
        if (styles[i])
            return styles[i];

        var canvas = IconLayer.circleCanvas(ugc, count);
        var context = canvas.getContext('2d');
        context.font = "12px Roboto";
        context.fillStyle = ugc ? '#005d9a' : '#ffffff';
        context.textAlign = 'center';
        context.fillText('' + count, canvas.width / 2, canvas.width / 2 + 4);

        styles[i] =  new ol.style.Style({
            image: new ol.style.Icon({
                src: canvas.toDataURL(),
                opacity: opacity
            })
        });       

        return styles[i];

        //var style = [
        //    new ol.style.Style({
        //        image: new ol.style.Icon({
        //            anchor: [0.4, 1.05],
        //            src: icons[1].marker,
        //            opacity: icons[1].geo.online ? 1.0 : 0.5
        //        })
        //    }),
        //    new ol.style.Style({
        //        image: new ol.style.Icon({
        //            anchor: [0.5, 1.0],
        //            src: icons[0].marker,
        //            opacity: icons[0].geo.online ? 1.0 : 0.5
        //        })
        //    })
        //];

        //if (icons.length > 2)
        //    style.unshift(new ol.style.Style({
        //        image: new ol.style.Icon({
        //            anchor: [0.3, 1.1],
        //            src: icons[2].marker,
        //            opacity: icons[2].geo.online ? 1.0 : 0.5
        //        })
        //    }))

        //return style;


        //if (ugcCount && proCount)
        //    return [
        //        IconLayer.mixedBackStyle,
        //        new ol.style.Style({
        //            text: new ol.style.Text({
        //                text: ugcCount.toString(),
        //                font: '10px Roboto',
        //                offsetY: -5,
        //                fill: new ol.style.Fill({
        //                    color: '#005d9a'
        //                })
        //            })
        //        }),
        //        new ol.style.Style({
        //            text: new ol.style.Text({
        //                text: proCount.toString(),
        //                font: '10px Roboto',
        //                offsetY: 6,
        //                fill: new ol.style.Fill({
        //                    color: '#ffffff'
        //                })
        //            })
        //        })
        //    ];

        //return [
        //    ugcCount ? IconLayer.ugcBackStyle : IconLayer.backStyle,
        //    new ol.style.Style({
        //        text: new ol.style.Text({
        //            text: icons.length.toString(),
        //            font: '12px Roboto',
        //            fill: new ol.style.Fill({
        //                color: ugcCount ? '#005d9a' : '#ffffff'
        //            })
        //        })
        //    })
        //];
    }

    //public static updateMinDist() {
    //    this.iconsShown.forEach((icon: Icon) => icon.updateMinDist());
    //}

    //public static updateMinDist() {
    //    //this.geos.forEach((geo: HaGeo) => {
    //    //    geo.icon.updateMinDist(); //TODO: don't
    //    //});


    //    var coords: Array<ol.Coordinate> = [];
    //    IconLayer.iconsShown.forEach((icon: Icon) => {
    //        coords.push(icon.coord3857);
    //    });
    //    var tree = new kdTree<ol.Coordinate>(coords);

    //    IconLayer.iconsShown.forEach((icon: Icon) => {
    //        icon.minDist = tree.searchNearest(icon.coord3857);
    //    });

    //    IconLayer.updateScale(); //TODO: in prev. loop instead?
    //}

    //public static updateScale() {
    //    var res = 1 / (App.map.getView().getResolution() * 40);
    //    var scale;
    //    this.iconsShown.forEach((icon: Icon) => {
    //        scale = Math.min(1, icon.minDist * res);
    //        //icon.small = scale < 0.2;
    //        icon.scale = scale;
    //        (<any>icon.iconStyle).setScale(scale);
    //    });
    //}

    public static updateShown() {
        if (IconLayer.updateDisabled || !this.source)
            return;

        this.source.clear(true);

        //if (!App.useClustering) {
        //    this.iconsSmall = [];

        var show: Array<Icon> = [];

        for (var icon of this.iconsShown)
            if (!icon.geo.isMoving) //TODO: move to iconsShown handling.......
                show.push(icon);


            
                //if (icon.small)
                //    this.iconsSmall.push(icon);
                //else

        //} else
        //this.source.addFeatures(this.iconsShown);
        this.source.addFeatures(show);
    }


    //public static addIcon(geo: HaGeo) {
    //    var icon = new Icon(geo);
    //    return icon;
    //}

    //public static findIcon(geoID: number) {
    //    this.feature = this.source.getFeatureById(geoID);
    //    var icon = (<Icon>this.feature);
    //    return icon;
    //}

    //public static findCoordinates(icon: Icon) {
    //    var coordinates = (<ol.geom.Point>icon.getGeometry()).getCoordinates();
    //    var lonlat = ol.proj.transform(coordinates, 'EPSG:3857', 'EPSG:4326');
    //    return [lonlat[0], lonlat[1]];
    //}

    private static circleCanvas(isUGC: boolean, count: number): HTMLCanvasElement {
        var canvas = document.createElement('canvas');
        canvas.width = this.sizeFromCount(count);
        canvas.height = canvas.width;
        var context = canvas.getContext("2d");

        var cachedCanvas = isUGC ? this.ugcBackCanvas[canvas.width] : this.backCanvas[canvas.width];
        if (!cachedCanvas) {
            cachedCanvas = document.createElement('canvas');
            cachedCanvas.width = canvas.width;
            cachedCanvas.height = cachedCanvas.width;
            var cachedContext = cachedCanvas.getContext("2d");
            cachedContext.arc(canvas.width / 2, canvas.width / 2, canvas.width / 2 - .75, 0, Math.PI * 2);
            cachedContext.strokeStyle = isUGC ? '#005d9a' : '#ffffff';
            cachedContext.fillStyle = isUGC ? '#ffffff' : '#005d9a';
            cachedContext.lineWidth = 1.5;
            cachedContext.fill();
            cachedContext.stroke();
            if (isUGC)
                this.ugcBackCanvas[canvas.width] = cachedCanvas;
            else
                this.backCanvas[canvas.width] = cachedCanvas;
        }

        context.drawImage(cachedCanvas, 0, 0);

        return canvas;
    }

    private static circleCanvasMixed(count: number): HTMLCanvasElement {
        var canvas = document.createElement('canvas');
        canvas.width = this.sizeFromCount(count); //was 32;
        canvas.height = canvas.width;
        var context = canvas.getContext("2d");

        var mixedBackCanvas = this.mixedBackCanvas[canvas.width];
        if (!mixedBackCanvas) {
            mixedBackCanvas = IconLayer.circleCanvas(false, count);
            var ugcCanvas = IconLayer.circleCanvas(true, count);

            var mixedBackContext = mixedBackCanvas.getContext('2d');
            mixedBackContext.clearRect(0, 0, mixedBackCanvas.width, mixedBackCanvas.height / 2);
            mixedBackContext.drawImage(ugcCanvas, 0, 0, mixedBackCanvas.width, mixedBackCanvas.height / 2, 0, 0, mixedBackCanvas.width, mixedBackCanvas.height / 2);
            this.mixedBackCanvas[canvas.width] = mixedBackCanvas;
        }
        
        context.drawImage(this.mixedBackCanvas[canvas.width], 0, 0);
        return canvas;
    }

    private static sizeFromCount(count: number): number {
        return Math.max(25 + count.toString().length * 3, 32);
    }

}
