//#region Generic Intro
export function simpleGeneric<T>(input: T): T[] {
  return [input];
}

export function anotherSimpleGeneric<T extends object>(
  input: T
): T & { someOtherField: boolean } {
  return { ...input, someOtherField: true };
}
//#endregion Generic Intro

//#region Type Predicates
export function isString(t: unknown): t is string {
  return typeof t === "string";
}

export function isPresent<T>(t: T | undefined | null | void): t is T {
  return t !== undefined && t !== null;
}

let x: (string | null)[] = [];
let y = x.filter(Boolean);
let z = x.filter(isPresent);

interface WordpressApiCategory {
  /** Number of published posts for the term. */
  count: number;
  /** HTML description of the term. */
  description: string;
  /** Unique identifier for the term. */
  id: number;
  /** URL of the term. */
  link: string;
  /** HTML title for the term. */
  name: string;
  /** The parent term ID. */
  parent: number;
  /** An alphanumeric identifier for the term unique to its type. */
  slug: string;
}
export function isWordpressApiCateogory(
  value: any
): value is WordpressApiCategory {
  return (
    typeof value === "object" &&
    typeof value.id === "number" &&
    typeof value.count === "number" &&
    typeof value.description === "string" &&
    typeof value.link === "string" &&
    typeof value.name === "string" &&
    typeof value.slug === "string" &&
    typeof value.parent === "number"
  );
}

export function isKeyOfObject<T extends object>(
  key: string | number | symbol,
  obj: T
): key is keyof T {
  return key in obj;
}

function showPointOfIsKeyOfObject(key: string) {
  const obj = { a: "a", b: "b" };
  if (isKeyOfObject(key, obj)) {
    return obj[key];
  }
}
//#endregion Type Predicates

//#region Indexed Access Types
const STATIC_TEXT_TRANSLATIONS = {
  en: { hello: "hello", bye: "bye" },
  fr: { hello: "bonjour", bye: "au revoir" },
  es: { hello: "hola", bye: "adios" },
};
type Language = keyof typeof STATIC_TEXT_TRANSLATIONS;
type TranslationKey = keyof (typeof STATIC_TEXT_TRANSLATIONS)[Language];

const EVENT_NAMES = [
  "site_subscription_created",
  "site_subscription_deleted",
] as const;
type EventName = (typeof EVENT_NAMES)[number];

export function refineStringToLiteralUnion<T extends string>(
  value: string | null | undefined,
  possibleValues: readonly T[]
): T | null {
  if (possibleValues.includes(value as T)) {
    return value as T;
  }
  return null;
}
let refined = refineStringToLiteralUnion("", EVENT_NAMES);

type DeepType = { a: { b: { c: { d: { e: boolean } }[] } } };
type OtherType = DeepType["a"]["b"]["c"][number]["d"]["e"];
//#endregion Indexed Access Types

//#region Conditional Types
export type SerializeDto<T> = T extends Date
  ? string
  : T extends object
  ? { [key in keyof T]: SerializeDto<T[key]> }
  : T;

type Primitive = string | number | boolean | null | undefined;
type ConvertToNonNull<T> = T extends Date
  ? string
  : T extends null
  ? never
  : T extends Primitive
  ? T
  : {
      [K in keyof T]: T[K] extends (infer U)[]
        ? ConvertToNonNull<U>[]
        : ConvertToNonNull<T[K]>;
    };

export function stripNull<T extends object>(someObj: T): ConvertToNonNull<T> {
  const replacer = (key: string, value: unknown) =>
    value === null ? undefined : value;

  return JSON.parse(JSON.stringify(someObj, replacer));
}
//#endregion Conditional Types

//#region Utility Types
type UtilityDemoX = { a: string; b: number; c: boolean };
type UtilityDemoY = Omit<UtilityDemoX, "a" | "b">;
type UtilityDemoZ = Pick<UtilityDemoX, "a" | "b">;

interface EventListenerMap {
  atsRetrieveEnvelopeSet?: (() => unknown)[];
  authStatusChanged?: ((params: { a: string }) => unknown)[];
  loaded?: ((params: { b: number }) => unknown)[];
}
type EventName2 = keyof EventListenerMap;
type EventListenerCb<E extends EventName2> = NonNullable<
  EventListenerMap[E]
>[number];
type EventData<E extends EventName2> = Parameters<EventListenerCb<E>>[0];
//#endregion Utility Types

//#region Function overloading
export function getMonthDayYearDateString(date: null): null;
export function getMonthDayYearDateString(date: undefined): null;
export function getMonthDayYearDateString(date: Date): string;
export function getMonthDayYearDateString(date: Date | null): string | null;
export function getMonthDayYearDateString(
  date: Date | null | undefined
): string | null;
export function getMonthDayYearDateString(
  date: Date | null | undefined
): string | null {
  if (!date) {
    return null;
  }
  return date.toISOString().slice(0, 10);
}
//#endregion Function overloading

//#region Template Literal Types
// https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html
type X = "a" | "b" | "c";
type Y = "d" | "e" | "f";
type Z = "g" | "h" | "i";
type Combo = `${X}:${Y}:${Z}`;

type PathParams<Path extends string> =
  Path extends `:${infer Param}/${infer Rest}`
    ? Param | PathParams<Rest>
    : Path extends `:${infer Param}`
    ? Param
    : // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Path extends `${infer _Prefix}:${infer Rest}`
    ? PathParams<`:${Rest}`>
    : never;

type PathArgs<Path extends string> = { [K in PathParams<Path>]: string };

type WhatAreTheArgs = PathArgs<"/users/:userId/posts/:postId">;
//#endregion Template Literal Types
