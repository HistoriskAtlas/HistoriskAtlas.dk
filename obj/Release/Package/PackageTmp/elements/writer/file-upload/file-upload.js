var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var FileUpload = (function (_super) {
    __extends(FileUpload, _super);
    //@property({ type: Object, value: {} })
    //public headers: Object;
    //@property({ type: String, value: '' })
    //public target: string;
    //ready() {
    //    if (this.auto)
    //        this.uploadClick();
    //}
    function FileUpload(multi, accept) {
        _super.call(this);
        this.multi = multi;
        this.accept = accept;
        //this.target = target;
    }
    FileUpload.prototype.uploadClick = function () {
        var elem = this.$.fileInput;
        if (elem && document.createEvent) {
            var evt = document.createEvent("MouseEvents");
            evt.initEvent("click", true, false);
            elem.dispatchEvent(evt);
        }
    };
    FileUpload.prototype.fileInputTap = function (e) {
        e.cancelBubble = true;
    };
    FileUpload.prototype.dropFile = function (e) {
        e.preventDefault();
        for (var i = 0; i < e.dataTransfer.files.length; i++) {
            var file = e.dataTransfer.files[i];
            if (!this.multi && this.files.length !== 0)
                return;
            //var mimeType = ((file.type !== '') ? file.type.match(/^[^\/]*\//)[0] : null);
            //var fileType = file.name.match(/\.[^\.]*$/)[0];
            //if (this.accept !== '' && !(this.accept.indexOf(mimeType) > -1 || this.accept.indexOf(fileType) > -1))
            //    return;
            this.uploadFile(file);
        }
    };
    FileUpload.prototype.fileChange = function (e) {
        for (var i = 0; i < e.target.files.length; i++)
            this.uploadFile(e.target.files[i]);
    };
    FileUpload.prototype.uploadFile = function (file) {
        var _this = this;
        if (!file)
            return;
        file.progress = 0;
        file.error = false;
        file.complete = false;
        this.push("files", file);
        this.fire('before-upload');
        var fileType = file.name.split('.').pop().toLowerCase();
        if (fileType == 'pdf') {
        }
        else {
            Services.insert('image', { 'userid': App.haUsers.user.id, 'text': '' }, function (data) { return _this.insertedImage(file, fileType, data); });
        }
    };
    FileUpload.prototype.insertedPDF = function (file, fileType, data) {
        file.path = 'Pdf\\' + file.name;
        this.inserted(file);
    };
    FileUpload.prototype.insertedImage = function (file, fileType, result) {
        var image = new HAImage(result.data[0]);
        file.path = 'Image\\' + (image.id % 100) + '\\' + image.id + '.' + fileType;
        file.image = image;
        this.inserted(file);
    };
    FileUpload.prototype.inserted = function (file) {
        var _this = this;
        var formData = new FormData();
        formData.append("file", file, file.path);
        var prefix = "files." + this.files.indexOf(file);
        var xhr = file.xhr = new XMLHttpRequest();
        xhr.upload.onprogress = function (e) {
            var done = e.loaded, total = e.total;
            _this.set(prefix + ".progress", Math.floor((done / total) * 1000) / 10);
        };
        var url = Common.api + 'upload.json?v=1&sid=' + document.sid;
        xhr.open('post', url, true);
        //for (var key in this.headers)
        //    if (this.headers.hasOwnProperty(key))
        //        xhr.setRequestHeader(key, this.headers[key]);
        xhr.onload = function (e) {
            if (xhr.status === 200) {
                _this.fire("success", { xhr: xhr, image: file.image });
                _this.set(prefix + ".complete", true);
                _this.splice("files", _this.files.indexOf(file), 1);
            }
            else {
                _this.set(prefix + ".error", true);
                _this.set(prefix + ".complete", false);
                _this.set(prefix + ".progress", 100);
                _this.updateStyles();
                _this.fire("error", { xhr: xhr });
            }
        };
        xhr.send(formData);
    };
    __decorate([
        property({ type: Boolean }), 
        __metadata('design:type', Boolean)
    ], FileUpload.prototype, "multi", void 0);
    __decorate([
        property({ type: String, value: '' }), 
        __metadata('design:type', String)
    ], FileUpload.prototype, "accept", void 0);
    __decorate([
        property({ type: Array, value: [] }), 
        __metadata('design:type', Array)
    ], FileUpload.prototype, "files", void 0);
    __decorate([
        listen('fileInput.tap'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', void 0)
    ], FileUpload.prototype, "fileInputTap", null);
    FileUpload = __decorate([
        component("file-upload"), 
        __metadata('design:paramtypes', [Boolean, String])
    ], FileUpload);
    return FileUpload;
}(polymer.Base));
FileUpload.register();
//# sourceMappingURL=file-upload.js.map