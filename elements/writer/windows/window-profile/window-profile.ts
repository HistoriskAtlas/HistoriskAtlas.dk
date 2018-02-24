@component("window-profile")
class WindowProfile extends polymer.Base implements polymer.Element {

    @property({ type: Number, value: 0 })
    public selectedTab: number;

    @property({ type: Object })
    public user: HAUser & Object;

    constructor() {
        super();
        this.user = App.haUsers.user;
    }

    @observe('user.*')
    userPropsChanged(e) {
        App.haUsers.notifyPath(e.path, e.value);
    }

    changePassword() {
        this.$.passwordDialog.open();
    }

    @listen('password-confirmed')
    passwordConfirmed(e: any) {
        Services.update('user', JSON.parse('{ "id": ' + this.user.id + ', "password": "' + $.md5(e.detail) + '" }'), (data) => {
            Common.dom.append(DialogAlert.create('Din adgangskode er nu ændret!'));
        }, (data) => {
            Common.dom.append(DialogAlert.create('Der opstod en fejl ved forsøg på at ændre din adgangskode!'));
        });
    }
}

WindowProfile.register();