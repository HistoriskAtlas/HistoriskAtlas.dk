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

    public static getHAAPI(service: string, params: { [key: string]: any }, success: (data: any) => any = null, error: (data: any) => any = null, message: string = null) {
        params = params || {};
        params.db = Common.isDevOrBeta ? 'hadb6beta' : 'hadb6';
        params.key = '00e763e5df5f47e3a4a64aea3a18fdaa';
        this.pushServiceCall(() => this.serviceCallHAAPI(`https://haapi-apim.azure-api.net/${service}${this.toURLParams(params)}`, success, error, message), message);
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

    private static serviceCallHAAPI(url: string, success: (data: any) => any, error: (data: any) => any, message: string = null) {

        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true); //TODO: support POST also...
        xhr.responseType = 'json';
        xhr.timeout = 10000,
        xhr.addEventListener('load', () => {
            if (xhr.status === 200)
                success(xhr.response);
            else {
                if (error)
                    error(xhr.response);
                Services.error(url, xhr.status.toString(), 'HAAPI soft error')
                return;
            }

            this.pendingServiceCalls.shift();
            if (this.pendingServiceCalls.length > 0)
                this.pendingServiceCalls[0]();
            this.hideLoading(message);
        });
        xhr.addEventListener('error', () => Services.error(url, xhr.responseText, 'HAAPI error'));
        xhr.addEventListener('timeout', () => Services.error(url, xhr.responseText, 'HAAPI timeout'));
        xhr.send();
    }

    private static error(url: string, status: string, error: string) {
        Common.dom.append(DialogAlert.create('Der opstod en fejl ved kommunikation med serveren. Hvis du oplever denne fejl gentagne gange, vil vi gerne høre om det på it@historiskatlas.dk. Teknisk info: ' + url + ' - ' + status + ' - ' + error, () => {
            this.pendingServiceCalls[0]();
        }, true, "Prøv igen"));
        Analytics.apiError(error, `${url} - ${(status ? status.substr(0, 50) : '(no status)')}`); //typeof App != 'undefined' ? App.haUsers.user.id : 0
    }

    private static serviceCall(url: string, data: any, success: (data: any) => any, error: (data: any) => any, async: boolean = false, message: string = null) { //RHL: why default to not async.... performance hit...
        if (!('v' in data))
            data.v = 1;
        data.sid = (<any>document).sid;

        $.ajax({
            type: 'POST',
            url: url.indexOf('http') == 0 ? url : (url.indexOf('hadb6') == -1 ? Common.api + url : Common.baseApi + '/' + url), //url.indexOf('hadb5')
            data: data,
            timeout: 30000, //was 10000 on hadb5
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
            error: (jqXHR: JQueryXHR, textStatus: string, errorThrown: string) => Services.error(url, textStatus, errorThrown)});
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

    private static toURLParams(obj) {
        if (!obj)
            return '';
        var str: string[] = [];
        for (var key in obj)
            str.push(`${key}=${obj[key]}`);
        return str.length == 0 ? '' : `?${str.join('&')}`;
    }

}