import { Scalar } from '@nestjs/graphql';
import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';

@Scalar('JSON', () => GraphQLScalarType)
export class JSONScalar {
  description = 'JSON custom scalar type';
  parseValue(value: any) {
    return value;
  }
  serialize(value: any) {
    return value;
  }
  parseLiteral(ast: any) {
    if (ast.kind === Kind.OBJECT) {
      const value = Object.create(null);
      ast.fields.forEach((field: any) => {
        value[field.name.value] = field.value.value;
      });
      return value;
    }
    return null;
  }
}
