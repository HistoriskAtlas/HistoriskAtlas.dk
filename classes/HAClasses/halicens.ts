class HaLicens {
    private _tagID: number;
    private _text: string;
    private _url: string;

    constructor(tagID: number, text: string, url: string) {
        this._tagID = tagID;
        this._text = text;
        this._url = url;
    }

    public get tagID(): number {
        return this._tagID;
    }

    public get text(): string {
        return this._text;
    }

    public get url(): string {
        return this._url;
    }

    public get isCopyright(): boolean {
        return this._tagID == 80;
    }
    public get isCC(): boolean {
        return this._tagID != 80;
    }
    public get isBY(): boolean {
        return this.isCC && this.tagID != 79;
    }
    public get isNC(): boolean {
        return this.tagID == 269 || this.tagID == 270 || this.tagID == 271;
    }
    public get isND(): boolean {
        return this.tagID == 268 || this.tagID == 271;
    }
    public get isSA(): boolean {
        return this.tagID == 267 || this.tagID == 270;
    }
    public get isPD(): boolean {
        return this.tagID == 79;
    }
}