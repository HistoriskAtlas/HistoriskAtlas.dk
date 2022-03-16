class Analytics {
    public static geoShow(geo: HaGeo) {
        Analytics.send({
            hitType: 'event',
            eventCategory: 'geo_show',
            eventAction: geo.title,
            eventLabel: geo.id.toString()
        });
    }
    public static mapShow(map: HaMap) {
        Analytics.send({
            hitType: 'event',
            eventCategory: 'map_show',
            eventAction: map.title,
            eventLabel: map.id.toString()
        });
    }
    public static collectionShow(collection: HaCollection) {
        Analytics.send({
            hitType: 'event',
            eventCategory: 'collection_show',
            eventAction: collection.title,
            eventLabel: collection.id.toString()
        });
    }
    public static regionTypeShow(regionType: HARegionType) {
        Analytics.send({
            hitType: 'event',
            eventCategory: 'region_type_show',
            eventAction: regionType.name,
            eventLabel: regionType.id.toString()
        });
    }
    public static apiError(error: string, api: string) {
        Analytics.send({
            hitType: 'event',
            eventCategory: 'api_error',
            eventAction: error,
            eventLabel: `API: ${api} | URL: ${window.location.href}`
        });
    }
    public static calcRoute(type: number) {
        Analytics.send({
            hitType: 'event',
            eventCategory: 'calc_route',
            eventAction: type.toString()
        });
    }

    private static send(event: AnalyticsEvent) {
        (<any>window).analytics('ha.send', event);
        (<any>window).analytics('obm.send', event);
        (<any>window).appInsights.trackEvent({
            name: event.eventCategory,
            properties: {
                action: event.eventAction,
                label: event.eventLabel
            }
        });
    }
}

class AnalyticsEvent {
    hitType: string;
    eventCategory: string;
    eventAction: string;
    eventLabel?: string;
}