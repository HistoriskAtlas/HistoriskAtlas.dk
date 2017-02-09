@component("panel-route")
class PanelRoute extends polymer.Base implements polymer.Element {

    @property({ type: Boolean, notify: true })
    public drawerOpen: boolean;

    @property({ type: Array, notify: true })
    public collections: Array<HaCollection>;

    @property({ type: Object, notify: true })
    public collection: HaCollection;

    @property({ type: Array })
    public topLevels: Array<ICollectionTopLevel>;

    @property({ type: Boolean})
    public show: boolean;

    @property({ type: Object })
    public user: HAUser;

    private showingUserRouteTopLevel: boolean = false;

    constructor() {
        super();
        this.topLevels = [
            //{ name: 'Mine ruter', shown: false, selected: false, filter: (collection: HaCollection) => collection.userid == App.haUsers.user.id },
            //{ name: 'spacer', shown: false, selected: false, filter: null },
            { name: 'Køreruter', shown: false, selected: false, filter: (collection: HaCollection) => collection.type == 0 },
            { name: 'Cykelruter', shown: false, selected: false, filter: (collection: HaCollection) => collection.type == 1 },
            { name: 'Til fods', shown: false, selected: false, filter: (collection: HaCollection) => collection.type == 2 },
            { name: 'spacer', shown: false, selected: false, filter: null },
            { name: 'Under 10 km', shown: false, selected: false, filter: (collection: HaCollection) => collection.distance < 10000 },
            { name: 'Over 10 km', shown: false, selected: false, filter: (collection: HaCollection) => collection.distance >= 10000 }
        ]
    }

    @observe('show')
    showChanged() {
        if (this.show)
            App.haCollections.getPublishedCollections();
    }

    @observe('user')
    userChanged() {
        if (!this.user.isDefault && !this.showingUserRouteTopLevel) {
            this.unshift('topLevels', { name: 'spacer', shown: false, selected: false, filter: null })
            this.unshift('topLevels', { name: 'Mine ruter', shown: false, selected: false, filter: (collection: HaCollection) => collection.userid == App.haUsers.user.id })
            this.showingUserRouteTopLevel = true;
        }
        if (this.user.isDefault && this.showingUserRouteTopLevel) {
            (<any>this).shift('topLevels');
            (<any>this).shift('topLevels');
            this.showingUserRouteTopLevel = false;
        }
    }

}

PanelRoute.register();