// To parse this data:
//
//   import { Convert, Unsplash } from "./file";
//
//   const unsplash = Convert.toUnsplash(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.
// noinspection JSUnusedGlobalSymbols,JSUnusedLocalSymbols

export interface Unsplash {
  id:                       string;
  created_at:               Date;
  updated_at:               Date;
  promoted_at:              null;
  width:                    number;
  height:                   number;
  color:                    string;
  blur_hash:                string;
  description:              null;
  alt_description:          string;
  urls:                     Urls;
  links:                    UnsplashLinks;
  categories:               any[];
  likes:                    number;
  liked_by_user:            boolean;
  current_user_collections: any[];
  sponsorship:              Sponsorship;
  user:                     User;
}

export interface UnsplashLinks {
  self:              string;
  html:              string;
  download:          string;
  download_location: string;
}

export interface Sponsorship {
  impression_urls: string[];
  tagline:         string;
  tagline_url:     string;
  sponsor:         User;
}

export interface User {
  id:                 string;
  updated_at:         Date;
  username:           string;
  name:               string;
  first_name:         string;
  last_name:          null;
  twitter_username:   string;
  portfolio_url:      string;
  bio:                string;
  location:           null;
  links:              UserLinks;
  profile_image:      ProfileImage;
  instagram_username: string;
  total_collections:  number;
  total_likes:        number;
  total_photos:       number;
  accepted_tos:       boolean;
  for_hire:           boolean;
  social:             Social;
}

export interface UserLinks {
  self:      string;
  html:      string;
  photos:    string;
  likes:     string;
  portfolio: string;
  following: string;
  followers: string;
}

export interface ProfileImage {
  small:  string;
  medium: string;
  large:  string;
}

export interface Social {
  instagram_username: string;
  portfolio_url:      string;
  twitter_username:   string;
}

export interface Urls {
  raw:     string;
  full:    string;
  regular: string;
  small:   string;
  thumb:   string;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
  public static toUnsplash(json: string): Unsplash {
    return cast(JSON.parse(json), r("Unsplash"));
  }

  public static unsplashToJson(value: Unsplash): string {
    return JSON.stringify(uncast(value, r("Unsplash")), null, 2);
  }
}

function invalidValue(typ: any, val: any, key: any = ''): never {
  if (key) {
    throw Error(`Invalid value for key "${key}". Expected type ${JSON.stringify(typ)} but got ${JSON.stringify(val)}`);
  }
  throw Error(`Invalid value ${JSON.stringify(val)} for type ${JSON.stringify(typ)}`, );
}

function jsonToJSProps(typ: any): any {
  if (typ.jsonToJS === undefined) {
    const map: any = {};
    typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
    typ.jsonToJS = map;
  }
  return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
  if (typ.jsToJSON === undefined) {
    const map: any = {};
    typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
    typ.jsToJSON = map;
  }
  return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = ''): any {
  function transformPrimitive(typ: string, val: any): any {
    if (typeof typ === typeof val) return val;
    return invalidValue(typ, val, key);
  }

  function transformUnion(typs: any[], val: any): any {
    // val must validate against one typ in typs
    const l = typs.length;
    for (let i = 0; i < l; i++) {
      const typ = typs[i];
      try {
        return transform(val, typ, getProps);
      } catch (_) {}
    }
    return invalidValue(typs, val);
  }

  function transformEnum(cases: string[], val: any): any {
    if (cases.indexOf(val) !== -1) return val;
    return invalidValue(cases, val);
  }

  function transformArray(typ: any, val: any): any {
    // val must be an array with no invalid elements
    if (!Array.isArray(val)) return invalidValue("array", val);
    return val.map(el => transform(el, typ, getProps));
  }

  function transformDate(val: any): any {
    if (val === null) {
      return null;
    }
    const d = new Date(val);
    if (isNaN(d.valueOf())) {
      return invalidValue("Date", val);
    }
    return d;
  }

  function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
    if (val === null || typeof val !== "object" || Array.isArray(val)) {
      return invalidValue("object", val);
    }
    const result: any = {};
    Object.getOwnPropertyNames(props).forEach(key => {
      const prop = props[key];
      const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
      result[prop.key] = transform(v, prop.typ, getProps, prop.key);
    });
    Object.getOwnPropertyNames(val).forEach(key => {
      if (!Object.prototype.hasOwnProperty.call(props, key)) {
        result[key] = transform(val[key], additional, getProps, key);
      }
    });
    return result;
  }

  if (typ === "any") return val;
  if (typ === null) {
    if (val === null) return val;
    return invalidValue(typ, val);
  }
  if (typ === false) return invalidValue(typ, val);
  while (typeof typ === "object" && typ.ref !== undefined) {
    typ = typeMap[typ.ref];
  }
  if (Array.isArray(typ)) return transformEnum(typ, val);
  if (typeof typ === "object") {
    return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
        : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
            : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
                : invalidValue(typ, val);
  }
  // Numbers can be parsed by Date but shouldn't be.
  if (typ === Date && typeof val !== "number") return transformDate(val);
  return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
  return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
  return transform(val, typ, jsToJSONProps);
}

function a(typ: any) {
  return { arrayItems: typ };
}

function u(...typs: any[]) {
  return { unionMembers: typs };
}

function o(props: any[], additional: any) {
  return { props, additional };
}

function m(additional: any) {
  return { props: [], additional };
}

function r(name: string) {
  return { ref: name };
}

const typeMap: any = {
  "Unsplash": o([
    { json: "id", js: "id", typ: "" },
    { json: "created_at", js: "created_at", typ: Date },
    { json: "updated_at", js: "updated_at", typ: Date },
    { json: "promoted_at", js: "promoted_at", typ: null },
    { json: "width", js: "width", typ: 0 },
    { json: "height", js: "height", typ: 0 },
    { json: "color", js: "color", typ: "" },
    { json: "blur_hash", js: "blur_hash", typ: "" },
    { json: "description", js: "description", typ: null },
    { json: "alt_description", js: "alt_description", typ: "" },
    { json: "urls", js: "urls", typ: r("Urls") },
    { json: "links", js: "links", typ: r("UnsplashLinks") },
    { json: "categories", js: "categories", typ: a("any") },
    { json: "likes", js: "likes", typ: 0 },
    { json: "liked_by_user", js: "liked_by_user", typ: true },
    { json: "current_user_collections", js: "current_user_collections", typ: a("any") },
    { json: "sponsorship", js: "sponsorship", typ: r("Sponsorship") },
    { json: "user", js: "user", typ: r("User") },
  ], false),
  "UnsplashLinks": o([
    { json: "self", js: "self", typ: "" },
    { json: "html", js: "html", typ: "" },
    { json: "download", js: "download", typ: "" },
    { json: "download_location", js: "download_location", typ: "" },
  ], false),
  "Sponsorship": o([
    { json: "impression_urls", js: "impression_urls", typ: a("") },
    { json: "tagline", js: "tagline", typ: "" },
    { json: "tagline_url", js: "tagline_url", typ: "" },
    { json: "sponsor", js: "sponsor", typ: r("User") },
  ], false),
  "User": o([
    { json: "id", js: "id", typ: "" },
    { json: "updated_at", js: "updated_at", typ: Date },
    { json: "username", js: "username", typ: "" },
    { json: "name", js: "name", typ: "" },
    { json: "first_name", js: "first_name", typ: "" },
    { json: "last_name", js: "last_name", typ: null },
    { json: "twitter_username", js: "twitter_username", typ: "" },
    { json: "portfolio_url", js: "portfolio_url", typ: "" },
    { json: "bio", js: "bio", typ: "" },
    { json: "location", js: "location", typ: null },
    { json: "links", js: "links", typ: r("UserLinks") },
    { json: "profile_image", js: "profile_image", typ: r("ProfileImage") },
    { json: "instagram_username", js: "instagram_username", typ: "" },
    { json: "total_collections", js: "total_collections", typ: 0 },
    { json: "total_likes", js: "total_likes", typ: 0 },
    { json: "total_photos", js: "total_photos", typ: 0 },
    { json: "accepted_tos", js: "accepted_tos", typ: true },
    { json: "for_hire", js: "for_hire", typ: true },
    { json: "social", js: "social", typ: r("Social") },
  ], false),
  "UserLinks": o([
    { json: "self", js: "self", typ: "" },
    { json: "html", js: "html", typ: "" },
    { json: "photos", js: "photos", typ: "" },
    { json: "likes", js: "likes", typ: "" },
    { json: "portfolio", js: "portfolio", typ: "" },
    { json: "following", js: "following", typ: "" },
    { json: "followers", js: "followers", typ: "" },
  ], false),
  "ProfileImage": o([
    { json: "small", js: "small", typ: "" },
    { json: "medium", js: "medium", typ: "" },
    { json: "large", js: "large", typ: "" },
  ], false),
  "Social": o([
    { json: "instagram_username", js: "instagram_username", typ: "" },
    { json: "portfolio_url", js: "portfolio_url", typ: "" },
    { json: "twitter_username", js: "twitter_username", typ: "" },
  ], false),
  "Urls": o([
    { json: "raw", js: "raw", typ: "" },
    { json: "full", js: "full", typ: "" },
    { json: "regular", js: "regular", typ: "" },
    { json: "small", js: "small", typ: "" },
    { json: "thumb", js: "thumb", typ: "" },
  ], false),
};
