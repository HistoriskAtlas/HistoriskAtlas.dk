@component("panel-route")
class PanelRoute extends polymer.Base implements polymer.Element {

    @property({ type: Boolean, notify: true })
    public drawerOpen: boolean;

    @property({ type: Array, notify: true })
    public collections: Array<HaCollection>;

    @property({ type: Array })
    public topLevels: Array<ICollectionTopLevel>;

    constructor() {
        super();
        this.topLevels = [
            { name: 'Mine ruter', shown: false, filter: (collection: HaCollection) => collection.userid == App.haUsers.user.id },
            { name: 'spacer', shown: false, filter: null },
            { name: 'Køreruter', shown: false, filter: (collection: HaCollection) => collection.type == 0 },
            { name: 'Cykelruter', shown: false, filter: (collection: HaCollection) => collection.type == 1 },
            { name: 'Til fods', shown: false, filter: (collection: HaCollection) => collection.type == 2 },
            { name: 'spacer', shown: false, filter: null },
            { name: 'Under 10 km', shown: false, filter: (collection: HaCollection) => collection.distance < 10000 },
            { name: 'Over 10 km', shown: false, filter: (collection: HaCollection) => collection.distance >= 10000 }
        ]
    }

}

PanelRoute.register();