/**
 * Type, type tuple, type callback or type tuple callback.
 */
export type TTypeOrArrayOrCallback<T> = T | T[] | (() => T) | (() => T[]);

/**
 * Returns all keys of type.
 */
export type TAllKeys<T> = T extends any ? keyof T : never;

/**
 * Returns type of specified property.
 */
type TPickType<T, K extends keyof T> = T extends { [k in K]?: any }
  ? T[K]
  : never;

type TPickTypeOf<T, K extends string | number | symbol> = K extends TAllKeys<T>
  ? TPickType<T, K>
  : never;

/**
 * Merges all the types in union.
 */
export type TMerge<T extends object> = {
  [K in TAllKeys<T>]: TPickTypeOf<T, K>
};

/**
 * Returns keys of object that could have value undefined.
 */
type TUndefinedKeys<T extends object> = {
  [K in keyof T]-?: undefined extends T[K] ? K : never;
}[keyof T];

/**
 * Converts object undefined fields to optional.
 */
export type TUndefinedToOptional<T extends object> =
  Omit<T, TUndefinedKeys<T>> & Partial<Pick<T, TUndefinedKeys<T>>>;

/**
 * Makes properties optional in object.
 */
export type TPartialBy<T, K> = [K] extends [never]
  ? T
  : K extends keyof T
    ? Omit<T, K> & Partial<Pick<T, K>>
    : T;

export type TOverride<Source extends object, Target extends Partial<Source>> = {
  [Key in keyof Source]: undefined extends Target[Key]
    ? Source[Key]
    : Target[Key];
};

export type TIsNever<T> = [T] extends [never] ? true : false;
