@component("panel-theme")
class PanelTheme extends polymer.Base implements polymer.Element {

    @property({ type: Boolean })
    public showThemeMenu: boolean;

    @property({ type: Object, notify: true })
    public theme: ITheme;

    @property({ type: Array, notify: true })
    public themes: Array<ITheme>;

    @property({ type: Array, notify: true })
    public collections: Array<HaCollection>;

    @property({ type: Object, notify: true })
    public collection: HaCollection;

    //@property({ type: Array })
    //public routeTopLevels: Array<ICollectionTopLevel>;

    //@property({ type: Array })
    //public userTopLevels: Array<ICollectionTopLevel>;

    @property({ type: Boolean })
    public show: boolean;

    @property({ type: Boolean, notify: true })
    public showMenuRoutes: boolean;

    @property({ type: Boolean, notify: true })
    public showMainMenu: boolean;

    @property({ type: Boolean })
    public isDevOrBeta: boolean;

    @property({ type: Object })
    public user: HAUser;

    @property({ type: Boolean, notify: true })
    public userCreators: boolean;

    @property({ type: Boolean, notify: true })
    public profCreators: boolean;

    ready() {
        this.isDevOrBeta = Common.isDevOrBeta;

        //if (Common.tagsLoaded)
        //    this.themeChanged()
        //else
        //    HaTags.loadedCallbacks.push(() => this.themeChanged());
    }

    active(item: ITheme, theme: ITheme): boolean {
        return item.name == theme.name;
    }

    showMenuItem(item: ITheme, user: HAUser): boolean {
        //if (this.isDevOrBeta)
        //    return true;

        ////if (this.isHoD2017(item))
        ////    return user ? user.canAccessHoD2017 : false;

        return true;
    }

    //public getThemeByName(name: string): ITheme {
    //    for (var theme of this.themes)
    //        if (theme.name == name)
    //            return theme;
    //    return null;
    //}

    @observe('showThemeMenu')
    showThemeMenuChanged(newVal: boolean, oldVal: boolean) {
        if (newVal && oldVal !== undefined)
            this.theme = Global.defaultTheme;
    }

    @listen('shown')
    shown(e) {
        var theme = <ITheme>this.$.themeRepeater.modelForElement(e.target).item;
        //if (!theme.id) {
        //    Services.get('theme', {
        //        name: theme.name,
        //        schema: '{theme:[id,name,mapid,maplatitude,maplongitude,mapzoom,tagid,' + ContentViewer.contentSchema + ']}',
        //    }, (result) => {
        //        this.theme = <ITheme>result.data[0];
        //        this.set('themes.' + this.themes.indexOf(theme), this.theme);
        //    })
        //}
        //else
        //    this.theme = theme;
        App.haThemes.selectTheme(theme);
    }

    @observe('theme')
    themeChanged() {
        //if (!Common.tagsLoaded)
        //    return;

        ////UrlState.themeChanged(); Moved to ha-themes

        //var routeTopLevels: Array<ICollectionTopLevel> = [];
        //if (this.theme.tagid && this.theme != Global.defaultTheme) {

        //    if (this.isDigterruter(this.theme)) {
        //        var themeTag = App.haTags.byId[this.theme.tagid];
        //        routeTopLevels.push(((tag: HaTag) => <ICollectionTopLevel>{
        //            name: 'Ruterne', shown: false, selected: true, ignoreCreators: true, filter: (collection: HaCollection) => collection.tags.indexOf(tag) > -1
        //        })(themeTag));
        //    }

        //    //App.haCollections.getCollectionsByTagId(this.theme.tagid); Moved to ha-themes
        //    for (var tag of App.haTags.byId[this.theme.tagid].children) {
        //        if (tag.isPublicationDestination) //TODO: other category?
        //            routeTopLevels.push(((tag: HaTag) => <ICollectionTopLevel>{
        //                name: tag.singName, shown: false, selected: true, ignoreCreators: true, filter: (collection: HaCollection) => collection.tags.indexOf(tag) > -1
        //            })(tag));
        //    }
        //}
        //this.set('routeTopLevels', routeTopLevels);

        //this.set('userTopLevels', [{ name: 'Mine ruter', shown: false, selected: false, filter: (collection: HaCollection) => collection.user.id == App.haUsers.user.id, ignoreCreators: true }]);

        //var userCollectionList = this.$$('#userCollectionList');
        //if (userCollectionList)
        //    (<CollectionList>userCollectionList).updateTopLevelSelections();

        //    //this.set('routeTopLevels', [
        //    //    { name: 'Landsdækkende rutenet', shown: false, filter: (collection: HaCollection) => collection.tags.indexOf(App.haTags.byId[734]) > -1 },
        //    //    { name: 'Vandrehistorier', shown: false, filter: (collection: HaCollection) => collection.tags.indexOf(App.haTags.byId[735]) > -1 }
        //    //]);
        ////} else
        ////    this.set('routeTopLevels', []);
    }

    newHaContent(content: IContent): HaContent {
        if (!content)
            return null;
        return new HaContent(content);
    }

    hideHeadline(theme: ITheme): boolean {
        return this.isHoD2017(theme) || this.isDigterruter(theme); //this.is1001(theme) || 
    }

    isHoD2017(theme: ITheme): boolean {
        return theme.linkname == 'hod' || theme.name == 'Historier om Danmark';
    }
    aboutHoD2017Tap() {
        Common.dom.append(WindowInstitution.create(App.haTags.byId[736]));
    }
    aboutHATap() {
        Common.dom.append(WindowTheAssociation.create());
    }

    createNewRouteTap() {
        if (App.haUsers.user.isDefault) {
            $(this).append(DialogConfirm.create('log-in', 'Du skal være logget ind for at kunne oprette en rute. Vil du logge ind nu?'));
            return;
        }

        this.theme = Global.defaultTheme;
        this.set('showMenuRoutes', true);
        this.set('showMainMenu', false);
        App.haCollections.newRoute();
    }
    @listen('log-in-confirmed')
    deleteContentConfirmed(e: any) {
        Common.dom.append(WindowLogin.create());
    }
    //showAllRoutesTap() {
    //    App.haTags.setSelectedByCategory(9, false);
    //    this.theme = Global.defaultTheme;
    //    this.set('showMenuRoutes', true);
    //    this.set('showMainMenu', false);
    //    setTimeout(() => {
    //        this.set('profCreators', true);
    //        this.set('userCreators', true);
    //        App.mainMenu.panelRoute.selectAll();
    //    }, 500);        
    //}
    guideRouteTap() {
        window.open('../../../pdf/Vejledning til at lave turforslag på HistoriskAtlas.dk' + (App.haUsers.user.isPro ? ' for kulturinstitutioner' : '') + '.pdf', '_blank')
    }

    //is1001(theme: ITheme): boolean {
    //    return theme.linkname == '1001';
    //}
    //about1001Tap() {
    //    Common.dom.append(WindowInstitution.create(App.haTags.byId[731]));
    //}

    isModstandskamp(theme: ITheme): boolean {
        return theme.linkname == 'modstandskamp';
    }

    isDigterruter(theme: ITheme): boolean {
        return theme.linkname == 'digterruter';
    }

    //itemTap(e: any) {
    //    //var map = <HaMap>e.model.item;
    //    //this.set('map', map);

    //    Services.get('theme', {
    //        name: (<ITheme>e.model.item).name,
    //        schema: '{theme:[name,mapid,maplatitude,maplongitude,mapzoom,tagid]}',
    //    }, (result) => {
    //        this.theme = <ITheme>result.data[0];
    //    })

    //}

    //@observe('show')
    //showChanged() {
    //    if (this.show)
    //        App.haCollections.getPublishedCollections();
    //}

}

interface ITheme {
    linkname: string;
    name: string;

    mapid: number;
    maplatitude: number;
    maplongitude: number;
    mapzoom: number;
    maprotation: number;

    secondarymapid: number;

    tagid: number;
    content: IContent;

    isfullyloaded: boolean;
}

interface IContent {
    texts: Array<IText>
}

interface IText {
    headline: string;
    text1: string;
}

PanelTheme.register();