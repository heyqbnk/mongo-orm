interface ITypesMappingMap {
  string: string;
  number: number;
  boolean: boolean;
}

export type TBaseType = 'string' | 'number' | 'boolean';
export type TTypeBasedType<T extends TBaseType> = ITypesMappingMap[T];

