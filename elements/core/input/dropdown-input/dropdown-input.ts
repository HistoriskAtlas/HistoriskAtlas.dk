@component("dropdown-input")
class DropdownInput extends polymer.Base implements polymer.Element {

    @property({ type: Number, notify: true })
    public selected: number;

    @property({ type: String })
    public label: string;

    //@property({ type: Boolean, value: true })
    //public disabled: boolean;

    //iconTap() {
    //    this.disabled = !this.disabled;
    //    if (!this.disabled)
    //        this.$.paperInput.focus();
    //    else
    //        this.value = this.immediateValue;
    //}

    //@observe('value')
    //valueChanged() {
    //    this.immediateValue = this.value;
    //}

    //@observe('disabled')
    //disabledChanged() {
    //    this.$.paperInput.updateStyles();
    //}

    //icon(disabled: boolean): string {
    //    return disabled ? 'create' : 'check';
    //}

    //@listen('paperDropdownMenu.focusout')
    //paperDropdownMenuFocusout(e: any) {
    //    if (this.contains(e.relatedTarget))
    //        return;
        
    //    this.disabled = true;
    //}
}

DropdownInput.register();