export abstract class SerializerStrategy<T = any, I = any> {
  abstract serialize(this: SerializerStrategy, deserialized: I): T;
  abstract deserialize(this: SerializerStrategy, serialized: T): I;
}
