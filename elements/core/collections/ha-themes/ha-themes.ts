﻿@component("ha-themes")
class HaThemes extends polymer.Base implements polymer.Element {

    @property({ type: Array, notify: true, value: [] })
    public themes: Array<ITheme>;

    @property({ type: Object, notify: true })
    public theme: ITheme;

    ready() {
        var send: any = {
            count: '*',
            schema: '{theme:[name]}',
            order: 'name'
        }

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

        Services.getHAAPI(`themes${(Common.isDevOrBeta ? '' : `?linknames=1001,hod,modstandskamp,${App.passed.theme.id}`)}`, (result) => {
            //this.showThemeMenu = false; TODO...................................................................
            var themes: Array<ITheme> = [];
            for (var name of result.data)
                themes.push(name == this.theme.name && this.theme.id != 'default' ? this.theme : <ITheme>{ name: name });

            this.themes = themes;
        })

        if (Common.tagsLoaded)
            this.themeChanged()
        else
            HaTags.loadedCallbacks.push(() => this.themeChanged());
    }

    @observe('theme')
    themeChanged() {
        if (!Common.tagsLoaded)
            return;

        UrlState.themeChanged();

        if (this.theme.tagid && this.theme.name != Global.defaultTheme.name)
            App.haCollections.getCollectionsByTagId(this.theme.tagid, true);
    }

}

HaThemes.register();