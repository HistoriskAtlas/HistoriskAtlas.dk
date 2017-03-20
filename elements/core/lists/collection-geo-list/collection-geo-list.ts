@component("collection-geo-list")
class CollectionGeoList extends polymer.Base implements polymer.Element {

    @property({ type: Array })
    public collectionGeos: Array<HaCollectionGeo>;

    cgTap(e: any) {
        var collection_geo = <HaCollectionGeo>e.model.cg;
        Common.dom.append(WindowGeo.create(collection_geo.geo));
        App.map.centerAnim(collection_geo.geo.coord, 1000, true)
    }

}

CollectionGeoList.register();