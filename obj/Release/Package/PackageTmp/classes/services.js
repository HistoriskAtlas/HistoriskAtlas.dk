var Services = (function () {
    function Services() {
    }
    Services.insert = function (service, data, success, error) {
        if (success === void 0) { success = null; }
        if (error === void 0) { error = null; }
        data.action = 'add';
        this.serviceCall(service + '.json', data, success, error, true);
    };
    Services.update = function (service, data, success, error) {
        if (success === void 0) { success = null; }
        if (error === void 0) { error = null; }
        data.action = 'set';
        this.serviceCall(service + '.json', data, success, error, true);
    };
    Services.delete = function (service, data, success, error) {
        if (success === void 0) { success = null; }
        if (error === void 0) { error = null; }
        data.action = 'delete';
        this.serviceCall(service + '.json', data, success, error, true);
    };
    Services.get = function (service, data, success, error) {
        if (success === void 0) { success = null; }
        if (error === void 0) { error = null; }
        this.serviceCall(service + '.json', data, success, error, true);
    };
    Services.proxy = function (proxy, data, success, error) {
        if (success === void 0) { success = null; }
        if (error === void 0) { error = null; }
        this.serviceCall('proxy/' + proxy + '.json', data, success, error, true);
    };
    Services.serviceCall = function (url, data, success, error, async, type) {
        if (async === void 0) { async = false; }
        if (type === void 0) { type = "POST"; }
        data.v = 1;
        data.sid = document.sid;
        $.ajax({
            type: type,
            url: Common.api + url,
            data: data,
            timeout: 8000,
            async: async,
            success: function (data) {
                if (data.status != 'Success' && error)
                    error(data);
                else if (success)
                    success(data);
            },
            error: error
        });
    };
    Services.toURLParams = function (obj, q) {
        var str = new Array();
        for (var key in obj) {
            str[str.length] = key + '=' + obj[key];
        }
        return (q === true ? '?' : '') + str.join('&');
    };
    return Services;
}());
//# sourceMappingURL=services.js.map