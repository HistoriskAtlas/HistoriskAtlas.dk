@component("ha-themes")
class HaThemes extends polymer.Base implements polymer.Element {

    @property({ type: Array, notify: true, value: [] })
    public themes: Array<ITheme>;

    @property({ type: Object, notify: true })
    public theme: ITheme;

    @property({ type: Array })
    public routeTopLevels: Array<ICollectionTopLevel>;

    @property({ type: Array })
    public userTopLevels: Array<ICollectionTopLevel>;

    private gettingThemes: boolean = false;

    ready() {
        if (Common.tagsLoaded)
            this.themeChanged()
        else
            HaTags.loadedCallbacks.push(() => this.themeChanged());
    }

    public init() { //was ready()

        this.getThemes(); //TODO: Could be postponed?

        if (Common.tagsLoaded)
            this.getThemeCollections();
        else
            HaTags.loadedCallbacks.push(() => this.getThemeCollections());
    }

    public getThemes(): void {
        if (this.themes.length > 0 || this.gettingThemes)
            return;

        this.gettingThemes = true;
        var params: any = {}
        if (!Common.isDevOrBeta)
            params.linknames = `1001,hod,modstandskamp,digterruter,${App.passed.theme.linkname}`

        Services.HAAPI_GET('themes', params, (result) => {
            //this.showThemeMenu = false; TODO...................................................................
            var themes: Array<ITheme> = [];
            for (var theme of result.data)
                themes.push(theme.name == this.theme.name && this.theme.linkname != 'default' ? this.theme : <ITheme>theme);

            this.themes = themes;
            this.gettingThemes = false;
        })
    }

    public getThemeByName(name: string): ITheme {
        for (var theme of this.themes)
            if (theme.name == name)
                return theme;
        return null;
    }

    @observe('theme')
    themeChanged() {
        if (!Common.tagsLoaded)
            return;

        UrlState.themeChanged();
        this.getThemeCollections();

        if (!Common.tagsLoaded)
            return;

        var routeTopLevels: Array<ICollectionTopLevel> = [];
        if (this.theme.tagid && this.theme != Global.defaultTheme) {

            if (this.isDigterruter(this.theme)) {
                var themeTag = App.haTags.byId[this.theme.tagid];
                routeTopLevels.push(((tag: HaTag) => <ICollectionTopLevel>{
                    name: 'Ruterne', shown: false, selected: true, ignoreCreators: true, filter: (collection: HaCollection) => collection.tags.indexOf(tag) > -1
                })(themeTag));
            }

            for (var tag of App.haTags.byId[this.theme.tagid].children) {
                if (tag.isPublicationDestination) //TODO: other category?
                    routeTopLevels.push(((tag: HaTag) => <ICollectionTopLevel>{
                        name: tag.singName, shown: false, selected: true, ignoreCreators: true, filter: (collection: HaCollection) => collection.tags.indexOf(tag) > -1
                    })(tag));
            }
        }

        //TODO: Let below have an effect........................................................................................................................................................................

        this.set('routeTopLevels', routeTopLevels);

        this.set('userTopLevels', [{ name: 'Mine ruter', shown: false, selected: false, filter: (collection: HaCollection) => collection.user.id == App.haUsers.user.id, ignoreCreators: true }]);

        var userCollectionList = this.$$('#userCollectionList');
        if (userCollectionList)
            (<CollectionList>userCollectionList).updateTopLevelSelections();

    }
    private isDigterruter(theme: ITheme): boolean {
        return theme.linkname == 'digterruter';
    }

    private getThemeCollections() {
        if (this.theme.tagid && this.theme.name != Global.defaultTheme.name)
            App.haCollections.getCollectionsByTagId(this.theme.tagid, true);
    }

    public selectTheme(theme: ITheme) {
        if (this.theme && this.theme.name == theme.name)
            return;

        if (theme.isfullyloaded) {
            this.theme = theme;
            return;
        }

        Services.HAAPI_GET(`theme/${theme.linkname}`, null, (result) => {
            this.theme = <ITheme>result.data;
            this.theme.isfullyloaded = true;
            this.set('themes.' + this.themes.indexOf(theme), this.theme);
        })
    }

}

HaThemes.register();