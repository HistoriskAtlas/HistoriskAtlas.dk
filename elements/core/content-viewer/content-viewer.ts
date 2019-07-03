@component("content-viewer")
class ContentViewer extends polymer.Base implements polymer.Element {

    public static contentSchema: string = '{content:[id,headline,geoid,ordering,deleted,contenttypeid,{texts:[empty,id,ordering,name,type,created,{user:[firstname,lastname]},text1]},{biblios:[empty,id,ordering,created,cql]},{pdfs:[empty,id,ordering,created,title,filename,ordering]},{externalcontent:[empty,id,created,externalsourceid,text,link]},{tag_contents:[{collapse:tagid}]}]}'

    @property({ type: Object, notify: true })
    public content: HaContent;

    @property({ type: Boolean, value: false })
    public editing: boolean;

    @property({ type: Boolean, value: false })
    public adjustable: boolean;

    @property({ type: Number })
    public truncateTextAt: number;

    private showPlainText(isPlainText: boolean, text: string, editing: boolean): boolean {
        if (!isPlainText)
            return false;
        if (editing)
            return true;
        return !!text;
    }
}

ContentViewer.register();