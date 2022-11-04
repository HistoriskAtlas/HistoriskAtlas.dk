@component("global-app")
class Global extends polymer.Base implements polymer.Element {

    @property({ type: Boolean, notify: true })
    public timeWarpActive: boolean;

    @property({ type: Number, notify: true })
    public timeWarpMode: TimeWarpModes;

    //@property({ type: Boolean, notify: true })
    //public timeLineActive: boolean;

    //@property({ type: Boolean, notify: true })
    //public routesActive: boolean;

    @property({ type: Number, notify: true })
    public year: number;

    @property({ type: Number, notify: true })
    public timeWarpYear: number;

    @property({ type: Number, notify: true })
    public mapRotation: number;

    @property({ type: Boolean })
    public userCreators: boolean;

    @property({ type: Boolean })
    public profCreators: boolean;

    @property({ type: Object, notify: true })
    public theme: ITheme;    

    @property({ type: Object, notify: true })
    public map: HaMap;

    @property({ type: Boolean, notify: true })
    public userJustActivated: boolean;

    @property({ type: Boolean, notify: true })
    public userJustResetPassword: boolean;

    public static defaultTheme: ITheme = {
        linkname: 'default',
        name: 'default',
        mapzoom: 7,
        maprotation: 0.0,
        mapid: 237, //161
        secondarymapid: null,
        maplatitude: 56.0,
        maplongitude: 10.0,
        tagid: 427,
        content: null,
        isfullyloaded: true
    };  

    ready() {
        this.theme = App.passed.theme ? App.passed.theme : Global.defaultTheme;
    }

    setTimeWarpMode(mode: TimeWarpModes) {
        this.set('timeWarpMode', mode);
    }

    public showFavourites() {
        if (App.windowFavourites)
            (<WindowBasic>App.windowFavourites.$.windowbasic).bringToFront();
        else
            Common.dom.append(App.windowFavourites = (<WindowFavourites>WindowFavourites.create()));
    }

    @observe('theme')
    themeChanged() {
        if (!App.map)
            return;

        App.map.center(this.theme.maplatitude ? [this.theme.maplongitude, this.theme.maplatitude] : [Global.defaultTheme.maplongitude, Global.defaultTheme.maplatitude], MainMap.getResolutionFromZoom(this.theme.mapzoom ? this.theme.mapzoom : Global.defaultTheme.mapzoom), false, false);
        this.map = this.theme.mapid ? App.haMaps.byId[this.theme.mapid] : HaMaps.defaultMap;
    }

    //public showRoutes() {
    //    App.map.showRouteLayer();

    //    if (App.windowRoutes)
    //        (<WindowBasic>App.windowRoutes.$.windowbasic).bringToFront();
    //    else
    //        Common.dom.append(<WindowRoutes>WindowRoutes.create());
    //}

    //public hideRoutes() {
    //    if (App.windowRoutes) {
    //        (<WindowBasic>App.windowRoutes.$.windowbasic).close();
    //        App.windowRoutes = null;
    //    }
    //    if (App.windowRoute) {
    //        (<WindowBasic>App.windowRoute.$.windowbasic).close();
    //        App.windowRoute = null;
    //    }
    //}

    public setMapRotation(rotation: number) {
        this.mapRotation = rotation;
    }
}

Global.register();