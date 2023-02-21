@component("horizontal-tag-list")
class HorizontalTagList extends polymer.Base implements polymer.Element {

    @property({ type: String })
    public title: string;

    @property({ type: String })
    public menu: string;

    @property({ type: Array })
    public tags: Array<HaTag>;

    @property({ type: Boolean })
    public editing: boolean;

    @property({ type: Object, value: {} })
    public localPrimaryTag: HaTag;

    //@property({ type: Boolean, value: false })
    //public addingTag: boolean;

    @property({ type: Object })
    public tagsService: Tags | HaGeoService;

    addTagTap() {
        //this.addingTag = !this.addingTag;

        //if (!this.addingTag) {
        //    (<PanelTag>App.mainMenu['panel' + this.menu]).tagsServiceAwaitingTagSelect = null;
        //    return;
        //}

        //App.mainMenu.drawerOpen = true;
        //App.mainMenu['showMenu' + this.menu + 's'] = true;
        //(<PanelTag>App.mainMenu['panel' + this.menu]).tagsServiceAwaitingTagSelect = this.tagsService;

        var tagCategory = this.menu == 'Subject' ? 9 : 10;

        var tags = [];
        for (var tag of App.haTags.tags)
            if (tag.category == tagCategory && this.tags.indexOf(tag) == -1)
                tags.push(tag);

        tags.sort((t1: HaTag, t2: HaTag) => t1.singName.localeCompare(t2.singName));

        Common.dom.append(DialogTagSelection.create(`Vælg ${this.menu == 'Subject' ? 'emne' : 'periode'}`, tags, (tag: HaTag) => {
            this.tagsService.addTag(tag, true, true);
        }));


        App.toast.show('Vælg fra listen');
    }

    removeTagTap(e) {
        this.tagsService.removeTag(this.$.tagRepeater.itemForElement(e.target));
    }
    togglePrimaryTagTap(e) {
        var tag = <HaTag>this.$.tagRepeater.itemForElement(e.target);
        tag = this.primary(tag) ? null : tag;
        (<HaGeoService>this.tagsService).setPrimaryTag(tag);
        this.set('localPrimaryTag', tag);
    }

    showSetPrimaryTag(): boolean {
        return this.tagsService instanceof HaGeoService;
    }

    primary(tag): boolean {
        if (!(this.tagsService instanceof HaGeoService))
            return false;

        if (!(<HaGeoService>this.tagsService).geo.primaryTagStatic)
            return false;

        return (<HaGeoService>this.tagsService).geo.primaryTag == tag;
    }

    togglePrimaryText(tag): string {
        return (this.primary(tag) ? 'Frav' : 'V') + 'ælg som primær';
    }

    tagClass(editing: boolean): string {
        return `tag${editing ? ' editing' : ''}`;
    }

    hideTitle(tagsLength: number, editing: boolean): boolean {
        //if (!tags)
        //    return true;
        return tagsLength == 0 && !editing;
    }

    //@observe('tags.length')
    //tagsLengthChanged() {
    //    this.addingTag = false;
    //}

}

HorizontalTagList.register();