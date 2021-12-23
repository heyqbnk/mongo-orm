import {Token} from 'typedi';
import {IFieldMeta, IModelSettings} from '../types';

export type ModelSettings = IModelSettings;
/**
 * Настройки модели.
 */
export const ModelSettingsToken = new Token<ModelSettings>();

export type ModelFields = IFieldMeta[];
/**
 * Поля модели.
 */
export const ModelFieldsToken = new Token<ModelFields>();
