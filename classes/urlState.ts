class UrlState {

    private static prevStateUrl: string;
    private static writeToUrlTimeoutHandler: number;
    private static tagSelectedChangedTimeoutHandler: number;
    public static stateObject: any = {};
    private static stateObjectString: string = '';

    public static ReadFromUrl() {
        var path = window.location.pathname;

        //TODO: error handling on wrong inputs..............
        if (path.substr(0, 2) == '/@') {
            var atArr = path.substr(2).split(',');
            App.passed.theme.maplatitude = parseFloat(atArr[0]);
            App.passed.theme.maplongitude = parseFloat(atArr[1]);
            App.passed.theme.mapzoom = parseFloat(atArr[2]);
            if (atArr.length > 3)
                App.passed.theme.maprotation = Common.toRad(parseFloat(atArr[3]));

            var split = window.location.href.split('?')
            if (split.length > 1)
            {
                //this.stateObject = JSON.parse(atob(params[1]))
                var params = split[1].split('&');
                if (params[0] == 'embed')
                    params.shift();

                if (params.length > 0)
                    for (var param of params[0].split('+')) {
                        var kvp = param.split('!');
                        this.stateObject[kvp[0]] = kvp[1];
                    }

                this.RefeshStateObjectString(false)
                if (this.stateObject.m)
                    App.passed.theme.mapid = this.stateObject.m;
                if (this.stateObject.hasOwnProperty('ogwint'))
                    Common.openGeoWindowInNewTab = !!parseInt(this.stateObject.ogwint);
            }
            return;
        }

        if (path.substr(-8) == '/welcome') {
            window.history.replaceState({}, null, window.location.href.substr(0, window.location.href.length - 8));
            App.global.userJustActivated = true;
            return;
        }

        if (path.substr(-13) == '/new_password') {
            window.history.replaceState({}, null, window.location.href.substr(0, window.location.href.length - 13));
            App.global.userJustResetPassword = true;
            return;
        }

        if (!App.passed.geo && !App.passed.collection && !App.passed.embed && App.passed.theme.id == Global.defaultTheme.id && path.substr(1).toLowerCase() != 'default.aspx')
            App.passed.search = path.substr(1);
    }

    public static WriteToUrl() {
        this.prevStateUrl = this.stateUrl;

        if (this.writeToUrlTimeoutHandler)
            clearTimeout(this.writeToUrlTimeoutHandler);

        this.writeToUrlTimeoutHandler = setTimeout(() => {
            var stateUrl = UrlState.stateUrl;
            if (stateUrl == UrlState.prevStateUrl) {
                var newUrl = stateUrl + (Common.embed ? (this.stateObjectString == '' ? '?' : '&') + 'embed' : '');
                window.history.replaceState({}, null, newUrl);
                if (window.parent)
                    window.parent.postMessage({ event: 'urlChanged', url: newUrl }, '*');
            }
        }, 500);
        
    }
    public static get stateUrl(): string {
        return this.GetMapStateString(Common.fromMapCoord(App.map.getView().getCenter()), App.map.fractialZoom, App.map.rotationInDegrees) + (this.stateObjectString == '' ? '' : '?' + this.stateObjectString); //TODO: cache map state also?
    }
    public static get embedStateUrl(): string {
        var url = this.stateUrl;
        return url + (url.indexOf('?') == -1 ? '?' : '&') + 'embed';
    }

    public static openGeoWindowInNewTabChanged() {
        if (!Common.openGeoWindowInNewTab && Common.embed)
            this.stateObject.ogwint = 0;
        else
            delete this.stateObject.ogwint;

        this.RefeshStateObjectString();
    }
    public static mapChanged() {
        if (App.map.HaMap.id != Global.defaultTheme.mapid)
            this.stateObject.m = App.map.HaMap.id;
        else
            delete this.stateObject.m;

        this.RefeshStateObjectString();
    }
    public static tagSelectedChanged() {
        if (this.tagSelectedChangedTimeoutHandler)
            clearTimeout(this.tagSelectedChangedTimeoutHandler);

        this.tagSelectedChangedTimeoutHandler = setTimeout(() => {
            this.stateObject.t = App.haTags.getSelectionState(); //TODO: delete if "empty" ie all category 9 selected?
            this.RefeshStateObjectString();
        }, 100);
    }
    public static themeChanged() {
        if (App.global.theme.id != Global.defaultTheme.id)
            this.stateObject.th = App.global.theme.id;
        else
            delete this.stateObject.th;

        this.RefeshStateObjectString();
    }

    private static RefeshStateObjectString(write: boolean = true) {
        var params = [];
        for (var p in this.stateObject) //TODO: sort?
            params.push(p + '!' + this.stateObject[p]);

        this.stateObjectString = params.join('+');
        
        //this.stateObjectString = ($.isEmptyObject(this.stateObject) ? '' : btoa(JSON.stringify(this.stateObject)));
        if (write)
            this.WriteToUrl();
    }

    public static ReloadOnGeo(geo: HaGeo) {
        var coord = Common.fromMapCoord(geo.coord);
        location.href = location.href.replace(/[^\/]*_\(([0-9]+)\)/g, '') + this.GetMapStateString(coord, 16); //TODO... dont use replace.......
    }

    private static GetMapStateString(coord: ol.Coordinate, zoom: number, rotation: number = 0): string {

        if (typeof Global != 'undefined')
            if (coord[1] == Global.defaultTheme.maplatitude && coord[0] == Global.defaultTheme.maplongitude && zoom.toPrecision(4) == Global.defaultTheme.mapzoom.toPrecision(4) && rotation == 0 && this.stateObjectString == '')
                return '';

        return '@' + coord[1].toFixed(7) + ',' + coord[0].toFixed(7) + ',' + zoom.toFixed(2).replace(/[.,]00$/, "") + 'z' + (rotation == 0 ? '' : ',' + rotation.toFixed(2) + 'r');
    }
}