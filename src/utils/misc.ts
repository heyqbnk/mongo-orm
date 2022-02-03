/**
 * Recursively gets extended class and calls passed function with each of them.
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