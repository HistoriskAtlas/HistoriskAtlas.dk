class IconLayerBase extends ol.layer.Vector {
    //private source: ol.source.Vector; //TODO: Make non static?
    private oldDragCoordinate: ol.Coordinate;

    constructor(source: ol.source.Vector, style: ol.style.StyleFunction) {
        //this.source = source;

        super({
            source: source,
            style: style,
            updateWhileAnimating: false, //Performance? Maybe disable on mobile or dynamically according to fps
            updateWhileInteracting: true,
            renderBuffer: 48, //Icon height
            renderOrder: (feauture1: any, feauture2: any) => {
                var coord1 = feauture1.getGeometry().getCoordinates();
                var coord2 = feauture2.getGeometry().getCoordinates();
                return coord2[1] - coord1[1];
            }
            //} : (icon1: Icon, icon2: Icon) => {
            //    return icon2.coord3857[1] - icon1.coord3857[1]
            //}
        })
    }

    public moveEvent(event: ol.MapBrowserEvent) {
        this.oldDragCoordinate = null;
    }

    public dragEvent(event: ol.MapBrowserEvent, geo: HaGeo) {
        if (!App.haUsers.user.canEdit(geo))
            return;

        if (!this.oldDragCoordinate) {
            this.oldDragCoordinate = event.coordinate
            return;
        }

        //if (this.dragDirtyGeo && this.dragDirtyGeo != geo) //TODO: alert?
        //    return;

        //this.dragDirtyGeo = geo;

        var deltaX = event.coordinate[0] - this.oldDragCoordinate[0];
        var deltaY = event.coordinate[1] - this.oldDragCoordinate[1];
        geo.translateCoord(deltaX, deltaY)
        this.oldDragCoordinate = event.coordinate

        //var pixel = App.map.getPixelFromCoordinate(geo.coord3857);
        //App.mapYesNo.left = pixel[0];
        //App.mapYesNo.top = pixel[1];

        App.map.preventDrag(event);
    }

    public set visible(val: boolean) {
        (<any>this).o(val); // o = setVisible
    }
}
