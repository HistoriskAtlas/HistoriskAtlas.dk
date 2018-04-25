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
    public static collectionShow(collection: HaCollection) {
        (<any>window).analytics('ha.send', {
            hitType: 'event',
            eventCategory: 'collection_show',
            eventAction: collection.title,
            eventLabel: collection.id
        });
    }
    public static regionTypeShow(regionType: HARegionType) {
        (<any>window).analytics('ha.send', {
            hitType: 'event',
            eventCategory: 'region_type_show',
            eventAction: regionType.name,
            eventLabel: regionType.id
        });
    }
}
