/**
 * Любая схема документа.
 */
export type TAnySchema = Record<string, any>;

/**
 * Стандартный документ MongoDB.
 */
export interface IDocument {
  _id: any;
}