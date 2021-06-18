class App extends polymer.Base {
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
    public static haThemes: HaThemes;
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

    @property({ type: Boolean })
    public userJustResetPassword: boolean;

    @property({ type: Boolean, value: false })
    public userCreators: boolean;

    @property({ type: Boolean, value: true })
    public profCreators: boolean;

    @property({ type: Object })
    public theme: ITheme;    

    public instanceIsDev(): boolean {
        return App.isDev();
    }
    public static isDev(): boolean { //static getter inheritance buggy in TS 1.8.31...
        //return this.passed.dev;
        return false; //TODO: TEMP!......
    }

    public static useClustering(): boolean { //static getter inheritance buggy in TS 1.8.31...
        //return !this.passed.dev;
        return true;
    }

    created() {
        App.passed = (<any>window).passed;

        if (!App.passed.theme)
            App.passed.theme = $.extend({}, Global.defaultTheme);

        Common.openGeoWindowInNewTab = Common.embed;
        UrlState.ReadFromUrl();
    }

    ready() {
        if (LocalStorage.get("sessionID"))
            (<any>document).sid = LocalStorage.get("sessionID");

        //this.beingIndexed = /bot|googlebot|crawler|spider|robot|crawling/i.test(navigator.userAgent) || App.isDev;
        this.cookieConcent = LocalStorage.get("cookieConcent") == 'true';

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
        App.haThemes = <HaThemes>document.querySelector('ha-themes');
        App.haRegions = <HaRegions>document.querySelector('ha-regions');
        App.haUsers = <HaUsers>document.querySelector('ha-users');
        App.haCollections = <HaCollections>document.querySelector('ha-collections');
        App.haLicenses = <HaLicenses>document.querySelector('ha-licenses');
        App.timeWarpClosed = <TimeWarpClosed>document.querySelector('time-warp-closed');

        App.global.userJustActivated = UrlState.userJustActivated;
        App.global.userJustResetPassword = UrlState.userJustResetPassword;

        (<HaDigDag>document.querySelector('ha-digdag')).getData();

        this.touchDevice = Common.touchDevice;
        //if (this.touchDevice)
        //    $('#drawer').css("overflow-y", "auto");

        //used? main-app not present when deeplinking to geo...
        //App.passed.geo = App.passed.geo ? new HaGeo(App.passed.geo) : null;

        if (App.passed.geo) { //when in fullapp mode
            var geo = new HaGeo(App.passed.geo, false, false);
            if (geo.isUGC)
                setTimeout(() => this.set('userCreators', true), 1000);
            Common.dom.append(WindowGeo.create(geo));
        }

        if (App.passed.theme.linkname != 'default' && !Common.embed) {
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


        //UrlState.ReadFromUrl();

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

        window.addEventListener('message', (e) => {
            if (e.data.event == 'openGeoWindowInNewTab') {
                Common.openGeoWindowInNewTab = e.data.value;
                UrlState.openGeoWindowInNewTabChanged();
            }
        });

        window.addEventListener('beforeunload', (e) => {
            if (!App.haUsers.user.isWriter)
                return;

            if (!Services.hasPendingCalls)
                return;

            e.preventDefault();
            e.returnValue = '';
        });

        window.addEventListener('touchmove', (e) => { //Fixes zooming bug on mobile(?)
            event.preventDefault();
        });
    }

    @observe('theme')
    themeChanged() {
        var root = document.documentElement;
        for (let i = root.classList.length - 1; i >= 0; i--) {
            const className = root.classList[i];
            if (className.indexOf('theme') > -1)
                root.classList.remove(className);
        }
        var id = `theme-${this.theme.linkname}`;
        Common.loadCSS(id, `css/themes/${id}.css`);
        root.classList.add(id);
    }


    public static init() {
        var theme = App.passed.theme
        var coord = App.passed.geo ? [App.passed.geo.latitude, App.passed.geo.longitude] : ([theme.maplatitude ? theme.maplatitude : Global.defaultTheme.maplatitude, theme.maplongitude ? theme.maplongitude : Global.defaultTheme.maplongitude]);
        var zoom = App.passed.geo ? 16 : (theme.mapzoom ? theme.mapzoom : Global.defaultTheme.mapzoom);
        var rotation = theme.maprotation ? theme.maprotation : Global.defaultTheme.maprotation;
        App.map = new MainMap(coord, zoom, rotation);
        App.global.setMapRotation(rotation);

        $(document).ready(() => {
            App.map.ready();
            if (App.passed.collection)
                App.haCollections.addPassedColection(App.passed.collection);
            if (App.passed.theme)
                UrlState.themeChanged();
            App.haMaps.init();
            App.haThemes.init();
        });
    }
}

interface IPassed {
    geo: any,
    collection: any,
    tag: any,
    theme: ITheme,
    dev: boolean,
    redribbon: boolean,
    embed: boolean,
    search: string
}

(<any>ol.source.XYZ.prototype).setCanvasTileClass = function () {
    this.tileClass = (<any>ol).CanvasTile;
}