//@component("window-geo-add-content")
//class WindowGeoAddContent extends polymer.Base implements polymer.Element {
    
//    @property({ type: String })
//    private input: string;

//    @property({ type: String, notify: true, value: '' })
//    public result: string;

//    @observe('result')
//    resultChanged() {
//        if (this.result == null) {
//            this.input = '';
//            setTimeout(() => this.$.input.$.input.focus(), 100);
//        }
//    }

//    checkForEnter(e: any) {
//        if (e.which === 13)
//            this.confirm();
//    }

//    confirm() {
//        this.result = this.input;
//    }

//    dismiss() {
//        this.result = '';
//    }
//}

//WindowGeoAddContent.register();