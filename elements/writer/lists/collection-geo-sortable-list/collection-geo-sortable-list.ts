@component("collection-geo-sortable-list")
class CollectionGeoSortableList extends polymer.Base implements polymer.Element {

    @property({ type: Array, notify: true })
    public items: Array<HaCollectionGeo>;
}

CollectionGeoSortableList.register();