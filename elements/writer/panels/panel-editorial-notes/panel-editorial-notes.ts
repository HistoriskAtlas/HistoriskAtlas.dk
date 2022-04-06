@component("panel-editorial-notes")
class PanelEditorialNotes extends polymer.Base implements polymer.Element {

    @property({ type: Object })
    public content: HaContent;

    @property({ type: Array, notify: true })
    public contents: Array<HaContent>;

    @property({ type: Object })
    public geo: HaGeo;

    sort(a: HaSubContent, b: HaSubContent): number {
        return a.created > b.created ? -1 : 1; 
    }

    createdTime(created: Date): string {
        return Common.shortTime(created);
    }

    createdDate(created: Date): string {
        return Common.shortDate(created);
    }

    addTap() {

        $(this).append(DialogRichText.create('Tilføj ny note', 'Skriv noten her', (message) => {
            if (!this.content)
                this.push('contents', new HaContent({ geoid: this.geo.id, ordering: 0, contenttypeid: 3, headline: '' }));
            setTimeout(() => this.push('content.subContents', new HaSubContentText({ headline: '', text1: Common.html2rich(message), ordering: this.content.subContents.length, type: 0 }, this.content)), 100); //Timeout so Polymer has time to create the new HA-Content....
            
        }));


    }
}

PanelEditorialNotes.register();