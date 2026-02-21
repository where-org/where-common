import { fileURLToPath } from 'url';
import path from 'node:path';

import { lstat } from 'node:fs/promises';

import { read } from '../file/read.js';

const ext = { '.json': 'json', '.yaml': 'yaml', '.yml': 'yaml', };

const checkDependencies = (i, tree, key, original, chain = [original]) => {

  if (key === original) {
    throw new Error(`Circular dependency detected: ${chain.join(' -> ')} -> ${key}`);
  }

  if (!tree[key]) {
    return i;
  }

  if (!tree[key].dep) {
    return i + 1;
  }

  return Object.entries(tree[key].dep).
    map(([k, v]) => checkDependencies(i + 1, tree, v, original, [...chain, key])).reduce((a, b) => Math.max(a, b));

};

// resolve
const resolve = async (dir, fileName) => {

  const paths = Object.keys(ext).map(v => path.join(dir, fileName + v));

  const configFilePath = await Promise.any(paths.map(async v => {

    if (!(await lstat(v)).isFile()) {
      throw new Error(`File not found: ${v}`);
    }

    return v;

  }));

  const key = ext[path.extname(configFilePath)];
  return await read[key](configFilePath, true);

};

const load = async (dir, mode, name, ignore = null) => {

  const configFileName = [
    { name, ignore: ignore ?? false },
    { name: `${name}-app`, ignore: ignore ?? false },
    { name: `${name}-spec`, ignore: ignore ?? true },
  ];

  const [commonConfig, appConfig, specConfig] = await Promise.all(configFileName.map(async v => {

    const config = await resolve(dir, `${v.name}-${mode}`).catch(async err => {

      if (err instanceof SyntaxError) {
        throw err;
      }

      return await resolve(dir, v.name).catch(err => {

        if (err instanceof SyntaxError) {
          throw err;
        }

        return undefined;

      });

    });

    if (!config) {

      if (v.ignore) {
        return {};
      }

      throw new Error(`Unable to resolve config: tried: ${v.name}-${mode}, ${v.name}`);

    }

    return config;

  }));

  // izon kankei wo shirabete sort shimasu.
  // junkan sansho shiteiru baai ha error wo throw shimasu.

  const sortedAppConfig = Object.entries(appConfig).reduce((o, [k1, v1]) => {

    const { dep } = v1;

    if (!dep) {
      o[0] = { ...(o[0] || {}), [k1]: v1 };
      return o;
    }

    const i = Object.entries(dep).
      map(([, k2]) => checkDependencies(0, mergedAppConfig, k2, k1)).reduce((a, b) => Math.max(a, b));

    o[i] = { ...(o[i] || {}), [k1]: v1 };
    return o;

  }, []).reduce((o, v) => {
    return Object.entries(v).reduce((o, [k, v]) => ({ ...o, [k]: v }), o);

  }, {});

  return { [name]: commonConfig, app: sortedAppConfig, spec: specConfig };

};

export { resolve, load };
