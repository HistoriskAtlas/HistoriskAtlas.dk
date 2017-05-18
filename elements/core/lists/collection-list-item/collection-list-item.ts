@component("collection-list-item")
class CollectionListItem extends polymer.Base implements polymer.Element {

    @property({ type: Object, notify: true })
    public collection: HaCollection;

    @property({ type: Boolean })
    public open: boolean;

    //@property({ type: Boolean })
    //public dragable: boolean;

    //closeTap(e: any) {
    //    this.fire('close', this.tag);
    //}

    public formatDistance(distance: number): string {
        return HaCollection.formatDistance(distance);
    }

    checkboxTap(e: any) {
        this.set('collection.selected', !this.collection.selected);
        e.cancelBubble = true;
        e.stopPropagation();
    }

}

CollectionListItem.register();