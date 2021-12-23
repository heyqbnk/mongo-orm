import {Db, MongoClient, MongoClientOptions} from 'mongodb';
import {IDocument, TAnySchema, TConstructor} from '../types';
import {Repository} from './Repository';
import {DIUtils} from './DIUtils';
import {ReflectUtils} from './ReflectUtils';

type TAnyConstructor = TConstructor<any>;

interface IConProps {
  /**
   * Экземпляр Db при помощи которого можно работать с коллекциями.
   */
  db: Db;
}

interface IInitOptions {
  connection: {
    uri: string,
    db: string;
    options?: MongoClientOptions;
  };
  models: TAnyConstructor[];
}

/**
 * Клиент, который создаёт подключение к БД и через который происходит вся
 * работа с ней.
 */
export class Client {
  private readonly db: Db;

  private constructor(props: IConProps) {
    const {db} = props;
    this.db = db;
  }

  /**
   * Инициализирует клиент.
   * @param options
   */
  static async init(options: IInitOptions): Promise<Client> {
    const {
      connection: {uri, options: clientOptions, db}
    } = options;

    // Создаем и сразу подключаем MongoDB Client.
    const mongoClient = await new MongoClient(uri, clientOptions).connect();

    // Создаем клиент.
    return new Client({db: mongoClient.db(db)});
  }

  /**
   * Возвращает репозиторий для генерации моделей.
   * @param Model
   */
  getRepository<ModelSchema extends TAnySchema, CollectionSchema extends IDocument>(
    Model: TConstructor<ModelSchema>
  ): Repository<ModelSchema, CollectionSchema> {
    return new Repository<ModelSchema, CollectionSchema>(Model, this.db);
  }
}