class HaGeoLog {
    private geoid: number;
    private date: Date;
    private type: string;
    private userid: number;
    private active: Boolean;
    private comments: string;

    constructor(data: any) {
        this.geoid = data.geoid
        this.date = new Date(data.date);
        this.type = data.type;
        this.userid = data.userid;
        this.active = data.active;
        this.comments = data.comments;
    }

    get _geoid(): number {
        return this.geoid;
    }

    get _date(): Date {
        return this.date;
    }

    get _type(): string {
        return this.type;
    }

    get _userid(): number {
        return this.userid;
    }

    get _active(): Boolean {
        return this.active;
    }

    get _comments(): string {
        return this.comments;
    }
}
