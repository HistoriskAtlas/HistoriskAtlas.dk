class HaSubContentPDF extends HaSubContent {
    private _title: string;
    private _filename: string;

    constructor(data: any, content: HaContent) {
        super(data, content);
        this._title = data.title;
        this._filename = data.filename;
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

    public update(property) {
        switch (property) {
            case 'title':
                Services.update('pdf', { id: this._id, cql: this._title }, (result) => { }); break;
            //case 'filename':
            //    Services.update('pdf', { id: this._id, cql: this._filename }, (result) => { }); break;
        }
    }

    public delete() {
        super.delete('pdf')
    }
}