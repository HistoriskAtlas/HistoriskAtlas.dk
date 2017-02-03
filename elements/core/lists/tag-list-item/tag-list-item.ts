@component("tag-list-item")
class TagListItem extends polymer.Base implements polymer.Element {

    @property({ type: Object })
    public tag: HaTag;

    @property({ type: Boolean })
    public closeable: boolean;

    //@property({ type: Boolean })
    //public dragable: boolean;

    closeTap(e: any) {
        this.fire('close', this.tag);
    }
}

TagListItem.register();