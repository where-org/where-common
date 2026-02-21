import { status } from './define.js';

class ConnectionException extends Error {

  constructor(message, ...options) {

    super(message, ...options);

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

  constructor(message, ...options) {

    super(message, ...options);

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

  constructor(message, debug = null, ...options) {

    const code = Object.values(status).reduce((o, v) => ({ [v.number]: v, ...o }), {})[message];

    if (!code) {
      throw new Error('Invalid "ServerException" argument');
    }

    super(code.message, ...options);

    this.status = { code };
    this.debug = debug;

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

  constructor(message, debug = null, ...options) {

    const code = Object.values(status).reduce((o, v) => ({ [v.number]: v, ...o }), {})[message];

    if (!code) {
      throw new Error('Invalid "ServerException" argument');
    }

    super(code.message, ...options);

    this.status = { code };
    this.debug = debug;

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

export { ConnectionException, UrlException, ServerException, ServerError };
