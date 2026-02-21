const credential = async ({ module, meta, ...rest }, dep) => {

  const { dep: metaDep, scope: metaScope, key: metaKey, credential: metaCredential = 'credential', ...column } = meta || {},
        { [metaDep]: db } = dep || {};

  const request = async (key) => {

    const res = (db) ? await db.get(metaScope, { where: { [metaKey]: key } }).catch(err => [rest[key]]) : [rest[key]],
          [data] = (res.length) ? res : [rest[key]];

    if (!data) {
      return null;
    }

    return Object.entries(column).reduce((o, [k1, k2]) => {
      const v = data[k2],
            {[k2]: remove, ...rest} = o;

      return (v === null || v === undefined) ? { ...rest } : { ...rest, [k1]: v };
    }, data);

  }

  return {

    keys: [
      ...((db) ? await db.get(metaScope).catch(err => []) : []).map(v => v[metaKey]),
      ...Object.keys(rest),
    ],

    // static
    requestStaticCredential: async () => {
      if (!rest[metaCredential]) {
        throw new Error(`Credential is not fixed.`);
      }

      const credential = await request(metaCredential);

      if (!credential) {
        throw new Error('No credential.');
      }

      return credential;
    },

    // dynamic
    requestCredential: async (key) => {
      if (rest[metaCredential]) {
        throw new Error(`Credential is fixed.`);
      }

      const credential = await request(key);

      if (!credential) {
        throw new Error('No credential.');
      }

      return credential;
    }

  };

}

export { credential };
