/*
---
definition file of the js Facebook SDK

author: [Mient-jan Stelling](http://www.github.com/mientjan)
license: [MIT License](https://github.com/mientjan/typescript-facebook-definition/blob/master/license.txt)

*/

// api(/me)
interface IFacebookAPIUserResponse {
    id: string;
    name: string;
    first_name: string;
    last_name: string;
    link: string;
    username: string;
    location: {
        id: string;
        name: string;
    };
    work: {
        employer: {
            id: string;
            name: string;
        };
        position: {
            id: string;
            name: string;
        };
        start_date: string;
        end_date: string;

        projects: {
            id: string;
            name: string;
            start_date: string;
            end_date: string;
        }[];

    }[];

    education: {
        school: {
            id: string;
            name: string;
        };

        type: string;
    }[];

    gender: string;
    timezone: number;
    locale: string;

    languages: {
        id: string;
        name: string;
    }[];

    verified: boolean;
    updated_time: string;
}

interface IFacebookUserAuthenticate {
    // Current status of the session
    status: string;	// connected or not_authorized
    authResponse?: IFacebookAuthResponse;
}

interface IFacebookAuthResponse {

    // String representing the current user's ID 
    userID: string;

    // String with the current signedRequest     		
    signedRequest: string;

    // UNIX time when the session expires	
    expiresIn: string;

    // Access token of the user 
    accessToken: string;
}

interface IFacebookUIParameters {
    method?: string;
    name?: string;
    href?: string; //WAS link
    picture?: string;
    caption?: string;
    description?: string;
}


interface IFacebookApiResponse {
}


interface IFacebookInitParameters {
    // Your application ID.
    appId?: string;	// default null	

    // true to enable cookie support.
    cookie?: boolean; // default false			

    version?: string; // default false			

    // false to disable logging.
    logging?: boolean;	// default true			

    // true to fetch fresh status.
    status?: boolean; // default true

    // true to parse XFBML tags.
    xfbml?: boolean; // default false

    // Specifies the URL of a custom URL channel file. This file must contain a single 
    // script element pointing to the JavaScript SDK URL.
    channelUrl?: string; // default true

    // Manually set the object retrievable from getAuthResponse.
    authResponse?: Object; // default true

    /**
     * Frictionless Requests enable users to send Requests to specific friends from within 
     * an app without having to click on a pop-up confirmation dialog. Upon sending a Request 
     * to a friend from within an app, a user may authorize the app to send subsequent Requests 
     * to the same friend without a Dialog prompt. This removes a Dialog from the flow and 
     * streamlines the process of sharing with friends.
     * 
     * @see http://developers.facebook.com/docs/reference/dialogs/requests/#frictionless_requests
     */
    frictionlessRequests?: boolean; // default false

    /**
     * Developers who wish to provide a custom hide and display experience may pass a 
     * JavaScript function in the hideFlashCallback option for FB.init. This function 
     * will be executed whenever the Flash object is hidden or displayed due to user 
     * behavior (clicking on a Notification, etc.) and can be used by a developer to 
     * take the appropriate actions: hiding or displaying their Flash object. It receives 
     * a parameter of type object that contains two properties
     */
    hideFlashCallback?: (params: {
        state: string; // 'opened' or 'closed'
        elem: HTMLElement;
    }) => {};
}

interface IFacebook {

    init(options: IFacebookInitParameters): void;

    api(path: string): void;
    api(path: string, params: Object): void;
    api(path: string, cb: (response?: any) => void): void;
    api(path: string, params: Object, cb: (response?: any) => void): void;
    api(path: string, method: string, cb: (response?: any) => void): void;
    api(path: string, method: string, params: Object, cb: (response?: any) => void): void;

    ui(
        params?: IFacebookUIParameters,
        cb?: (response?: any) => void
        ): void;

    login(
        cb?: (response: IFacebookUserAuthenticate) => any,
        opts?: { scope: string; }
        ): void;

    // FB.logout will log the user out of both your site and Facebook. 
    // You will need to have a valid access token for the user in order to call the function.
    logout(cb?: (response?: Object) => any);

    getLoginStatus(
        cb?: (response: IFacebookUserAuthenticate) => void,

        // Access token of the user 
        force?: boolean
        ): void;

    getAuthResponse(cb?: (response: IFacebookAuthResponse) => void): void;

    Event: {

        /**
         * FB.Events.subscribe
         * 
         * subscribe gives different response objects depending on the subscribed event.
         * 
         * @see http://developers.facebook.com/docs/reference/javascript/FB.Event.subscribe/
         */

        /**
         * name: 'auth.login' - fired when the auth status changes to connected
         * name: 'auth.authResponseChange' - fired when the authResponse changes
         * name: 'auth.statusChange' - fired when the status changes (see FB.getLoginStatus for additional information on what this means)
         */
        subscribe(name: string, cb: (response: IFacebookUserAuthenticate) => any);

        /**
         * name: 'auth.logout'
         */
        subscribe(name: string, cb: (response: { status: string; }) => any);

        /**
         * name: 'xfbml.render'
         */
        subscribe(name: string, cb: () => any);

        /**
         * name: 'edge.remove'
         * name: 'comment.create'
         * name: 'auth.prompt'
         * name: 'message.send'
         */
        subscribe(name: string, cb: (response: string) => any);

        /**
         * name: 'comment.remove'
         */
        subscribe(name: string, cb: (response: { href: string; commendID: string; }) => any);

        /**
         * @see http://developers.facebook.com/docs/reference/javascript/FB.Event.unsubscribe/
         */
        unsubscribe(name: string, cb: (response: string) => any);
    };

    XFBML: {
        parse(dom?: Element, cb?: () => any);
    };

    Canvas: {

        Prefetcher: {
            COLLECT_AUTOMATIC: string;
            COLLECT_MANUAL: string;
            addStaticResource(str: string): void;
            setCollectionMode(str: string): void;
        };

        getPageInfo(cb: (info: {

            // The height of the viewport in pixels
            clientHeight: number;

            // The width of the viewport in pixels
            clientWidth: number;

            // The number of pixels between the left edge of the viewport and 
            // the left edge of your app's iframe
            offsetLeft: number;

            // The number of pixels between the top edge of the viewport and 
            // the top edge of your app's iframe
            offsetTop: number;

            // The number of pixels between the left edge of your iframe and 
            // the left edge of your iframe's viewport
            scrollLeft: number;

            // The number of pixels between the top edge of your iframe and 
            // the top edge of your iframe's viewport	
            scrollTop: number;

        }) => void): void;

        hideFlashElement(elem: Element): void;
        showFlashElement(elem: Element): void;

        scrollTo(x: number, y: number): void;

        setAutoGrow(interval: number);
        setAutoGrow(onOrOff?: boolean, interval?: number);

        setDoneLoading(cb: (response: { time_delta_ms?: number; }) => void);

        setSize(size: { width?: number; height?: number; });

        setUrlHandler(cb: (response: { path: string; }) => void);

        startTimer();
        stopTimer(cb: (response: { time_delta_ms: number; }) => void);
    };
}
declare var FB: IFacebook;