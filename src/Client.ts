import {DbOptions, MongoClient, MongoClientOptions} from 'mongodb';
import {Db} from './Db';

type TUrlOrSettings = string | {
  /**
   * Database host.
   */
  host: string;
  /**
   * Database port.
   */
  port: number;
};

function urlOrSettingsToString(urlOrSettings: TUrlOrSettings): string {
  if (typeof urlOrSettings === 'string') {
    return urlOrSettings;
  }
  return `mongodb://${urlOrSettings.host}:${urlOrSettings.port}`;
}

export class Client extends MongoClient {
  constructor(urlOrSettings: TUrlOrSettings, options?: MongoClientOptions) {
    super(urlOrSettingsToString(urlOrSettings), options);
  }

  /**
   * Returns Db instance.
   * @param dbName
   * @param options
   */
  db(dbName: string, options?: DbOptions): Db {
    return new Db(this, dbName, options);
  }
}