class HARegionTypeCategory {
    private _id: number;
    private _name: string;

    private _regionTypes: Array<HARegionType>;
    public showChildren: boolean;

    constructor(data: any) {
        this._id = data.id;
        this._name = data.name;

        this._regionTypes = [];
        data.regiontypes.forEach((regiontype: any) => {
            this._regionTypes.push(new HARegionType(regiontype, this));
        })

        this.showChildren = false;
    }

    get id(): number { return this._id; }

    get name(): string { return this._name; }

    get regionTypes(): Array<HARegionType> { return this._regionTypes; }
}