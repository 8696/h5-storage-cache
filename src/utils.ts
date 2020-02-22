export function valueType(value: any): any {
  let type = {
    '[object Number]': 'number',
    '[object String]': 'string',
    '[object Array]': 'array',
    '[object Object]': 'object',
    '[object Function]': 'function',
    '[object Undefined]': 'undefined',
    '[object Null]': 'null',
    '[object Boolean]': 'boolean',
    '[object Set]': 'set',
    '[object Map]': 'map',
  };

  return type[Object.prototype.toString.call(value)];

}

export function parseDateTime(options = {format: null, timestamp: null}) {
  // @ts-ignore
  !options.format && (options.format = 'y-m-d h:i:s');
  !options.timestamp && (options.timestamp = null);
  const date = options.timestamp === null ? new Date() : new Date(Number(options.timestamp)),
    y = date.getFullYear(), m = date.getMonth() + 1,
    d = date.getDate(), h = date.getHours(),
    i = date.getMinutes(), s = date.getSeconds();
  // @ts-ignore
  return options.format
    .replace(/y/g, y).replace(/m/g, m < 10 ? '0' + m : m)
    .replace(/d/g, d < 10 ? '0' + d : d).replace(/h/g, h < 10 ? '0' + h : h)
    .replace(/i/g, i < 10 ? '0' + i : i).replace(/s/g, s < 10 ? '0' + s : s);
}
