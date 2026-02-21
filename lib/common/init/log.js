import { date } from '../util/date.js';

const log = (label, indent = false, out = 'error') => {

  const { module, ...rest } = (typeof label === 'string') ? { module: label } : label;

  return (o) => {
    const log = (typeof o === 'string') ? { message: o }: o;
    console[out](JSON.stringify({ date: date.string(new Date()), module, ...rest, ...log }, null, (indent) ? 2 : 0));
  }

}

export { log };
