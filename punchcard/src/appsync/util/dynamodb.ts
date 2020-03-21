import { ArrayShape, BinaryShape, BoolShape, MapShape, NumericShape, RecordShape, RecordType, SetShape, Shape, StringShape, TimestampShape } from '@punchcard/shape';
import { GraphQL } from '../graphql';

export class $DynamoDBUtil {
  /**
   * General object conversion tool for DynamoDB that converts input objects to the appropriate
   * DynamoDB representation. It’s opinionated about how it represents some types: e.g., it will
   * use lists (“L”) rather than sets (“SS”, “NS”, “BS”). This returns an object that describes
   * the DynamoDB attribute value.
   *
   * @param object value to convert to its DynamoDB encoding
   */
  public toDynamoDB<T extends GraphQL.Type>(_object: T): GraphQL.TypeOf<ToDynamoDBJson<GraphQL.ShapeOf<T>>> {
    throw new Error('todo');
  }

  /**
   * The same as $util.dynamodb.toDynamoDB(Object) : Map, but returns the DynamoDB attribute value
   * as a JSON encoded string.
   *
   * @param object value to convert to its DynamoDB encoding
   */
  public toDynamoDBJson<T extends GraphQL.Type>(_object: T): GraphQL.String {
    throw new Error('todo');
  }

  public toBoolean(_bool: GraphQL.Bool): GraphQL.TypeOf<ToDynamoDBJson<BoolShape>> {
    throw new Error('todo');
  }

  public toNumber<N extends GraphQL.Integer | GraphQL.Number>(_number: N): GraphQL.TypeOf<ToDynamoDBJson<GraphQL.ShapeOf<N>>> {
    throw new Error('todo');
  }

  public toString(_value: GraphQL.String): GraphQL.TypeOf<ToDynamoDBJson<StringShape>> {
    throw new Error('todo');
  }

  public toStringSet(_value: GraphQL.List<GraphQL.String>): GraphQL.TypeOf<RecordType<{
    SS: ArrayShape<StringShape>
  }>> {
    throw new Error('todo');
  }
}

/**
 * Converts a Shape to its DynamoDB representation.
 *
 * According to the opinonated approach of `$util.dynamodb.toDynamoDB`
 *
 * @see https://docs.aws.amazon.com/appsync/latest/devguide/resolver-util-reference.html
 */
export type ToDynamoDBJson<T extends Shape> =
  T extends NumericShape ? RecordType<{ S: StringShape }> :
  T extends StringShape ? RecordType<{ S: StringShape }> :
  T extends TimestampShape ? RecordType<{ S: TimestampShape }> :
  T extends BoolShape ? RecordType<{ BOOL: BoolShape; }> :
  T extends BinaryShape ? RecordType<{ B: StringShape; }> :
  T extends SetShape<infer I> ? RecordType<{
    L: ArrayShape<ToDynamoDBJson<I>>;
  }> :
  T extends ArrayShape<infer I> ? RecordType<{
    L: ArrayShape<ToDynamoDBJson<I>>;
  }> :
  T extends MapShape<infer V> ? RecordType<{
    M: MapShape<ToDynamoDBJson<V>>;
  }> :
  T extends RecordType<infer M> ? RecordType<{
    M: RecordType<{
      [m in keyof M]: ToDynamoDBJson<Shape.Resolve<M[m]>>;
    }>
  }> :
  T extends RecordShape<infer M> ? RecordType<{
    M: RecordType<{
      [m in keyof M]: ToDynamoDBJson<Shape.Resolve<M[m]>>;
    }>
  }> :
  T extends RecordType<infer M> ? RecordType<{
    M: RecordType<{
      [m in keyof M]: ToDynamoDBJson<Shape.Resolve<M[m]>>;
    }>
  }> :
  never
  ;