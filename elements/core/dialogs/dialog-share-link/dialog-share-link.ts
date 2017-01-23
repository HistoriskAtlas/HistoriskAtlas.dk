@component("dialog-share-link")
class DialogShareLink extends polymer.Base implements polymer.Element {
    
    @property({ type: String })
    private link: string;

    public open() {
        this.$.dialog.open();
    }

    copy() {
        var target = this.$.input.inputElement;
        target.focus();
        target.setSelectionRange(0, target.value.length);
    
        try {
            document.execCommand("copy");
            if ('App' in window)
                App.toast.show('Link kopieret til udklipsholder.')
        } catch (e) {
            if ('App' in window)
                App.toast.show('Kunne ikke kopiere linket. Kopiér det manuelt.')
        }

        //if (!succeed)
        //    App.toast
    }
}

DialogShareLink.register();