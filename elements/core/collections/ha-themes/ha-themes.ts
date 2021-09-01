@component("ha-themes")
class HaThemes extends polymer.Base implements polymer.Element {

    @property({ type: Array, notify: true, value: [] })
    public themes: Array<ITheme>;

    @property({ type: Object, notify: true })
    public theme: ITheme;

    public init() { //was ready()

        //var send: any = {
        //    count: '*',
        //    schema: '{theme:[name]}',
        //    order: 'name'
        //}

        //if (!Common.isDevOrBeta)
        //    send.id = '{in:["1001","hod","modstandskamp","' + App.passed.theme.id + '"]}'

        //Services.get('theme', send, (result) => {
        //    if (this.theme.id != 'default') {
        //        //this.showThemeMenu = false; TODO...................................................................
        //        for (var theme of result.data)
        //            if (theme.name == this.theme.name) {
        //                result.data[result.data.indexOf(theme)] = this.theme;
        //                break;
        //            }
        //    }

        //    this.themes = result.data;
        //})

        var params: any = {}
        if (!Common.isDevOrBeta)
            params.linknames = `1001,hod,modstandskamp,digterruter,${App.passed.theme.linkname}`

        Services.HAAPI_GET('themes', params, (result) => {
            //this.showThemeMenu = false; TODO...................................................................
            var themes: Array<ITheme> = [];
            for (var name of result.data)
                themes.push(name == this.theme.name && this.theme.linkname != 'default' ? this.theme : <ITheme>{ name: name });

            this.themes = themes;
        })

        if (Common.tagsLoaded)
            this.getThemeCollections();
        else
            HaTags.loadedCallbacks.push(() => this.getThemeCollections());
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

        if (theme.linkname) {
            this.theme = theme;
            return;
        }

        Services.get('theme', { //TODO: Implement as HAAPI Call......
            name: theme.name,
            schema: '{theme:[linkname,name,mapid,maplatitude,maplongitude,mapzoom,tagid,' + ContentViewer.contentSchema + ']}',
        }, (result) => {
            this.theme = <ITheme>result.data[0];
            this.set('themes.' + this.themes.indexOf(theme), this.theme);
        })
    }

}

HaThemes.register();