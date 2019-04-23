@component("window-admin")
class WindowAdmin extends polymer.Base implements polymer.Element {

    @property({ type: Number, value: 0 })
    public selectedTab: number;
}

enum WindowAdminTabs { geos = 2 }

WindowAdmin.register();