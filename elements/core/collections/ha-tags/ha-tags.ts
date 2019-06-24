@component("ha-tags")
class HaTags extends polymer.Base implements polymer.Element {
    @property({ type: Array, notify: true })
    public tags: Array<HaTag>;

    @property({ type: Array, notify: true/*, value: Array<HaTag>(20)*/ })
    public tagTops: Array<HaTag>;

    @property({ type: Object, notify: true }) //Not used yet
    public passedTag: HaTag;

    @property({ type: Array, notify: true, value: [] })
    public selectedTagNames: Array<string>;

    //@property({ type: Boolean })
    //public beingIndexed: boolean;

    
    public static loadedCallbacks: Array<() => void> = [];

    //TEMP(?)
    public static tagsWithMarkers: Array<HaTag> = new Array<HaTag>(10000);
    private static _crossHairMarker: string;
    //public static tagUGC: HaTag; //only needed because UGC cant add subjects yet........................................................................
    //public static tagUserLayer: HaTag; //TODO: create as seperate map layer instead....................................................................
    //public static tagTop: Array<HaTag> = new Array<HaTag>(20);

    public byId: Array<HaTag>; //Needed because polymer dosnt suppert asigning to array, ie. tags[id] = tag

    private parentIDs: Array<Array<number>>;
    private childIDs: Array<Array<number>>;
    private tagIdsInStorage: Array<number>;
    private RLEregex: RegExp = /(.)\1{3,60}/g;

    private static _blankMarker: HTMLImageElement;
    public static _blankImageMarker: HTMLImageElement;
    private static _numberMarkers: Array<string> = [];
    private static _viaPointMarkers: Array<string> = [];
        
    ready() {
        HaTags._blankMarker = document.createElement("img");
        HaTags._blankMarker.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAwCAYAAAB5R9gVAAAFbklEQVRYw82YfUzVZRTHv+c8v3tBXvRegQlXE8UBOlkp+Iav+cKcyJxZrXyZKGo4m3O1WjVRyv6o1h9t5NaLpZGZW6Vzy0pD1EQF+sOcoolWKgjmgosgiHh/z3P6I/AlU3m9t++/z9n5ffZ9fs/ZOYfQQYlIEoBpAMb6jCSRyEAQqdZDLUQXHUynAJQCKCSiUx3JT+2ECAaQaRtZbTENF0BOVnnN8coade5KA3zaAAAcihHfrzdGDozSSR43E0C2kTKL6X0A+UTU0mUgEXlSG9momKL3l1eb/KNn+dsTF1F3/cG5+4YGYc5jsViSmmimJMSwNnJZMa0iol2dAhKRPsbgI2Y8U1herV/6ulgdr6xFZ5QSG4l3nxqnpyZ4lDHYzoyVRNTQbiARGezTZt9N28RmbzuktpX+hu7Q4nEJ+GDhRO2w+LyDOY2ILjwUSETitJGjVxqaI6a/t9s68+dVdKeGe9zY98JsOyqsV61iSiWi8/cFEhG3T5tfahtvDBj79i5V4W1ET2hQRDhKX5urI0KDLyqmZCKqbzvjOwNtLZ/5tHlkZt73PQYDABdqr2FW3g/Kp80gW8vmO8/4DncWWYrmrNh6iE9c8qKndayiBiu3FbGlaJ6IzL/rykQkxNamcu/pS+6MjXsIftTeNekybain1mIeSETNbQ4tU0x9X935s19hAOCVnaWkiCIBZN26Mp8xq388XSVl1V5/8+B4ZS0Kz1SLz5jVAMAiMsrBHP/J4TN+d6dNm4+Uk4M5UURGMIBZtjGy51RloHiw++RF2NoIgHQWkTEnLnmlscUXMKBrN3woq64TAKPZZ2T4ySovI8Aqq/byTW2SWBFFVV1tCjQPqq42gYF+zISQphY74EDXbvigFPdiI7geFuQIOFBYkAPGSDNrkbqIsKCAA0WGBUOLeJlBlYMjwiXQQHGR4aKYKthSVDQxPsZYHLiH5lCM8UOijSI6zABKejmUSh4YGTCgUbFRCHYoBaCEAezVRuqXTxwaMKAVk4ZCG6kHUMBE1KyYti4YM0T3Dnb6HcYV4sSzo4doxZR/Z/uxsZfTwtr0kX4HyklPRrDDEgAbb7UfRFTORHkvpj1qEvu5/AYzNNqFNdOTDAF5RHTu3z31GxCp/WZlmg4NsvxSCHesTNMEqgGw4Z6emojqLcXzhnvcsiXzcVHcc+2RYsLnWVPNsBi3UUzz7jt1ENFhAp5/OiUO25dPF6fV/bXJaTG+em6GPDFiEBGwioiOtGdyzTQin/507jIt2XKQu2skio0IQ/7SqXpyfIwQkEVEWzsy28/QRr5ssbX75R0l1qaiM7e2HJ2pxNmTh+GdeWN1kKVqFdMCIirs8PZDRKIE+JiAuRXeRv3md8dUfvHZdoM5FCMzNQG5GSn2AHeoJSI7iSibiGq6uh8ar0VeV0Rp2V8U4eOiX9sFlD15GD5cOAlapEAR5RJRcbcsrG6N2sYUXKlvnhq3drtqsfUDY4MshQtvzbf7hYfsZ6aZ7f1Gh56RIlrvcYWorAmJD41dNjER0b1DLCLkduQbHQIiomItUpiTnqyDLPVAd3LSk20RFBBRSY8Btbq0zuMKUUvGJ9w3Zun4RMT06bg7nQJqdWn/utnJ+r8Kp9NirM9ItgXY156fuMtAbS71d4WqzNR7XVqS2uoOsL4zuTsFRERHtciB3IyUu1xyWozcjBRb/tlPF/sNqNWlnP6uULV43G2XMlMT4HF13p0uyzbmQKW30Xau2iTOVZukqq7JZ0QKu5KzS42PIsoZ4A49vGhsPAgEjyvEArAuoPOUbcyR3/9q8P1R03DTGCkK+MQpIlPktibg/yCfbQ7Zxhzsjlzd0jxbijYA6JZx/G+qy0TEoXIVyQAAAABJRU5ErkJggg==';

        HaTags._blankImageMarker = document.createElement("img");
        //HaTags._blankImageMarker.src = 'data:image/png;base64,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';
        HaTags._blankImageMarker.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAwCAYAAAB5R9gVAAANjnpUWHRSYXcgcHJvZmlsZSB0eXBlIGV4aWYAAHjarZprduMwroT/cxWzBIJvLofPc+4O7vLnA6WknbTz7Im7LUeWRLCqUAClmPX//7fNf/iJzicTYi6ppmT5CTVU1/hQ7PVzbcWG835+XLi/k7f7jb/3W8cu/eXekdZ9fGN//HNCvi8k/e1+k8d9nXJfSF4vfH68jqyf7+PKfSHvrv1y/27qfV4LD9O5/7txX/ZlWu9+DxkwZuR63hm3vHjLe9JRPBH46hvbxLvzweke4XM4787759iZYZ+D9/rpHXa23fv9WyiMTfcB6R1G936J7/b712Hcm4jkz8hvvohLXgl9j93es+y9rtm1kEAqmXtSL1M5nziwA+WFRuKV+R/5nM+r8ipMccDYhM3Oaxip4hh7S5ApTbassx0yCDG45TJb54bzZ1/x2VU3DilBX7Jdhp5pfIGJAWue3e41Fjnj1jPekMLIUzjSCRcTzvjrZZ7t/M3r9UJ7qxBEbLlwGodgp5omDGVO3zkKQmTfmMaD73mZB93YB2I9DMYDc2GCzfbrEj3KH235w7PnuGiDsVdqSJ73BYCIsSPBoOggNomPksRm57IIOBb4aUSusu8wIDG6KWbDjfcJcorTsTknyznWRXftxlogIpI0GWpIIMgKIaKfHAoaatHHYGKMKeZYYo0t+RRSTCnlpB7Vss8hx5xyziXX3IovocSSSi6l1NKqqx4LizXVbGqptbbGoI1LN85uHNFad9330GNPPffSa28D+Yww4kgjjzLqaNNNP0n/mWY2s8w625KFlFZYcaWVV1l1tY3Wtt9hx5123mXX3V5Zkztt37Am75j7nDW5WVPGwjku/2GN3Tm/XELUTqJyBmMuCIxnZQBBO+XMFgnBKXPKma1YlI8O1iQqOVOUMRgMS1zc8srdH+Y+5c3E8CPe3EfMGaXuf8GcUepu5v7m7Qlrs51E9IcgzULF1PqNse0sk6NdyaH1FOvKsQoqw5A0g30d4ucoO7RRPXYzfcl7dOlcFh5XzLo1pTWgrbBb8DTd1Xa5tpCdq0t9tzVnqjUP/Al/c0xIcy8OUVNzvossU+PMAVpaKcuOsFycLq+Q29CLDZdqywSwTwB9CcMztt9Yepi+75XLnHlP6FetRToA/HxwmVau89IdeNftfa5bM/hzbufc7eYZjJPDNjOA717T7dVG7jr6t6N4DML8OgrZSP5PBObvEPRSkh8u9SSMa0KKhuKokZjXUK5APg7j7yDexGB+gsNnMJif4PAZDOYnOHwGg/kJDp/BYH6Cw2cwmJ/g8BkM5ic4fAaD+Ze0eITB/EtaPEZg/iUtHmEw/5IWjzCYf0mLx/HNlzgUjHjVkfeK9zDuGiZ17LfV4Fub3ZtAXzO4eFu0rVRbGcvKGmG3SSlbRY5hM5Wx7ZgYNlWK6nmaNQzb+k5F6HGZnrHqvdkzTkxx2wM6pbqt1DZbT41M1Ge3Wt9O8kjnCGcZaa8Lo2CEg2msRVEosblTPxaFSi/m+DLbU2SY9lVmKDKR8mZj68PvkU7FcWJSAeRerP46bW2dBQ3VfiWMPGTqYxTWhi3lsuR81pXVk6356Isn2xxknQEBgkp+gBjsWIWybhY9lj017IYJkHhv9oC9C3Ncwc0z5ZmvKTdxk2YgFw/vwW6vdS0PNqs4gE/Jl538JQRv/6q/8Zr+AzhOXpEx+wAzaTKecfEVFeAp1PJdxYw9FYO4al2+xIMHc//x1rzZIZN4vovKAyhCihD4AfrQcEiw9tDwwsKjVOfVpcBDrWX5WQbpNQ4s5ue4PJeo+Vuj7yVahi3pS32a7+vxA33ewJgfIXMrlGMvNi4uDhPmYyoe9Om/TlzzDJVXfb5hQa3l4oHp/WHi4iGYN/L8B3Wajw94UeczRP4GxDyI80OL+MwhXpRpXqX5I0QedHnjb742iP0tVZpfqvEv1zQ/xeQj1zRfGMS3XdN8iMoPXdM8s83f6NJ8KdxvuqZ5Zpu/cU3zzDZ/45rme5X9a9c03yjr39qaZ7b5G9c03zOJr13TfBeVr1zTfGASP1an+VmR/9g1zRcl/duuaZ7Z5m9c0zyzzd+4pvlus/nV1ny32fzKNc0v2qq3rikXmOYhz+05csYVauNTzLFVVh5h2lEti4wRhFWGC6wyQl3E2nQ4vf+VKJC6InFDfA9nQSJDgjsLkrKWHppC3Tala1XT41nVXNMeYWY/cZNWm8ezxZeUY0TDyx3GbCmrnU9+Mspeu53l1XLpLPpKYG1ysKxrJuaXJ7NmBekj6x/2F7JAk3G2pWd3+L/OLcHtsMj+NfMRRZ7tOAWnTr/j8uSS6Vyt9bqc/300Goz5fTQhT827OxKzLHE1F8equgTsro8wWuxp6d3T7Itj0Nm6L2XE3LeudH2ZrDNtkeRqWmnXGLxJa4C51ZuEsokuw5wfATF4xMWoofmezw3NkUIqwVfvfKucUGXWkFtM0Cgm28oUWFS2nmxqwcfYZeUYosZgW2JKdTxPCwZz53Eai1QWfrOkUrPXHJweSMS1kma/pacLXD9X756UyORr6DP56Kqba7nF4fpEwFGyR1rNroy+c9Rl7pyz5AuGoGtjKQeGGoBt9N70VikGV0G9V6c3ZkWmJLNyZu1sZ9B7s8mzQGctz1fnXkKPZykf5q3kTwRrjkb67Hq+7ddthDsT0rmtfs5+Lo9ODm1Bk7N21iJxbAjbL1q7laaK8flFMXs4qDr3I9LL/Yh63Y8gwdM6Eb1o7qhVVXc0hyvdV5B83QlJ152QqXdCSNPVh2goJxIXDWUh+F6nW8SS6wrnTruHVScuKAn4MJLqpPqQBLvvbE1tClDMM1T0rgcmE3wLs3tcyIcyylhx1GqLyt36ji4qscTVW0OsZqw2fJJ63Xwm2svE2fGXhwPayjuVBfgMa33mQrtv0a5BKy1UrI23LZ8IdOTcfJitEZWNFGrLde1UEWU1vxGLIwtCmilJQXALd2UFqfY8j4VoXh4eNLVOhieJVUs4+UKRrRvjoajNuZi4ProC5KC32zO5YKzzesO9x3KDOjY5JpQ6/dBbDAIFsjv1KuSqD9BCw8krlGG/1EQJGq5JjpmTX67USjJTCbtSVTH4soFzgZVr2w/ccOzKyVFWaDWT27VfgGpWmxck9fkbpouEtY/S+PF0KgicE39rPbuBh3S9/dRj2AnsUy9rihsEw8IPAl2NdcYQUuyuBPWmQuAkDlVJ5gG97pLJdnKZKmjn9LAy0GsWP7umr/GSY65JWiJ9caRCQoXeZ5lIG2BmJmUttjutxtiALCMtN4ebKAh2Xfc2OdPGrCi7huRRR98NrnHiD9RyxHJ9qynlcm0nH2cxMUHwlIgKxqAvo7aF9Is2wtya3dEjsfNYtiyqU+qjqFMc88x5udBzdT4XnDWV1jc1n5xS/lMejrpWukczhDoik2gRIFLVYo6gU0BbVG19TtQl0Sz3oglegIH8xPdzE4ZtdjazIJaaoCIdbXSBNX167AUAOA31061hnt2joZXOHc/Uw6786620fIwCY4vYx3ZXgq4Y7ZlpU9f2SIQzsYOa0VLB/myaUvOKTAVjQ6u0Lr1i+8kbVLF8W7nQtcB4sDgKSo7scaHqAzyGpJhZaMWb0pVGNEGOIZBf7sMCId1I1DrYOxoGWYckAz0PbljmrAWVwT4QrOaZtSA+aKAOqLZVNjsKHakn1xoTq9u700jHItP9rpXEj3LGHCoFuVNWqIB6/zliR62qHU1LQWN4SElgi9awBJ/CWolgcPSlqb3DuTVGZzjS1Mss1FjJSSzcdqZoC61AY5JpVYmxdBtjGmVyQaaaZWpKIrK2zSXxlOWUPEn7FJu9hutOe0qiQAx02tmrK1H5fAiAWNtVJpRpiHCGQoHg6BdVXhWKC2aCYkXokAu1hcqftqBzVO8W8hntZP0m5xFxrGivDWduTxut4r9qDUn/6AL7eLU0fdS/sqeKkyQ4OYa2bKITbXYX0XUBLt/oRqoP24bTAE8aLbFraBsyI8sS+qm26HijDkutlkfvWlf/SyO+9O4xBY3E0Wnghn4C1kgsOyzw1r4SvWUviBgY9Alw8MGiKzoo3DZ3ITl93NKWqac3o3uZ+gcJgLKOLAt9CC0X9SMlfaRQgV7TCk+n9G5oQq2q7sv5RJ9CMKP8hvBBE/VAOMb5nnD905p35mbU3f4X5mY+vsV0zC68M7v+anbxmF0Ot9cZEi4dV9gAOumSaL9ZUkAQv1ARUNMkVIr4PW3WWxGz40qJNcyUzNxpKQzo0fooeuR27kGwAxpenTprIP1TDme1xUH93qljajnDrWbg66kdSowOJzDqdch6CV1yzz5VjbhUpyEXn1DpHx/DxfpxsQcTY7XqdXRzd1gvLuaeuNh+42KMVJ+YmPnCxcqrh5XN+jTPSr7wL4XmCrXR0ozpB8DWsq87f79dG2Mw/qUqiz6wW+pF0SFNakxNcDSBfuKdJ+DAnjnGCdgjTafQbRv1OW1Xgc9VmC2lPQ6mZ/VPgWhjekfhzp2ShvwrkNZT0mg7yQZWPjjjWc2N5QyeZZ+bGSjTb5XZv9VFGPekiyBPVJW3i9Nk6eO9N00lS+bHptL3bt53lYt+DnbsSzd53U+imzz9pfaTTEj/nMp++ymENqSzmv8C54gOC5eC5/4AAAAGYktHRAD9AAEAAT8idTIAAAAJcEhZcwAALiMAAC4jAXilP3YAAAAHdElNRQfjBhgJKReOrWj/AAACF0lEQVRYw+2YTWtTQRSG3zMzuYUb1OuqmroSzMWdpoLeRCOuCjG4V6xp60LIH3DRfEA34h/o5q7c6N6drWnFVuPChUsRFEFciKJYFWkzd44LI0VKmq+myWJemN2ZmYd3Ps7hUCMyGCUpQUDl4UvoiIcLIgkLV85AEREA4O6jV0MFms+dBhFBYMRkgSyQBbJAFsgCWSALZIEskAWyQBbIAlmgrqSY/3Y9bk+dahn0Y3ML4dpr9Nq6iUmBW9mTiDuxljH/ui/U6SbMjOL9ddyrv+kYLCYFCkESi9cuoNlkaX9kMSnQbihBaSFoKZzO8mzaZwAdjbmMz+F0loXAkhIUdLIXdWO9Nmb50/ffl47PP5CbOto1dkxJvL9zVY8fcFeEoKmBXGpJVEl4rpzL+G1jb573ceSgq4hQHdgrI6J6xFwr5VLRmJK7ulPKpTQzlonoxUCfvSQqJzxXzqSTLWNm0z6OHurenZ6Ami6tlC+nIkftnO4ogUo+pRl4TET1ffkYJVF5wovLQrDTpZmg6Q5Q2befmoieR8yr1fzkfy45SqCan9QM1Hpxp6/UIYlKE15c3ji37VIhSCLh9e5O39LGrH74+lM7xZCdYsgfv/1qGOZaX7msn8mSqHTscHz9+tkTIBASnqsAlIeanbUxz95+3mi8+7KxZQyvDb1cYOaLvK3MSNQwDW2eamOe7Ek9tCeLSFpoZvi+9QeTjbkJM/wo6gAAAABJRU5ErkJggg=='

        this.tags = [];
        this.byId = [];
        this.parentIDs = [];
        this.childIDs = [];
        this.tagIdsInStorage = JSON.parse(LocalStorage.get('tag-ids'));
        if (!this.tagIdsInStorage)
            this.tagIdsInStorage = [];                                                    

        this.$.ajax.url = Common.api + 'tag.json?count=all&schema=' + Common.apiSchemaTags + (this.tagIdsInStorage.length > 0 ? '&lastmodified={min:' + LocalStorage.timestampDateTime('tag-ids') + '}' : '');
        //HaTags.createCrossHairMarker();
    }

    public get tagsLoaded(): boolean {
        if (!this.tags)
            return false;

        return this.tags.length > 0;
    }

    public handleResponse() {

        //TODO: also handle deleted tags.................................................


        var selections = this.getSelectionArray(UrlState.stateObject.t);

        for (var data of this.$.ajax.lastResponse) {
            data.selected = selections ? selections[data.tagid] : data.category == 9;
            this.getTagFromData(data)
            LocalStorage.set('tag-' + data.tagid, JSON.stringify(data));
            this.tagIdsInStorage.push(data.tagid);
        }

        for (var tagID of this.tagIdsInStorage) {
            if (this.byId[tagID])
                continue;

            var data = JSON.parse(LocalStorage.get('tag-' + tagID));
            data.selected = selections ? selections[data.tagid] : data.category == 9;
            this.getTagFromData(data);
        }
        LocalStorage.set('tag-ids', JSON.stringify(this.tagIdsInStorage), true);
        //HaTags.tagTop[9] = new HaTag({ id: 1000000 + 9, category: 9, plurname: '' });
        //HaTags.tagTop[9].selected = true;

        var tagTops: Array<HaTag> = [];

        this.tags.forEach((tag: HaTag) => {
            tag.translateRelations(this.parentIDs[tag.id], this.childIDs[tag.id])
            if (tag.isTop) {
                var topTag = tagTops[tag.category];
                if (!topTag) {
                    tagTops[tag.category] = new HaTag({ id: 1000000 + tag.category, category: tag.category, plurname: '' });
                    topTag = tagTops[tag.category];
                    //if (tag.category == 9 && !selections)
                    //    topTag.selected = true;
                }
                topTag.children.push(tag);
            }
        });

        for (var tagTop of tagTops)
            (<any>tagTop)._selected = selections ? tagTop.allChildrenSelected : tagTop.category == 9;

        this.set('tagTops', tagTops)
        this.parentIDs = null;
        this.childIDs = null;

        //this.push('tags', HaTags.tagUGC = new HaTag({ tagid: 10000, category: 6, plurname: 'Vis altid' }));
        //HaTags.tagUGC.selected = true;
        //this.byId[HaTags.tagUGC.id] = HaTags.tagUGC;

        //this.push('tags', HaTags.tagUserLayer = new HaTag({ tagid: 10001, category: 6, plurname: 'Brugerlag' }));
        //HaTags.tagUserLayer.selected = true;
        //this.byId[HaTags.tagUserLayer.id] = HaTags.tagUserLayer;

        if (App.passed.tag)
            this.passedTag = this.byId[App.passed.tag.id];

        this.updateSelectedTagNames(9);
        this.updateSelectedTagNames(10);
        this.loadMarkers();
    }

    private getTagFromData(data: any) {
        var tag: HaTag;
        this.push('tags', tag = new HaTag(data)); //TODO: should update all at once?
        this.byId[tag.id] = tag;
        if (data.parents.length > 0) {
            this.parentIDs[tag.id] = [];
            data.parents.forEach((parentID: number) => {
                this.parentIDs[tag.id].push(parentID);
                if (!this.childIDs[parentID])
                    this.childIDs[parentID] = [];
                this.childIDs[parentID].push(tag.id);
            });
        }
    }

    public setSelectedByCategory(tagCategory: number, value: boolean) {
        IconLayer.updateDisabled = true;
        this.set('tagTops.' + tagCategory + '.selected', value);
        IconLayer.updateDisabled = false;
        IconLayer.updateShown();
    }
   
    //@observe("tags.*") //needed? performance impact?
    //tagsChanged(changeRecord: any) { //TODO: really? any?
    //    var props: Array<string> = (<string>changeRecord.path).split('.');
    //    var property: string = props.pop();
    //    if (props.length == 0) //array it self was changed
    //        return;
    //    if (props.length == 1) //splice or property of array changed
    //    {
    //        if (property == 'splices') { //TODO: Check for deleted keys?
    //            //var tag: HaTag = this.tags[changeRecord.value.indexSplices[0].addedKeys[0].substring(1)]
    //            var tag: HaTag = this.tags[changeRecord.value.indexSplices[0].index];
    //            this.byId[tag.id] = tag;
    //        }
    //        return;
    //    }

    //    ////var tag: HaTag = props.reduce((obj, i) => obj[i], <any>this)
    //    //var tag: HaTag = this.tags[props[1].substring(1)];
    //    //if (property == 'selected')
    //    //    tag.selectedChanged(changeRecord.value);
    //}

    private loadMarkers() {
        var markerSize: number = 24;
        var markers = document.createElement("img");
        var canvasTemp = document.createElement('canvas');
        canvasTemp.width = markerSize;
        canvasTemp.height = markerSize;
        var contextTemp = canvasTemp.getContext("2d");

        var blankImageData = contextTemp.getImageData(0, 0, 1, 1);
        //var blankImageData = new ImageData(1, 1); Not (yet) supported in IE

        var canvas = document.createElement('canvas');
        canvas.width = 36;
        canvas.height = 48;
        var delta: number = Math.floor((canvas.width - markerSize) / 2);
        var context = canvas.getContext("2d");
        var x: number = 0;
        var y: number = 0;
        //HaTags._blankMarker = document.createElement("img");
        //$(HaTags._blankMarker).on('load', () => {
            $(markers).on('load', () => {
                while (true) {
                    context.clearRect(0, 0, canvas.width, canvas.height);
                    contextTemp.clearRect(0, 0, canvasTemp.width, canvasTemp.height);
                    contextTemp.drawImage(markers, -x * markerSize, -y * markerSize);
                    var tagID = contextTemp.getImageData(0, 0, 1, 1).data[3] + contextTemp.getImageData(markerSize - 1, 0, 1, 1).data[3] * 256;
                    if (tagID == 0 && x > 0 && y > 0)
                        break;
                    contextTemp.putImageData(blankImageData, 0, 0);
                    contextTemp.putImageData(blankImageData, markerSize - 1, 0);

                    context.drawImage(HaTags._blankMarker, 0, 0);
                    context.drawImage(canvasTemp, delta, delta);

                    if (tagID) {
                        this.byId[tagID].marker = canvas.toDataURL();
                        this.invertColors(canvas, context);
                        this.byId[tagID].invertedMarker = canvas.toDataURL();
                        HaTags.tagsWithMarkers.push(this.byId[tagID]);
                    } else {
                        Icon.defaultMarker = canvas.toDataURL();
                        this.invertColors(canvas, context);
                        Icon.invertedDefaultMarker = canvas.toDataURL();
                    }

                    x++;
                    if (x * markerSize < markers.width)
                        continue;
                    x = 0;
                    y++;
                    if (y * markerSize < markers.height)
                        continue;

                    break;
                }
                //(<HaGeos>document.querySelector('ha-geos')).tagsLoaded(); //TODO: best place?

                for (var callback of HaTags.loadedCallbacks)
                    callback();
            });
            markers.src = 'images/markers/all.png';
        //});
        //HaTags._blankMarker.src = 'images/markers/marker.png';
    }

    private invertColors(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
        var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        for (var i = 0; i < imageData.data.length; i += 4) {
            imageData.data[i] = 255 - imageData.data[i];
            imageData.data[i + 1] = 357 - imageData.data[i + 1]; //255 + 102
            imageData.data[i + 2] = 408 - imageData.data[i + 2]; //255 + 153
        }
        context.putImageData(imageData, 0, 0);
    }

    public static numberMarker(number: number): string {
        var marker: string = this._numberMarkers[number];
        if (marker)
            return marker;

        var canvas = document.createElement('canvas');
        canvas.width = 36;
        canvas.height = 48;
        var context = canvas.getContext("2d");
        context.fillStyle = '#FFFFFF';
        context.font = 'bold 18px Arial' //Roboto

        context.drawImage(HaTags._blankMarker, 0, 0);
        this.redColors(canvas, context);

        var text = number.toString();
        context.fillText(text, (canvas.width - context.measureText(text).width) / 2.0, 24)

        marker = canvas.toDataURL()
        this._numberMarkers[number] = marker;

        return marker;
    }

    public static viaPointMarker(number: number): string {
        var marker: string = this._viaPointMarkers[number];
        if (marker)
            return marker;

        var canvas = document.createElement('canvas');
        canvas.width = 36;
        canvas.height = 36;
        var context = canvas.getContext("2d");
        context.fillStyle = '#FFFFFF';
        context.font = 'bold 14px Roboto'
        context.strokeStyle = '#990000';
        context.lineWidth = 4;

        context.arc(18, 18, 10, 0, Math.PI * 2);
        context.stroke();
        context.fill();

        if (number > -1) {
            context.fillStyle = '#990000';
            var text: string;
            switch (number) {
                case 26: text = String.fromCharCode(198); break;
                case 27: text = String.fromCharCode(216); break;
                case 28: text = String.fromCharCode(197); break;
                default: text = String.fromCharCode(65 + number); break;
            }
            context.fillText(text, (canvas.width - context.measureText(text).width) / 2.0, 23)
        }
        var marker = canvas.toDataURL()
        this._viaPointMarkers[number] = marker;

        return marker;
    }

    public static get crossHairMarker(): string {
        if (!this._crossHairMarker) {
            var canvas = document.createElement('canvas');
            canvas.width = 30;
            canvas.height = 30;
            var context = canvas.getContext("2d");
            context.fillStyle = '#990000';
            context.strokeStyle = '#FFFFFF';
            context.lineWidth = 4;
            context.save();
            context.arc(15, 15, 12.5, 0, Math.PI * 2);
            context.stroke();
            context.fill();
            context.beginPath();
            context.lineWidth = 9;
            context.arc(15, 15, 6, 0, Math.PI * 2);
            context.stroke();
            context.fill();
            this._crossHairMarker = canvas.toDataURL()
        }

        return this._crossHairMarker;
    }
    //private static createCrossHairMarker() {
    //    var canvas = document.createElement('canvas');
    //    canvas.width = 100;
    //    canvas.height = 100;
    //    var context = canvas.getContext("2d");

    //    var svg = new Blob(['<svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg"><g><path fill="#990000" d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z" /></g></svg>'], { type: "image/svg+xml;charset=utf-8" }),
    //        domURL = self.URL || (<any>self).webkitURL || self,
    //        url = domURL.createObjectURL(svg),
    //        img = new Image;

    //    img.onload = () => {
    //        context.fillStyle = 'rgba(255,255,255,0.5)';
    //        context.arc(canvas.width / 2, canvas.height / 2, canvas.width / 3, 0, Math.PI * 2);
    //        context.fill();
    //        context.drawImage(img, 0, 0, canvas.width, canvas.height);
    //        domURL.revokeObjectURL(url);
    //        this._crossHairMarker = canvas.toDataURL();
    //    };

    //    img.src = url;
    //}

    private static redColors(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
        var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        for (var i = 0; i < imageData.data.length; i += 4) {
            var hsl = this.rgbToHsl(imageData.data[i], imageData.data[i + 1], imageData.data[i + 2])
            var rgb = this.hslToRgb(0, hsl.s, hsl.l)
            imageData.data[i] = rgb.r;
            imageData.data[i + 1] = rgb.g;
            imageData.data[i + 2] = rgb.b;
        }
        context.putImageData(imageData, 0, 0);
    }
    
    private static rgbToHsl(r, g, b) {
        r /= 255, g /= 255, b /= 255;
        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s, l = (max + min) / 2;
        if (max == min) {
            h = s = 0; // achromatic
        } else {
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        return ({ h: h, s: s, l: l });
    }

    private static hslToRgb(h, s, l) {
        var r, g, b;
        if (s == 0) {
            r = g = b = l; // achromatic
        } else {
            var hue2rgb = function(p, q, t) {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            }
            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }
        return ({
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255),
        });
    }

    public getSelectionState(): string {
        var bytes = new Uint8Array(Math.floor((this.byId.length + 7) / 8));
        for (var i = 0; i < this.byId.length; i++) {
            if (this.byId[i])
                if (this.byId[i].selected) //{
                    bytes[Math.floor(i / 8)] |= 1 << (i % 8); //(7 - i % 8)
        }

        var binstr = Array.prototype.map.call(bytes, function (ch) {
            return String.fromCharCode(ch);
        }).join('');

        var b64 = btoa(binstr).replace(/=/g, '');
        var rle = b64.replace(this.RLEregex, (substring: string) => '-' + substring[0] + Common.base64chars.charAt(substring.length));
        return rle.replace(/\//g, '_').replace(/\+/g, '--');
    }

    private getSelectionArray(state: string): Array<boolean> {
        if (!state)
            return null;

        var decodedRLE = state.replace(/_/g, '/').replace(/--/g, '+');
        var decodedB64 = decodedRLE.replace(/-(..)/g, (substring: string) => Array(Common.base64chars.indexOf(substring[2]) + 1).join(substring[1]));
        var decodedBINSTR = atob(decodedB64);
        var decodedBYTES = new Uint8Array(decodedBINSTR.length);
        var result: Array<boolean> = [];
        for (var i = 0; i < decodedBINSTR.length; i++) {
            var byte = decodedBINSTR.charCodeAt(i);
            for (var b = 0; b < 8; b++)
                result[i * 8 + b] = !!(byte >> b & 1);
        }
        return result;
    }

    //public includeInSitemap(tag: HaTag): boolean {
    //    return this.passedTag ? tag.isChildOf(this.passedTag) : (tag.isTop && tag.category == 9); //only subjects for now
    //}

    public updateSelectedTagNames(category: number) {

        if (this.tagTops[category].selected) {
            this.set(['selectedTagNames', category], "Alle" + category); //HACK... observes didn't fire when set to the same value as other in the array....
            this.set(['selectedTagNames', category], "Alle");
            return;
        }

        var selectedTags: Array<string> = [];
        //var selectedTagTopChildren: Array<string> = [];
        for (var tag of this.tags)
            if (tag.category == category && tag.selected)
                if (!tag.parentSelected) {
                    selectedTags.push(tag.plurName);
                    //if (tag.isTop)
                    //    selectedTagTopChildren.push(tag.plurName);
                }

        //if (selectedTagTopChildren.length == selectedTags.length) {
        //    selectedTags = "Alle pånær ";
        //}

        if (selectedTags.length == 0) {
            this.set(['selectedTagNames', category], '' + category); //HACK... observes didn't fire when set to the same value as other in the array....
            this.set(['selectedTagNames', category], '');
            return;
        }

        if (selectedTags.length == 1) {
            this.set(['selectedTagNames', category], selectedTags[0]);
            return;
        }

        selectedTags.sort();

        if (selectedTags.length > 3) {
            this.set(['selectedTagNames', category], selectedTags.slice(0, 3).join(", ") + "...");
            return;
        }

        this.set(['selectedTagNames', category], selectedTags.slice(0, selectedTags.length - 1).join(", ") + ' og ' + selectedTags[selectedTags.length - 1]);
        return;
    }

    public toggleTop(category: number, value: boolean) {
        IconLayer.updateDisabled = true;
        //App.haTags.tags.forEach((tag: HaTag) => {
        //    if (tag.isTop)
        //        if (tag.category == this.tagCategory)
        //            tag.selected = selected;
        //});

        //HaTags.tagTop[this.tagCategory].selected = selected;

        if (this.tagTops[category].selected != value)
            this.set('tagTops.' + category + '.selected', value);
        else {
            this.set('tagTops.' + category + '.selected', !value);
            this.set('tagTops.' + category + '.selected', value);
        }


        IconLayer.updateDisabled = false;
        IconLayer.updateShown();
    }

}

HaTags.register();