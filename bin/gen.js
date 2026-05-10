#!/usr/bin/env node

import { ArgumentParser } from 'argparse';
import { apiKey } from '../lib/common/security/apiKey.js';

const ALGORITHMS = ['argon2', 'bcrypt', 'sha256'];

const main = async () => {

  const parser = new ArgumentParser({
    description: 'Generate where-server API key(s)',
  });

  parser.add_argument('algorithm', {
    choices: ALGORITHMS,
    nargs: '?',
    default: 'sha256',
    help: `Hashing algorithm used to store the where-server API key (default: sha256). Choices: ${ALGORITHMS.join(', ')}`,
  });

  parser.add_argument('-n', '--count', {
    type: 'int',
    default: 1,
    metavar: 'N',
    help: 'Number of where-server API keys to generate (default: 1)',
  });

  const rawArgs = process.argv.slice(2),
        args = rawArgs[0]?.endsWith('.js') ? rawArgs.slice(1) : rawArgs;

  const { algorithm, count } = parser.parse_args(args),
        generatedKeys = await Promise.all([...Array(count)].map(() => apiKey.generate(algorithm)));

  console.log(
    JSON.stringify(count === 1 ? generatedKeys[0] : generatedKeys, null, 2)
  );

};

main();
