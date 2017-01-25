var HARegionType = (function () {
    function HARegionType(data, regionTypeCategory) {
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
    Object.defineProperty(HARegionType.prototype, "id", {
        get: function () { return this._id; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HARegionType.prototype, "name", {
        get: function () { return this._name; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HARegionType.prototype, "periodStart", {
        get: function () { return this._periodStart; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HARegionType.prototype, "periodEnd", {
        get: function () { return this._periodEnd; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HARegionType.prototype, "active", {
        get: function () { return this._active; },
        set: function (newVal) { this._active = newVal; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HARegionType.prototype, "regionsLoaded", {
        get: function () { return this._regionsLoaded; },
        set: function (newVal) { this._regionsLoaded = newVal; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HARegionType.prototype, "regionTypeCategory", {
        get: function () { return this._regionTypeCategory; },
        enumerable: true,
        configurable: true
    });
    return HARegionType;
}());
