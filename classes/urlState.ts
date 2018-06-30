class UrlState {

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

        if (path.substr(0, 2) == '/@') {
            var atArr = path.substr(2).split(',');
            App.passed.theme.maplatitude = parseFloat(atArr[0]);
            App.passed.theme.maplongitude = parseFloat(atArr[1]);
            App.passed.theme.mapzoom = parseFloat(atArr[2]);
            if (atArr.length > 3)
                App.passed.theme.maprotation = Common.toRad(parseFloat(atArr[3]));
        }
    }

    public static WriteToUrl() {

        //TODO: Throttle output to url..... (settimeout and check if same?)............................................

        var view = App.map.getView();
        //var test = (<any>view).getZoomForResolution(view.getResolution())
        window.history.replaceState({}, null, this.GetMapStateString(Common.fromMapCoord(view.getCenter()), view.getZoom(), App.map.rotationInDegrees)); //TODO: view.getZoom is undefined at fractional zoom levels.... fixed in OL 3.18...................
    }

    public static ReloadOnGeo(geo: HaGeo) {
        var coord = Common.fromMapCoord(geo.coord);
        location.href = location.href.replace(/[^\/]*_\(([0-9]+)\)/g, '') + this.GetMapStateString(coord, 16); //TODO... dont use replace.......
    }

    private static GetMapStateString(coord: ol.Coordinate, zoom: number, rotation: number = 0): string {
        return '@' + coord[1].toFixed(7) + ',' + coord[0].toFixed(7) + ',' + zoom.toFixed(2).replace(/[.,]00$/, "") + 'z' + (rotation == 0 ? '' : ',' + rotation.toFixed(2) + 'r');
    }
}