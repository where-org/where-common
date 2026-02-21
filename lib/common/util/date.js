const date = {

  iso8601: /^\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d(\.\d+)?([+-][0-2]\d:[0-5]\d|Z)$/,

  isIsoString: (v) => {
    return (v && v.match && v.match(date.iso8601)) ? true : false;
  },

  isString: (v) => {
    return (date.isIsoString(v) || typeof v === 'string' && isNaN(v) && !isNaN(new Date(v).getDate())) ? true : false;
  },

  isDate: (v) => {
    return v instanceof Date || Object.prototype.toString.call(v) === '[object Date]'
  },

  string: (v) => {
    return new Intl.DateTimeFormat('ja-jp', {
      year: 'numeric', month : '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'
    }).format(v).replace(/\//g, '-');
  }

};

export { date };
