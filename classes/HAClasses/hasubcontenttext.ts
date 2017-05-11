class HaSubContentText extends HaSubContent {
    private _text: string;
    private _headline: string;

    constructor(data: any, content: HaContent) {
        super(data, content);
        this._text = Common.rich2html(data.text1);
        this._headline = Common.rich2html(data.headline); //TODO: conversion needed?
    }

    get text(): string {
        return this._text;
    }
    set text(value: string) {
        this._text = value;
    }

    get headline(): string {
        return this._headline;
    }
    set headline(value: string) {
        this._headline = value;
    }

    public insert(callback: (props: Array<string>) => void) {
        super.insert(callback, 'text',
            {
                headline: this._headline,
                text1: Common.html2rich(this._text)
            }
        )
    }

    public update(property) {
        switch (property) {
            case 'headline':
                Services.update('text', { id: this._id, headline: this._headline }, (result) => { }); break;
            case 'text':
                var test = Common.html2rich(this._text);
                Services.update('text', { id: this._id, text1: Common.html2rich(this._text) }, (result) => { }); break;
        }
    }

    public delete() {
        super.delete('text')
    }
}