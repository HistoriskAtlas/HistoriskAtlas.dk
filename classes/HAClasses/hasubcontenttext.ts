class HaSubContentText extends HaSubContent {
    private _text: string;
    private _name: string;
    private _type: number; //0=rich-text, 1=plain-text

    constructor(data: any, content: HaContent) {
        super(data, content);
        this._text = data.type == 0 ? Common.rich2html(data.text1) : data.text1;
        this._name = data.name;
        this._type = data.type;
        //this._headline = Common.rich2html(data.headline); //TODO: conversion needed?
    }

    get isText(): boolean {
        return true;
    }

    get text(): string {
        return this._text;
    }
    set text(value: string) {
        this._text = value;
    }

    get name(): string {
        return this._name;
    }
    set name(value: string) {
        this._name = value;
    }

    get isRichText(): boolean {
        return this._type == 0;
    }
    get isPlainText(): boolean {
        return this._type == 1;
    }

    public insert(callback: (props: Array<string>) => void) {
        super.insert(callback, 'text',
            {
                //headline: this._headline,
                text1: Common.html2rich(this._text),
                type: this._type
            }
        )
    }

    public update(property) {
        switch (property) {
            //case 'headline':
            //    Services.update('text', { id: this._id, headline: this._headline }, (result) => { }); break;
            case 'text':
                var test = Common.html2rich(this._text);
                Services.update('text', { id: this._id, text1: Common.html2rich(this._text) }, (result) => { }); break;
            default:
                super.update('text', property); break;
        }
    }

    public delete() {
        this.deleteSuper('text')
    }
}