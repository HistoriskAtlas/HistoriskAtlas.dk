class UrlState {

    private static prevStateUrl: string;
    private static timeoutHandler: number;
    private static stateObject: any = {};
    private static stateObjectString: string = '';

    public static ReadFromUrl() {
        var path = window.location.pathname;

        if (path.substr(-8) == '/welcome') {
            window.history.replaceState({}, null, window.location.href.substr(0, window.location.href.length - 8));
            App.global.userJustActivated = true;
        }

        if (path.substr(-13) == '/new_password') {
            window.history.replaceState({}, null, window.location.href.substr(0, window.location.href.length - 13));
            App.global.userJustResetPassword = true;
        }

        //TODO: error handling on wrong inputs..............
        if (path.substr(0, 2) == '/@') {
            var atArr = path.substr(2).split(',');
            App.passed.theme.maplatitude = parseFloat(atArr[0]);
            App.passed.theme.maplongitude = parseFloat(atArr[1]);
            App.passed.theme.mapzoom = parseFloat(atArr[2]);
            if (atArr.length > 3)
                App.passed.theme.maprotation = Common.toRad(parseFloat(atArr[3]));

            var params = window.location.href.split('?')
            if (params.length > 1)
            {
                //this.stateObject = JSON.parse(atob(params[1]))
                for (var param of params[1].split('+')) {
                    var kvp = param.split('!');
                    this.stateObject[kvp[0]] = kvp[1];
                }

                this.RefeshStateObjectString(false)
                if (this.stateObject.m)
                    App.passed.theme.mapid = this.stateObject.m;
            }
        }
    }

    public static WriteToUrl() {
        this.prevStateUrl = this.stateUrl;

        if (this.timeoutHandler)
            clearTimeout(this.timeoutHandler);

        this.timeoutHandler = setTimeout(() => {
            var stateUrl = UrlState.stateUrl;
            if (stateUrl == UrlState.prevStateUrl)
                window.history.replaceState({}, null, stateUrl); //window.location.href.split('/')[0] + '/' + 
        }, 500);
        
    }
    private static get stateUrl(): string {
        return this.GetMapStateString(Common.fromMapCoord(App.map.getView().getCenter()), App.map.fractialZoom, App.map.rotationInDegrees) + (this.stateObjectString == '' ? '' : '?' + this.stateObjectString); //TODO: cache map state also?
    }

    public static mapChanged() {
        if (App.map.HaMap.id != Global.defaultTheme.mapid)
            this.stateObject.m = App.map.HaMap.id;
        else
            delete this.stateObject.m;

        this.RefeshStateObjectString();
    }
    public static tagSelectedChanged() {
        this.stateObject.t = App.haTags.getSelectionState(); //TODO: delete if "empty" ie all selected
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

        if (coord[1] == Global.defaultTheme.maplatitude && coord[0] == Global.defaultTheme.maplongitude && zoom.toPrecision(4) == Global.defaultTheme.mapzoom.toPrecision(4) && rotation == 0 && this.stateObjectString == '')
            return '';

        return '@' + coord[1].toFixed(7) + ',' + coord[0].toFixed(7) + ',' + zoom.toFixed(2).replace(/[.,]00$/, "") + 'z' + (rotation == 0 ? '' : ',' + rotation.toFixed(2) + 'r');
    }
}