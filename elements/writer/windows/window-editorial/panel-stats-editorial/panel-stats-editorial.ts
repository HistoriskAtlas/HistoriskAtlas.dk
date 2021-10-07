@component("panel-stats-editorial")
class PanelStatsEditorial extends polymer.Base implements polymer.Element {

    @property({ type: Boolean })
    public selected: boolean;

    @property({ type: Number })
    public totalGeoViews: number;

    @observe('selected')
    selectedChanged() {
        if (this.selected) {
            this.fetchStats();
        }
    }

    public fetchStats() {
        //Services.get('institution', {
        //    'schema': JSON.stringify(
        //        {
        //            institution: {
        //                fields: ['geoviews'],
        //                filters: { id: App.haUsers.user.currentInstitution.id }
        //            }
        //        }
        //    ),
        //    'count': 'all'
        Services.HAAPI_GET(`institution/${App.haUsers.user.currentInstitution.id}`, { schema: 'geoviews' }, (result) => {
            this.totalGeoViews = result.data;
        })
    }

    institution(): string {
        return App.haUsers.user.currentInstitution ? App.haUsers.user.currentInstitution.tag.plurName : '';
    }

    numberWithSeparaters(n: number): string {
        return Common.numberWithSeparaters(n);
    }
}

PanelStatsEditorial.register();