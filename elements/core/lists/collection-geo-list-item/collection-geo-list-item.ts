@component("collection-geo-list-item")
class CollectionGeoListItem extends polymer.Base implements polymer.Element {

    @property({ type: Object, notify: true })
    public collectionGeo: HaCollectionGeo;

    @property({ type: Boolean })
    public closeable: boolean;

    @property({ type: Boolean })
    public dragable: boolean;

    closeTap(e: any) {
        this.fire('close', this.collectionGeo);
    }

    //geoTap(e: any) {
    //    var geo = <HaGeo>e.model.geo;
    //    Common.dom.append(WindowGeo.create(geo));
    //    App.map.centerAnim(geo.coord, 1000, true)
    //}

}

CollectionGeoListItem.register();