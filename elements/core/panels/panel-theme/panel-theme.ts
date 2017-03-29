@component("panel-theme")
class PanelTheme extends polymer.Base implements polymer.Element {

    @property({ type: Boolean })
    public showThemeMenu: boolean;

    @property({ type: Object, notify: true })
    public theme: ITheme;

    @property({ type: Array })
    public themes: Array<ITheme>;

    @property({ type: Array, notify: true })
    public collections: Array<HaCollection>;

    @property({ type: Object, notify: true })
    public collection: HaCollection;

    @property({ type: Array })
    public routeTopLevels: Array<ICollectionTopLevel>;

    @property({ type: Boolean })
    public show: boolean;

    @property({ type: Boolean })
    public isDevOrBeta: boolean;

    @property({ type: Object })
    public user: HAUser;

    ready() {
        this.isDevOrBeta = Common.isDevOrBeta;

        HaTags.loadedCallbacks.push(() => this.themeChanged());

        var send: any = {
            count: '*',
            schema: '{theme:[name]}',
            order: 'name'
        }

        if (!Common.isDevOrBeta)
            send.id = '{in:["1001","hod2017"]}'

        Services.get('theme', send, (result) => {
            if (this.theme.id != 'default') {
                this.showThemeMenu = false;
                for (var theme of result.data)
                    if (this.active(theme, this.theme)) {
                        result.data[result.data.indexOf(theme)] = this.theme;
                        break;
                    }
            }

            this.themes = result.data;
        })
    }

    active(item: ITheme, theme: ITheme): boolean {
        return item.name == theme.name;
    }

    showMenuItem(item: ITheme, user: HAUser): boolean {
        if (this.isDevOrBeta)
            return true;

        if (this.isHoD2017(item))
            return user ? user.canAccessHoD2017 : false;

        return true;
    }

    public getThemeByName(name: string): ITheme {
        for (var theme of this.themes)
            if (theme.name == name)
                return theme;
        return null;
    }

    @observe('showThemeMenu')
    showThemeMenuChanged(newVal: boolean, oldVal: boolean) {
        if (newVal && oldVal !== undefined)
            this.theme = Global.defaultTheme;
    }

    @listen('shown')
    shown(e) {
        var theme = <ITheme>this.$.themeRepeater.modelForElement(e.srcElement).item;
        if (!theme.id) {
            Services.get('theme', {
                name: theme.name,
                schema: '{theme:[id,name,mapid,maplatitude,maplongitude,mapzoom,tagid,' + ContentViewer.contentSchema + ']}',
            }, (result) => {
                this.theme = <ITheme>result.data[0];
                this.set('themes.' + this.themes.indexOf(theme), this.theme);
            })
        }
        else
            this.theme = theme;


    }

    @observe('theme')
    themeChanged() {
        //if (this.theme.content == undefined && this.theme != Global.defaultTheme) { //If theme selected from deep link
        //    Services.get('theme', {
        //        id: this.theme.id,
        //        schema: '{theme:[' + ContentViewer.contentSchema + ']}',
        //    }, (result) => {
        //        this.set('theme.content', (<ITheme>result.data[0]).content);
        //    })
        //}

        if (!App.haTags)
            return;

        if (!App.haTags.tagsLoaded)
            return;

        var routeTopLevels: Array<ICollectionTopLevel> = [];
        if (this.theme.tagid && this.theme != Global.defaultTheme) {
            App.haCollections.getCollectionsByTagId(this.theme.tagid);
            //App.haCollections.getPublishedCollections();
            for (var tag of App.haTags.byId[this.theme.tagid].children) {
                if (tag.isPublicationDestination) //TODO: other category?
                    routeTopLevels.push(((tagId: number) => <ICollectionTopLevel>{ name: tag.singName, shown: false, selected: false, filter: (collection: HaCollection) => { return collection.tags.indexOf(App.haTags.byId[tagId]) > -1; } })(tag.id));
            }
        }
        this.set('routeTopLevels', routeTopLevels);
            //this.set('routeTopLevels', [
            //    { name: 'Landsdækkende rutenet', shown: false, filter: (collection: HaCollection) => collection.tags.indexOf(App.haTags.byId[734]) > -1 },
            //    { name: 'Vandrehistorier', shown: false, filter: (collection: HaCollection) => collection.tags.indexOf(App.haTags.byId[735]) > -1 }
            //]);
        //} else
        //    this.set('routeTopLevels', []);
    }

    newHaContent(content: IContent): HaContent {
        if (!content)
            return null;
        return new HaContent(content);
    }

    hideHeadline(theme: ITheme): boolean {
        return this.isHoD2017(theme) || this.is1001(theme);
    }

    isHoD2017(theme: ITheme): boolean {
        return theme.id == 'hod2017' || theme.name == 'Historier om Danmark 2017';
    }
    aboutHoD2017Tap() {
        Common.dom.append(WindowInstitution.create(App.haTags.byId[736]));
    }

    is1001(theme: ITheme): boolean {
        return theme.id == '1001';
    }
    about1001Tap() {
        Common.dom.append(WindowInstitution.create(App.haTags.byId[731]));
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
    id: string;
    name: string;
    mapid: number;
    maplatitude: number;
    maplongitude: number;
    mapzoom: number;
    tagid: number;
    content: IContent;
}

interface IContent {
    texts: Array<IText>
}

interface IText {
    headline: string;
    text1: string;
}

PanelTheme.register();