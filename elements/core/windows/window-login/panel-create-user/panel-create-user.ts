@component("panel-create-user")
class PanelCreateUser extends polymer.Base implements polymer.Element {

    private exisitingLogins: Array<string> = [];

    @property({ type: String })
    public login: string;

    @property({ type: String })
    public firstname: string;

    @property({ type: String })
    public lastname: string;

    @property({ type: String })
    public email: string;

    @property({ type: String })
    public password1: string;

    @property({ type: String })
    public password2: string;

    @property({ type: Boolean })
    public accepted: boolean;

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

    public passwordErrorMessage(password: string): string {
        if (password.length == 0)
            return 'Adgangskoden skal udfyldes';

        if (password.length < 6)
            return 'Minimumslængde på 6 tegn';

        return 'Adgangskoderne er ikke ens';
    }

    @observe('login')
    validateLogin(newValue: string, oldValue: string): boolean {
        if (oldValue == undefined)
            return false;

        if (!this.$.inputLogin.validate())
            return false;

        if (this.exisitingLogins.indexOf(newValue) > -1) {
            this.$.inputLogin.invalid = true;
            return false;
        }

        return true;
    }

    public loginErrorMessage(login: string): string {
        if (login.length == 0)
            return 'Brugernavn skal udfyldes';

        return 'Brugernavnet findes allerede';
    }

    public createUser() {
        if (!(this.validateLogin(this.login, this.login) && this.$.inputFirstname.validate() && this.$.inputLastname.validate() && this.$.inputEmail.validate() && this.validatePassword('new', 'old'))) {
            App.toast.show('Ikke alle felter er udfyldt korrekt');
            return;
        }

        if (!this.accepted) {
            App.toast.show('Du skal acceptere betingelser for anvendelse for at fortsætte');
            return;
        }

        Services.get('login', {
            provider: "ha", utoken: JSON.stringify({
                login: this.login,
                pass: Common.md5(this.password1),
                email: this.email,
                firstname: this.firstname,
                lastname: this.lastname,
                role: 2 //Has no effect(?)
            })
        }, (result: any) => {
            if (result.data.status.code == 1) {
                App.haUsers.login(result.data.user); 
                this.$.confirmationDialog.open();
            } else {
                App.toast.show("Brugernavnet findes allerede. Vælg et andet.")
                this.exisitingLogins.push(this.login)
                this.validateLogin(this.login, this.login);
            }
        });

    }

    termsOfUseTap() {
        Common.dom.append(WindowTermsOfUse.create());
    }

    privacyTap() {
        Common.dom.append(WindowPrivacy.create());
    }
}

PanelCreateUser.register();