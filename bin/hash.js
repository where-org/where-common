#!/usr/bin/env node

import { ArgumentParser } from 'argparse';
import { hash } from '../lib/common/security/hash.js';

const ALGORITHMS = ['argon2', 'bcrypt', 'sha256'];

const main = async () => {

  const parser = new ArgumentParser({
    description: 'Hash a plain text string using the specified algorithm',
  });

  parser.add_argument('algorithm', {
    choices: ALGORITHMS,
    help: `Hashing algorithm to use. Choices: ${ALGORITHMS.join(', ')}`,
  });

  parser.add_argument('plain', {
    help: 'Plain text string to hash',
  });

  const rawArgs = process.argv.slice(2),
        args = rawArgs[0]?.endsWith('.js') ? rawArgs.slice(1) : rawArgs;

  const { algorithm, plain } = parser.parse_args(args),
        hashed = await hash.create(algorithm).hash(plain);

  console.log(hashed);

};

main();
