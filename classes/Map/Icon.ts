class Icon extends ol.Feature {
    public geo: HaGeo;
    public static defaultMarker: string;
    public static invertedDefaultMarker: string;
    //private coord: ol.Coordinate;
    private point: ol.geom.Point;
    public minDist: number;
    public scale: number;
    //public small: boolean;
    public iconStyle: ol.style.Icon;

    //private static styleCache: any = {};

    constructor(geo: HaGeo, coord4326: ol.Coordinate) {
        //this.coord3857 = Common.toMapCoord([geo.lng, geo.lat]);
        var point = new ol.geom.Point(Common.toMapCoord(coord4326));
        super({
            geometry: point,
            name: geo.title
        })
        this.point = point;
        this.geo = geo;
        geo.icon = this;
        this.setId(this.geo.id); //TODO: what if not sat? ie, newly created.
        this.updateStyle();
    }

    public translateCoord(deltaX: number, deltaY: number) {
        //this.setGeometry(new ol.geom.Point(newCoord));
        (<any>this.point).translate(deltaX, deltaY);
        //this.coord = this.point.getCoordinates();
        //var coord4326 = this.coord4326;
        //this.geo.lat = coord4326[1];
        //this.geo.lng = coord4326[0];
        //App.map.iconLayer.changed();
        //App.map.renderSync();
    }

    public get coord3857(): ol.Coordinate {
        return this.point.getCoordinates();
        //return this.coord;
    }
    public set coord3857(coord: ol.Coordinate) {
        this.point.setCoordinates(coord);
    }

    public get coord4326(): ol.Coordinate {
        return Common.fromMapCoord(this.coord3857);
    }
    public set coord4326(coord: ol.Coordinate) {
        this.coord3857 = Common.toMapCoord(coord);
    }

    //set coord(newCoord: ol.Coordinate) {
    //    this.point.setCoordinates(newCoord);
    //}

    //public highlight(): void {
    //    var old: Icon = IconLayer.higlightedIcon;
    //    IconLayer.higlightedIcon = this;
    //    if (old)
    //        old.update();
    //    this.update();
    //}

    //public lowlight(): void {
    //    IconLayer.higlightedIcon = null;
    //    this.update();
    //}

    public updateStyle(): void {
        //var marker = this.marker;
        //var style: ol.style.Style = Icon.styleCache[marker + '']

        //if (!style) {
        var style = new ol.style.Style({
            image: this.iconStyle = new ol.style.Icon({
                anchor: [0.5, 1.0],
                src: this.marker,
                opacity: this.geo.online || this.geo.isMoving ? 1.0 : 0.5
            })
        });
        //    Icon.styleCache[marker] = style;
        //}

        if (!this.geo.isMoving) {
            this.setStyle(style);
            return;
        }

        var styles: Array<ol.style.Style> = [];
        styles.push(style);
        styles.push(new ol.style.Style({
            image: new ol.style.Icon({
                anchor: [0.5, 0.75],
                src: '../../images/markers/move-marker.png'

            })
        }));

        this.setStyle(styles);
    }

    public updateMinDist() {
        var minDistSquared: number = Number.MAX_VALUE;

        IconLayer.iconsShown.forEach((icon: Icon) => {
            if (icon != this) {

                var distSquared = Math.pow(icon.coord3857[0] - this.coord3857[0], 2) + Math.pow(icon.coord3857[1] - this.coord3857[1], 2);

                if (distSquared < minDistSquared)
                    minDistSquared = distSquared;

                //if ((icon.coord3857[0] - this.coord3857[0]) * App.map.getView().getResolution() < 100 && (icon.coord3857[1] - this.coord3857[1]) * App.map.getView().getResolution() < 100)
                //    scale *= .95;

            }
        })

        this.minDist = Math.sqrt(minDistSquared);
    }

    public get marker(): string {
        //var hasChildrenTag: HaTag;
        //for (var tag of this.geo.tags)
        //    if (tag.marker) {
        //        if (!tag.hasChildren)
        //            return this.geo.isUGC ? tag.invertedMarker : tag.marker;
        //        hasChildrenTag = tag;
        //    }

        //if (hasChildrenTag)
        //    return this.geo.isUGC ? hasChildrenTag.invertedMarker : hasChildrenTag.marker;        
        if (this.geo.isPartOfCurrentCollection)
            return HaTags.numberMarker(App.haCollections.collection.geos.indexOf(this.geo) + 1);

        if (this.geo.primaryTag)
            if (this.geo.primaryTag.marker)
                return this.geo.isUGC ? this.geo.primaryTag.invertedMarker : this.geo.primaryTag.marker

        return this.geo.isUGC ? Icon.invertedDefaultMarker : Icon.defaultMarker;
    }
}
