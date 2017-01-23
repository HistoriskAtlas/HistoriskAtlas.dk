@component("dialog-add-to-homescreen")
class DialogAddToHomescreen extends polymer.Base implements polymer.Element {

    @property({ type: String })
    public os: string;

    constructor(os: string) {
        super();
        this.os = os;
    }

    dismissTap() {
        LocalStorage.set('dismissedAddAsApp', 'true');
    }

    isAndroid(os: string): boolean {
        return os == 'android';
    }
    
    isIOS(os: string): boolean {
        return os == 'ios';
    }
}

DialogAddToHomescreen.register();