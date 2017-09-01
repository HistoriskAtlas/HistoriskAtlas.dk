abstract class HaSubContent {
    protected _id: number;
    protected _created: Date;
    protected _user: Object;
    protected _content: HaContent;
    private _ordering: number;

    constructor(data: any, content: HaContent) {
        this._id = data.id;
        this._ordering = data.ordering;
        this._created = data.created ? new Date(data.created) : null;
        this._user = data.user;
        this._content = content;
    }

    get id(): number {
        return this._id;
    }
    //set id(newValue: number) {
    //    this._id = newValue;
    //}

    get ordering(): number {
        return this._ordering;
    }
    set ordering(newValue: number) {
        this._ordering = newValue;
    }

    get created(): Date {
        return this._created;
    }
    //set created(newValue: Date) {
    //    this._created = newValue;
    //}
    //get createdDate(): string {
    //    return Common.shortDate(this._created);
    //}
    //get createdTime(): string {
    //    return Common.shortTime(this._created);
    //}

    get user(): Object {
        return this._user
    }

    protected insert(callback: (props: Array<string>) => void, table: string, data: any) {
        data.contentid = this._content.id,
        Services.insert(table, data, (result) => {
            this._id = result.data[0].id;
            this._created = new Date(result.data[0].created);
            this._user = { firstname: App.haUsers.user.firstname, lastname: App.haUsers.user.lastname };
            if (callback)
                callback(['id', 'created', 'user']);
        })
    }

    protected delete(table: string) {
        Services.delete(table, { id: this._id, deletemode: 'permanent' }, (result) => { })
    }
}