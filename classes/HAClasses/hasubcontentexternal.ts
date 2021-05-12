class HaSubContentExternal extends HaSubContent {
    private _text: string;
    private _externalsourceid: number; //TODO: not used yet...
    private _link: string;

    constructor(data: any, content: HaContent) {
        super(data, content);
        if (!this._id)
            this._id = data.externalcontentid;
        this._text = data.text;
        this._link = data.link;
    }

    get isExternal(): boolean {
        return true;
    }


    get text(): string {
        return this._text;
    }
    set text(value: string) {
        this._text = value;
    }

    get link(): string {
        return this._link;
    }
    get thumbnailUrl(): string {
        return 'http://img.youtube.com/vi/' + this._link + '/0.jpg'
    }
    get embedUrl(): string {
        return 'https://www.youtube.com/embed/' + this._link + '?autoplay=1&rel=0'
    }

    public insert() {
        //TODO...
    }

    public delete() {
        //TODO...
    }
}