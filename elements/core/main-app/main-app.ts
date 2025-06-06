﻿@component("main-app")
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

    //showThemeTitle(theme: ITheme): boolean {
    //    return theme.name != 'default';
    //}
    //selectTheme() {
    //    this.$.themeSelect.open();
    //}

    openCookiesWindow() {
        Common.dom.append(WindowPrivacy.create());
    }

    openLoginWindow() {
        Common.dom.append(WindowLogin.create());
    }

    cookieConcentGiven() {
        LocalStorage.set("cookieConcentV2", "true");
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
        if (App.map) {
            App.map.HaMap = newVal;
            UrlState.mapChanged();
        }
        this.year = Math.min(newVal.orgEndYear, Common.digDagEndYear);
    }

    @observe("timeWarpMap")
    timeWarpMapChanged(newVal: HaMap, oldVal: HaMap) {
        if (!newVal)
            return;
        if (App.map)
            if (App.map.timeWarp) {
                App.map.timeWarp.HaMap = newVal;
                UrlState.secondaryMapChanged();
            }
        this.timeWarpYear = Math.min(newVal.orgEndYear, Common.digDagEndYear);
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
        return true; // !touchDevice || !narrow;
    }

    //mainMenuClass(theme: ITheme, showMenuThemes: boolean): string {
    //    if (showMenuThemes)
    //        return 'menu-style-theme-' + theme.id;
    //    return '';
    //}
    //mainMenuClass(showMenuThemes: boolean): string {
    //    if (showMenuThemes)
    //        return 'show-menu-themes';
    //    return '';
    //}

    canEditCollection(collection: HaCollection): boolean {
        return App.haUsers.user.canEditCollection(collection);
    }

}

MainApp.register();