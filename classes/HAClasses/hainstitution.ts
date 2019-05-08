class HAInstitution {
    private _id: number;
    private _tagid: number;
    private _url: string;
    private _email: string;
    private _type: boolean;
    private _content: HaContent;
    public static types = [, 'Arkiv', 'Bibliotek', 'Museum', '', 'Andet'];
    

    constructor(data: any) {
        this._id = data.id;
        this._url = data.url;
        this._email = data.email;
        this._type = data.type;
        this._tagid = data.tagid;
        if (data.content)
            this._content = new HaContent(data.content);
    }
    set url(newUrl: string) {
        this._url = newUrl;
    }

    set email(newEmail: string) {
        this._email = newEmail;
    }

    set type(newType: boolean) {
        this._type = newType;
    }

    get id(): number {
        return this._id;
    }

    get tagid(): number {
        return this._tagid;
    }

    get url(): string {
        return this._url;
    }

    get email(): string {
        return this._email;
    }

    get type(): boolean {
        return this._type;
    }

    get name(): string {
        return this.tag.plurName;
    }

    get content(): HaContent {
        return this._content;
    }

    get tag(): HaTag {
        return App.haTags.byId[this._tagid];
    }
} 