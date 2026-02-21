// ConnectionExcption
export declare class ConnectionException extends Error {
  constructor(message: string);
}

// UrlException
export declare class UrlException extends Error {
  constructor(message: string);
}

// ServerException
export declare class ServerException extends Error {
  static header: string; g
  status: any; // henko yotei
  debug?: string;
  constructor(message: number, debug?: string);
}

// ServerError
