@component("geo-list")
class GeoList extends polymer.Base implements polymer.Element {

    @property({ type: Array })
    public geos: Array<HaGeo>;

    @property({ type: Array })
    public addresses: Array<Address>;

    @property({ type: String })
    public compareFunction: string;

    geoTap(e: any) {
        var geo = <HaGeo>e.model.geo;
        Common.dom.append(WindowGeo.create(geo));
        App.map.centerAnim(geo.coord, 1000, true)
    }

    public sortByTitle(geo1: HaGeo, geo2: HaGeo) {
        return geo1.title.localeCompare(geo2.title);
    }
}

GeoList.register();