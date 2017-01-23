class HARegionType {
    private _id: number;
    private _name: string;
    private _periodStart: number;
    private _periodEnd: number;

    private _active: boolean;
    private _regionsLoaded: boolean;
    private _regionTypeCategory: HARegionTypeCategory;

    constructor(data: any, regionTypeCategory: HARegionTypeCategory) {
        this._id = data.regiontypeid;
        this._name = data.name;
        this._periodStart = data.periodstart;
        this._periodEnd = data.periodend;

        this._active = false;
        this._regionsLoaded = false;
        this._regionTypeCategory = regionTypeCategory;

        if (App.haRegions.regionTypes == undefined)
            App.haRegions.regionTypes = [];
        App.haRegions.regionTypes[this._id] = this;
    }

    get id(): number { return this._id; }
    get name(): string { return this._name; }
    get periodStart(): number { return this._periodStart; }
    get periodEnd(): number { return this._periodEnd; }

    get active(): boolean { return this._active; }
    set active(newVal: boolean) { this._active = newVal; }

    get regionsLoaded(): boolean { return this._regionsLoaded; }
    set regionsLoaded(newVal: boolean) { this._regionsLoaded = newVal; }

    get regionTypeCategory(): HARegionTypeCategory { return this._regionTypeCategory; }
}