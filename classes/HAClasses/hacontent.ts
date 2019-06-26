class HaContent {
    private _id: number;
    private _headline: string;
    private _geoid: number;
    private _contenttypeid: number;
    private _ordering: number;

    //public texts: Array<HaSubContentText> = [];
    //public biblios: Array<HaSubContentBiblio> = [];
    //public pdfs: Array<HaSubContentPDF> = [];
    //public externals: Array<HaSubContentExternal> = [];
    public subContents: Array<HaSubContent> = [];

    constructor(data: any) {
        this._id = data.id;
        this._headline = data.headline;
        this._geoid = data.geoid;
        this._contenttypeid = data.contenttypeid;
        this._ordering = data.ordering;

        if (data.texts)
            for (var text of data.texts)
                this.subContents.push(new HaSubContentText(text, this));

        if (data.biblios)
            for (var biblio of data.biblios)
                this.subContents.push(new HaSubContentBiblio(biblio, this));

        if (data.pdfs)
            for (var pdf of data.pdfs)
                this.subContents.push(new HaSubContentPDF(pdf, this));

        if (data.externalcontent)
            for (var external of data.externalcontent)
                this.subContents.push(new HaSubContentExternal(external, this));
    }

    get id(): number {
        return this._id;
    }

    get ordering(): number {
        return this._ordering;
    }
    set ordering(value: number) {
        this._ordering = value;
    }

    //get count(): number {
    //    return this.texts.length + this.biblios.length + this.pdfs.length + this.externals.length;
    //}

    get headline(): string {
        switch (this._contenttypeid) {
        //    case 0:
        //        if (this.texts.length > 0)
        //            return this.texts[0].headline;
        //        else {
        //            if (this.pdfs.length > 0)
        //                return 'Dokumenter'
        //        }
        //        break;
            case 1: return 'Litteratur';
        }

        //return '';
        return this._headline;
    }
    set headline(value: string) {
        this._headline = value;
    }

    public get isText(): boolean {
        return this._contenttypeid == 0;
    }
    public get isBiblio(): boolean {
        return this._contenttypeid == 1;
    }
    public get isExternal(): boolean {
        return this._contenttypeid == 2;
    }
    public get isEditorial(): boolean {
        return this._contenttypeid == 3;
    }
    public get showAsTab(): boolean {
        return this.isText || this.isBiblio || this._contenttypeid == 5; //Sabotage
    }

    public insert(callback?: () => void) {
        var data: any = {
            geoid: this._geoid,
            headline: this._headline,
            ordering: this._ordering,
            userid: App.haUsers.user.id,
            contenttypeid: this._contenttypeid
        };
        Services.insert('content', data, (result) => {
            this._id = result.data[0].id;

            //for (var text of this.texts)
            //    text.insert(null); //TODO callbacks needed?
            //for (var biblio of this.biblios)
            //    biblio.insert();
            //for (var external of this.externals)
            //    external.insert();
            for (var subContent of this.subContents) {
                if (subContent instanceof HaSubContentText)
                    (<HaSubContentText>subContent).insert(null);
                if (subContent instanceof HaSubContentBiblio)
                    (<HaSubContentBiblio>subContent).insert();
                if (subContent instanceof HaSubContentExternal)
                    (<HaSubContentExternal>subContent).insert();
            }

            if (callback)
                callback();

            //var data: any = {
            //    contentid: this._id,
            //};
            //switch (this._type) {
            //    //case ContentType.Text:
            //    //    data.headline = this._headline;
            //    //    data.text1 = this._text; //use Common.html2rich( ?
            //    //    Services.insert('text', data, (result) => { //TODO: Not always text...
            //    //        this._textid = result.data[0].id;
            //    //    })
            //    //    break;
            //    case ContentType.Biblio:
            //        data.cql = this._cql;
            //        Services.insert('biblio', data, (result) => { //TODO: Not always text...
            //            this._biblioid = result.data[0].id;
            //        })
            //        break;
            //}
       })
    }

    public update(property: string) {
        switch (property) {
            case 'ordering': //TODO: Add Ordering to PDF and Biblio tables................................................................................................
                Services.update('content', { id: this._id, ordering: this._ordering }, (result) => { }); break; 
            case 'headline':
                Services.update('content', { id: this._id, headline: this._headline }, (result) => { }); break;
        }
    }

    public delete() {
        Services.delete('content', { id: this._id, deletemode: 'permanent' }, (result) => { })

        //TODO wait for below to finish first?

        //for (var text of this.texts)
        //    text.delete();
        //for (var biblio of this.biblios)
        //    biblio.delete();
        //for (var external of this.externals)
        //    external.delete();

        for (var subContent of this.subContents)
            subContent.delete();


        //switch (this._type) {
        //    case ContentType.Text:
        //        Services.delete('text', { textid: this._textid, deletemode: 'permanent' }, (result) => { })
        //        break;
        //    case ContentType.Biblio:
        //        Services.delete('biblio', { biblioid: this._biblioid, deletemode: 'permanent' }, (result) => { })
        //        break;
        //}
    }

    public sort(otherContent: HaContent): number {
        return this._ordering - otherContent.ordering;
    }
}

//enum ContentType {
//    Intro,
//    Text,
//    Biblio
//}