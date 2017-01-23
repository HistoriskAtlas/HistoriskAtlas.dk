@component("panel-theme")
class PanelTheme extends polymer.Base implements polymer.Element {

    @property({ type: Boolean })
    public showThemeMenu: boolean;

    @property({ type: Object, notify: true })
    public theme: ITheme;

    @property({ type: Array })
    public themes: Array<ITheme>;

    ready() {
        Services.get('theme', {
            count: '*',
            schema: '{theme:[name]}',
            order: 'name'
        }, (result) => {

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

    newHaContent(content: IContent): HaContent {
        if (!content)
            return null;
        return new HaContent(content);
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