class HaSubContentPDF extends HaSubContent {
    private _title: string;
    private _filename: string;

    constructor(data: any, content: HaContent) {
        super(data, content);
        this._title = data.title;
        this._filename = data.filename;
    }

    get isPDF(): boolean {
        return true;
    }

    get title(): string {
        return this._title;
    }
    set title(value: string) {
        this._title = value;
    }

    get filename(): string {
        return this._filename;
    }
    set filename(value: string) {
        this._filename = value;
    }

    public insert() {
        super.insert(null, 'pdf',
            {
                title: this._title,
                filename: this._filename
            }
        )
    }

    public update(property: string) {
        switch (property) {
            case 'title':
                Services.update('pdf', { id: this._id, title: this._title, filename: this._filename }, (result) => { }); break; //HACK with filename included... to avoid to closely followed API calls...
            //case 'filename':
            //    Services.update('pdf', { id: this._id, filename: this._filename }, (result) => { }); break;
            default:
                super.update('pdf', property); break;
        }
    }

    public delete() {
        this.deleteSuper('pdf')
    }
}