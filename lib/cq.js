import { cast } from './common/util/cast.js';

const operators = [
  '=', '!', '<', '>', '<=', '>=', '-', '*', '!*',
];

const shortToLong  = {
  s: 'select', w: 'where', o: 'order', l: 'limit',
};

const longToShort = Object.entries(shortToLong).reduce((o, [k, v]) => ({ ...o, [v]: k }), {});

const normalizeKey = Object.entries(shortToLong).reduce((o, [k, v]) => {
  return { ...o, [k]: v, [v]: v };
}, {});

// parse
const parse = (string, ignore) => {

  // prepare
  const prepare = (string, ignore) => {

    const r1 = /([^\/]*["'].*?["'][^\/]*)|\//,
          sp = string.trim().replace(/^\/|\/$/g, '').split(r1).filter(v => v);

    return sp.reduce((o, v, i, s) => {

      if (i % 2 !== 0) {
        return { ...o, [s[i - 1]]: v };
      }

      if (ignore || normalizeKey[v]) {
        return o;
      }

      throw new Error(`${v} is not allowed.`);

    }, {});

  };

  // split
  const split = (string) => {

    const r1 = /([^:]*?["'].*?["'][^:]*)|:/,
          r2 = /([^,]*?["'].*?["'][^,]*)|,/,
          r3 = /^["']|["']$/g;

    return string.split(r1).filter(v => v).reduce((o, v) => {

      const [k, first, ...values] = v.split(r2).filter(v => v).map((v) => cast(v.replace(r3, '')));
      return { ...o, [k]: (values.length) ? [first, ...values] : (first !== undefined) ? first : null };

    }, {});

  }

  const object = (typeof string === 'string') ? prepare(string, ignore) : string,
        r1 = /([^\|]*["'].*?["'][^\|]*)|\|/;

  const { select, limit, ...wo } = Object.entries(object).reduce((o, [k, v]) => {

    if (!normalizeKey[k]) {
      return o;
    }

    const [first, ...or] = v.split(r1).filter(v => v),
          values = or.length ?  { or: [first, ...or].map(v => split(v)) } : split(first);

    return { ...o, [normalizeKey[k]]: values };

  }, {});

  const s = (!select) ? {} : {

    select: Object.entries(select).reduce((o, [k, v]) => {
      return [...o, k, ...(Array.isArray(v) ? v : [v])];
    }, []).filter(v => v)

  };

  const l = !limit || 'offset' in limit && !('limit' in limit) || 'or' in limit
    ? {}
    : { limit: Object.entries(limit).reduce(
      (o, [k, v]) => (['offset', 'limit'].includes(k) ? { ...o, [k]: v  } : o), {}) };

  return { ...s, ...wo, ...l };

}

// string
const string = (object) => {

  const join = (object, separator) => {
    return Object.entries(object).map(([k, v]) => [k, String(v)].join(',')).join(separator);
  };

  const { select, where, order, limit, ...rest } = object;

  // genmitsu ni suru baai ha reigai wo hassei sasemasu.
  //if(rest){
    //throw new Error('no where condition object.');
  //}

  // s
  const s = select ? [longToShort.select, select.join(',')].join('/') : undefined;

  // w, o
  const [w, o] = Object.entries({ where, order }).filter(([k, v]) => v).map(([k, v]) => {
    const values = (v.or) ? v.or.map(v => join(v, ':')).join('|') : join(v, ':');
    return [longToShort[k], values].join('/');
  });

  // l
  const { offset: lo, limit: lv } = limit ?? {},
        l = lv ? [longToShort.limit, [lo ? `offset,${lo}` : undefined, `limit,${lv}`].join(':')].join('/') : undefined;

  return [s, w, o, l].filter(v => v).join('/');

}

export { parse, string };
