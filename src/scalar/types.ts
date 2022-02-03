import {ObjectId} from 'mongodb';

export type TString = typeof String;
export type TNumber = typeof Number;
export type TBoolean = typeof Boolean;
export type TDate = typeof Date;
export type TObjectId = typeof ObjectId;

/**
 * Known scalar types.
 */
export type TScalarCtr = TString | TNumber | TBoolean | TDate | TObjectId;
