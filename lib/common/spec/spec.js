import path from 'node:path';
import { read } from '../file/read.js';

const [{ scope: at }] = (await read.yaml(path.resolve(import.meta.dirname, './at-spec.yaml'))).flat();

const properties = {

  single: (type) => {
    return { type };
  },

  oneOf: (type) => {
    return {
      oneOf: [
        { type },
        { type: 'array', items: { type } },
      ],
    };
  },

  array: (type) => {
    return {
      type: 'array',
      items: { type },
      minItems: 2,
      maxItems: 2,
    };
  },

};

const operators = {

  '=': ([k, op], v) => {
    const description = 'Equal';
    return { [k]: { description, ...properties.oneOf(v.type) } };
  },

  '!': ([k, op], v) => {
    const description = 'Not equal';
    return { [k + op]: { description, ...properties.oneOf(v.type) } };
  },

  '<': ([k, op], v) => {
    const description = 'Less than';
    return { [k + op]: { description, ...properties.single(v.type) } };
  },

  '>': ([k, op], v) => {
    const description = 'Greater than';
    return { [k + op]: { description, ...properties.single(v.type) } };
  },

  '<=': ([k, op], v) => {
    const description = 'Less than or equal';
    return { [k + op]: { description, ...properties.single(v.type) } };
  },

  '>=': ([k, op], v) => {
    const description = 'Greater than or equal';
    return { [k + op]: { description, ...properties.single(v.type) } };
  },

  '-': ([k, op], v) => {
    const description = 'Between range';
    return { [k + op]: { description, ...properties.array(v.type) } };
  },

  '*': ([k, op], v) => {
    const description = 'Partial match (LIKE). Supports wildcard "*". "*value*" for contains, "value*" for prefix, "*value" for suffix. Without "*", treated as exact match.';
    return { [k + op]: { description, ...properties.single(v.type) } };
  },

  '!*': ([k, op], v) => {
    const description = 'Partial not match (NOT LIKE). Supports wildcard "*". "*value*" for contains, "value*" for prefix, "*value" for suffix. Without "*", treated as exact match.';
    return { [k + op]: { description, ...properties.single(v.type) } };
  },

};

const fromConfig = async (name, spec = {}) => {

  const scope = !('scope' in spec) ? {} : { scope: [...spec.scope, ...at].map(v => {

    const schema = {
      '$schema': 'https://json-schema.org/draft/2020-12/schema',
      'x-scope-name': v.name,
      ...v.schema ?? {},
    };

    const where = Object.entries(schema.items.properties).reduce((o, [k, v]) => {

      if (['array', 'object'].includes(v.type) || v.writeOnly) {
        return o;
      }

      return Object.entries(operators).reduce((o, [op, f]) => {
        return { ...o, ...f([k, op], v) };
      }, o);

    }, {});

    const condition = {
      '$schema': 'https://json-schema.org/draft/2020-12/schema',
      'x-scope-name': v.name,

      title: 'condition',
      description: 'Query conditions for filtering, sorting, and paginating results',

      type: 'object',
      additionalProperties: false,

      properties: {

        select: {
          description: 'Array of column names to retrieve',
          type: 'array',
          items: {
            type: 'string',
            enum: Object.keys(schema.items.properties),
          },
          uniqueItems: true,
          minItems: 1,
        },

        where: {
          description: 'Filter conditions',
          oneOf: [
            {
              description: 'AND conditions',
              '$ref': '#/$defs/where',
            },

            {
              description: 'OR conditions',
              type: 'object',
              properties: {
                or: {
                  type: 'array',
                  items: { '$ref': '#/$defs/where' },
                },
              },
              required: ['or'],
              additionalProperties: false,
            },

          ]
        },

        order: {
          description: 'Sort order',
          type: 'object',
          additionalProperties: false,

          properties: Object.entries(schema.items.properties).reduce((o, [k, v]) => {

            if (['array', 'object'].includes(v.type) || v.writeOnly) {
              return o;
            }

            const { description } = v;
            return { ...o, [k]: { description, type: 'string', enum: ['asc', 'desc'] } };

          }, {}),

        },

        limit: {
          description: 'Pagination',
          type: 'object',
          additionalProperties: false,
          properties: {
            offset: {
              description: 'Number of rows to skip',
              type: 'integer',
            },
            limit: {
              description: 'Maximum number of rows to return',
              type: 'integer',
            },
          },
        },

      },

      '$defs': {

        where: {
          type: 'object',
          additionalProperties: false,
          properties: where,
        },

      },

    };

    return { ...v, schema, condition };

  })};

  return { ...spec, ...scope };

};

export { fromConfig };
