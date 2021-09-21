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
        //Common.loadJS('facebook-jssdk', '//connect.facebook.com/da_DK/sdk.js');
        //Common.loadJS('google-jssdk', '//apis.google.com/js/client:platform.js');
        (<any>window).handleFacebookResponse = (response) => this.handleFacebookResponse(response);
        Common.loadJS('facebook-jssdk', '//connect.facebook.net/da_DK/sdk.js', () => {
            (<any>window).FB.init({ appId: '876939902336614', cookie: true, xfbml: true, version: 'v11.0' }); //TODO: callback when button is clicked?!................................

        });
        Common.loadJS('google-jssdk', '//accounts.google.com/gsi/client', () => {
            (<any>window).google.accounts.id.initialize({
                client_id: '232489990938-2m96hqlhfm75bqvqtr8i4ukvnuhrc7n4.apps.googleusercontent.com',
                callback: (response) => this.handleGoogleResponse(response)
            });
            (<any>window).google.accounts.id.renderButton(this.$.login_google, {
                theme: 'filled_blue',
                logo_alignment: 'left',
                size: 'large',
                width: 230
            });
        });
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

        //Services.get('login', { provider: "ha", uname: this.$.username.value, password: $.md5(this.$.password.value) }, (result) => this.getLoginCallback(result));
        Services.HAAPI_GET('login', { provider: "ha", username: this.$.username.value, password: Common.md5(this.$.password.value), sid: (<any>document).sid }, (result) => this.getLoginCallback(result?.data));
    }

    private handleFacebookResponse(response: any) {
        if (response.status != 'connected') {
            App.toast.show('Fejl under indlogning via facebook.');
            return;
        }
        (<any>window).FB.api('/me', { fields: 'first_name, last_name, email' }, (meResponse) => {
            var params = {
                sid: (<any>document).sid,
                provider: 'facebook',
                authkey: meResponse.id,
                firstname: meResponse.first_name,
                lastname: meResponse.last_name,
                email: meResponse.email
            }
            Services.HAAPI_GET('login', params, (result) => this.getLoginCallback(result.data));
        });
    }
    private handleGoogleResponse(response: any) {
        var payloadString = (<string>response.credential).split('.')[1];
        var payload = JSON.parse(atob(payloadString));
        var params = {
            sid: (<any>document).sid,
            provider: 'google',
            authkey: payload.sub,
            firstname: payload.given_name,
            lastname: payload.family_name,
            email: payload.email
        }
        Services.HAAPI_GET('login', params, (result) => this.getLoginCallback(result.data));
    }
    
    private getLoginCallback(user) {
        //if (result.data.status.code == 1) //Authorized
        if (user) //Authorized
        {
            if (this.remember)
                LocalStorage.set("sessionID", (<any>document).sid);
            (<any>this.domHost).$.windowbasic.close();
            App.haUsers.login(user);

            //if (result.data.user.role > 3)
            //    Services.get('hadb6stats.login', { provider: "ha", uname: this.$.username.value, password: $.md5(this.$.password.value) }); //hadb5stats

            return;
        }

        App.toast.show('Forkert brugernavn eller adgangskode');
    }

    //private getStatsLoginCallback(result) {
    //    if (result.data.status.code == 1) //Authorized
    //        if (this.remember)
    //            localStorage.setItem("sessionID", (<any>document).sid);
    //}

    public resetPasswordConfirm() {
        if (!(this.$.inputEmail.validate() && this.validatePassword('new', 'old'))) {
            App.toast.show('Ikke alle felter er udfyldt korrekt');
            return;
        }

        //Services.get('auth', { send_reset_password_mail_to: this.email, new_password: Common.md5(this.password1) }, (result) => {
        //    Common.dom.append(DialogAlert.create("Der vil nu blive sendt en email til den adresse du har angivet. Følg instruktionerne i emailen, for at fortsætte."));
        //});
        Services.HAAPI_GET('resetpassword', { email: this.email, password: Common.md5(this.password1) }, () => {
            Common.dom.append(DialogAlert.create("Der vil nu blive sendt en email til den adresse du har angivet. Følg instruktionerne i emailen, for at fortsætte."));
        })
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