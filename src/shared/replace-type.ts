export type ReplaceType<Type, ToType> = Omit<Type, keyof ToType> & ToType;
