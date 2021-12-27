import {ObjectId} from 'mongodb';

/**
 * Стандартный документ MongoDB.
 */
export interface IDocument<Id = ObjectId> {
  _id: Id;
}