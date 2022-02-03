import {Db as MongoDb} from 'mongodb';
import {ISchemaCtr} from './schema';
import {Repository} from './Repository';

interface IRepository {
  /**
   * Returns Repository instance when source is specified in schema.
   * @param Schema
   */
  <S extends ISchemaCtr<any, { source: string }>>(
    Schema: S,
  ): Repository<S['schema']>;
  /**
   * Returns Repository instance when source is unknown.
   * @param Schema
   * @param source
   */
  <S extends ISchemaCtr<any>>(
    Schema: S,
    source: string,
  ): Repository<S['schema']>;
}

export class Db extends MongoDb {
  /**
   * Returns repository which generates schema instances.
   * @param Schema
   * @param source
   */
  repository: IRepository = (Schema: ISchemaCtr<any, any>, source?: string) => {
    return new Repository(this, Schema, {source});
  }
}