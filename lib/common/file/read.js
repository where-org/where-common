import path from 'node:path';
import { readFile } from 'node:fs/promises';

import yaml from 'js-yaml';

const expandEnvVars = (str) => {
  return str.replace(/\$\{([^}:]+)(?::?-([^}]*))?\}/g, (_, k, d) => process.env[k] ?? d ?? '');
};

/* read */
const read = {

  json: async (src, flat = false) => {

    try {
      const content = JSON.parse(expandEnvVars(await readFile(src, 'utf8')));

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
      const content = yaml.loadAll(expandEnvVars(await readFile(src, 'utf8')));

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
