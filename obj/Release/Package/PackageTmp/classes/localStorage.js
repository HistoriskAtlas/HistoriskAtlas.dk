var LocalStorage = (function () {
    function LocalStorage() {
    }
    Object.defineProperty(LocalStorage, "showTimeWarp", {
        get: function () {
            return localStorage.getItem('showTimeWarp') != 'false';
        },
        set: function (val) {
            localStorage.setItem('showTimeWarp', String(val));
        },
        enumerable: true,
        configurable: true
    });
    LocalStorage.get = function (key, maxAgeInHours) {
        if (maxAgeInHours === void 0) { maxAgeInHours = undefined; }
        if (maxAgeInHours) {
            if (!this.timestamp(key))
                return null;
            if (this.isOlderThan(key, maxAgeInHours))
                return null;
        }
        return localStorage.getItem(key);
    };
    LocalStorage.set = function (key, data, timestamp) {
        if (timestamp === void 0) { timestamp = false; }
        if (timestamp)
            localStorage.setItem(key + '-timestamp', new Date().getTime().toString());
        return localStorage.setItem(key, data);
    };
    LocalStorage.isBefore = function (key, date) {
        return this.timestamp(key) < date.getTime();
    };
    LocalStorage.isOlderThan = function (key, maxAgeInHours) {
        return (new Date().getTime() - this.timestamp(key)) / this.msPerHour > maxAgeInHours;
    };
    LocalStorage.timestamp = function (key) {
        var timestamp = localStorage.getItem(key + '-timestamp');
        return timestamp ? parseInt(localStorage.getItem(key + '-timestamp')) : 0;
    };
    LocalStorage.timestampDateTime = function (key) {
        return Common.dateTimeStringFromMs(this.timestamp(key));
    };
    LocalStorage.msPerHour = 1000 * 60 * 60;
    return LocalStorage;
}());
