class HaContent {
    private _id: number;
    private _headline: string;
    private _geoid: number;
    private _contenttypeid: number;
    private _ordering: number;

    public subContents: Array<HaSubContent> = [];

    constructor(data: any) {
        this._id = data.id || data.contentid;
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

        var externalcontents = data.externalcontents || data.externalcontent;  // data.externalcontent is v5 specs.....
        if (externalcontents)
            for (var external of externalcontents)
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

    get headline(): string {
        switch (this._contenttypeid) {
            case 1: return 'Litteratur';
        }
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
        Services.HAAPI_POST('content', {}, Common.formData({ geoid: this._geoid, headline: this._headline, ordering: this._ordering, contenttypeid: this._contenttypeid }), (result) => {
            this._id = result.data.contentid;

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
       })
    }

    public update(property: string) {
        switch (property) {
            case 'ordering': //TODO: Add Ordering to PDF and Biblio tables.....................
                Services.HAAPI_PUT('content', this._id, {}, Common.formData({ ordering: this._ordering })); break;
            case 'headline':
                Services.HAAPI_PUT('content', this._id, {}, Common.formData({ headline: this._headline })); break;
        }
    }

    public delete() {
        Services.HAAPI_DELETE('content', this._id, true);
    //    for (var subContent of this.subContents) // Not needed... is cascadedeleted...
    //        subContent.delete();
    }

    public sort(otherContent: HaContent): number {
        return this._ordering - otherContent.ordering;
    }

    public get externals(): Array<HaSubContentExternal> {
        var result: Array<HaSubContentExternal> = [];
        for (var subContent of this.subContents)
            if (subContent instanceof HaSubContentExternal)
                result.push(<HaSubContentExternal>subContent);
        return result;
    }

}