@component("window-profile")
class WindowProfile extends polymer.Base implements polymer.Element {

    @property({ type: Number, value: 0 })
    public selectedTab: number;

    @property({ type: Object })
    public user: HAUser & Object;

    constructor() {
        this.user = App.haUsers.user;
        super();
    }

    @observe('user.*')
    userPropsChanged(e) {
        App.haUsers.notifyPath(e.path, e.value);
    }

}

WindowProfile.register();