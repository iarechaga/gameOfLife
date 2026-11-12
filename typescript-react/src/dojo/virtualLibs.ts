/**
 * Declaraciones de tipos virtuales para el compilador TypeScript (`ts.createProgram`)
 * ejecutado en vivo dentro del navegador (< 20ms por compilación con strict: true).
 */

export const VIRTUAL_ES_DOM_LIB_DTS = `
/// <reference no-default-lib="true"/>

declare var undefined: undefined;
declare var NaN: number;
declare var Infinity: number;

interface Boolean { valueOf(): boolean; }
interface BooleanConstructor { new(value?: unknown): Boolean; <T>(value?: T): boolean; readonly prototype: Boolean; }
declare var Boolean: BooleanConstructor;

interface Number {
  toString(radix?: number): string;
  toFixed(fractionDigits?: number): string;
  valueOf(): number;
}
interface NumberConstructor {
  new(value?: unknown): Number;
  (value?: unknown): number;
  readonly prototype: Number;
  readonly MAX_SAFE_INTEGER: number;
  readonly MIN_SAFE_INTEGER: number;
  isNaN(number: unknown): boolean;
  isFinite(number: unknown): boolean;
  isInteger(number: unknown): boolean;
  parseInt(string: string, radix?: number): number;
  parseFloat(string: string): number;
}
declare var Number: NumberConstructor;
declare function parseInt(s: string, radix?: number): number;
declare function parseFloat(s: string): number;
declare function isNaN(number: number): boolean;

interface Object {
  constructor: Function;
  toString(): string;
  valueOf(): Object;
  hasOwnProperty(v: PropertyKey): boolean;
}
interface ObjectConstructor {
  new(value?: unknown): Object;
  (): unknown;
  readonly prototype: Object;
  keys<T extends object>(o: T): Array<string>;
  values<T>(o: { [s: string]: T } | ArrayLike<T>): T[];
  entries<T>(o: { [s: string]: T } | ArrayLike<T>): [string, T][];
  assign<T extends {}, U>(target: T, source: U): T & U;
  is(value1: unknown, value2: unknown): boolean;
  hasOwn(o: object, v: PropertyKey): boolean;
  freeze<T>(o: T): Readonly<T>;
}
declare var Object: ObjectConstructor;

interface Function {
  apply(this: Function, thisArg: unknown, argArray?: unknown): unknown;
  call(this: Function, thisArg: unknown, ...argArray: unknown[]): unknown;
  bind(this: Function, thisArg: unknown, ...argArray: unknown[]): Function;
  readonly prototype: unknown;
  readonly length: number;
  readonly name: string;
}
interface CallableFunction extends Function {
  call<T, A extends any[], R>(this: (this: T, ...args: A) => R, thisArg: T, ...args: A): R;
  apply<T, A extends any[], R>(this: (this: T, ...args: A) => R, thisArg: T, args: A): R;
}
interface NewableFunction extends Function {}
interface IArguments { [index: number]: unknown; length: number; callee: Function; }

interface RegExpMatchArray extends Array<string> { index?: number; input?: string; }
interface RegExp {
  exec(string: string): RegExpExecArray | null;
  test(string: string): boolean;
  readonly source: string;
  readonly flags: string;
}
interface RegExpExecArray extends Array<string> { index: number; input: string; }
interface RegExpConstructor {
  new(pattern: RegExp | string, flags?: string): RegExp;
  (pattern: RegExp | string, flags?: string): RegExp;
  readonly prototype: RegExp;
}
declare var RegExp: RegExpConstructor;

interface String {
  readonly length: number;
  charAt(pos: number): string;
  charCodeAt(index: number): number;
  indexOf(searchString: string, position?: number): number;
  includes(searchString: string, position?: number): boolean;
  startsWith(searchString: string, position?: number): boolean;
  endsWith(searchString: string, endPosition?: number): boolean;
  slice(start?: number, end?: number): string;
  substring(start?: number, end?: number): string;
  toLowerCase(): string;
  toUpperCase(): string;
  trim(): string;
  split(separator: string | RegExp, limit?: number): string[];
  replace(searchValue: string | RegExp, replaceValue: string): string;
  match(matcher: string | RegExp): RegExpMatchArray | null;
  padStart(maxLength: number, fillString?: string): string;
  [index: number]: string;
}
interface StringConstructor {
  new(value?: unknown): String;
  (value?: unknown): string;
  readonly prototype: String;
}
declare var String: StringConstructor;

interface Symbol { readonly description: string | undefined; toString(): string; }
interface SymbolConstructor {
  (description?: string | number): symbol;
  readonly iterator: unique symbol;
}
declare var Symbol: SymbolConstructor;

interface IteratorYieldResult<TYield> { done?: false; value: TYield; }
interface IteratorReturnResult<TReturn> { done: true; value: TReturn; }
type IteratorResult<T, TReturn = unknown> = IteratorYieldResult<T> | IteratorReturnResult<TReturn>;
interface Iterator<T, TReturn = unknown, TNext = undefined> {
  next(...args: [] | [TNext]): IteratorResult<T, TReturn>;
}
interface Iterable<T> { [Symbol.iterator](): Iterator<T>; }
interface IterableIterator<T> extends Iterator<T> { [Symbol.iterator](): IterableIterator<T>; }
interface ArrayLike<T> { readonly length: number; readonly [n: number]: T; }

interface ReadonlyArray<T> extends Iterable<T> {
  readonly length: number;
  readonly [n: number]: T;
  includes(searchElement: T, fromIndex?: number): boolean;
  indexOf(searchElement: T, fromIndex?: number): number;
  find<S extends T>(predicate: (value: T, index: number, obj: readonly T[]) => value is S): S | undefined;
  find(predicate: (value: T, index: number, obj: readonly T[]) => unknown): T | undefined;
  findIndex(predicate: (value: T, index: number, obj: readonly T[]) => unknown): number;
  filter<S extends T>(predicate: (value: T, index: number, array: readonly T[]) => value is S): S[];
  filter(predicate: (value: T, index: number, array: readonly T[]) => unknown): T[];
  map<U>(callbackfn: (value: T, index: number, array: readonly T[]) => U): U[];
  flatMap<U>(callback: (value: T, index: number, array: readonly T[]) => U | ReadonlyArray<U>): U[];
  forEach(callbackfn: (value: T, index: number, array: readonly T[]) => void): void;
  some(predicate: (value: T, index: number, array: readonly T[]) => unknown): boolean;
  every<S extends T>(predicate: (value: T, index: number, array: readonly T[]) => value is S): this is readonly S[];
  every(predicate: (value: T, index: number, array: readonly T[]) => unknown): boolean;
  reduce(callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: readonly T[]) => T): T;
  reduce<U>(callbackfn: (previousValue: U, currentValue: T, currentIndex: number, array: readonly T[]) => U, initialValue: U): U;
  slice(start?: number, end?: number): T[];
  concat(...items: (T | ConcatArray<T>)[]): T[];
  join(separator?: string): string;
  [Symbol.iterator](): IterableIterator<T>;
}

interface ConcatArray<T> {
  readonly length: number;
  readonly [n: number]: T;
  join(separator?: string): string;
  slice(start?: number, end?: number): T[];
}

interface Array<T> extends Iterable<T> {
  length: number;
  [n: number]: T;
  push(...items: T[]): number;
  pop(): T | undefined;
  shift(): T | undefined;
  unshift(...items: T[]): number;
  splice(start: number, deleteCount?: number, ...items: T[]): T[];
  sort(compareFn?: (a: T, b: T) => number): this;
  reverse(): T[];
  fill(value: T, start?: number, end?: number): this;
  includes(searchElement: T, fromIndex?: number): boolean;
  indexOf(searchElement: T, fromIndex?: number): number;
  find<S extends T>(predicate: (value: T, index: number, obj: T[]) => value is S): S | undefined;
  find(predicate: (value: T, index: number, obj: T[]) => unknown): T | undefined;
  findIndex(predicate: (value: T, index: number, obj: T[]) => unknown): number;
  filter<S extends T>(predicate: (value: T, index: number, array: T[]) => value is S): S[];
  filter(predicate: (value: T, index: number, array: T[]) => unknown): T[];
  map<U>(callbackfn: (value: T, index: number, array: T[]) => U): U[];
  flatMap<U>(callback: (value: T, index: number, array: T[]) => U | ReadonlyArray<U>): U[];
  forEach(callbackfn: (value: T, index: number, array: T[]) => void): void;
  some(predicate: (value: T, index: number, array: T[]) => unknown): boolean;
  every<S extends T>(predicate: (value: T, index: number, array: T[]) => value is S): this is S[];
  every(predicate: (value: T, index: number, array: T[]) => unknown): boolean;
  reduce(callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: T[]) => T): T;
  reduce<U>(callbackfn: (previousValue: U, currentValue: T, currentIndex: number, array: T[]) => U, initialValue: U): U;
  slice(start?: number, end?: number): T[];
  concat(...items: (T | ConcatArray<T>)[]): T[];
  join(separator?: string): string;
  [Symbol.iterator](): IterableIterator<T>;
}

interface ArrayConstructor {
  new <T>(arrayLength?: number): T[];
  new <T>(...items: T[]): T[];
  readonly prototype: unknown[];
  isArray(arg: unknown): arg is unknown[];
  from<T>(arrayLike: ArrayLike<T> | Iterable<T>): T[];
  from<T, U>(arrayLike: ArrayLike<T> | Iterable<T>, mapfn: (v: T, k: number) => U): U[];
}
declare var Array: ArrayConstructor;

interface ReadonlyMap<K, V> extends Iterable<[K, V]> {
  forEach(callbackfn: (value: V, key: K, map: ReadonlyMap<K, V>) => void): void;
  get(key: K): V | undefined;
  has(key: K): boolean;
  readonly size: number;
  keys(): IterableIterator<K>;
  values(): IterableIterator<V>;
  entries(): IterableIterator<[K, V]>;
  [Symbol.iterator](): IterableIterator<[K, V]>;
}

interface Map<K, V> extends ReadonlyMap<K, V> {
  clear(): void;
  delete(key: K): boolean;
  set(key: K, value: V): this;
}
interface MapConstructor {
  new <K = unknown, V = unknown>(entries?: readonly (readonly [K, V])[] | null): Map<K, V>;
  readonly prototype: Map<unknown, unknown>;
}
declare var Map: MapConstructor;

interface ReadonlySet<T> extends Iterable<T> {
  forEach(callbackfn: (value: T, value2: T, set: ReadonlySet<T>) => void): void;
  has(value: T): boolean;
  readonly size: number;
  values(): IterableIterator<T>;
  [Symbol.iterator](): IterableIterator<T>;
}

interface Set<T> extends ReadonlySet<T> {
  add(value: T): this;
  clear(): void;
  delete(value: T): boolean;
}
interface SetConstructor {
  new <T = unknown>(values?: Iterable<T> | null): Set<T>;
  readonly prototype: Set<unknown>;
}
declare var Set: SetConstructor;

interface Error { name: string; message: string; stack?: string; }
interface ErrorConstructor {
  new(message?: string): Error;
  (message?: string): Error;
  readonly prototype: Error;
}
declare var Error: ErrorConstructor;
declare class TypeError extends Error {}
declare class RangeError extends Error {}

interface PromiseLike<T> {
  then<TResult1 = T, TResult2 = never>(
    onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | undefined | null
  ): PromiseLike<TResult1 | TResult2>;
}
interface Promise<T> {
  then<TResult1 = T, TResult2 = never>(
    onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | undefined | null
  ): PromiseLike<TResult1 | TResult2>;
  catch<TResult = never>(
    onrejected?: ((reason: unknown) => TResult | PromiseLike<TResult>) | undefined | null
  ): Promise<T | TResult>;
  finally(onfinally?: (() => void) | undefined | null): Promise<T>;
}
interface PromiseConstructor {
  new <T>(executor: (resolve: (value: T | PromiseLike<T>) => void, reject: (reason?: unknown) => void) => void): Promise<T>;
  readonly prototype: Promise<unknown>;
  resolve<T>(value: T | PromiseLike<T>): Promise<T>;
  resolve(): Promise<void>;
  reject<T = never>(reason?: unknown): Promise<T>;
  all<T>(values: Iterable<T | PromiseLike<T>>): Promise<T[]>;
}
declare var Promise: PromiseConstructor;

interface Math {
  abs(x: number): number;
  ceil(x: number): number;
  floor(x: number): number;
  max(...values: number[]): number;
  min(...values: number[]): number;
  round(x: number): number;
  random(): number;
  trunc(x: number): number;
}
declare var Math: Math;

interface JSON {
  parse(text: string): unknown;
  stringify(value: unknown, replacer?: null, space?: string | number): string;
}
declare var JSON: JSON;

interface Console {
  log(...data: unknown[]): void;
  warn(...data: unknown[]): void;
  error(...data: unknown[]): void;
}
declare var console: Console;

type PropertyKey = string | number | symbol;
type Partial<T> = { [P in keyof T]?: T[P]; };
type Required<T> = { [P in keyof T]-?: T[P]; };
type Readonly<T> = { readonly [P in keyof T]: T[P]; };
type Pick<T, K extends keyof T> = { [P in K]: T[P]; };
type Record<K extends keyof any, T> = { [P in K]: T; };
type Exclude<T, U> = T extends U ? never : T;
type Extract<T, U> = T extends U ? T : never;
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
type NonNullable<T> = T & {};
type Parameters<T extends (...args: any) => any> = T extends (...args: infer P) => any ? P : never;
type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any;

// Minimal DOM classes & interfaces (both types and runtime constructors for instanceof)
declare class EventTarget {
  addEventListener(type: string, callback: (event: any) => void): void;
  removeEventListener(type: string, callback: (event: any) => void): void;
  dispatchEvent(event: Event): boolean;
}
declare class Event {
  constructor(type: string, eventInitDict?: { bubbles?: boolean; cancelable?: boolean });
  readonly type: string;
  readonly target: EventTarget | null;
  preventDefault(): void;
  stopPropagation(): void;
}
declare class KeyboardEvent extends Event {
  readonly key: string;
  readonly code: string;
  readonly repeat: boolean;
  readonly ctrlKey: boolean;
  readonly metaKey: boolean;
  readonly shiftKey: boolean;
  readonly altKey: boolean;
}
declare class MouseEvent extends Event {
  readonly clientX: number;
  readonly clientY: number;
  readonly button: number;
}
declare class HTMLElement extends EventTarget {
  readonly tagName: string;
  id: string;
  className: string;
  textContent: string | null;
  focus(): void;
  blur(): void;
  click(): void;
  getAttribute(qualifiedName: string): string | null;
}
declare class HTMLInputElement extends HTMLElement {
  value: string;
  checked: boolean;
  disabled: boolean;
  select(): void;
}
declare class HTMLSelectElement extends HTMLElement {
  value: string;
  disabled: boolean;
}
declare class HTMLButtonElement extends HTMLElement {
  disabled: boolean;
  type: string;
}
declare class HTMLCanvasElement extends HTMLElement {
  width: number;
  height: number;
}

interface Window extends EventTarget {
  setInterval(handler: () => void, timeout?: number): number;
  clearInterval(id: number | undefined): void;
  setTimeout(handler: () => void, timeout?: number): number;
  clearTimeout(id: number | undefined): void;
  addEventListener(type: 'keydown' | 'keyup', listener: (ev: KeyboardEvent) => void): void;
  addEventListener(type: string, listener: (ev: Event) => void): void;
  removeEventListener(type: 'keydown' | 'keyup', listener: (ev: KeyboardEvent) => void): void;
  removeEventListener(type: string, listener: (ev: Event) => void): void;
}
declare var window: Window;
declare function setTimeout(handler: () => void, timeout?: number): number;
declare function clearTimeout(id: number | undefined): void;
declare function setInterval(handler: () => void, timeout?: number): number;
declare function clearInterval(id: number | undefined): void;
`;

export const VIRTUAL_REACT_DTS = `
export type Key = string | number;
export type ReactNode =
  | ReactElement
  | string
  | number
  | boolean
  | null
  | undefined
  | Iterable<ReactNode>;

export interface ReactElement<P = any> {
  type: any;
  props: P;
  key: Key | null;
}

export type SetStateAction<S> = S | ((prevState: S) => S);
export type Dispatch<A> = (value: A) => void;
export type EffectCallback = () => void | (() => void);
export type DependencyList = readonly unknown[];
export type Reducer<S, A> = (prevState: S, action: A) => S;

export interface RefObject<T> {
  current: T;
}

export type Attributes = {
  key?: Key | null;
};

export type ComponentType<P = {}> = (props: P & Attributes) => ReactElement | null;
export type FC<P = {}> = ComponentType<P>;

export interface Context<T> {
  Provider: ComponentType<{ value: T; children?: ReactNode }>;
}

export interface CSSProperties {
  [key: string]: string | number | undefined;
}

export interface ChangeEvent<T = HTMLElement> {
  target: T & EventTarget;
  currentTarget: T & EventTarget;
  preventDefault(): void;
}

export interface FormEvent<T = HTMLElement> {
  target: EventTarget;
  currentTarget: T & EventTarget;
  preventDefault(): void;
}

export interface MouseEvent<T = HTMLElement> {
  currentTarget: T & EventTarget;
  clientX: number;
  clientY: number;
  preventDefault(): void;
  stopPropagation(): void;
}

export interface KeyboardEvent<T = HTMLElement> {
  key: string;
  code: string;
  currentTarget: T & EventTarget;
  preventDefault(): void;
}

export declare function useState<S>(initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>];
export declare function useState<S = undefined>(): [S | undefined, Dispatch<SetStateAction<S | undefined>>];
export declare function useReducer<S, A>(reducer: Reducer<S, A>, initialState: S): [S, Dispatch<A>];
export declare function useReducer<S, I, A>(
  reducer: Reducer<S, A>,
  initialArg: I,
  init: (arg: I) => S,
): [S, Dispatch<A>];
export declare function useEffect(effect: EffectCallback, deps?: DependencyList): void;
export declare function useCallback<T extends (...args: any[]) => any>(callback: T, deps: DependencyList): T;
export declare function useMemo<T>(factory: () => T, deps: DependencyList): T;
export declare function useRef<T>(initialValue: T): RefObject<T>;
export declare function useRef<T>(initialValue: T | null): RefObject<T | null>;
export declare function createContext<T>(defaultValue: T): Context<T>;
export declare function useContext<T>(context: Context<T>): T;
export declare function memo<P extends object>(
  Component: (props: P) => ReactNode,
  propsAreEqual?: (prevProps: Readonly<P>, nextProps: Readonly<P>) => boolean,
): ComponentType<P>;
export declare function createElement(type: any, props?: any, ...children: any[]): ReactElement;

declare namespace React {
  export {
    Key,
    ReactNode,
    ReactElement,
    SetStateAction,
    Dispatch,
    EffectCallback,
    DependencyList,
    Reducer,
    RefObject,
    Context,
    ComponentType,
    FC,
    CSSProperties,
    ChangeEvent,
    FormEvent,
    MouseEvent,
    KeyboardEvent,
    useState,
    useReducer,
    useEffect,
    useCallback,
    useMemo,
    useRef,
    createContext,
    useContext,
    memo,
    createElement,
  };
  export const Fragment: ComponentType<{ children?: ReactNode }>;
}

export default React;

declare global {
  namespace JSX {
    interface Element extends ReactElement<any> {}
    interface ElementAttributesProperty { props: {}; }
    interface ElementChildrenAttribute { children: {}; }
    interface IntrinsicAttributes { key?: Key | null; }

    interface HTMLProps<T = HTMLElement> {
      key?: Key | null;
      ref?: { current: T | null } | ((instance: T | null) => void);
      id?: string;
      className?: string;
      style?: CSSProperties;
      title?: string;
      role?: string;
      tabIndex?: number;
      children?: ReactNode;
      'aria-label'?: string;
      'aria-live'?: 'polite' | 'assertive' | 'off';
      'data-testid'?: string;
      onClick?: (event: MouseEvent<T>) => void;
      onKeyDown?: (event: KeyboardEvent<T>) => void;
    }

    interface IntrinsicElements {
      div: HTMLProps<HTMLElement>;
      section: HTMLProps<HTMLElement>;
      article: HTMLProps<HTMLElement>;
      header: HTMLProps<HTMLElement>;
      footer: HTMLProps<HTMLElement>;
      aside: HTMLProps<HTMLElement>;
      main: HTMLProps<HTMLElement>;
      nav: HTMLProps<HTMLElement>;
      p: HTMLProps<HTMLElement>;
      span: HTMLProps<HTMLElement>;
      strong: HTMLProps<HTMLElement>;
      em: HTMLProps<HTMLElement>;
      code: HTMLProps<HTMLElement>;
      kbd: HTMLProps<HTMLElement>;
      pre: HTMLProps<HTMLElement>;
      h1: HTMLProps<HTMLElement>;
      h2: HTMLProps<HTMLElement>;
      h3: HTMLProps<HTMLElement>;
      h4: HTMLProps<HTMLElement>;
      ul: HTMLProps<HTMLElement>;
      ol: HTMLProps<HTMLElement>;
      li: HTMLProps<HTMLElement>;
      label: HTMLProps<HTMLElement> & { htmlFor?: string };
      button: HTMLProps<HTMLButtonElement> & {
        type?: 'button' | 'submit' | 'reset';
        disabled?: boolean;
      };
      input: HTMLProps<HTMLInputElement> & {
        type?: string;
        value?: string | number;
        defaultValue?: string | number;
        placeholder?: string;
        checked?: boolean;
        disabled?: boolean;
        min?: number | string;
        max?: number | string;
        step?: number | string;
        onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
      };
      select: HTMLProps<HTMLSelectElement> & {
        value?: string;
        defaultValue?: string;
        disabled?: boolean;
        onChange?: (event: ChangeEvent<HTMLSelectElement>) => void;
      };
      option: HTMLProps<HTMLElement> & {
        value?: string;
        disabled?: boolean;
      };
      form: HTMLProps<HTMLElement> & {
        onSubmit?: (event: FormEvent<HTMLElement>) => void;
      };
      canvas: HTMLProps<HTMLCanvasElement> & {
        width?: number;
        height?: number;
      };
    }
  }
}
`;

export const VIRTUAL_DOMAIN_DTS = `
export declare class Cell {
  constructor();
  alive(): boolean;
  die(): void;
}

export declare class NullCell extends Cell {
  static getInstance(): NullCell;
  alive(): boolean;
  die(): void;
}

export declare class CellBlock {
  constructor(x: number, y: number, content?: Cell);
  getRow(): number;
  getColumn(): number;
  kill(): void;
  containsCell(): boolean;
  containsLivingCell(): boolean;
  clone(): CellBlock;
}

export declare class SquaredPetriDish {
  constructor(size: number);
  add(block: CellBlock): void;
  remove(row: number, column: number): void;
  getCell(row: number, column: number): CellBlock;
  getOccupiedCells(): CellBlock[];
  getNeighbours(block: CellBlock): CellBlock[];
  cleanDeadCells(): void;
  getRange(): number;
  clone(): SquaredPetriDish;
}

export declare class NextGenerationCalculator {
  evolve(petriDish: SquaredPetriDish): void;
  evolveImmutable(petriDish: SquaredPetriDish): SquaredPetriDish;
}

export declare class LivingCellBlockGenerator {
  smallExploder(range: number): CellBlock[];
}

export interface GameDependencies {
  nextGenerationCalculator: NextGenerationCalculator;
  livingCellBlockGenerator: LivingCellBlockGenerator;
  defaultDishSize: number;
}

export declare function createDefaultDependencies(defaultDishSize?: number): GameDependencies;
`;
