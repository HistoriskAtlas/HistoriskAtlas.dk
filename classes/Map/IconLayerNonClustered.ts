class IconLayerNonClustered extends IconLayerBase {
    private source: ol.source.Vector;

    private _youAreHerePoint: ol.geom.Point;
    private _youAreHereIcon: ol.Feature;
    private _youAreHereShown: boolean;
    private _watchId: number;

    constructor() {
        var source = new ol.source.Vector();

        super(source, null) //Icon.defaultMarker

        this.source = source;
        this._youAreHereShown = false;
    }

    public addIcon(icon: Icon) {
        this.source.addFeature(icon);
    }

    public removeIcon(icon: Icon) {
        this.source.removeFeature(icon);
    }

    public toggleYouAreHere() {
        if (this._youAreHereShown) {
            this.hideYouAreHere();
            return;
        }

        App.toast.show("Finder din position...");
        navigator.geolocation.getCurrentPosition((pos) => {
            App.toast.show("Din position blev fundet (inden for " + Math.round(pos.coords.accuracy) + " meter).");
            var coord = [pos.coords.longitude, pos.coords.latitude];
            App.map.centerAnim(coord, Math.max(pos.coords.accuracy, 200));
            this.showYouAreHere(coord, pos.coords.accuracy);
        }, (error) => {
            App.toast.show("Din position blev IKKE fundet. Har du husket at give tilladelse til, at vi må bruge din position?");
        });
    }

    private showYouAreHere(coord: ol.Coordinate, accuracy: number) {
        if (this._youAreHereShown)
            return;

        if (!this._youAreHereIcon) {
            this._youAreHereIcon = new ol.Feature(this._youAreHerePoint = new ol.geom.Point(Common.toMapCoord(coord)));
            this._youAreHereIcon.setStyle(new ol.style.Style({
                image: new ol.style.Icon({
                    src: HaTags.crossHairMarker
                })
            }))
        }

        //this.setYouAreHereStyle(accuracy);
        this.source.addFeature(this._youAreHereIcon);
        this._youAreHereShown = true;

        this._watchId = navigator.geolocation.watchPosition((pos) => {
            this._youAreHerePoint.setCoordinates(Common.toMapCoord([pos.coords.longitude, pos.coords.latitude]));
            //this.setYouAreHereStyle(pos.coords.accuracy);
        }, (error) => {
            navigator.geolocation.clearWatch(this._watchId);
            //App.toast.show("Kunne ikke følge ");
        })
    }

    private hideYouAreHere() {
        if (this._youAreHereShown) {
            this.source.removeFeature(this._youAreHereIcon);
            navigator.geolocation.clearWatch(this._watchId);
            this._youAreHereShown = false;
        }
    }

    //private setYouAreHereStyle(accuracy: number) {
    //    this._youAreHereIcon.setStyle((res: number) =>
    //        new ol.style.Style({
    //            image: new ol.style.Icon({
    //                src: HaTags.crossHairMarker,
    //                opacity: Math.min(Math.max((10 - accuracy + 10) / 10, 0.3), 1),
    //                scale: Math.max(accuracy / (res * 50), 1 / window.devicePixelRatio) /*50 = pixel size of bitmap / 2 */
    //            })
    //    }));
    //}
}
