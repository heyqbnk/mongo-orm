import {Collection, Db, MongoClient} from 'mongodb';

/**
 * Обертка вокруг MongoDB Db.
 */
export class Database {
  private readonly db: Db;

  constructor(client: MongoClient, dbName: string) {
    this.db = client.db(dbName);
  }

  /**
   * Возвращает коллекцию по идентификатору.
   * @param name
   */
  public collection<T>(name: string): Collection<T> {
    return this.db.collection<T>(name);
  }
}