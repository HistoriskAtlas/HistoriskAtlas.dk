@component("confirm-input")
class ConfirmInput extends polymer.Base implements polymer.Element {

    @property({ type: String, notify: true })
    public value: string;

    @property({ type: String })
    public immediateValue: string;    

    @property({ type: String })
    public label: string;

    @property({ type: Boolean, value: true })
    public disabled: boolean;

    @property({ type: Boolean, value: false })
    public multiline: boolean;

    iconTap() {
        this.disabled = !this.disabled;
        if (!this.disabled)
            this.$$('#paperInput').focus();
        else
            this.value = this.immediateValue;
    }

    @observe('value')
    valueChanged() {
        this.immediateValue = this.value;
    }

    @observe('disabled')
    disabledChanged() {
        var input = this.$$('#paperInput');
        if (input) 
            input.updateStyles();
    }

    icon(disabled: boolean): string {
        return disabled ? 'create' : 'check';
    }

    //@listen('paperInput.focusout')
    paperInputFocusout(e: any) {
        if (this.contains(e.relatedTarget))
            return;
        
        this.disabled = true;

        if (this.value != this.immediateValue)
            $(this).append(DialogConfirm.create('save-changes', 'Vil du gemme ændringerne i feltet "' + this.label + '"?'));
    }

    @listen('save-changes-confirmed')
    saveChangesConfirmed(e: any) {
        this.value = this.immediateValue;
    }

    @listen('save-changes-dismissed')
    saveChangesDismissed(e: any) {
        this.immediateValue = this.value;
    }
}

ConfirmInput.register();