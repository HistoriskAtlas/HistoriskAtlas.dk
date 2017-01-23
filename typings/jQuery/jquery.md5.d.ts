// Type definitions for jQuery.md5.js
// Definitions by: daha

interface Md5Static {
    (value: string, key?: string, israw?: boolean): JQuery;

    safe_add(x: Element, y: Element): string;
    safe_add(x: JQuery, y: JQuery): string;
    bit_rol(num: Element, cnt: Element): string;
    bit_rol(num: JQuery, cnt: JQuery): string;
    md5_cmn(q: Element, a: Element, b: Element, x: Element, s: Element, t: Element): string;
    md5_cmn(q: JQuery, a: JQuery, b: JQuery, x: JQuery, s: JQuery, t: JQuery): string;
    md5_ff(a: Element, b: Element, c: Element, d: Element, x: Element, s: Element, t: Element): string;
    md5_ff(a: JQuery, b: JQuery, c: JQuery, d: JQuery, x: JQuery, s: JQuery, t: JQuery): string;
    md5_gg(a: Element, b: Element, c: Element, d: Element, x: Element, s: Element, t: Element): string;
    md5_gg(a: JQuery, b: JQuery, c: JQuery, d: JQuery, x: JQuery, s: JQuery, t: JQuery): string;
    md5_hh(a: Element, b: Element, c: Element, d: Element, x: Element, s: Element, t: Element): string;
    md5_hh(a: JQuery, b: JQuery, c: JQuery, d: JQuery, x: JQuery, s: JQuery, t: JQuery): string;
    md5_ii(a: Element, b: Element, c: Element, d: Element, x: Element, s: Element, t: Element): string;
    md5_ii(a: JQuery, b: JQuery, c: JQuery, d: JQuery, x: JQuery, s: JQuery, t: JQuery): string;
    binl_md5(x: Element, len: number): string;
    binl_md5(x: JQuery, len: number): string;
    binl2rstr(input: Element): string;
    binl2rstr(input: JQuery): string;
    rstr2binl(input: Element): string;
    rstr2binl(input: JQuery): string;
    rstr_md5(s: Element): string;
    rstr_md5(s: JQuery): string;
    rstr_hmac_md5(key: Element, data: Element): string;
    rstr_hmac_md5(key: JQuery, data: JQuery): string;
    rstr2hex(input: Element): string;
    rstr2hex(input: JQuery): string;
    str2rstr_utf8(input: Element): string;
    str2rstr_utf8(input: JQuery): string;
    raw_md5(s: Element): string;
    raw_md5(s: JQuery): string;
    hex_md5(s: Element): string;
    hex_md5(s: JQuery): string;
    raw_hmac_md5(k: Element, d: Element): string;
    raw_hmac_md5(k: JQuery, d: JQuery): string;
    hex_hmac_md5(k: Element, d: Element): string;
    hex_hmac_md5(k: JQuery, d: JQuery): string;
}

interface JQueryStatic {
    md5: Md5Static;
}

//interface JQuery {
//    md5(value: string, key?: string, israw?: boolean): JQuery;
//}


