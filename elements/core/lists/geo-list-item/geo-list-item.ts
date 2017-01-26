@component("geo-list-item")
class GeoListItem extends polymer.Base implements polymer.Element {

    @property({ type: Object })
    public geo: HaGeo;

    @property({ type: Boolean })
    public closeable: boolean;

    @property({ type: Boolean })
    public dragable: boolean;

    closeTap(e: any) {
        this.fire('close', this.geo);
    }

    //geoTap(e: any) {
    //    var geo = <HaGeo>e.model.geo;
    //    Common.dom.append(WindowGeo.create(geo));
    //    App.map.centerAnim(geo.coord, 1000, true)
    //}

}

GeoListItem.register();