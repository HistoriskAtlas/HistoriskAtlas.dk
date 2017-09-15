@component("subcontent-viewer")
class SubcontentViewer extends polymer.Base implements polymer.Element {

    @property({ type: Boolean })
    public editing: boolean;

    @property({ type: Boolean, value: false })
    public adjustable: boolean;

    @property({ type: String })
    public type: string;

    @property({ type: Object, notify: true })
    public content: HaContent;

    @property({ type: Object, notify: true })
    public subContent: HaSubContent;

    deleteTap() {
        $(this).append(DialogConfirm.create('delete-item', 'Er du sikker på at du vil slette denne ' + this.type + '?'));
    }
    @listen('delete-item-confirmed')
    deleteItemConfirmed(e: any) {
        this.splice('content.subContents', this.content.subContents.indexOf(this.subContent), 1);
        setTimeout(() => this.moveUpOrdering(this.subContent.ordering + 1), 250);
    }
    moveUpOrdering(ordering: number) {
        if (ordering > this.content.subContents.length)
            return;

        var i;
        for (i = 0; i < this.content.subContents.length; i++)
            if (this.content.subContents[i].ordering == ordering)
                break;

        this.set('content.subContents.' + i + '.ordering', ordering - 1);

        setTimeout(() => this.moveUpOrdering(ordering + 1), 250);
    }

    moveUpTap() {
        this.swap(this.subContent.ordering - 1);
    }
    moveDownTap() {
        this.swap(this.subContent.ordering + 1);
    }
    swap(otherOrdering: number) {
        var otherIndex;
        for (otherIndex = 0; otherIndex < this.content.subContents.length; otherIndex++)
            if (this.content.subContents[otherIndex].ordering == otherOrdering)
                break;

        this.set('content.subContents.' + otherIndex + '.ordering', this.subContent.ordering);
        this.set('content.subContents.' + this.content.subContents.indexOf(this.subContent) + '.ordering', otherOrdering);
    }

    @observe('subContent.ordering')
    orderingChanged(e: any) {
        $(this).css('order', this.subContent.ordering);
    }

    showMenu(editing: boolean, adjustable: boolean): boolean {
        return editing && adjustable;
    }

    first(ordering) {
        return ordering == 0;
    }
    last(ordering, length) {
        return ordering == length - 1;
    }
}

SubcontentViewer.register();