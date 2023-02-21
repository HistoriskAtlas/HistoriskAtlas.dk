@component("panel-tag")
class PanelTag extends polymer.Base implements polymer.Element {

    @property({ type: Array, notify: true })
    public tags: Array<HaTag>;

    @property({ type: Array, notify: true })
    public tagTops: Array<HaTag>;

    @property({ type: Boolean, notify: true })
    public userCreators: boolean;

    @property({ type: Boolean, notify: true })
    public profCreators: boolean;

    @property({ type: String, value: 'Kulturinstitutioner' })
    public createdBy: string;

    //public tagsServiceAwaitingTagSelect: Tags;

    allCreatorsChecked(profCreators: boolean, userCreators: boolean): boolean { return userCreators && profCreators; }
    profCreatorsChecked(profCreators: boolean, userCreators: boolean): boolean { return !userCreators && profCreators; }
    userCreatorsChecked(profCreators: boolean, userCreators: boolean): boolean { return userCreators && !profCreators; }

    allCreatorsTap() { this.profCreators = true; this.userCreators = true; }
    profCreatorsTap() { this.profCreators = true; this.userCreators = false; }
    userCreatorsTap() { this.profCreators = false; this.userCreators = true; }
}

PanelTag.register();