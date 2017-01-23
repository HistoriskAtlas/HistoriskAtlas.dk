@component("window-editorial")
class WindowEditorial extends polymer.Base implements polymer.Element {

    @property({ type: Number, value: 0 })
    public selectedTab: number;
}

WindowEditorial.register();