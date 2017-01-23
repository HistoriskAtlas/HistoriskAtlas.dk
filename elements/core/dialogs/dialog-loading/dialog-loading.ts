@component("dialog-loading")
class DialogLoading extends polymer.Base implements polymer.Element {
    
    @property({ type: String })
    public text: string;

    @property({ type: Number, value: 0 })
    public elevation: number;

    private texts: Array<string>;
    private oldText: string;
    
    ready() {
        this.texts = [];
    }
    
    public show(text: string) {
        if (this.texts.length == 0 && !this.text)
            this.text = text;
        else
            this.texts.push(text);

        this.elevation = 1;
    }

    public hide(text: string) {
        if (this.text == text) {
            if (this.texts.length == 0) {
                this.oldText = text;
                this.text = '';
            } else
                this.text = this.texts.pop();
        } else
            this.texts.splice(this.texts.indexOf(text), 1);

        if (!this.text)
            this.elevation = 0;
    }

    shownText(text: string): string {
        return text ? text : this.oldText;
    } 

}

DialogLoading.register();