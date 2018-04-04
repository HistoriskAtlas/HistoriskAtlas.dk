@component("window-editorial")
class WindowEditorial extends polymer.Base implements polymer.Element {

    @property({ type: Number, value: 0 })
    public selectedTab: number;

    hasWriters(): boolean {
        return App.haUsers.user.isPro && App.haUsers.user.isEditor;
    }
}

WindowEditorial.register();