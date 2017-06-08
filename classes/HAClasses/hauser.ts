class HAUser {
    private _id: number;
    private _login: string;
    //private _password: string;
    private _firstname: string;
    private _lastname: string;
    private _email: string;
    private _institutions: Array<HAInstitution> = [];
    private _isActive: boolean;
    private _role: number;
    private _about: string;

    private _favourites: HaCollection;
    private _created: Date;
    private _isDefault: boolean;

    public geos: Array<HaGeo>;
    //private _deleted: boolean;
    //private institutionid: number;
    //private licensename: string;
    //private geoid: number;
    //private rolelevel: string;
    //private passwordvalidto: string;
    //private updatepassrequired: boolean;
    //private location: string;
    //private profiletext: string;

    constructor(data: any) {
        this._id = data.id;
        this._login = data.login;
        this._firstname = data.firstname;
        this._lastname = data.lastname;
        this._email = data.email;
        this._isActive = data.isactive;
        this._role = data.role;
        this._about = data.about;

        this._created = data.created;
        this._favourites = new HaCollection(data.favourites);
        this._isDefault = !this._id; //TODO: not always so...

        if (data.user_institutions)
            for (var user_institution of data.user_institutions)
                this._institutions.push(new HAInstitution(user_institution.institution));

        //this._deleted = data.deleted;
        //this.institutionid = data.institutionid;
        //this.licensename = data.licensename;
        //this.geoid = data.geoid;
        //this.rolelevel = data.rolelevel;
        //this.passwordvalidto = data.passwordvalidto;
        //this.updatepassrequired = data.updatepassrequired;
        //this.isactive = data.isactive;
        ////added
        //this.location = data.location;
        //this.profiletext = data.profiletext;
    }

    public static get default(): HAUser {
        return new HAUser({isactive: true, firstname: ''});
    }    

    get id(): number { return this._id; }
    set id(newVal: number) { this._id = newVal; }

    get login(): string { return this._login; }
    set login(newVal: string) { this._login = newVal; }

    //get password(): string { return this._password; }
    //set password(newVal: string) { this._password = newVal; }

    get isActive(): boolean { return this._isActive; }

    //get role(): number { return this._role; }

    get firstname(): string { return this._firstname; }
    set firstname(newVal: string) { this._firstname = newVal; }

    get lastname(): string { return this._lastname; }
    set lastname(newVal: string) { this._lastname = newVal; }

    get email(): string { return this._email; }
    set email(newVal: string) { this._email = newVal; }

    get institutions(): Array<HAInstitution> { return this._institutions; }
    set institutions(newVal: Array<HAInstitution>) { this._institutions = newVal; }

    get currentInstitution(): HAInstitution {
        return this._institutions.length == 0 ? null : this._institutions[0];
    }

    public isMemberOf(institutionTagID: number): boolean {
        for (var institution of this._institutions) {
            if (institution.tagid == institutionTagID)
                return true;
        }
        return false;
    }

    get created(): Date { return this._created; }
    get favourites(): HaCollection { return this._favourites; }
    get isDefault(): boolean { return this._isDefault; }
    get isPro(): boolean { return this.institutions.length > 0; }
    get fullname(): string { return this._firstname + ' ' + this._lastname; }
    get fullnameAndAbout(): string { return this.fullname + (this._about ? ', ' + this._about : ''); }
    get isWriter(): boolean { return this._role >= 1; }
    get isEditor(): boolean { return this._role >= 2; }
    get isAdmin(): boolean { return this._role >= 4; }

    get canAccessHoD2017(): boolean {
        //return true;

        if (this.isAdmin)
            return true;
        //return this.currentInstitution ? this.currentInstitution.id == 233 : false; //Historier om Danmark
        return this.isPro;
    }

    public canEdit(geo: HaGeo): boolean {
        return geo.userLayer;
        //for (var institution of this._institutions)
        //    if (geo.institutionTags.indexOf(institution.tag) > -1)
        //        return true;

        //if (!this.geos)
        //    return false;

        //return this.geos.indexOf(geo) > -1;
    }

    public canEditCollection(collection: HaCollection): boolean {
        if (!collection)
            return false;
        return collection.user.id == this._id; //TODO: should check for "userLayer" as above.....
    }
}