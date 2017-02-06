@component("collection-list-item")
class CollectionListItem extends polymer.Base implements polymer.Element {

    @property({ type: Object })
    public collection: HaTag;

    //@property({ type: Boolean })
    //public closeable: boolean;

    //@property({ type: Boolean })
    //public dragable: boolean;

    //closeTap(e: any) {
    //    this.fire('close', this.tag);
    //}

    public formatDistance(distance: number): string {
        return HaCollection.formatDistance(distance);
    }

}

CollectionListItem.register();