export interface SerializerStrategy<T = any, I = any> {
  serialize(unserialized: I): T;
  deserialize?(serialized: T): I;
}
