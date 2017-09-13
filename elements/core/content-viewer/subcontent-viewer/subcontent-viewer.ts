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
        $(this).append(DialogConfirm.create('delete-item', 'Er du sikker på at du vil slette denne ' + this.type + '?'));
    }
    @listen('delete-item-confirmed')
    toggleActiveConfirmed(e: any) {
        this.splice('items', this.items.indexOf(this.item), 1);
    }

    moveUpTap() {
        this.swap(this.item.ordering - 1);
    }
    moveDownTap() {
        this.swap(this.item.ordering + 1);
    }
    swap(otherOrdering: number) {
        var otherIndex;
        for (otherIndex = 0; otherIndex < this.items.length; otherIndex++)
            if (this.items[otherIndex].ordering == otherOrdering)
                break;

        this.set('items.' + otherIndex + '.ordering', this.item.ordering); //SAME..............................................................................................
        this.set('items.' + this.items.indexOf(this.item) + '.ordering', otherOrdering);
    }

    @observe('item.ordering')
    orderingChanged(e: any) {
        $(this).css('order', this.item.ordering);
    }

    showMenu(editing: boolean, adjustable: boolean): boolean {
        return editing && adjustable;
    }

    first(ordering) {
        return ordering == 0;
    }
    last(ordering, length) { //TODO; not working since length is only length of current item type............................................................................................
        return ordering == length - 1;
    }
}

SubcontentViewer.register();