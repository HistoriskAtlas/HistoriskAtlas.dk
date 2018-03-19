@component("panel-login")
class PanelLogin extends polymer.Base implements polymer.Element {

    @property({ type: Boolean, value: false })
    private remember: boolean;

    @property({ type: String })
    public password1: string;

    @property({ type: String })
    public password2: string;

    @property({ type: String })
    public email: string;


    ready() {
        Common.loadJS('facebook-jssdk', '//connect.facebook.com/da_DK/sdk.js');
        Common.loadJS('google-jssdk', '//apis.google.com/js/client:platform.js');
    }

    resetPassword() {
        this.$.dialog.open();
    }

    @listen("username.keyup")
    @listen("password.keyup")
    keyup(e: KeyboardEvent) {
        if (e.keyCode == 13)
            this.login();
    }

    @listen("login.tap")
    login() {
        if (!(this.$.username.validate() && this.$.password.validate()))
            return;

        Services.get('login', { provider: "ha", uname: this.$.username.value, password: $.md5(this.$.password.value) }, (result) => this.getLoginCallback(result));
    }

    @listen("loginFB.tap")
    loginFB() {
        FB.init({ appId: '876939902336614', xfbml: true, version: 'v2.9' });
        FB.login((fbToken) => {
            FB.api('/me?fields=name,first_name,last_name,email,link', (fbUser) => {
                Services.get('login', { provider: "facebook", utoken: JSON.stringify(fbUser) }, (result) => this.getLoginCallback(result));
            });
        }, { scope: 'public_profile, email' });
    }

    @listen("loginG.tap")
    loginG() { //TODO: user Polymer google sign in instead?
        var params = {
            client_id: "232489990938-2m96hqlhfm75bqvqtr8i4ukvnuhrc7n4.apps.googleusercontent.com", //"364350662015-nssk0tgtoh9d7d0r7brt78mr0utvoi0d.apps.googleusercontent.com",
            immediate: false,
            response_type: "token",
            scope: "email"
        };
        gapi.auth.authorize(params, (UToken) => {
            gapi.client.load('plus', 'v1', () => {
                var object = { path: '/plus/v1/people/me' };
                var request = gapi.client.request(object);
                request.then((googleToken) => {
                    var gplink = 'https://plus.google.com/' + googleToken.result.id;
                    var token = { id: googleToken.result.id, name: googleToken.result.displayName, photo: googleToken.result.image.url, email: googleToken.result.emails[0].value, link: gplink };
                    Services.get('login', { provider: "google-plus", utoken: JSON.stringify(token) }, (result) => this.getLoginCallback(result));
                }, (fail) => { });
            });
        });
    }

    private getLoginCallback(result) {
        if (result.data.status.code == 1) //Authorized
        {
            if (this.remember)
                localStorage.setItem("sessionID", (<any>document).sid);
            (<any>this.domHost).$.windowbasic.close();
            App.haUsers.login(result.data.user);
            return;
        }

        App.toast.show('Forkert brugernavn eller adgangskode');
    }

    public resetPasswordConfirm() {
        if (!(this.$.inputEmail.validate() && this.validatePassword('new', 'old'))) {
            App.toast.show('Ikke alle felter er udfyldt korrekt');
            return;
        }

        Services.get('auth', { send_reset_password_mail_to: this.email, new_password: $.md5(this.password1) }, (result) => {
            Common.dom.append(DialogAlert.create("Der vil nu blive sendt en email til den adresse du har angivet. Følg instruktionerne i emailen, for at fortsætte."));
        });
        this.$.dialog.close();
    }
    resetPasswordDismiss() {
        this.$.dialog.close();
    }

    public passwordErrorMessage(password: string): string {
        if (password.length == 0)
            return 'Adgangskoden skal udfyldes';

        if (password.length < 6)
            return 'Minimumslængde på 6 tegn';

        return 'Adgangskoderne er ikke ens';
    }

    @observe('password1')
    @observe('password2')
    validatePassword(newValue: string, oldValue: string): boolean {
        if (oldValue == undefined)
            return false;

        if (!this.$.inputPassword1.validate() || !this.$.inputPassword2.validate())
            return false;

        if (this.password1 != this.password2) {
            this.$.inputPassword2.invalid = true;
            return false;
        }

        return true;
    }
}

PanelLogin.register();