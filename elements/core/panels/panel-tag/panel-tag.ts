@component("panel-tag")
class PanelTag extends polymer.Base implements polymer.Element {

    @property({ type: Array, notify: true })
    public tags: Array<HaTag>;

    @property({ type: Number })
    public tagCategory: number;

    //public isChildOf(subTag: HaTag, tag: HaTag): boolean {
    //    return subTag.isChildOf(tag);
    //}
    public tagsServiceAwaitingTagSelect: Tags;

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
        if (this.tagsServiceAwaitingTagSelect) {
            if (this.tagsServiceAwaitingTagSelect.addTag(tag, true, true))
                this.tagsServiceAwaitingTagSelect = null;
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

    @listen("buttonAll.tap")
    buttonAllTap() {
        this.toggle(true);
    }

    @listen("buttonNone.tap")
    buttonNoneTap() {
        this.toggle(false);
    }

    private toggle(selected: boolean) {
        IconLayer.updateDisabled = true;
        //App.haTags.tags.forEach((tag: HaTag) => {
        //    if (tag.isTop)
        //        if (tag.category == this.tagCategory)
        //            tag.selected = selected;
        //});

        HaTags.tagTop[this.tagCategory].selected = selected;
        IconLayer.updateDisabled = false;
        IconLayer.updateShown();
    }

}

PanelTag.register();