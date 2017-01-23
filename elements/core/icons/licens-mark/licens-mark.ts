@component("licens-mark")
class LicensMark extends polymer.Base implements polymer.Element {

    @property({ type: Object })
    public licens: HaLicens;

    @property({ type: Array })
    public licenses: Array<HaLicens>;

    @property({ type: Boolean })
    public editing: boolean;

    @property({ type: String, value: 'top' })
    public verticalAlign: string;

    @property({ type: Boolean, value: true })
    public showPlaceholder: boolean;

    ready() {
        setTimeout(() => { this.licenses = (<HaLicenses>document.querySelector('ha-licenses')).licenses }, 500)
    }

    tap() {
        if (this.licens) {
            if (typeof this.editing != 'undefined')
                window.open(this.licens.url, '_new');
        } else
            this.dropdownTap();
    }

    dropdownTap(e: any = null) {
        if (e)
            e.stopPropagation();
        var pmb = this.$$('#paperMenuButton');
        pmb.opened = !pmb.opened;
    }

    changeTap(e: any) {
        this.fire('licens-changed', e.model.item);
        var pmb = this.$$('#paperMenuButton');
        pmb.opened = false;
    }

    infoTap(e: any) {
        window.open(e.model.item.url, '_new');
    }

    @observe('licens')
    @observe('editing')
    changed() {
        this.showPlaceholder = !this.licens && this.editing;
    }
}

LicensMark.register();