@component("dialog-selection")
class DialogSelection extends polymer.Base implements polymer.Element {
    public open() {
        this.$.dialog.open();
    }

    @listen('dialog.iron-activate')
    itemActivate() {
        this.$.dialog.close();
    }
}

DialogSelection.register();