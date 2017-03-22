var Common = (function () {
    function Common() {
    }
    Object.defineProperty(Common, "isDevOrBeta", {
        get: function () {
            if (this.standalone)
                return document.location.hostname.indexOf('beta') == 0 || document.location.hostname.indexOf('localhost') == 0;
            return App.isDev || document.location.hostname.indexOf('beta') == 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Common, "api", {
        get: function () {
            if (!this._api) {
                this._api = location.protocol + '//' + (this.isDevOrBeta ? ((location.protocol == 'https:' ? 'betasecure.' : 'beta.')) : (location.protocol == 'https:' ? 'secure' : '')) + 'api.historiskatlas.dk/api/hadb5' + (this.isDevOrBeta ? 'beta' : '') + '.';
            }
            return this._api;
        },
        enumerable: true,
        configurable: true
    });
    Common.rich2html = function (rich) {
        var result = rich;
        result = result.replace(Common.r2hLinebreak, '<br>');
        result = result.replace(Common.r2hItalic, '<i>$1</i>');
        result = result.replace(Common.r2hBold, '<b>$1</b>');
        result = result.replace(Common.r2hA, "<a href='$1'>$2</a>");
        result = result.replace(Common.r2hSpace, ' &nbsp;');
        return result;
    };
    Common.html2rich = function (html) {
        var result = html;
        result = result.replace(Common.h2rItalic, "'''$1'''");
        result = result.replace(Common.h2rBold, "''$1''");
        result = result.replace(Common.h2rSpace, " ");
        result = result.replace(Common.h2rDiv, "\n$1");
        result = result.replace(Common.h2rA, "[$1 $2]");
        result = result.replace(Common.h2rLinebreak, "\n");
        return result;
    };
    Common.toMapCoord = function (coord) {
        return ol.proj.transform(coord, 'EPSG:4326', 'EPSG:3857');
    };
    Common.fromMapCoord = function (coord) {
        return ol.proj.transform(coord, 'EPSG:3857', 'EPSG:4326');
    };
    Common.sphericalDistance = function (coord1, coord2) {
        var R = 6371000;
        var dLon = this.toRad(coord2[0] - coord1[0]), lat1 = this.toRad(coord1[1]), lat2 = this.toRad(coord2[1]);
        return Math.acos(Math.sin(lat1) * Math.sin(lat2) + Math.cos(lat1) * Math.cos(lat2) * Math.cos(dLon)) * R;
    };
    Common.toRad = function (x) { return x * Math.PI / 180; };
    Common.years = function (start, end) {
        return (start ? start + ' - ' : '') + (end == 2050 ? 'nu' : end);
    };
    Common.geoClick = function (id) {
        var geo = App.haGeos.geos[id];
        if (!geo) {
            App.toast.show('Lokaliteten er ikke tilgængelig');
            return;
        }
        Common.dom.append(WindowGeo.create(geo));
    };
    Common.dateTimeStringFromMs = function (ms) {
        var date = new Date(ms);
        return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
    };
    Common.formatDate = function (stringDate) {
        return this.shortDate(new Date(stringDate));
    };
    Common.shortDate = function (date) {
        return date ? date.getDate() + '/' + (date.getMonth() + 1) + '-' + date.getFullYear() : '';
    };
    Common.shortTime = function (date) {
        return date ? date.toLocaleTimeString('da-DK', { hour: '2-digit', minute: '2-digit' }) : '';
    };
    Object.defineProperty(Common, "standalone", {
        get: function () {
            return typeof App == 'undefined';
        },
        enumerable: true,
        configurable: true
    });
    Common.objPath = function (obj, path) {
        return path.split('.').reduce(function (o, i) { return o[i]; }, obj);
    };
    Common.objPathsString = function (obj, paths) {
        var result = '';
        for (var _i = 0, _a = paths.split(','); _i < _a.length; _i++) {
            var part = _a[_i];
            if (part.substr(0, 1) == "$")
                result += part.substr(1);
            else {
                var val = Common.objPath(obj, part);
                if (val)
                    result += val;
            }
        }
        return result;
    };
    Common.importModule = function (name, callback) {
        if (callback === void 0) { callback = null; }
        if (document.getElementById('module_' + name)) {
            if (callback)
                callback(null);
            return;
        }
        var link = document.createElement('link');
        link.id = 'module_' + name;
        if (callback)
            link.onload = callback;
        link.rel = 'import';
        link.href = 'elements/' + name + '.aspx';
        link.setAttribute('async', '');
        document.head.appendChild(link);
    };
    Common.r2hItalic = new RegExp("'''(.*?)'''", 'gi');
    Common.r2hBold = new RegExp("''(.*?)''", 'gi');
    Common.r2hSpace = new RegExp("  ", 'gi');
    Common.r2hLinebreak = new RegExp("\\n", 'gi');
    Common.r2hA = new RegExp("\\[(https?:\\/\\/.*?) (.*?)\\]", 'gi');
    Common.h2rItalic = new RegExp('<i>(.*?)<\/i>', 'gi');
    Common.h2rBold = new RegExp('<b>(.*?)<\/b>', 'gi');
    Common.h2rSpace = new RegExp("&nbsp;", 'gi');
    Common.h2rLinebreak = new RegExp("<br>", 'gi');
    Common.h2rDiv = new RegExp("<div>(.*?)<\/div>", 'gi');
    Common.h2rA = new RegExp("<a href=[\"'](https?:\\/\\/.*?)[\"']>(.*?)<\\/a>", 'gi');
    Common.dom = $(document.body);
    Common.apiSchemaTags = '{tag:[tagid,plurname,singname,category,yearstart,yearend,{parents:[empty,{collapse:{parent:id}}]}]}';
    return Common;
}());
var ChangeRecord = (function () {
    function ChangeRecord() {
    }
    return ChangeRecord;
}());
var IndexSplice = (function () {
    function IndexSplice() {
    }
    return IndexSplice;
}());
var KeySplice = (function () {
    function KeySplice() {
    }
    return KeySplice;
}());
