@component("theme-selector")
class ThemeSelector extends polymer.Base implements polymer.Element {

    @property({ type: Object })
    public theme: ITheme;  

    @property({ type: Boolean, notify: true, value: false })
    public open: boolean;  

    ready() {
    }

    tapTheme(e: any) {
        if (this.open)
            App.haThemes.selectTheme(e.model.child ?? Global.defaultTheme);;
        this.open = !this.open;
    }

    showTheme(linkname: string, open: boolean): boolean {
        return open || this.activeTheme(linkname);
    }

    activeTheme(linkname: string): boolean {
        return this.theme.linkname == linkname;
    }

}

ThemeSelector.register();