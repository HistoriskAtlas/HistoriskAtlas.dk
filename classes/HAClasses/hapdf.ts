class HAPdf {
    private id: number;
    private title: string;
    private filename: string;
    private src: any;
    private deleted: string;

    constructor(data: any) {
        this.id = data.id
        this.title = data.title;
        this.filename = data.filename;
        this.src = data.src;
        this.deleted = data.deleted;
    }

    get _id(): number {
        return this.id;
    }

    get _title(): string {
        return this.title;
    }

    get _filename(): string {
        return this.filename;
    }

    get _src(): any {
        return this.src;
    }

    get _deleted(): string {
        return this.deleted;
    }

    set setTitle(newTitle: string) {
        this.title = newTitle;
    }

    set setFilename(newFilename: string) {
        this.filename = newFilename;
    }

    set setSrc(newSrc: any) {
        this.src = newSrc;
    }

    set setDeleted(newDeleted: string) {
        this.deleted = newDeleted;
    }
}
