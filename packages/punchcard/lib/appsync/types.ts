import { ArrayShape, BinaryShape, BoolShape, DynamicShape, IntegerShape, MakeRecordType, MapShape, NothingShape, NumberShape, RecordMembers, RecordShape, RecordType, SetShape, ShapeOrRecord, string, StringShape, TimestampShape, Trait, Shape } from '@punchcard/shape';

import { ShapeVisitor } from '@punchcard/shape';

const IDTrait: {
  [Trait.Data]: {
    graphqlType: 'ID'
  }
} = {
  [Trait.Data]: {
    graphqlType: 'ID'
  }
};

export const ID = string.apply(IDTrait);



export type GraphQL<T> = Generator<any, T, any>;

export namespace GraphQL {
  export function of<T extends ShapeOrRecord>(type: T): Of<T> {
    throw new Error('todo');
  }

  // tslint:disable: ban-types
  // cool - we can use recursion now
  export type Of<T extends ShapeOrRecord> =
    T extends StringShape ? String :
    T extends IntegerShape ? Integer :
    T extends NumberShape ? Integer :
    T extends ArrayShape<infer I> ? List<Of<I>> :
    T extends MapShape<infer I> ? Map<Of<I>> :
    T extends RecordType<any, infer M> ? Record<{
      [m in keyof M]: Of<M[m]>;
    }> & {
      [m in keyof M]: Of<M[m]>;
    }:
    T extends RecordShape<infer M> ? Record<{
      [m in keyof M]: Of<M[m]>;
    }> & {
      [m in keyof M]: Of<M[m]>;
    } :
    Type<T>
    ;

  export type ShapeOf<T extends Type> = T extends Type<infer I> ? I : never;

  export class Type<T extends ShapeOrRecord = any> {
    constructor(public readonly shape: T, public readonly expression: GraphQL.Expression) {}
  }
  export class Any extends Type<DynamicShape<any>> {}
  export class Bool extends Type<BoolShape> {}
  export class Integer extends Type<IntegerShape> {}
  export class Number extends Type<NumberShape> {}
  export class String extends Type<StringShape> {}
  export class Binary extends Type<BinaryShape> {}
  export class List<T extends Type = any> extends Type<ArrayShape<ShapeOf<T>>> {
    constructor(shape: ArrayShape<ShapeOf<T>>, expression: GraphQL.Expression) {
      super(shape, expression);

    }
  }
  export class Map<T extends Type = any> extends Type<MapShape<ShapeOf<T>>> {}
  export class Record<M extends { [m: string]: Type; } = any> extends Type<RecordShape<{
    [m in keyof M]: ShapeOf<M[m]>;
  }>> {}
  export namespace Record {
    export type GetMembers<R extends Record> = R extends Record<infer M> ? M : any;
  }
  export type RecordClass<T extends Record = any> = (new(members: Record.GetMembers<T>) => T);

}
export namespace GraphQL {
  export interface StaticInterface<M extends RecordMembers> {
    readonly members: M;
    /**
     * Value of this type at runtime in a Lambda Function or Container.
     */
    readonly Record: MakeRecordType<M>;
  }

  export interface InstanceInterface {
    [field: string]: (root: this, ...args: GraphQL.Type[]) => GraphQL<GraphQL.Type> | GraphQL<GraphQL.Type[]>;
    // [field: string]: <T extends GraphQL.RecordClass>(impl: (root: this) => GraphQL<T[]>) => GraphQL<T[]>;
    // field<T extends GraphQL.RecordClass>(returns: (type?: any) => T, impl: (root: this) => GraphQL<InstanceType<T>>): T;
    // field<T extends GraphQL.RecordClass>(returns: (type?: any) => [T], impl: (root: this) => GraphQL<InstanceType<T>[]>): T;
  }

  export function NewType<M extends RecordMembers>(members: M): StaticInterface<M> & (new(values: {
    [m in keyof M]: Of<M[m]>;
  }) => Record<{
    readonly [m in keyof M]: Of<M[m]>;
  }> & {
    readonly [m in keyof M]: Of<M[m]>;
  } & InstanceInterface) {
    return null as any;
  }
}
export namespace GraphQL {
  export class Expression {

  }
}

export namespace GraphQL {
  export class Visitor implements ShapeVisitor<GraphQL.Type, GraphQL.Expression> {
    public arrayShape(shape: ArrayShape<any>, expr: Expression): List {
      return new List(shape, expr);
    }
    public binaryShape(shape: BinaryShape, expr: Expression): Type<any> {
      return new Binary(shape, expr);
    }
    public boolShape(shape: BoolShape, expr: Expression): Type<any> {
      return new Bool(shape, expr);
    }
    public recordShape(shape: RecordShape<any, any>, expr: Expression): Type<any> {
      return new Record(shape, expr);
    }
    public dynamicShape(shape: DynamicShape<any>, expr: Expression): Type<any> {
      return new Any(shape, expr);
    }
    public integerShape(shape: IntegerShape, expr: Expression): Type<any> {
      return new Integer(shape, expr);
    }
    public mapShape(shape: MapShape<any>, expr: Expression): Type<any> {
      return new Map(shape, expr);
    }
    public nothingShape(shape: NothingShape, expr: Expression): Type<any> {
      throw new Error("Method not implemented.");
    }
    public numberShape(shape: NumberShape, expr: Expression): Type<any> {
      throw new Error("Method not implemented.");
    }
    public setShape(shape: SetShape<any>, expr: Expression): Type<any> {
      throw new Error("Method not implemented.");
    }
    public stringShape(shape: StringShape, expr: Expression): Type<any> {
      throw new Error("Method not implemented.");
    }
    public timestampShape(shape: TimestampShape, expr: Expression): Type<any> {
      throw new Error("Method not implemented.");
    }
  }
}