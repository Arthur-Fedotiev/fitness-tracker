export abstract class SerializerStrategy<T = any, I = any> {
  abstract serialize(deserialized: I): T;
  abstract deserialize(serialized: T): I;
}
