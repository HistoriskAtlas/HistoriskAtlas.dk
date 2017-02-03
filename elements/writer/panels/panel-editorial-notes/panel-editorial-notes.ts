@component("panel-editorial-notes")
class PanelEditorialNotes extends polymer.Base implements polymer.Element {

    @property({ type: Object })
    public content: HaContent;

    sort(a: HaSubContent, b: HaSubContent): number {
        return a.created > b.created ? -1 : 1; 
    }

    createdTime(created: Date): string {
        return Common.shortTime(created);
    }

    createdDate(created: Date): string {
        return Common.shortDate(created);
    }
}

PanelEditorialNotes.register();