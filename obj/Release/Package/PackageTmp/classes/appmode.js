var AppMode = (function () {
    function AppMode() {
    }
    AppMode.showPopup = function () {
        if (LocalStorage.get("dismissedAddAsApp") == 'true')
            return;
        var appmodecapable = false;
        var appmode = false;
        var ua = navigator.userAgent;
        var os = (ua.match(/(iPad|iPhone|iPod)/i)) ? 'ios' : (ua.match(/(android)/i) ? 'android' : (ua.match(/(windows)/i) ? 'windows' : undefined));
        switch (os) {
            case 'ios':
                //TODO: dosent detect if browser is safari... apperently hard to do...
                appmodecapable = ("standalone" in window.navigator);
                appmode = window.navigator.standalone;
            case 'android':
                var execArray;
                if (execArray = (/chrome\/([0-9]*)\./gi).exec(ua))
                    if (parseInt(execArray[1]) > 38) {
                        appmodecapable = true;
                        appmode = window.matchMedia('(display-mode: standalone)').matches;
                    }
                break;
        }
        //TODO: Better way in Chrome 42+!!! See: https://developers.google.com/web/updates/2015/03/increasing-engagement-with-app-install-banners-in-chrome-for-android
        if (appmodecapable && !appmode)
            Common.dom.append(DialogAddToHomescreen.create(os));
    };
    return AppMode;
}());
//# sourceMappingURL=appmode.js.map