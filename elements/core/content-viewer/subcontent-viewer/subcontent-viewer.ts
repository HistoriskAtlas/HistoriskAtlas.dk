@component("subcontent-viewer")
class SubcontentViewer extends polymer.Base implements polymer.Element {

    @property({ type: Boolean })
    public editing: boolean;

    @property({ type: Boolean, value: false })
    public adjustable: boolean;

    @property({ type: String })
    public type: string;

    @property({ type: Array, notify: true })
    public items: Array<HaSubContent>;

    @property({ type: Object })
    public item: HaSubContent;

    deleteTap() {
        //TODO: Are you sure?...............................................................................

        this.splice('items', this.items.indexOf(this.item), 1);
    }

    showMenu(editing: boolean, adjustable: boolean): boolean {
        return editing && adjustable;
    }
}

SubcontentViewer.register();