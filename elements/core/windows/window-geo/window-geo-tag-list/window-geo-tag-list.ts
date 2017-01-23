@component("window-geo-tag-list")
class WindowGeoTagList extends polymer.Base implements polymer.Element {

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

    addTagTap() {


        this.addingTag = !this.addingTag;
        if (!this.addingTag) {
            App.mainMenu['panel' + this.menu].haGeoServiceAwaitingTagSelect = null;
            return;
        }

        App.mainMenu.drawerOpen = true;
        App.mainMenu['showMenu' + this.menu + 's'] = true;
        App.mainMenu['panel' + this.menu].haGeoServiceAwaitingTagSelect = (<any>this.domHost).$.haGeoService;
        App.toast.show('Vælg fra listen');
    }

    removeTagTap(e) {
        (<HaGeoService>(<any>this.domHost).$.haGeoService).removeTag(e.model.dataHost.dataHost.tag);
    }

    @observe('tags.length')
    tagsLengthChanged() {
        this.addingTag = false;
    }

}

WindowGeoTagList.register();