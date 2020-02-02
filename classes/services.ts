class Services {

    private static pendingServiceCalls: Array<() => void> = [];
    private static timeoutToken: number;
    private static loadingText: string = 'Kommunikerer med serveren';

    public static get hasPendingCalls(): boolean {
        return this.pendingServiceCalls.length > 0;
    }

    public static insert(service: string, data: any, success: (data: any) => any = null, error: (data: any) => any = null, message: string = null) {
        data.action = 'add';
        this.pushServiceCall(() => this.serviceCall(service + '.json', data, success, error, true, message), message);
    }

    public static update(service: string, data: any, success: (data: any) => any = null, error: (data: any) => any = null) {
        data.action = 'set';
        this.pushServiceCall(() => this.serviceCall(service + '.json', data, success, error, true));
    }

    public static delete(service: string, data: any, success: (data: any) => any = null, error: (data: any) => any = null, message: string = null) {
        data.action = 'delete';
        this.pushServiceCall(() => this.serviceCall(service + '.json', data, success, error, true, message), message);
    }

    public static get(service: string, data: any, success: (data: any) => any = null, error: (data: any) => any = null, message: string = null) {
        this.pushServiceCall(() => this.serviceCall(service + '.json', data, success, error, true, message), message);
    }

    public static proxy(proxy: string, data: any, success: (data: any) => any = null, error: (data: any) => any = null) {
        this.pushServiceCall(() => this.serviceCall('proxy/' + proxy + '.json', data, success, error, true));
    }

    private static pushServiceCall(serviceCall: () => void, message: string = null) {
        if (typeof App != 'undefined' && !this.timeoutToken)
            if (message != "")
                this.timeoutToken = setTimeout(() => {
                    App.loading.show(message == null ? this.loadingText : message);
                }, message == null ? 3000 : 100)

        this.pendingServiceCalls.push(serviceCall);
        if (this.pendingServiceCalls.length == 1)
            serviceCall();
    }

    private static serviceCall(url: string, data: any, success: (data: any) => any, error: (data: any) => any, async: boolean = false, message: string = null) { //RHL: why default to not async.... performance hit...
        if (!('v' in data))
            data.v = 1;
        data.sid = (<any>document).sid;

        $.ajax({
            type: 'POST',
            url: url.indexOf('hadb5') == -1 ? Common.api + url : Common.baseApi + '/' + url,
            data: data,
            timeout: 10000,
            async: async,
            success: (data) => ((data, succesMessage) => {
                if (data.status != 'Success' && error)
                    error(data); //Soft error
                else if (success)
                    success(data)

                this.pendingServiceCalls.shift();

                if (this.pendingServiceCalls.length > 0)
                    this.pendingServiceCalls[0]();

                this.hideLoading(succesMessage);
            })(data, message),
            error: (jqXHR: JQueryXHR, textStatus: string, errorThrown: string) => {
                //Hard error
                Common.dom.append(DialogAlert.create('Der opstod en fejl ved kommunikation med serveren. Hvis du oplever denne fejl gentagne gange, vil vi gerne høre om det på it@historiskatlas.dk', () => {
                    this.pendingServiceCalls[0]();
                }, true, "Prøv igen"));
                Analytics.apiError(textStatus + (errorThrown ? ' - ' + errorThrown : ''), typeof App != 'undefined' ? App.haUsers.user.id : 0);
            }
        });
    }


    private static hideLoading(message: string = null) {
        if (typeof App != 'undefined' && this.pendingServiceCalls.length == 0) {
            clearTimeout(this.timeoutToken);
            this.timeoutToken = null;
            if (message != "")
                App.loading.hide(message == null ? this.loadingText : message)
            //this.loadingText = null;
        } else if (typeof App != 'undefined' && message != null)
            App.loading.hide(message)
    }

    private static toURLParams(obj, q?) {
        var str = new Array();
        for (var key in obj) {
            str[str.length] = key + '=' + obj[key];
        }
        return (q === true ? '?' : '') + str.join('&');
    }

}