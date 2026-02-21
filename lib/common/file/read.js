import path from 'node:path';
import { readFile } from 'node:fs/promises';

import yaml from 'js-yaml';

const read = {

  json: async (src, flat = false) => {

    try {
      const content = JSON.parse(await readFile(src));

      return flat && Array.isArray(content)
        ? content.reduce((o, v) => ({ ...o, ...v }), {})
        : content;

    } catch(err) {

      if (err instanceof yaml.YAMLException) {
        throw new SyntaxError(err.message);
      }
      throw err;

    }
  },

  yaml: async (src, flat = false) => {

    try {
      const content = yaml.loadAll(await readFile(src));

      return flat
        ? content.reduce((o, v) => ({ ...o, ...v }), {})
        : content;

    } catch(err) {
      if (err instanceof yaml.YAMLException) {
        throw new SyntaxError(err.message);
      }
      throw err;
    }
  },

};

export { read };
