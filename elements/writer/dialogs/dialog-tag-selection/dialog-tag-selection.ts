@component("dialog-tag-selection")
class DialogTagSelection extends polymer.Base implements polymer.Element {

    @property({ type: String })
    public title: string;

    @property({ type: String })
    public tags: Array<HaTag>;

    private callback: (tag: HaTag) => void;

    constructor(title, tags: Array<HaTag>, callback: (tag: HaTag) => void) {
        super();
        this.title = title;
        this.tags = tags;
        this.callback = callback;
    }

    tagTap(e) {
        this.callback(e.model.item);
    }

    @listen('dialog.iron-activate')
    @listen('dialog.iron-overlay-closed')
    close() {
        $(this).remove();
    }
}

DialogTagSelection.register();