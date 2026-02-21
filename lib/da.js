import { cast } from './common/util/cast.js';
import { multipartFormDataKey } from './define.js';

const operators = {

  '=': (k, v, data) => {

    const values = Array.isArray(v) ? v : [v];

    const [first] = values,
          v1 = (first === null) ? String(first) : first; //.toLowerCase();

    const isNull = {
      'null' : true, 'not-null': false
    };

    if (Object.keys(isNull).includes(v1)) {
      return (v1 === 'null') ? data === null : data !== null;

    } else {
      return values.filter(v => data === v).length > 0;
    }
  },

  '!': (k, v, data) => {

    const values = Array.isArray(v) ? v : [v];

    const [first] = values,
          v1 = (first === null) ? String(first) : first.toLowerCase();

    const isNull = {
      'null' : true, 'not-null': false
    };

    if (Object.keys(isNull).includes(v1)) {
      return (v1 === 'null') ? data !== null : data === null;

    } else {
      return values.filter(v => data !== v).length > 0;
    }
  },

  '<': (k, v, data) => {
    const v1 = Array.isArray(v) ? v[0] : v;
    return (isNaN(v1) || isNaN(data)) ? false : data < v1;
  },

  '>': (k, v, data) => {
    const v1 = Array.isArray(v) ? v[0] : v;
    return (isNaN(v1) || isNaN(data)) ? false : data > v1;
  },

  '<=':(k, v, data) => {
    const v1 = Array.isArray(v) ? v[0] : v;
    return (isNaN(v1) || isNaN(data)) ? false : data <= v1;
  },

  '>=':(k, v, data) => {
    const v1 = Array.isArray(v) ? v[0] : v;
    return (isNaN(v1) || isNaN(data)) ? false : data >= v1;
  },

  '-': (k, v, data) => {

    if (!Array.isArray(v) || isNaN(data)) {
      return false;
    }

    const [v1, v2] = v;
    return v1 <= data && data <= v2;
  },

  '*': (k, v, data) => {

    if (Array.isArray(v)) {
      return false;
    }

    const v1 = v.replace(/[\\^$.\-+?()[\]{}|]/g, '\\$&').replace(/\*/g, '.*');

    try {
      return data.match(new RegExp(`^${v1}$`, 's'));

    } catch(err) {
      return false;
    }

  },

  '!*': (k, v, data) => {

    if (Array.isArray(v)) {
      return false;
    }

    const v1 = v.replace(/[\\^$.\-+?()[\]{}|]/g, '\\$&').replace(/\*/g, '.*');

    try {
      return !data.match(new RegExp(`^${v1}$`, 's'));

    } catch(err) {
      return false;
    }

  },

};

// split
const split = (operators) => {

  const r1 = operators.map(v => v.replace(/[\\^$.\-*+?()[\]{}|]/g, '\\$&')).join('|'),
        r2 = new RegExp(`(${r1})$`);

  return (key) => {
    return [key.replace(r2, ''), (key.match(r2)) ? key.match(r2)[0] : '='];
  };

}

// pasrse
const parse = (object, contentType) => {

  // { k1: [v1, v2], k2: [v1 , v2], ... } (multipart/form-data)

  if (contentType && contentType.match(/multipart\/form-data/)) {

    if (object && object[multipartFormDataKey]) {
      const data = JSON.parse(object[multipartFormDataKey]);
      return (Array.isArray(data)) ? data : [data];
    }

    return Object.values(Object.entries(object).reduce((o, [k, v]) => {
      return ((Array.isArray(v)) ? v : [v]).reduce((o, v, i) => ({ ...o, [i]: { ...o[i], [k]: cast(v) } }), o);
    }, {}));

  }

  // {k1: v1, ... }

  if (Object.keys(object).filter(v => isNaN(v)).length) {
    return [object];
  }

  const [header, ...body] = Object.values(object);

  // [[k1, k2, ... ], [v1, v2, ... ], ... ]

  if (header && Array.isArray(header)) {
    return body.map((v) => v.reduce((o, v, i) => ({ ...o, [header[i]]: cast(v) }), {}));
  }

  // [{k1: v1}, {k2: v2}, ...] || {}

  return (Array.isArray(object)) ? object : [object];

}

// filter
const filter = (() => {

  const sp = split(Object.keys(operators));

  const filter = {

    select: (data, condition) => {

      const [first] = data;

      if (condition.includes('*') || !first) {
        return data;
      }

      const keys = Object.keys(first);

      if (condition.includes('count')) {

        return [condition.reduce((o, k) => {

          if (k !== 'count' && !keys.includes(k)) {
            throw new Error(`No such column ${k}`);
          }
          return { ...o, [k]: (k == 'count') ? data.length : first[k] };

        }, {})];

      }

      return condition.reduce((o, k) => {

        if (!keys.includes(k)) {
          throw new Error(`No such column ${k}`);
        }

        return o.map((v, i) => ({ ...v, [k]: data[i][k] }));

      }, data.map(v => ({})));
    },

    where: (data, condition) => {

      const [first] = data;

      if (!first) {
        return data;
      }

      const keys = Object.keys(first);

      return data.filter((v) => {

        const or = condition.filter((cv) => {

          const conditionArray = Object.entries(cv);

          return conditionArray.length === conditionArray.filter(([ak, av]) => {

            const [k, op] = sp(ak);

            if (!keys.includes(k)) {
              throw new Error(`No such column ${k}`);
            }

            return operators[op](k, av, v[k]);

          }).length;

        });

        return or.length > 0;
      });

    },

    order: (data, condition) => {

      return Object.entries(condition).reduce((o, [k, v]) => {

        const asc = (v.toLowerCase() !== 'desc') ? true : false;

        return [...o].sort((a, b) => {

          const orderA = (asc) ? a[k] : b[k],
                orderB = (asc) ? b[k] : a[k];

          if (typeof orderA !== 'string' || typeof orderB !== 'string') {
            return orderA - orderB;
          }

          const upperA = orderA.toUpperCase(),
                upperB = orderB.toUpperCase();

          return (upperA > upperB) ? 1 : (upperA < upperB) ? -1 : 0;
        });

      }, data);

    },

    limit: (data, condition) => {

      if (!('limit' in condition)) {
        return data;
      }

      const { offset = 0, limit } = condition;
      return data.slice(offset, limit + offset);

    }

  };

  return (object, condition) => {

    const {where: w = null, order: o, select: s, limit: l} = condition || {},
           where = (w) ? { where: (w.or) ? w.or : [w] } : {};

    const [order, select, limit] = Object.entries({ order: o, select: s, limit: l }).map(([k, v]) => {
      return (v) ? { [k]: v } : {};
    });

    return Object.entries({ ...where, ...order, ...select, ...limit }).reduce((o, [k, v]) => {
      return filter[k](o, v);
    }, object);

  };

})();

export { split, parse, filter };
