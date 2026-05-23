/* regaiteki ni class wo shiyo shiteiru, reigai dakenine. */

import { status } from './define.js';

class ConfigurationException extends Error {

  constructor(message, options) {

    super(message, options);

    Object.defineProperty(this, 'name', {
      value: this.constructor.name,
      configurable: true,
      enumerable: false,
      writable: true,
    });

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ConfigurationException);
    }

  }

}

class ConnectionException extends Error {

  constructor(message, options) {

    super(message, options);

    Object.defineProperty(this, 'name', {
      value: this.constructor.name,
      configurable: true,
      enumerable: false,
      writable: true,
    });

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ConnectionException);
    }

  }

}

class UrlException extends Error {

  constructor(message, options) {

    super(message, options);

    Object.defineProperty(this, 'name', {
      value: this.constructor.name,
      configurable: true,
      enumerable: false,
      writable: true,
    });

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, UrlException);
    }

  }

}

class ServerException extends Error {

  static header = 'X-Where-Server-Exception';

  constructor(number, debug = null, options) {

    const code = Object.fromEntries(Object.values(status).map(v => [v.number, v]))[number];

    if (!code) {
      throw new RangeError(`Invalid "number" argument: "${number}" is not a known status code`);
    }

    super(code.message, options);

    this.status = { code };
    this.debug = debug;

    if (options) {
      Object.entries(options).forEach(([k, v]) => this[k] = v);
    }

    Object.defineProperty(this, 'name', {
      value: this.constructor.name,
      configurable: true,
      enumerable: false,
      writable: true,
    });

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ServerException);
    }

  }

}

class ServerError extends Error {

  static header = 'X-Where-Server-Error';

  constructor(number, debug = null, options) {

    const code = Object.fromEntries(Object.values(status).map(v => [v.number, v]))[number];

    if (!code) {
      throw new RangeError(`Invalid "number" argument: "${number}" is not a known status code`);
    }

    super(code.message, options);

    this.status = { code };
    this.debug = debug;

    if (options) {
      Object.entries(options).forEach(([k, v]) => this[k] = v);
    }

    Object.defineProperty(this, 'name', {
      value: this.constructor.name,
      configurable: true,
      enumerable: false,
      writable: true,
    });

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ServerError);
    }

  }

}

export { ConfigurationException, ConnectionException, UrlException, ServerException, ServerError };
