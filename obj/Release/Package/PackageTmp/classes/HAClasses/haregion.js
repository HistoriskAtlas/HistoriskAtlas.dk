var HaRegion = (function () {
    function HaRegion(data) {
        if (!data)
            return;
        this._id = data.regionid;
        this._name = data.name;
        if (data.periodstart)
            this.periodStart = data.periodstart;
        if (data.periodend)
            this.periodEnd = data.periodend;
    }
    Object.defineProperty(HaRegion.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HaRegion.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    return HaRegion;
}());
