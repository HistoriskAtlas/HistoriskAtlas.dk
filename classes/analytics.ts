class Analytics {
    public static geoShow(geo: HaGeo) {
        Analytics.send({
            hitType: 'event',
            eventCategory: 'geo_show',
            eventAction: geo.title,
            eventLabel: geo.id
        });
    }
    public static mapShow(map: HaMap) {
        Analytics.send({
            hitType: 'event',
            eventCategory: 'map_show',
            eventAction: map.title,
            eventLabel: map.id
        });
    }
    public static collectionShow(collection: HaCollection) {
        Analytics.send({
            hitType: 'event',
            eventCategory: 'collection_show',
            eventAction: collection.title,
            eventLabel: collection.id
        });
    }
    public static regionTypeShow(regionType: HARegionType) {
        Analytics.send({
            hitType: 'event',
            eventCategory: 'region_type_show',
            eventAction: regionType.name,
            eventLabel: regionType.id
        });
    }
    public static apiError(error: string, userID: number) {
        Analytics.send({
            hitType: 'event',
            eventCategory: 'api_error',
            eventAction: error,
            eventLabel: userID
        });
    }
    public static calcRoute(type: number) {
        Analytics.send({
            hitType: 'event',
            eventCategory: 'calc_route',
            eventAction: type
        });
    }
    private static send(params: object) {
        (<any>window).analytics('ha.send', params);
        (<any>window).analytics('obm.send', params);
    }
}
