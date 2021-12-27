import {Db, MongoClient, MongoClientOptions} from 'mongodb';
import {Repository} from './Repository';
import {TConstructor} from '../types';

interface IConProps {
  /**
   * Клиент MongoDB.
   */
  client: MongoClient;
  /**
   * Наименование БД.
   */
  dbName: string;
}

interface IInitOptions {
  connection: {
    uri: string,
    db: string;
    options?: MongoClientOptions;
  };
}

/**
 * Клиент, который создаёт подключение к БД и через который происходит вся
 * работа с ней.
 */
export class Client {
  private readonly db: Db;

  /**
   * Созданный клиент MongoDB.
   */
  client: MongoClient;

  private constructor(props: IConProps) {
    const {client, dbName} = props;
    this.client = client;
    this.db = client.db(dbName);
  }

  /**
   * Инициализирует клиент.
   * @param options
   */
  static async init(options: IInitOptions): Promise<Client> {
    const {connection: {uri, options: clientOptions, db}} = options;

    // Создаем и сразу подключаем MongoDB Client.
    const client = await new MongoClient(uri, clientOptions).connect();

    // Создаем клиент.
    return new Client({client, dbName: db});
  }

  /**
   * Возвращает репозиторий для генерации моделей.
   * @param Model
   */
  getRepository<Model>(Model: TConstructor<Model>): Repository<Model> {
    return new Repository<Model>(Model, this.db);
  }
}