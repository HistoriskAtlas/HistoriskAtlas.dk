@component("main-search")
class MainSearch extends polymer.Base implements polymer.Element {

    @property({ type: Boolean, notify: true, value: false })
    public open: boolean;

    searchIconTap() {
        if (!this.open) {
            this.open = true;
            $(this.$.searchInput).focus();
        } else
            this.doSearch(this.$.searchInput.value);
    }

    containerClass(open: boolean): string {
        return open ? 'expanded' : ''; 
    }

    searchCloseTap() {
        this.doSearch(null);
    }

    @listen("searchInput.keyup")
    searchInputKeyup(e: KeyboardEvent) {
        if (e.keyCode == 13) {
            $(this.$.searchInput).blur();
            this.doSearch(this.$.searchInput.value);
        }
    }

    @observe('open')
    openChanged() {
        if (this.open)
            $(this).addClass('expanded');
        else
            $(this).removeClass('expanded');
    }

    private doSearch(value: string) {
        this.open = false;
        setTimeout(() => this.$.searchInput.value = '', 300);
        if (!value)
            return

        switch (value) {
            case 'devtools': Common.dom.append(WindowDev.create()); break;
            default: Common.dom.append(WindowSearch.create(value)); break;
        }
    }
}

MainSearch.register();