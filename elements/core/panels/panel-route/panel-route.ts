@component("panel-route")
class PanelRoute extends polymer.Base implements polymer.Element {

    private geoToAdd: HaGeo;

    @property({ type: Boolean, notify: true })
    public drawerOpen: boolean;

    @property({ type: Array, notify: true })
    public collections: Array<HaCollection>;

    //@property({ type: String })
    //public newTitle: string;

    constructor() {
        super();
        //App.windowRoutes = this;
        //this.collections = App.haCollections.collections;
        //this.$.templateCollections.render();
        //this.geos = App.haUsers.user.favourites.geos;
        //App.haUsers.addEventListener('userFavouritesGeosChanged', () => this.$.templateGeos.render())
    }
    
    //@listen('windowbasic.closed') 
    //windowBasicClosed() {
    //    App.windowRoutes = null;
    //    App.global.routesActive = false;
    //    this.geoToAdd = null;
    //}

    collectionTap(e: any) {
        //this.openRoute(<HaCollection>e.model.collection);
        //(<HaCollection>e.model.collection).open();
        App.haCollections.select(<HaCollection>e.model.collection);
        //App.haCollections.set('collection', e.model.collection);
    }
    //private openRoute(route: HaCollection) {
    //    if (App.windowRoute) {
    //        App.windowRoute.setRoute(route);
    //        (<WindowBasic>App.windowRoute.$.windowbasic).bringToFront();
    //    } else
    //        Common.dom.append(WindowRoute.create(route));

    //    //if (this.geoToAdd) {
    //    //    App.windowRoute.addGeo(this.geoToAdd);
    //    //    this.geoToAdd = null;
    //    //}
    //}

   // newRoute() {
   //     //this.$.routeTitleDialog.open();
   //     Common.dom.append(DialogText.create('Angiv titel på rute', (title) => this.routeTitleConfirmed(title)));
   //}

    //@listen('route-title-confirmed')
    //routeTitleConfirmed(title: string) {
    //    var route: HaCollection = App.haCollections.newCollection(title);
    //    this.push('collections', route);
    //    this.openRoute(route);
    //}

    //public addGeo(geo: HaGeo) {
    //    this.geoToAdd = geo;
    //    this.drawerOpen = true;
    //    //this.$.windowbasic.bringToFront();
    //    if (this.collections.length == 0)
    //        this.newRoute();
    //    else
    //        App.toast.show("Vælg rute eller opret ny")
    //}
    public formatDistance(distance: number): string {
        return HaCollection.formatDistance(distance);
    }
}

PanelRoute.register();