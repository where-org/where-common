import bcrypt from 'bcrypt';
import argon2 from 'argon2';

const BCRYPT_SALT_ROUNDS = 12;

const hasher = {

  sha256: {

    hash: async (plain) => {

      const encoded = new TextEncoder().encode(plain),
            buffer = await crypto.subtle.digest('SHA-256', encoded);

      return Buffer.from(buffer).toString('hex');

    },

    verify: async (hashed, plain) => {

      const encoded = new TextEncoder().encode(plain),
            buffer = await crypto.subtle.digest('SHA-256', encoded);

      return Buffer.from(buffer).toString('hex') === hashed;

    },
  },

  bcrypt: {

    hash: async (plain) => {
      return await bcrypt.hash(plain, BCRYPT_SALT_ROUNDS);
    },

    verify: async (hashed, plain) => {
      return await bcrypt.compare(plain, hashed);
    },

  },

  argon2: {

    hash: async (plain) => {
      return await argon2.hash(plain, { type: argon2.argon2id });
    },

    verify: async (hashed, plain) => {
      return await argon2.verify(hashed, plain);
    },

  },

};

const hash = {
  create: (algorithm) => hasher[algorithm],
};

export { hash };
