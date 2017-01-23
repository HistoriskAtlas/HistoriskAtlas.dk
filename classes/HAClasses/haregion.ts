class HaRegion {
    private _id: number;
    private _name: string;

    public periodStart: number;
    public periodEnd: number;
    public type: HARegionType;
    public sources: Array<string>;
    public parents: Array<HaRegion>;
    public children: Array<HaRegion>;

    constructor(data?: any) {
        if (!data)
            return;

        this._id = data.regionid;
        this._name = data.name;

        if (data.periodstart)
            this.periodStart = data.periodstart;
        if (data.periodend)
            this.periodEnd = data.periodend;
    }

    get id(): number {
        return this._id;
    }

    get name(): string {
        return this._name;
    }
}