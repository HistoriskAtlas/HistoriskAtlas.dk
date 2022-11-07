@component("dialog-theme-select")
class DialogThemeSelect extends polymer.Base implements polymer.Element {

    @property({ type: Object })
    public newTheme: ITheme;

    @property({ type: Array })
    public themes: Array<ITheme>;

    public open() {
        this.$.dialog.open();
    }

    selectHA() {
        this.$.dialog.close();
        App.haThemes.selectTheme(Global.defaultTheme);
    }

    @observe('newTheme')
    themeChanged() {
        this.$.dialog.close();
        App.haThemes.selectTheme(this.newTheme);
    }
}

DialogThemeSelect.register();