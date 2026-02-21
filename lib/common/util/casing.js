// casing
const casing = {

  // pascal
  toPascal: (word) => {
    return word.replace(/[_-]./g, (s) => s[1].toUpperCase()).replace(/^./, (s) => s.toUpperCase());
  },

  camelToPascal: (word) => {
    return word.replace(/^./, (s) => s.toUpperCase());
  },

  snakeToPascal: (word) => {
    return word.replace(/_./g, (s) => s[1].toUpperCase()).replace(/^./, (s) => s.toUpperCase());
  },

  kebabToPascal: (word) => {
    return word.replace(/-./g, (s) => s[1].toUpperCase()).replace(/^./, (s) => s.toUpperCase());
  },

  // camel
  toCamel: (word) => {
    return word.replace(/[_-]./g, (s) => s[1].toUpperCase()).replace(/^./, (s) => s.toLowerCase());
  },

  pascalToCamel: (word) => {
    return word.replace(/^./, (s) => s.toLowerCase());
  },

  snakeToCamel: (word) => {
    return word.replace(/_./g, (s) => s[1].toUpperCase());
  },

  kebabToCamel: (word) => {
    return word.replace(/-./g, (s) => s[1].toUpperCase());
  },

  // snake
  toSnake:(word) => {
    return word.replace(/^./, (s) => s.toLowerCase()).replace(/([A-Z])/g, (s) => '_' + s[0].toLowerCase()).replace(/-/g, '_');
  },

  camelToSnake: (word) => {
    return word.replace(/([A-Z])/g, (s) => '_' + s[0].toLowerCase());
  },

  pascalToSnake: (word) => {
    return word.replace(/^./, (s) => s.toLowerCase()).replace(/([A-Z])/g, (s) => '_' + s[0].toLowerCase());
  },

  kebabToSnake: (word) => {
    return word.replace(/^./, (s) => s.toLowerCase()).replace(/-/g, '_');
  },

  // kebab
  toKebab: (word) => {
    return word.replace(/^./, (s) => s.toLowerCase()).replace(/([A-Z])/g, (s) => '-' + s[0].toLowerCase()).replace(/_/g, '-');
  },

  camelToKebab: (word) => {
    return word.replace(/([A-Z])/g, (s) => '-' + s[0].toLowerCase());
  },

  pascalToKebab: (word) => {
    return word.replace(/^./, (s) => s.toLowerCase()).replace(/([A-Z])/g, (s) => '-' + s[0].toLowerCase());
  },

  snakeToKebab: (word) => {
    return word.replace(/_/g, '-');
  },

  ...Object.entries({ keysToCamel: 'toCamel', keysToPascal: 'toPascal', keysToSnake: 'toSnake', keysToKebab : 'toKebab' }).reduce((o, [k, f]) => {

    return { ...o, [k]: (data) => {

      const isArray = Array.isArray(data);

      const [first, ...rest] = (isArray ? data : [data]).map(v => {
        return Object.entries(v).reduce((o, [k, v]) => ({ ...o, [casing[f](k)]: v }), {});
      });

      return isArray ? [first, ...rest] : first;

    } };

  }, {}),

};

export { casing };
