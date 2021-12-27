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

  while (currentTarget !== Function) {
    f(currentTarget);
    currentTarget = currentTarget.constructor
  }
}