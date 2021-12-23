/**
 * Конструктор.
 */
export type TConstructor<T> = {
  new(...args: any[]): T;
  prototype: T;
}

/**
 * Тип, кортеж или коллбэк, который возвращает тип или кортеж.
 */
export type TTypeOrTupleOrCallback<T> = T | [T] | (() => T) | (() => [T]);