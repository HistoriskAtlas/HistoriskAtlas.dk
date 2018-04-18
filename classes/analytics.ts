class Analytics {
    public static geoShow(geo: HaGeo) {
        (<any>window).analytics('ha.send', {
            hitType: 'event',
            eventCategory: 'geo_show',
            eventAction: geo.title,
            eventLabel: geo.id
        });
    }
    public static mapShow(map: HaMap) {
        (<any>window).analytics('ha.send', {
            hitType: 'event',
            eventCategory: 'map_show',
            eventAction: map.title,
            eventLabel: map.id
        });
    }
}
