@component("window-route-contest")
class WindowRouteContest extends polymer.Base implements polymer.Element {


    @property({ type: Object })
    public route: HaCollection;
    
}

WindowRouteContest.register();