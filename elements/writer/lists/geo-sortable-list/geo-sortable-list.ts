@component("geo-sortable-list")
class GeoSortableList extends polymer.Base implements polymer.Element {

    @property({ type: Array, notify: true })
    public items: Array<HaGeo>;
}

GeoSortableList.register();