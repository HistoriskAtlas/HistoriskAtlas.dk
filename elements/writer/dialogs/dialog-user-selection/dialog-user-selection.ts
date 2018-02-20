@component("dialog-user-selection")
class DialogUserSelection extends polymer.Base implements polymer.Element {

    @property({ type: String })
    public title: string;

    @property({ type: Array })
    public users: Array<HAUser>;

    private callback: (user: HAUser) => void;

    constructor(title, users: Array<HAUser>, callback: (user: HAUser) => void) {
        super();
        this.title = title;
        this.users = users;
        this.callback = callback;
    }

    userTap(e) {
        this.callback(e.model.item);
    }

    @listen('dialog.iron-activate')
    @listen('dialog.iron-overlay-closed')
    close() {
        $(this).remove();
    }
}

DialogUserSelection.register();