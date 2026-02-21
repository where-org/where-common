const multipartFormDataKey = 'where-data-json',
      filesKey = 'where-data-files';

const status = {
  // 400
  code400: { number: 400, message: '400 Bad Request' },
  code401: { number: 401, message: '401 Unauthorized' },
  code403: { number: 403, message: '403 Forbidden' },
  code404: { number: 404, message: '404 Not Found' },
  code405: { number: 405, message: '405 Method Not Allowed' },
  code413: { number: 413, message: '413 Payload Too Large' },
  code418: { number: 418, message: "418 I'm a teapot" },
  code451: { number: 451, message: '451 Unavailable For Legal Reasons' },
  // 500
  code500: { number: 500, message: '500 Internal Server Error' },
  code501: { number: 501, message: '501 Not Implemented' },
  code502: { number: 502, message: '502 Bad Gateway' },
  code503: { number: 503, message: '503 Service Unavailable' },
  code504: { number: 504, message: '504 Gateway Timeout' },
};

export { multipartFormDataKey, filesKey, status };
