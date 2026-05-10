import { hash } from './hash.js';

const apiKey = {

  generate: async (algorithm = 'sha256') => {

    const bytes = crypto.getRandomValues(new Uint8Array(32));

    const raw = btoa(String.fromCharCode(...bytes))
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

    const key = `whr_${raw}`,
          hashedKey = await hash.create(algorithm).hash(key);

    return { apiKey: key, hashedApiKey: hashedKey, hashedAlgorithm: algorithm };

  },

};

export { apiKey };
