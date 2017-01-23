class AppMode {

    public static showPopup() {
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
                appmode = (<any>window).navigator.standalone;

            case 'android':
                var execArray: RegExpExecArray;
                if (execArray = (/chrome\/([0-9]*)\./gi).exec(ua))
                    if (parseInt(execArray[1]) > 38) {
                        appmodecapable = true;
                        appmode = window.matchMedia('(display-mode: standalone)').matches;
                    }
                break;

            //case 'windows':
            //    if (/Edge\/12./i.test(navigator.userAgent)) {
            //        appmodecapable = true;
            //        appmode = (<any>window).external.msIsSiteMode();
            //        //appModeNoteSubTxt = 'Tryk p&aring; <svg width="14" height="19" xmlns="http://www.w3.org/2000/svg"><g><title>menu icon</title><g id="gmenu"><path id="menu" fill="#ffffff" d="m1.86363,8.25c-0.61508,0 -1.11363,0.49853 -1.11363,1.11362c0,0.61511 0.49855,1.11364 1.11363,1.11364s1.11365,-0.49853 1.11365,-1.11364c0,-0.6151 -0.49855,-1.11362 -1.11365,-1.11362zm5.19698,0c-0.6151,0 -1.11363,0.49855 -1.11363,1.11362c0,0.61508 0.49855,1.11364 1.11363,1.11364c0.61508,0 1.11363,-0.4985 1.11363,-1.11364c0,-0.6151 -0.49853,-1.11362 -1.11363,-1.11362zm4.82576,0c-0.6151,0 -1.11363,0.49855 -1.11363,1.11362c0,0.61508 0.49853,1.11364 1.11363,1.11364c0.61508,0 1.11363,-0.49853 1.11363,-1.11364c0,-0.6151 -0.49855,-1.11362 -1.11363,-1.11362z"/></g></g></svg> og "Fastg&oslash;r til start"';
            //    }
            //    break;
        }

        //TODO: Better way in Chrome 42+!!! See: https://developers.google.com/web/updates/2015/03/increasing-engagement-with-app-install-banners-in-chrome-for-android
        
        if (appmodecapable && !appmode)
            Common.dom.append(DialogAddToHomescreen.create(os))

    }
}
