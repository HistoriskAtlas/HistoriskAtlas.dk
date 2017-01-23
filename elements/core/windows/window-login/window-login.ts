@component("window-login")
class WindowLogin extends polymer.Base implements polymer.Element {

    @property({ type: Number, value: 0 })
    public selectedTab: number;

    public passwordErrorMessage(password: string): string {
        if (password.length == 0)
            return 'Adgangskoden skal udfyldes';

        return 'Minimumslængde på 6 tegn';
    }
}

WindowLogin.register();