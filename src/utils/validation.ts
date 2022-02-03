/**
 * States that value is record.
 * @param value
 */
export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && !Array.isArray(value) && value !== null;
}
