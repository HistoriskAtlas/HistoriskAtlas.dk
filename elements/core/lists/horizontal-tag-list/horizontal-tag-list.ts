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

    @property({ type: Boolean, value: false })
    public addingTag: boolean;

    @property({ type: Object })
    public tagsService: Tags | HaGeoService;

    addTagTap() {
        this.addingTag = !this.addingTag;
        if (!this.addingTag) {
            (<PanelTag>App.mainMenu['panel' + this.menu]).tagsServiceAwaitingTagSelect = null;
            return;
        }

        App.mainMenu.drawerOpen = true;
        App.mainMenu['showMenu' + this.menu + 's'] = true;
        (<PanelTag>App.mainMenu['panel' + this.menu]).tagsServiceAwaitingTagSelect = this.tagsService;
        App.toast.show('Vælg fra listen');
    }

    removeTagTap(e) {
        this.tagsService.removeTag(e.model.dataHost.dataHost.tag);
    }

    @observe('tags.length')
    tagsLengthChanged() {
        this.addingTag = false;
    }

}

HorizontalTagList.register();