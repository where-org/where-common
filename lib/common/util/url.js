import { UrlException } from '../../exception.js';

const socket = {

  parse: (string) => {
    const split = new URL(string).pathname.split('/').filter(v => v);

    const lastIndex = split.length - 1,
          userIndex = (split[lastIndex].match(':')) ? lastIndex - 1 : lastIndex;

    const [app, group, user] = [...Array(3)].map((v, i) => split[userIndex - i]).reverse();

    const option = (lastIndex === userIndex) ? {} : split[lastIndex].split(',').reduce((o, v1) => {
      const [k, v] = v1.split(':');
      return { ...o, [k]: v };
    }, {});

    return { url: string, app, group, user, ...option };
  },

  string: (pre) => {
    const { url, group, user, ...option } = pre;

    const optionString = Object.entries(option).map(([k, v]) => {
      return [k, v].join(':');
    }).join(',');

    const [app] = url.replace(/\/?$/, '').split('/').reverse();
    return { url: [url, group, user, optionString].join('/'), app, group, user, ...option };
  },

  either: (config) => {
    const { url, group, user, ...option } = config;

    try {
      return (group && user) ? socket.string(config) : socket.parse(url);

    } catch (err) {

      throw (err instanceof TypeError)
        ? new UrlException((url) ? `"${url}" invalid URL` : '"url" undefined')
        : err;
    }

  }

};

const url = { socket };
export { url };
