import { GraphQLScalarType, Kind, ObjectValueNode, ValueNode } from 'graphql';
import { Scalar } from '@nestjs/graphql';

@Scalar('JSON')
export class JSONScalar {
  description = 'JSON custom scalar type';

  parseValue(value: unknown): Record<string, any> {
    if (typeof value !== 'object') {
      throw new Error('JSONScalar can only be used with JSON objects.');
    }
    return value as Record<string, any>;
  }

  serialize(value: Record<string, any>): Record<string, any> {
    return value;
  }

  parseLiteral(ast: ValueNode): Record<string, any> | null {
    if (ast.kind !== Kind.OBJECT) {
      throw new Error('JSONScalar can only be used with JSON objects.');
    }
    const fields = (ast as ObjectValueNode).fields.reduce((acc: any, field) => {
      acc[field.name.value] = field.value.kind === Kind.STRING ? field.value.value : null;
      return acc;
    }, {});
    return fields;
  }
}
