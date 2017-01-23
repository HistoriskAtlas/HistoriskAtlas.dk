//@component("window-routes")
//class WindowRoutes extends polymer.Base implements polymer.Element {

//    private geoToAdd: HaGeo;

//    @property({ type: Array })
//    public collections: Array<HaCollection>;

//    @property({ type: String })
//    public newTitle: string;

//    constructor() {
//        super();
//        App.windowRoutes = this;
//        this.collections = App.haCollections.collections;
//        //this.$.templateCollections.render();
//        //this.geos = App.haUsers.user.favourites.geos;
//        //App.haUsers.addEventListener('userFavouritesGeosChanged', () => this.$.templateGeos.render())
//    }
    
//    @listen('windowbasic.closed') 
//    windowBasicClosed() {
//        App.windowRoutes = null;
//        App.global.routesActive = false;
//        this.geoToAdd = null;
//    }

//    collectionTap(e: any) {
//        this.openRoute(<HaCollection>e.model.collection);
//    }
//    private openRoute(route: HaCollection) {
//        if (App.windowRoute) {
//            App.windowRoute.setRoute(route);
//            (<WindowBasic>App.windowRoute.$.windowbasic).bringToFront();
//        } else
//            Common.dom.append(WindowRoute.create(route));

//        if (this.geoToAdd) {
//            App.windowRoute.addGeo(this.geoToAdd);
//            this.geoToAdd = null;
//        }
//    }

//    newRoute() {
//        this.$.routeTitleDialog.open();
//    }
//    //@listen('routeTitleDialog.iron-overlay-closed')
//    //routeTitleDialogClosed(e: any) {
//    //    this.closeDialog(e.detail.confirmed);
//    //}

//    //checkForEnter(e: any) {
//    //    if (e.which === 13) {
//    //        this.$.routeTitleDialog.close();
//    //        this.closeDialog(true);
//    //    }
//    //}
//    //private closeDialog(confirmed: boolean) {
//    //    if (confirmed) {
//    //        var route: HaCollection = App.haCollections.newCollection(this.newTitle);
//    //        this.push('collections', route);
//    //        this.openRoute(route);
//    //    }
//    //    this.newTitle = '';
//    //}

//    @observe('newTitle')
//    newTitleChanged() {
//        var route: HaCollection = App.haCollections.newCollection(this.newTitle);
//        this.push('collections', route);
//        this.openRoute(route);
//    }

//    public addGeo(geo: HaGeo) {
//        this.geoToAdd = geo;
//        this.$.windowbasic.bringToFront();
//        if (this.collections.length == 0)
//            this.newRoute();
//        else
//            App.toast.show("Vælg rute eller opret ny")
//    }
//}

//WindowRoutes.register();