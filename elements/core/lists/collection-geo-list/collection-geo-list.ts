@component("collection-geo-list")
class CollectionGeoList extends polymer.Base implements polymer.Element {

    @property({ type: Array })
    public collectionGeos: Array<HaCollectionGeo>;

    cgTap(e: any) {
        var collection_geo = <HaCollectionGeo>e.model.cg;

        if (collection_geo.isViaPoint || (collection_geo.geoIsPlaceholder && (!collection_geo?.geo?.id))) {
            collection_geo.followExternalLink();            
            return;
        }

        //if (!App.haGeos.geos[collection_geo.geo.id])
        //    return;

        Common.dom.append(WindowGeo.create(collection_geo.geo));
        App.map.centerAnim(collection_geo.geo.coord, 1000, true);
    }

}

CollectionGeoList.register();