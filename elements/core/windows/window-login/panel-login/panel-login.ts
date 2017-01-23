@component("panel-login")
class PanelLogin extends polymer.Base implements polymer.Element {

    @property({ type: Boolean, value: false })
    private remember: boolean;

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
        FB.login((fbToken) => {
            FB.api('/me', (fbUser) => {
                //this.loginData = { provider: "facebook", utoken: JSON.stringify(fbUser) };
                Services.get('login', { provider: "facebook", utoken: JSON.stringify(fbUser) }, (result) => this.getLoginCallback(result));
            });
        }, { scope: 'public_profile, email' });
    }

    @listen("loginG.tap")
    loginG() { //TODO: user Polymer google sign in instead?
        var params = {
            client_id: "364350662015-nssk0tgtoh9d7d0r7brt78mr0utvoi0d.apps.googleusercontent.com",
            immediate: false,
            response_type: "token",
            scope: "https://www.googleapis.com/auth/plus.login"
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
}

PanelLogin.register();