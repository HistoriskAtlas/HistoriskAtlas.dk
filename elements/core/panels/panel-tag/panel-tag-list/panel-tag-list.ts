@component("panel-tag-list")
class PanelTagList extends polymer.Base implements polymer.Element {

    @property({ type: Array, notify: true })
    public tags: Array<HaTag>;

    @property({ type: Number })
    public tagCategory: number;

    @property({ type: Array, notify: true })
    public tagTops: Array<HaTag>;

    @property({ type: String })
    public title: string;


    public includeTag(tag: HaTag): boolean {
        return tag.isTop && tag.category == this.tagCategory;
    }

    private sortFunction(tagCategory: number): string {
        return tagCategory == 9 ? 'sortByPlurName' : 'sortByYear';
    }

    public hideArrow(tag: HaTag): string {
        return tag.hasChildren ? '' : 'visibility:hidden';
    }

    public sortByPlurName(tag1: HaTag, tag2: HaTag) {
        return tag1.plurName.localeCompare(tag2.plurName);
    }

    public sortByYear(tag1: HaTag, tag2: HaTag) {
        return tag1.yearStart - tag2.yearStart;
    }

    tagTap(e: any) {
        if (this._tagTap(e.model.tag))
            return;

        e.model.set('tag.selected', !e.model.tag.selected);
    }

    subTagTap(e: any) {
        if (this._tagTap(e.model.subTag))
            return;

        e.model.set('subTag.selected', !e.model.subTag.selected);
    }

    private _tagTap(tag: HaTag): boolean {
        var tagsServiceAwaitingTagSelect = (<PanelTag>App.mainMenu['panelTag']).tagsServiceAwaitingTagSelect;

        if (tagsServiceAwaitingTagSelect) {
            if (tagsServiceAwaitingTagSelect.addTag(tag, true, true))
                tagsServiceAwaitingTagSelect = null;
            else
                App.toast.show('"' + tag.plurName + '" er allerede tilføjet. Vælg en anden.')
            return true;
        }

        return false;
    }

    cancel(e: any) {
        e.cancelBubble = true;
        e.stopPropagation();
    }

    //@listen("buttonAll.tap")
    //buttonAllTap() {
    //    this.toggle(true);
    //}

    //@listen("buttonNone.tap")
    //buttonNoneTap() {
    //    this.toggle(false);
    //}

    tagTopSelected(tagTops: Array<HaTag>): boolean {
        var tag = tagTops[this.tagCategory];
        return tag ? tag.selected : false;
    }

    toggleTop() {
        this.toggle();
    }

    private toggle() {
        App.haTags.toggleTop(this.tagCategory, !this.tagTopSelected(this.tagTops));
    }

}

PanelTagList.register();