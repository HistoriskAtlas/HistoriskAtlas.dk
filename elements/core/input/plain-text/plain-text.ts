@component("plain-text")
class PlainText extends polymer.Base implements polymer.Element {
    @property({ type: String, notify: true })
    public content: string;

    @property({ type: Boolean, value: false })
    public editable: boolean;

    @property({ type: Number })
    public maxlength: number;

    @property({ type: Number })
    public length: number;

    @property({ type: Boolean, notify: true })
    public immediateContent: string;

    @property({ type: String })
    public placeholder: string;

    @property({ type: Boolean, value: false })
    public allowLinebreaks: boolean;

    @property({ type: Boolean })
    public numeric: boolean;

    @property({ type: Boolean, value: false })
    public showPlaceholderWhenNotEditing: boolean;

    @property({ type: Boolean, value: false })
    public enableEditorPanel: boolean;

    @property({ type: Boolean, value: false })
    public enableReadMore: boolean;

    //@property({ type: Boolean, value: false })
    //public hasFocus: boolean;

    ready() {
        this.contentChanged();
    }

    public setFocus() {
        if (this.editable)
            (<any>this.$$('#content')).textarea.focus();
    }

    public focus() { //TODO rename...
        //this.hasFocus = true;

        if (!this.editable || !this.enableEditorPanel)
            return;
        $(this.$$('#editorPanel')).css('opacity', 1);
        $(this.$$('#editorPanel')).css('pointer-events', 'auto');
        $(this.$$('#editorPanel')).css('padding-top', '5px');
    }

    blur() {
        //this.hasFocus = false;

        if (this.editable) {
            this.content = this.immediateContent; //TODO: also on inactivity....?

            if (this.enableEditorPanel) {
                $(this.$$('#editorPanel')).css('opacity', 0);
                $(this.$$('#editorPanel')).css('pointer-events', 'none');
                $(this.$$('#editorPanel')).css('padding-top', '0px');
            }
        }
    }

    @observe('content')
    contentChanged() {
        if (!this.content && this.showPlaceholderWhenNotEditing && !this.editable)
            this.content = this.placeholder;

        this.immediateContent = this.content;
    }

    @observe('immediateContent')
    immediateContentChanged() {
        this.length = this.immediateContent.length + (this.immediateContent.match(/\n/g) || []).length; //"hack" to correctly count newline as 2 chars
        $(this).toggleClass('no-content', this.immediateContent.length == 0)
    }

    //@observe('enableEditorPanel')
    //@observe('hasFocus')
    //enableEditorPanelChanged() {
    //    this.setMarginTop();
    //}

    //setMarginTop() {
    //    $(this.$$('#content')).css('margin-top', this.enableEditorPanel ? (this.hasFocus ? '25px' : '17px') : '0px');
    //}

    //contentStyle(enableEditorPanel: boolean, hasFocus: boolean): string {
    //    return 'margin-top: ' + (enableEditorPanel ? (hasFocus ? '25' : '17') : '0') + 'px';
    //}

    keydown(e: any) {
        if (e.which === 13 && !this.allowLinebreaks)
            e.preventDefault();

        if (this.numeric)
            if (!this.keyCodeIsNumeric(e.which) && !this.keyCodeIsControl(e.which))
                e.preventDefault();            
    }

    private keyCodeIsNumeric(code: number): boolean {
        return (code >= 48 && code <= 57) || (code >= 96 && code <= 105)
    }

    private keyCodeIsControl(code: number): boolean {
        return (code == 37 || code == 39 || code == 8 || code == 46)
    }

    private showReadMore(content: string): boolean {
        if (!this.enableReadMore)
            return;

        return content.lastIndexOf('...') == content.length - 3;
    }

    readMore() {
        this.fire('read-more-tapped');
    }

}

PlainText.register();