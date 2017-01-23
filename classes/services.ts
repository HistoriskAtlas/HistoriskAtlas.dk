class Services {

    public static insert(service: string, data: any, success: (data: any) => any = null, error: (data: any) => any = null) {
        data.action = 'add';
        this.serviceCall(service + '.json', data, success, error, true);
    }

    public static update(service: string, data: any, success: (data: any) => any = null, error: (data: any) => any = null) {
        data.action = 'set';
        this.serviceCall(service + '.json', data, success, error, true);
    }

    public static delete(service: string, data: any, success: (data: any) => any = null, error: (data: any) => any = null) {
        data.action = 'delete';
        this.serviceCall(service + '.json', data, success, error, true);
    }

    public static get(service: string, data: any, success: (data: any) => any = null, error: (data: any) => any = null) {
        this.serviceCall(service + '.json', data, success, error, true);
    }

    public static proxy(proxy: string, data: any, success: (data: any) => any = null, error: (data: any) => any = null) {
        this.serviceCall('proxy/' + proxy + '.json', data, success, error, true);
    }

    private static serviceCall(url: string, data: any, success: (data: any) => any, error: (data: any) => any, async: boolean = false, type: string = "POST") { //RHL: why default to not async.... performance hit...
        data.v = 1;
        data.sid = (<any>document).sid;
        $.ajax({
            type: type,
            url: Common.api + url,
            data: data, //WAS JSON.stringify........
            timeout: 8000,
            async: async,
            success: (data) => {
                if (data.status != 'Success' && error)
                    error(data);
                else if (success)
                    success(data)
            },
            error: error
            //error: (jqXHR: JQueryXHR, textStatus: string, errorThrown: string) => {
            //    console.log(jqXHR);
            //    console.log(textStatus);
            //    console.log(errorThrown);
            //    console.log(errorMessage);
            //}
        });
    }

    private static toURLParams(obj, q?) {
        var str = new Array();
        for (var key in obj) {
            str[str.length] = key + '=' + obj[key];
        }
        return (q === true ? '?' : '') + str.join('&');
    }

}