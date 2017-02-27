@component("by-line")
class ByLine extends polymer.Base implements polymer.Element {

    @property({ type: Array })
    public institutions: Array<HaTag>;

    @property({ type: Object })
    public user: HAUser;

    show1001User(institution: HaTag): boolean {
        return institution.id == 731; //1001 institution
    }

    showUser(institutions: Array<HaTag>, user: HAUser): boolean {
        return institutions.length == 0 && user != null;
    }

    institutionTap(e: any) {
        Common.dom.append(WindowInstitution.create(e.model.item));
    }

        //public get creator(): string {
    //    var institutionTags = this.institutionTags;
    //    if (institutionTags.length > 0) {
    //        var institutionNames: Array<string> = [];
    //        for (var institutionTag of institutionTags) {

    //            if (institutionTag.id == 731) {//1001 institution
    //                if (this.user) {
    //                    if (this.user.isMemberOf(institutionTag.id)) {
    //                        institutionNames.push((<HaTag>institutionTag).plurName + ' / ' + this.user.fullname);
    //                        continue;
    //                    }
    //                }
    //            }

    //            institutionNames.push((<HaTag>institutionTag).plurName);
    //        }
    //        return institutionNames.join(', ');
    //    }

    //    if (this.user)
    //        return this.user.fullname;

    //    return '';
    //}

}

ByLine.register();