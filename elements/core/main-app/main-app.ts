@component("main-app")
class App extends polymer.Base implements polymer.Element {

    public static global: Global;
    public static map: MainMap;
    public static windowFavourites: WindowFavourites;
    public static mainMenu: MainMenu;
    //public static windowRoute: WindowRoute;
    public static mapTooltip: MapTooltip;
    public static toast: ToastWrapper;
    public static loading: DialogLoading;
    public static timeline: TimeLine;
    public static haTags: HaTags;
    public static haGeos: HaGeos;
    public static haMaps: HaMaps;
    public static haRegions: HaRegions;
    public static haUsers: HaUsers;
    public static haCollections: HaCollections;
    public static haLicenses: HaLicenses;
    public static timeWarpClosed: TimeWarpClosed
    public static passed: IPassed;
    private leftPanelUpdateTimerID: number;

    //@property({ type: Number, value: 0 })
    //public selectedLeftPanel: number;

    @property({ type: Boolean })
    public drawerOpen: boolean;

    @property({ type: String })
    public panelSelected: string;

    @property({ type: Boolean, notify: true })
    public timeWarpActive: boolean;

    @property({ type: Boolean, notify: true })
    public timeLineActive: boolean;

    //@property({ type: Boolean, notify: true })
    //public routesActive: boolean;

    //@property({ type: Boolean, notify: true })
    //public userContentActive: boolean;

    @property({ type: Number })
    public year: number;

    @property({ type: Number })
    public timeWarpYear: number;

    @property({ type: Boolean })
    public touchDevice: boolean;

    @property({ type: Boolean })
    public narrow: boolean;

    @property({ type: Boolean })
    public cookieConcent: boolean;

    @property({ type: Number })
    public mapRotation: number;

    @property({ type: Boolean })
    public leftPanelDragging: boolean;

    //@property({ type: Boolean })
    //public leftPanelPeeking: boolean;

    @property({ type: Boolean })
    public showRedRibbon: boolean;

    @property({ type: Boolean })
    public userJustActivated: boolean;

    @property({ type: Boolean, value: false })
    public userCreators: boolean;

    @property({ type: Boolean, value: true })
    public profCreators: boolean;

    @property({ type: Object })
    public theme: ITheme;    

    @observe("leftPanelDragging.changed")
    leftPanelDraggingChanged() {
        if (!App.map)
            return;

        App.map.draggable = !this.leftPanelDragging;
    }

    @observe('panelSelected')
    panelSelectedChanged() {
        this.drawerOpen = this.panelSelected == 'drawer';
    }
    @observe('drawerOpen')
    drawerOpenChanged() {
        this.panelSelected = this.drawerOpen ? 'drawer' : 'main';
    }

    notNull(object: any): boolean {
        return !!object;
    }

    showThemeTitle(theme: ITheme): boolean {
        return theme.id != 'default';
    }

    openCookiesWindow() {
        Common.dom.append(WindowPrivacy.create());
    }

    openLoginWindow() {
        Common.dom.append(WindowLogin.create());
    }

    cookieConcentGiven() {
        localStorage.setItem("cookieConcent", "true");
        Common.dom.append(DialogTourIntro.create());
    }

    @observe("timeWarpActive")
    timeWarpActiveChanged(newVal: boolean, oldVal: boolean) {
        if (App.map)
            App.map.timeWarp.toggle(newVal);
    }

    @observe("mainMap")
    mainMapChanged(newVal: HaMap, oldVal: HaMap) {
        if (!newVal)
            return;
        if (App.map)
            App.map.HaMap = newVal;
        this.year = newVal.orgEndYear;
    }

    @observe("timeWarpMap")
    timeWarpMapChanged(newVal: HaMap, oldVal: HaMap) {
        if (!newVal)
            return;
        if (App.map)
            if (App.map.timeWarp)
                App.map.timeWarp.HaMap = newVal;
        this.timeWarpYear = newVal.orgEndYear;
    }

    @observe("year")
    yearChanged(newVal: number) {
        if (App.map)
            if (App.map.digDagLayer)
                App.map.digDagLayer.year = newVal;
    }

    public instanceIsDev(): boolean {
        return App.isDev;
    }
    public static get isDev(): boolean {
        return this.passed.dev;
    }

    public static get useClustering(): boolean {
        //return !this.passed.dev;
        return true;
    }

    public disableLeftPanelSwipe(touchDevice: boolean, narrow: boolean): boolean {
        return !touchDevice || !narrow;
    }

    mainMenuClass(theme: ITheme, showMenuThemes: boolean): string {
        if (showMenuThemes)
            return 'menu-style-theme-' + theme.id;
        return '';
    }

    canEditCollection(collection: HaCollection): boolean {
        return App.haUsers.user.canEditCollection(collection);
    }


    created() {
        App.passed = (<any>window).passed;

        if (!App.passed.theme)
            App.passed.theme = Global.defaultTheme;
    }

    ready() {
        if (localStorage.getItem("sessionID"))
            (<any>document).sid = localStorage.getItem("sessionID");

        //this.beingIndexed = /bot|googlebot|crawler|spider|robot|crawling/i.test(navigator.userAgent) || App.isDev;
        this.cookieConcent = localStorage.getItem("cookieConcent") == 'true';

        //App.instance = this;
        //App.dom = $(document.body);
        App.global = <Global>document.querySelector('global-app');
        App.mainMenu = <MainMenu>document.querySelector('main-menu');
        App.toast = <ToastWrapper>document.querySelector('toast-wrapper');
        App.loading = <DialogLoading>document.querySelector('dialog-loading');
        App.timeline = <TimeLine>document.querySelector('#mainTimeLine');
        App.mapTooltip = <MapTooltip>document.querySelector('map-tooltip');
        App.haTags = <HaTags>document.querySelector('ha-tags');
        App.haGeos = <HaGeos>document.querySelector('ha-geos');
        App.haMaps = <HaMaps>document.querySelector('ha-maps');
        App.haRegions = <HaRegions>document.querySelector('ha-regions');
        App.haUsers = <HaUsers>document.querySelector('ha-users');
        App.haCollections = <HaCollections>document.querySelector('ha-collections');
        App.haLicenses = <HaLicenses>document.querySelector('ha-licenses');
        App.timeWarpClosed = <TimeWarpClosed>document.querySelector('time-warp-closed');

        (<HaDigDag>document.querySelector('ha-digdag')).getData();

        this.touchDevice = 'ontouchstart' in window || !!navigator.maxTouchPoints;
        //if (this.touchDevice)
        //    $('#drawer').css("overflow-y", "auto");

        //used? main-app not present when deeplinking to geo...
        //App.passed.geo = App.passed.geo ? new HaGeo(App.passed.geo) : null;

        if (App.passed.theme.id != 'default') {
            this.drawerOpen = true;
            App.mainMenu.showMainMenu = false;
            App.mainMenu.showMenuThemes = true;
        }

        if (App.passed.redribbon) {
            this.showRedRibbon = true;
        }

        //if (localStorage.getItem("sessionID"))
        //    Services.get('login', {}, (result) => {
        //        if (result.data.user.isvalid)
        //            App.haUsers.login(result.data.user);
        //    });

        if (this.cookieConcent)
            AppMode.showPopup();

        //if (LocalStorage.isBefore('user-news-shown', WindowUserNews.lastUpdate)) {
        //    $(this).append(WindowUserNews.create());
        //    LocalStorage.set('user-news-shown', 'true', true);
        //}


        //TODO: move to generel url interpreter class?
        var path = window.location.pathname
        if (path.substr(-8) == '/welcome') {
            window.history.replaceState({}, null, window.location.href.substr(0, window.location.href.length - 8));
            this.userJustActivated = true;
        }
        //TODO: move to generel url interpreter class?
        if (path.substr(0, 2) == '/@') {
            var atArr = path.substr(2).split(',');
            App.passed.theme.maplatitude = parseFloat(atArr[0]);
            App.passed.theme.maplongitude = parseFloat(atArr[1]);
            App.passed.theme.mapzoom = parseInt(atArr[2]);
        }

        //else {
        //    App.passed.initCoord = [Global.defaultTheme.maplatitude, Global.defaultTheme.maplongitude]; //TODO: what if default theme isnt selected....
        //    App.passed.initZoom = Global.defaultTheme.mapzoom; //TODO: what if default theme isnt selected....
        //}

        //if ('registerElement' in document
        //    && 'import' in document.createElement('link')
        //    && 'content' in document.createElement('template')) {
        //    // platform is good!
        //    App.init();
        //} else {
        //    // polyfill the platform first!
        //    var e = document.createElement('script');
        //    e.src = '/bower_components/webcomponentsjs/webcomponents-lite.min.js';
        //    document.body.appendChild(e);
        //}

        //App.init();

    }

    public static init() {
        var theme = App.passed.theme
        App.map = new MainMap([theme.maplatitude ? theme.maplatitude : Global.defaultTheme.maplatitude, theme.maplongitude ? theme.maplongitude : Global.defaultTheme.maplongitude], theme.mapzoom ? theme.mapzoom : Global.defaultTheme.mapzoom);
        //FB.init({ appId: '876939902336614', xfbml: true, version: 'v2.2' }); //moved to login window

        $(document).ready(() => {
            App.map.ready();
            if (App.passed.collection)
                App.haCollections.addPassedColection(App.passed.collection);
        });
    }
}

interface IPassed {
    geo: any,
    collection: any,
    tag: any,
    theme: ITheme,
    dev: boolean,
    redribbon: boolean
}

(<any>ol.source.XYZ.prototype).setCanvasTileClass = function () {
    this.tileClass = (<any>ol).CanvasTile;
}

App.register();