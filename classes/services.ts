class Services {

    private static pendingServiceCalls: Array<() => void> = [];
    private static timeoutToken: number;
    private static loadingText: string = 'Kommunikerer med serveren...';

    public static insert(service: string, data: any, success: (data: any) => any = null, error: (data: any) => any = null) {
        data.action = 'add';
        this.pushServiceCall(() => this.serviceCall(service + '.json', data, success, error, true));
    }

    public static update(service: string, data: any, success: (data: any) => any = null, error: (data: any) => any = null) {
        data.action = 'set';
        this.pushServiceCall(() => this.serviceCall(service + '.json', data, success, error, true));
    }

    public static delete(service: string, data: any, success: (data: any) => any = null, error: (data: any) => any = null) {
        data.action = 'delete';
        this.pushServiceCall(() => this.serviceCall(service + '.json', data, success, error, true));
    }

    public static get(service: string, data: any, success: (data: any) => any = null, error: (data: any) => any = null) {
        this.pushServiceCall(() => this.serviceCall(service + '.json', data, success, error, true));
    }

    public static proxy(proxy: string, data: any, success: (data: any) => any = null, error: (data: any) => any = null) {
        this.pushServiceCall(() => this.serviceCall('proxy/' + proxy + '.json', data, success, error, true));
    }

    private static pushServiceCall(serviceCall: () => void) {
        if (App && !this.timeoutToken)
            this.timeoutToken = setTimeout(() => {
                App.loading.show(this.loadingText);
            }, 3000)

        this.pendingServiceCalls.push(serviceCall);
        if (this.pendingServiceCalls.length == 1)
            serviceCall();
    }

    private static serviceCall(url: string, data: any, success: (data: any) => any, error: (data: any) => any, async: boolean = false, type: string = "POST") { //RHL: why default to not async.... performance hit...
        data.v = 1;
        data.sid = (<any>document).sid;

        $.ajax({
            type: type,
            url: url.indexOf('hadb5') == -1 ? Common.api + url : Common.baseApi + '/' + url,
            data: data,
            timeout: 10000,
            async: async,
            success: (data) => {
                if (data.status != 'Success' && error)
                    error(data); //Soft error
                else if (success)
                    success(data)

                this.pendingServiceCalls.shift();

                if (this.pendingServiceCalls.length > 0)
                    this.pendingServiceCalls[0]();

                this.hideLoading();
            },
            error: (jqXHR: JQueryXHR, textStatus: string, errorThrown: string) => {
                //Hard error
                Common.dom.append(DialogAlert.create('Der opstod en fejl ved kommunikation med serveren. Hvis du oplever denne fejl gentagne gange, vil vi gerne høre om det på it@historiskatlas.dk', () => {
                    this.pendingServiceCalls[0]();
                }, true, "Prøv igen"));
                Analytics.apiError(textStatus + (errorThrown ? ' - ' + errorThrown : ''), App ? App.haUsers.user.id : 0);
            }
        });
    }


    private static hideLoading() {
        if (App && this.pendingServiceCalls.length == 0) {
            clearTimeout(this.timeoutToken);
            this.timeoutToken = null;
            App.loading.hide(this.loadingText)
            //this.loadingText = null;
        }
    }

    private static toURLParams(obj, q?) {
        var str = new Array();
        for (var key in obj) {
            str[str.length] = key + '=' + obj[key];
        }
        return (q === true ? '?' : '') + str.join('&');
    }

}