@component("content-viewer")
class ContentViewer extends polymer.Base implements polymer.Element {

    public static contentSchema: string = '{content:[id,geoid,ordering,deleted,contenttypeid,{texts:[empty,id,created,{user:[firstname,lastname]},headline,text1]},{biblios:[empty,id,created,cql]},{pdfs:[empty,id,created,title,filename,ordering]},{externalcontent:[empty,id,created,externalsourceid,text,link]},{tag_contents:[{collapse:tagid}]}]}'

    @property({ type: Object, notify: true })
    public content: HaContent;

    @property({ type: Boolean, value: false })
    public editing: boolean;

    @property({ type: Number })
    public truncateTextAt: number;
}

ContentViewer.register();