import type { DataObject } from './da.js';

// lib/common/file/config.js

type Mode = 'development' | 'staging' | 'production';

export type CommonFileConfigLoad = <T>(load: string, mode: Mode, name: string, ignore?: boolean) => Promise<T>;

export type CommonFileConfig = {
  load: CommonFileConfigLoad,
};

// lib/common/file/read.js

export type CommonFileReadJson = <T>(src: string) => Promise<T>;
export type CommonFileReadYaml = <T>(src: string) => Promise<T>;

export type CommonFileRead = {
  json: CommonFileReadJson,
  yaml: CommonFileReadYaml,
};

// lib/common/file/index.js

export type CommonFile = {
  config: CommonFileConfig,
  read  : CommonFileRead,
};

// lib/common/init/credential.js

export type Credential<T = DataObject> = T;
// ato de yoi kanji ni shusei shimasu.
export type RequestStaticCredential = <T>() => Promise<Credential<T>>;
export type RequestCredential = <T>(key: string) => Promise<Credential<T>>;

export type Credentials = {
  module: string, keys: string[], [key: string]: any,

  requestStaticCredential: RequestStaticCredential,
  requestCredential: RequestCredential,
};

export type CommonInitCredential = <T, U>(config: T, dep: U) => Promise<Credentials>;

// lib/common/init/emitter.js

export type On = (event: string, ...args: any[]) => void;
export type Off = (event: string, ...args: any[]) => void;
export type Once = (event: string, ...args: any[]) => void;
export type Emit = (event: string, ...args: any[]) => boolean;

export type Emitter = {
  on: On, off: Off, once: Once, emit: Emit,
};

export type CommonInitEmitter = () => Emitter;

// lib/common/init/log.js

export type Log = <T>(o: T) => void;
export type CommonInitLog = <T>(label: T, indent?: boolean, out?: 'log' | 'error') => Log;

// lib/common/init/index.js

export type CommonInit = {
  credential: CommonInitCredential, emitter: CommonInitEmitter, log: CommonInitLog,
};

// lib/common/util/cast.js

export type CommonUtilCast = (value: string) => Date | string;

// lib/common/util/date.js

export type CommonUtilDateIso8601 = string;

export type CommonUtilDateIsIsoString = (v: string) => boolean;
export type CommonUtilDateIsString = (v: string) => boolean;
export type CommonUtilDateIsDate = (v: Date | string) => boolean;
export type CommonUtilDateString = (v: Date) => string;

export type CommonUtilDate = {
  iso8601: CommonUtilDateIso8601,

  isIsoString: CommonUtilDateIsIsoString,
  isString: CommonUtilDateIsString,
  isDate: CommonUtilDateIsDate,
  string: CommonUtilDateString,
};

// lib/common/util/format.js

export type CommonUtilFormatPascal = (word: string) => string;
export type CommonUtilFormatCamel = (word: string) => string;
export type CommonUtilFormatSnake = (word: string) => string;
export type CommonUtilFormatKebab = (word: string) => string;
// pascal 
export type CommonUtilFormatPascalToCamel = (word: string) => string;
export type CommonUtilFormatPascalToSnake = (word: string) => string;
export type CommonUtilFormatPascalToKebab = (word: string) => string; 
// camel
export type CommonUtilFormatCamelToPascal = (word: string) => string;
export type CommonUtilFormatCamelToSnake = (word: string) => string;
export type CommonUtilFormatCamelToKebab = (word: string) => string; 
// snake
export type CommonUtilFormatSnakeToPascal = (word: string) => string;
export type CommonUtilFormatSnakeToCamel = (word: string) => string;
export type CommonUtilFormatSnakeToKebab = (word: string) => string;
// kebab
export type CommonUtilFormatKebabToPascal = (word: string) => string;
export type CommonUtilFormatKebabToCamel = (word: string) => string;
export type CommonUtilFormatKebabToSnake = (word: string) => string;
// keys
export type CommonUtilFormatPascalKeys = <T, U>(data: T) => U;
export type CommonUtilFormatCamelKeys = <T, U>(data: T) => U;
export type CommonUtilFormatSnakeKeys = <T, U>(data: T) => U;
export type CommonUtilFormatKebabKeys = <T, U>(data: T) => U;

export type CommonUtilFormat = {
  // case
  pascal: CommonUtilFormatPascal,
  camel: CommonUtilFormatCamel,
  snake: CommonUtilFormatSnake,
  kebab: CommonUtilFormatKebab,
  // pascal 
  pascalToCamel: CommonUtilFormatPascalToCamel,
  pascalToSnake: CommonUtilFormatPascalToSnake,
  pascalToKebab: CommonUtilFormatPascalToKebab,
  // camel
  camelToPascal: CommonUtilFormatCamelToPascal,
  camelToSnake: CommonUtilFormatCamelToSnake,
  camelToKebab: CommonUtilFormatCamelToKebab,
  // snake
  snakeToPascal: CommonUtilFormatSnakeToPascal,
  snakeToCamel: CommonUtilFormatSnakeToCamel,
  snakeToKebab: CommonUtilFormatSnakeToKebab,
  // kebab
  kebabToPascal: CommonUtilFormatKebabToPascal,
  kebabToCamel: CommonUtilFormatKebabToCamel,
  kebabToSnake: CommonUtilFormatKebabToSnake,
  // keys
  pascalKeys: CommonUtilFormatPascalKeys,
  camelKeys: CommonUtilFormatCamelKeys,
  snakeKeys: CommonUtilFormatSnakeKeys,
  kebabKeys: CommonUtilFormatKebabKeys,
};

// lib/common/util/url.js

export type SocketUrlString = string;

export type SocketUrlConfig = {
  url: string, [option: string]: string,
};

export type SocketUrlPreObject = {
  url: string, group: string, user: string, [option: string]: string,
};

export type SocketUrlObject = SocketUrlPreObject & {app: string};

export type CommonUtilUrlSocketParse = (string: SocketUrlString) => SocketUrlObject;
export type CommonUtilUrlSocketString = (object: SocketUrlPreObject) => SocketUrlObject;
export type CommonUtilUrlSocketEither = (config: SocketUrlConfig) => SocketUrlObject;

export type CommonUtilUrlSocket = {
  parse: CommonUtilUrlSocketParse,string: CommonUtilUrlSocketString, either: CommonUtilUrlSocketEither,
};

export type CommonUtilUrl = {
  socket: CommonUtilUrlSocket,
};

// lib/common/util/index.js

export type CommonUtil = {
  cast: CommonUtilCast, date: CommonUtilDate, format: CommonUtilFormat, url: CommonUtilUrl,
};

// lib/common/index.js

export type Common = {
  file: CommonFile, init: CommonInit, util: CommonUtil,
};

// const
export declare const common: Common;
