import { date } from './date.js';

const cast = (value) => {

  try {
    return JSON.parse(value);
  } catch (err) {
  }

  if (value.match(date.iso8601)) {
    return new Date(value);
  }

  return value;

}

export { cast };
