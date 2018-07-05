@component("main-app")
class MainApp extends App implements polymer.Element {

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
        UrlState.mapChanged();
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

    created() {
        super.created();
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

}

MainApp.register();