@component("window-intro-beta")
class WindowIntroBeta extends polymer.Base implements polymer.Element {
    constructor() {
        super();
        //TODO: not working properly...
        //(<any>$('.content')).niceScroll({
        //    cursorwidth: '8px',
        //    cursorborder: '0px',
        //    cursorborderradius: '0px',
        //    cursoropacitymax: 0.5
        //});        
    }

    feedbackTap() {
        Common.dom.append(WindowFeedback.create());
    }
}

WindowIntroBeta.register();