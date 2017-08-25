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

    @property({ type: Boolean })
    public userCreators: boolean;

    @property({ type: Boolean })
    public profCreators: boolean;

    private showingUserRouteTopLevel: boolean = false;

    constructor() {
        super();
        this.topLevels = [
            { name: 'I bil', shown: false, selected: false, filter: (collection: HaCollection) => collection.type == 0, ignoreCreators: false },
            { name: 'På cykel', shown: false, selected: false, filter: (collection: HaCollection) => collection.type == 1, ignoreCreators: false },
            { name: 'Til fods', shown: false, selected: false, filter: (collection: HaCollection) => collection.type == 2, ignoreCreators: false },
            { name: 'spacer', shown: false, selected: false, filter: null, ignoreCreators: false },
            { name: 'Under 10 km', shown: false, selected: false, filter: (collection: HaCollection) => collection.distance < 10000, ignoreCreators: false },
            { name: 'Over 10 km', shown: false, selected: false, filter: (collection: HaCollection) => collection.distance >= 10000, ignoreCreators: false },
            { name: 'spacer', shown: false, selected: false, filter: null, ignoreCreators: false }
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
            //this.push('topLevels', { name: 'spacer', shown: false, selected: false, filter: null, ignoreCreators: false })
            this.push('topLevels', { name: 'Mine turforslag', shown: false, selected: false, filter: (collection: HaCollection) => collection.user.id == App.haUsers.user.id, ignoreCreators: true })
            this.showingUserRouteTopLevel = true;
        }
        if (this.user.isDefault && this.showingUserRouteTopLevel) {
            //(<any>this).pop('topLevels');
            (<any>this).pop('topLevels');
            this.showingUserRouteTopLevel = false;
        }
    }

    public selectAll() {
        (<CollectionList>this.$.list).selectAll();
    }

    createNewRouteTap() {
        if (App.haUsers.user.isDefault) {
            $(this).append(DialogConfirm.create('log-in', 'Du skal være logget ind for at kunne oprette et turforslag. Vil du logge ind nu?'));
            return;
        }

        //this.theme = Global.defaultTheme;
        //this.set('showMenuRoutes', true);
        //this.set('showMainMenu', false);
        App.haCollections.newRoute();
    }
    @listen('log-in-confirmed')
    deleteContentConfirmed(e: any) {
        Common.dom.append(WindowLogin.create());
    }

    guideRouteTap() {
        window.open('../../../pdf/Vejledning til at lave turforslag på HistoriskAtlas.dk' + (App.haUsers.user.isPro ? ' for kulturinstitutioner' : '') + '.pdf', '_blank')
    }
}

PanelRoute.register();