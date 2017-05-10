@component("rich-text")
class RichText extends polymer.Base implements polymer.Element {
    @property({ type: String, notify: true })
    public content: string;

    @property({ type: Boolean, value: false })
    public editable: boolean;

    @property({ type: Number })
    public maxlength: number; //TODO: Should not be possible to set maxlength.......... because it screws up with formatting.....

    @property({ type: Number })
    public length: number;

    @property({ type: Boolean, notify: true })
    public immediateContent: string;

    @property({ type: String })
    public placeholder: string;

    @property({ type: Number })
    public truncateTextAt: number;

    @property({ type: Boolean, value: false })
    public textIsTruncated: boolean;

    @property({ type: Boolean, value: true })
    public truncatedTextHidden: boolean;

    //@property({ type: Boolean })
    //public showPlaceholder: boolean;

    @property({ type: Boolean })
    public isIE: boolean;

    private static matchGeoLink: RegExp = new RegExp('<a href=["\']http:\/\/historiskatlas\.dk\/.*?_\\((.*?)\\)["\']>(.*?)<\/a>', 'g');
    private savedSelectionRange: Range;

    ready() {
        //this.contentChanged();
        this.isIE = Common.isIE;
    }

    focus() {
        if (this.editable) {
            //this.focusButton();
            $(this.$.content).focus(); //TODO: needed?
        }
    }
    blur() {
        if (this.editable)
            this.set('content', this.immediateContent); //TODO: also on inactivity....?
    }

    focusButton(e: Event) {
        if (e.preventDefault)
            e.preventDefault();

        $(this.$.content).focus();
        e.returnValue = false;
    }

    keypress(e: any) {
        if (this.maxlength)
            if ((<HTMLDivElement>this.$.content).innerText.length >= this.maxlength)
                e.preventDefault();
    }

    input() {
        var elem = <HTMLDivElement>this.$.content;

        this.set('immediateContent', elem.innerHTML);

        //this.length = elem.innerText.length;
    }

    keyup() { //Needed in IE10+?
        var elem = <HTMLDivElement>this.$.content;
        //this.set('immediateContent', elem.innerHTML);
        this.set('immediateContent', this.isIE ? elem.innerHTML.replace(/<\s*font[^>]*>(.*?)<\s*\/\s*font\s*>/gi, '$1') : elem.innerHTML); //IE hack to remove weird font tags...
    }

    paste(e: ClipboardEvent) {
        setTimeout(() => this.cleanHtml(), 0);
    }
    private cleanHtml() {
        var elem = <HTMLDivElement>this.$.content;
        //elem.innerHTML = '<div>' + elem.innerHTML + '</div>';
        //elem.innerHTML = elem.innerHTML.replace(/<o:p>\s*<\/o:p>/g, "");
        //elem.innerHTML = elem.innerHTML.replace(/<o:p>.*?<\/o:p>/g, "&nbsp;");

        var html = elem.innerHTML;
        html = html.replace(/>\n+?</gi, '><'); //removes linebreaks between tags
        html = html.replace(/\n/gi, ' '); //converts all other linebreaks to a space
        html = html.replace(/<\s*p[^>]*>(.*?)<\s*\/\s*p\s*>/gi, '$1<br>'); //converts p's to br's
        html = html.replace(/<b [^>]*>/gi, '<b>'); //removes styles from b (IE fix)
        html = html.replace(/<i [^>]*>/gi, '<i>'); //removes styles from i (IE fix)
        
        var text = Common.html2rich(html);
        text = text.replace(/<[^>]*>/gi, '');
        elem.innerHTML = Common.rich2html(text);
        this.input();
    }

    @observe('content')
    contentChanged() {
        if (this.content == null)
            return;

        var content: string;

        if ((<any>window).App)
            content = this.content.replace(RichText.matchGeoLink, (g1, g2, g3, g4, g5) => { //TODO: function not needed... use $3 in a string instead?
                return '<a href="javascript:void(0);" onclick="Common.geoClick(' + g2 + ')">' + g3 + '</a>'
            });
        else
            content = this.content;

        this.set('immediateContent', content);
    }

    @observe('immediateContent')
    immediateContentChanged() {
        var element = <HTMLDivElement>this.$.content;

        //if (this.placeholder && this.editable && !oldVal)
        //    this.showPlaceholder = this.immediateContent == '';

        if (element.innerHTML != this.immediateContent) {
            if (!this.editable && this.truncateTextAt)
                this.setTruncatedHtml()
            else
                element.innerHTML = this.immediateContent
        }

        if (element.innerText.trim() == '')
            this.set('immediateContent', '');

        this.length = element.innerText.length;
    }

    setTruncatedHtml() {
        var element = <HTMLDivElement>this.$.content;
        var truncatedHtml = Common.truncateHtml(this.immediateContent, this.truncateTextAt);
        this.textIsTruncated = truncatedHtml.html.length < this.immediateContent.length;
        element.innerHTML = (this.textIsTruncated && this.truncatedTextHidden) ? truncatedHtml.html : this.immediateContent;
    }

    toggleTruncation() {
        this.truncatedTextHidden = !this.truncatedTextHidden
        this.setTruncatedHtml();
    }

    readmoreText(truncatedTextHidden: boolean): string {
        return truncatedTextHidden ? 'læs mere' : 'luk';
    }

    //@observe('editable')
    //editableChanged() {
    //    if (this.editable)
    //        if (this.placeholder && this.immediateContent == '')
    //            this.showPlaceholder = true;;
    //}

    boldTap() { this.exec('bold') };
    italicTap() { this.exec('italic') };
    linkTap() {
        var n = window.getSelection().anchorNode;

        (n.nodeType === 3) && (n = n.parentNode);

        if (n.nodeName.toLowerCase() == "a") {
            this.selectElementContents(n);
            this.exec('unlink');
        } else {
            this.saveSelection();
            this.$$('#linkUrlDialog').open();
        }
    };
    undoTap() { this.exec('undo') };
    redoTap() { this.exec('redo') };

    private exec(com: string, opts: any = null) {
        //var elem = window.getSelection().anchorNode.parentNode; //Was parentElement

        //while (elem != this.$.content) {
        //    if (elem == document.documentElement)
        //        return;
        //    elem = elem.parentElement;
        //}

        //var test = document.getSelection().getRangeAt(0);
        //alert(document.getSelection().getRangeAt(0));
        //if (this.isIE) {
        //    (<any>document.getSelection().getRangeAt(0)).execCommand(com, false, opts);
            
        //}
        //else
        document.execCommand(com, false, opts);
        this.input();
    }

    @listen('link-url-confirmed')
    linkUrlConfirmed(e: any) {
        this.restoreSelection();
        var url: string = e.detail;
        if (url.toLowerCase().indexOf('http') == -1)
            url = 'http://' + url;
        this.exec('createlink', url)
    }

    private selectElementContents(el: Node) {
        var range = document.createRange();
        range.selectNodeContents(el);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    }

    private saveSelection() {
        if (window.getSelection) {
            var sel = window.getSelection();
            if (sel.getRangeAt && sel.rangeCount)
                this.savedSelectionRange = sel.getRangeAt(0);
        }
        //else if ((<any>document).selection && (<any>document).selection.createRange)
        //    this.savedSelectionRange = (<any>document).selection.createRange();
    }

    private restoreSelection() {
        if (window.getSelection) {
            var sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(this.savedSelectionRange);
        }
        //else if ((<any>document).selection && (<any>this.savedSelectionRange).select)
        //    (<any>this.savedSelectionRange).select();
    }
}

RichText.register();