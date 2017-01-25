var HARegionTypeCategory = (function () {
    function HARegionTypeCategory(data) {
        var _this = this;
        this._id = data.id;
        this._name = data.name;
        this._regionTypes = [];
        data.regiontypes.forEach(function (regiontype) {
            _this._regionTypes.push(new HARegionType(regiontype, _this));
        });
        this.showChildren = false;
    }
    Object.defineProperty(HARegionTypeCategory.prototype, "id", {
        get: function () { return this._id; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HARegionTypeCategory.prototype, "name", {
        get: function () { return this._name; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HARegionTypeCategory.prototype, "regionTypes", {
        get: function () { return this._regionTypes; },
        enumerable: true,
        configurable: true
    });
    return HARegionTypeCategory;
}());
