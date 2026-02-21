import { EventEmitter } from 'events';

const emitter = () => {

  const eventEmitter = new EventEmitter();

  return ['on', 'off', 'once', 'emit'].reduce((o, k) => {
    return { ...o, [k]: (...args) => eventEmitter[k](...args) };
  }, {});

}

export { emitter };
