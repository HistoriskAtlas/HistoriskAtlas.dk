@component("window-institution")
class WindowInstitution extends polymer.Base implements polymer.Element {

    @property({ type: Object })
    public institution: HAInstitution;

    constructor(tag: HaTag) {
        super();
        this.institution = new HAInstitution({ tagid: tag.id });

        Services.get('institution', {
            schema: '{institution:[id,url,type,tagid,' + ContentViewer.contentSchema + ']}',
            tagid: tag.id
        }, (data) => {
            this.institution = new HAInstitution(data.data[0]);
        });
    }

    formatUrl(url: string): string {
        if (!url)
            return null;
        if (url.indexOf('http') != 0)
            return 'http://' + url;
        return url;
    }

    classFromInstitution(institution: HAInstitution): string {
        return "institution-" + institution.id;
    }

}

WindowInstitution.register();