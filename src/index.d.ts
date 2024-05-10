declare type Type<T> = {
  [key in keyof T]: T[key];
};
declare type Nullable<T> = T | null;
