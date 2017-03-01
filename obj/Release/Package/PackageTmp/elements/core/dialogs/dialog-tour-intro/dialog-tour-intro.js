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
var DialogTourIntro = (function (_super) {
    __extends(DialogTourIntro, _super);
    function DialogTourIntro(showFirst) {
        if (showFirst === void 0) { showFirst = true; }
        _super.call(this);
        this.curDialog = 0;
        if (showFirst)
            this.$.dialog.open();
        else
            this.nextTap();
    }
    DialogTourIntro.prototype.dismissTap = function () {
        AppMode.showPopup();
    };
    DialogTourIntro.prototype.nextTap = function () {
        App.mainMenu.drawerOpen = false;
        this.curDialog++;
        $(this).append(DialogTour.create('Her er hovedmenuen', 'Her kan du slå indhold på kortet til og fra, og få mere information. Til højre herfor finder du søgeknappen.', -25, null, 50, null, 6, null, -15, null));
    };
    DialogTourIntro.prototype.next = function () {
        this.curDialog++;
        switch (this.curDialog) {
            case 2:
                $(this).append(DialogTour.create('Her er MitAtlas', 'Her kan du logge ind eller oprette en bruger, så du kan bidrage med dine egne fortællinger!', null, -25, 50, null, null, 6, -15, null));
                break;
            case 3:
                $(this).append(DialogTour.create('Her er kortnavigationen', 'Brug knapperne til at zoome på kortet og finde hen hvor du er lige nu. mv.', null, 50, null, 0, null, -15, null, 6));
                break;
            case 4:
                $(this).append(DialogTour.create('Her kan du vælge et nyt kort', 'Hvis du vil se hjælpen igen, så vælg "Brug for hjælp?" i hovedmenuen.', -20, null, null, 50, 6, null, null, -15, true));
                break;
            case 5:
                AppMode.showPopup();
                break;
        }
    };
    __decorate([
        listen('next'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], DialogTourIntro.prototype, "next", null);
    DialogTourIntro = __decorate([
        component("dialog-tour-intro"), 
        __metadata('design:paramtypes', [Boolean])
    ], DialogTourIntro);
    return DialogTourIntro;
}(polymer.Base));
DialogTourIntro.register();
