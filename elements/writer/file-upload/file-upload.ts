@component("file-upload")
class FileUpload extends polymer.Base implements polymer.Element {
    @property({ type: Boolean })
    public multi: boolean;

    @property({ type: String, value: '' })
    public accept: string;

    @property({ type: Array, value: [] })
    public files: Array<any>;

    //@property({ type: Object, value: {} })
    //public headers: Object;

    //@property({ type: String, value: '' })
    //public target: string;

    //ready() {
    //    if (this.auto)
    //        this.uploadClick();
    //}

    constructor(multi: boolean, accept: string) {
        super();
        this.multi = multi;
        this.accept = accept;
        //this.target = target;
    }

    public uploadClick() {
        var elem = this.$.fileInput;
        if (elem && document.createEvent) { // sanity check
            var evt = document.createEvent("MouseEvents");
            evt.initEvent("click", true, false);
            elem.dispatchEvent(evt);
        }
    }
    @listen('fileInput.tap')
    fileInputTap(e) {
        e.cancelBubble = true;
    }

    public dropFile(e: DragEvent) {
        e.preventDefault();
        for (var i = 0; i < e.dataTransfer.files.length; i++) {
            var file: File = e.dataTransfer.files[i];
            if (!this.multi && this.files.length !== 0)
                return;

            //var mimeType = ((file.type !== '') ? file.type.match(/^[^\/]*\//)[0] : null);
            //var fileType = file.name.match(/\.[^\.]*$/)[0];
            //if (this.accept !== '' && !(this.accept.indexOf(mimeType) > -1 || this.accept.indexOf(fileType) > -1))
            //    return;

            this.uploadFile(file);
        }
    }

    private fileChange(e) {
        for (var i = 0; i < e.target.files.length; i++)
            this.uploadFile(e.target.files[i]);
    }

    private uploadFile(file: File) {
        if (!file)
            return;

        (<any>file).progress = 0;
        (<any>file).error = false;
        (<any>file).complete = false;
        this.push("files", file);

        this.fire('before-upload');
        var fileType: string = file.name.split('.').pop().toLowerCase();

        if (fileType == 'pdf') {
            this.insertedPDF(file); //, fileType
        }
        else {
            Services.insert('image', { 'userid': App.haUsers.user.id, 'text': '' }, (data) => this.insertedImage(file, data)) //, fileType
        }
    }

    private insertedPDF(file: File) { //, fileType: string
        //(<any>file).newName = (Math.floor(Math.random() * 9000000) + 1000000) + file.name;
        //(<any>file).path = 'Pdf\\' + (<any>file).newName;
        (<any>file).url = `pdf/${file.name}`;
        this.inserted(file) //TODO: Handle filename collisions............................................
    }

    private insertedImage(file: File, result: any) { //, fileType: string
        var image = new HAImage(result.data[0], -1);
        //(<any>file).path = 'Image\\' + (image.id % 100) + '\\' + image.id + '.' + fileType;
        (<any>file).url = `image/${image.id}.jpg`;
        (<any>file).image = image;
        this.inserted(file)
    }

    private inserted(file: File) {
        var formData = new FormData();
        formData.append("file", file, (<any>file).path);
        var prefix = "files." + this.files.indexOf(file);

        //var xhr = (<any>file).xhr = new XMLHttpRequest();
        Services.HAAPI_POST((<any>file).url, null, formData, "Uploader fil", () => {
            this.fire("success", { image: (<any>file).image, file: file }); //xhr: xhr, 
            this.set(prefix + ".complete", true);
            this.splice("files", this.files.indexOf(file), 1);
        }, () => {
            this.set(prefix + ".error", true);
            this.set(prefix + ".complete", false);
            this.set(prefix + ".progress", 100);
            this.updateStyles();
            this.fire("error"); //, { xhr: xhr }
        }, (e: ProgressEvent) => {
            var done = e.loaded, total = e.total;
            this.set(prefix + ".progress", Math.floor((done / total) * 1000) / 10);
        })

        //xhr.upload.onprogress = (e: ProgressEvent) => {
        //    var done = e.loaded, total = e.total;
        //    this.set(prefix + ".progress", Math.floor((done / total) * 1000) / 10);
        //};
        //var url = Common.api + 'upload.json?v=1&sid=' + (<any>document).sid;
        //xhr.open('post', url, true);

        //xhr.onload = (e) => {
        //    if (xhr.status === 200) {
        //        this.fire("success", { xhr: xhr, image: (<any>file).image, file: file });
        //        this.set(prefix + ".complete", true);
        //        this.splice("files", this.files.indexOf(file), 1);
        //    } else {
        //        this.set(prefix + ".error", true);
        //        this.set(prefix + ".complete", false);
        //        this.set(prefix + ".progress", 100);
        //        this.updateStyles();
        //        this.fire("error", { xhr: xhr });
        //    }
        //};
        //xhr.send(formData);
    }
}

FileUpload.register();