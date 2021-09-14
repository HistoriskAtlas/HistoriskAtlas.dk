@component("ha-themes")
class HaThemes extends polymer.Base implements polymer.Element {

    @property({ type: Array, notify: true, value: [] })
    public themes: Array<ITheme>;

    @property({ type: Object, notify: true })
    public theme: ITheme;

    private gettingThemes: boolean = false;

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

    @observe('theme')
    themeChanged() {
        if (!Common.tagsLoaded)
            return;

        UrlState.themeChanged();
        this.getThemeCollections();
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

        //Services.get('theme', { //TODO: Implement as HAAPI Call......
        Services.HAAPI_GET(`theme/${theme.linkname}`, null,
            //name: theme.name,
            //schema: '{theme:[linkname,name,mapid,maplatitude,maplongitude,mapzoom,tagid,' + ContentViewer.contentSchema + ']}',
        //}, 
        (result) => {
            this.theme = <ITheme>result.data;
            this.theme.isfullyloaded = true;
            this.set('themes.' + this.themes.indexOf(theme), this.theme);
        })
    }

}

HaThemes.register();