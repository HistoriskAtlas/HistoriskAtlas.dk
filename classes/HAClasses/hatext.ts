class HaText {
    private id: number;
    private text: string;
    private headline: string;

    constructor(data: any) {
        this.id = data.id
        this.text = data.text;
        this.headline = data.headline;
    }

    set setText(newText: string) {
        this.text = newText;
    }

    set setHeadline(newHeadline: string) {
        this.headline = newHeadline;
    }

    get _id(): number {
        return this.id;
    }

    get _text(): string {
        return this.text;
    }

    get _headline(): string {
        return this.headline;
    }
}
 