class HaSubContentBiblio extends HaSubContent {
    private _cql: string;

    constructor(data: any, content: HaContent) {
        super(data, content);
        this._cql = data.cql;
    }

    get isBiblio(): boolean {
        return true;
    }

    get cql(): string {
        return this._cql;
    }
    set cql(value: string) {
        this._cql = value;
    }

    public insert() {
        super.insert(null, 'biblio',
            {
                cql: this._cql
            }
        )
    }

    public update(property) {
        switch (property) {
            case 'cql':
                Services.update('biblio', { id: this._id, cql: this._cql }, (result) => { }); break;
            default:
                super.update('biblio', property); break;
        }
    }
    public delete() {
        this.deleteSuper('biblio')
    }
}