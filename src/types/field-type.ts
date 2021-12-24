import {ObjectId} from 'mongodb';
import {IParser} from './parser';
import {TTypeOrTupleOrCallback} from './utils';

type TAnyDataMapper = IParser<any, any>;

export type TString = typeof String;
export type TNumber = typeof Number;
export type TBoolean = typeof Boolean;
export type TDate = typeof Date;
export type TObjectId = typeof ObjectId;

/**
 * Известные для библиотеки типы, для которых есть парсеры.
 */
export type TKnownType = TString | TNumber | TBoolean | TDate | TObjectId;

/**
 * Типы, которые библиотеке неизвестны, но могут быть ей использованы.
 */
export type TCustomType = TAnyDataMapper;

/**
 * Любой тип, принимаемый библиотекой.
 */
export type TSupportedType = TKnownType | TCustomType;

/**
 * Генератор типов, которые можно указать при инициализации поля.
 */
export type TFieldType<T> = TTypeOrTupleOrCallback<T>;

/**
 * Любой доступный тип, который можно передать при инициализации поля.
 */
export type TAnyFieldType = TFieldType<TSupportedType>;