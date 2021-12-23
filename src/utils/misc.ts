/**
 * Рекурсивно получает расширяемый класс и вызывает функцию с каждым из них
 * включая сам переданный класс.
 * @param target
 * @param f
 */
export function whileHasParentConstructor(
  target: Function,
  f: (target: Function) => void,
) {
  let currentTarget = target;

  while (currentTarget !== null && currentTarget !== undefined) {
    f(currentTarget);
    currentTarget = (target as any).__proto__;
  }
}