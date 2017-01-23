@component("window-user-news")
class WindowUserNews extends polymer.Base implements polymer.Element {
    public static lastUpdate: Date = new Date(2016, 11, 19, 15, 0); //remember: zero based month index
}

WindowUserNews.register();