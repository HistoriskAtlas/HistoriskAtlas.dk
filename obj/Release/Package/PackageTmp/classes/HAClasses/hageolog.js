var HaGeoLog = (function () {
    function HaGeoLog(data) {
        this.geoid = data.geoid;
        this.date = new Date(data.date);
        this.type = data.type;
        this.userid = data.userid;
        this.active = data.active;
        this.comments = data.comments;
    }
    Object.defineProperty(HaGeoLog.prototype, "_geoid", {
        get: function () {
            return this.geoid;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HaGeoLog.prototype, "_date", {
        get: function () {
            return this.date;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HaGeoLog.prototype, "_type", {
        get: function () {
            return this.type;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HaGeoLog.prototype, "_userid", {
        get: function () {
            return this.userid;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HaGeoLog.prototype, "_active", {
        get: function () {
            return this.active;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HaGeoLog.prototype, "_comments", {
        get: function () {
            return this.comments;
        },
        enumerable: true,
        configurable: true
    });
    return HaGeoLog;
}());
