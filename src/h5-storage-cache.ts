import * as utils from './utils';

interface StorageInterface {
  /**
   * Returns the number of key/value pairs currently present in the list associated with the object.
   */
  readonly length: number;

  /**
   * Empties the list associated with the object of all key/value pairs, if there are any.
   */
  clear(): void;

  /**
   * Returns the current value associated with the given key, or null if the given key does not exist in the list associated with the object.
   */
  getItem(key: string): string | null;

  /**
   * Returns the name of the nth key in the list, or null if n is greater than or equal to the number of key/value pairs in the object.
   */
  key(index: number): string | null;

  /**
   * Removes the key/value pair with the given key from the list associated with the object, if a key/value pair with the given key exists.
   */
  removeItem(key: string): void;

  /**
   * Sets the value of the pair identified by key to value, creating a new key/value pair if none existed for key previously.
   *
   * Throws a "QuotaExceededError" DOMException exception if the new value couldn't be set. (Setting could fail if, e.g., the user has disabled storage for the site, or if the quota has been exceeded.)
   */
  setItem(key: string, value: string): void;

  [name: string]: any;
}

interface CacheInterface {
  /**
   * @description 配置
   * */
  config: ConfigInterface

  /**
   * @description 存储类型
   * */
  storage: object

  /**
   * @description 获取配置
   * */
  getConfig(): object

  /**
   * @description 生成 key string
   * */
  makeKey(inputKey: string): string

  /**
   * @description 解析 input key
   * */
  parseInputKey(storageKey: string): string
}

interface ConfigInterface {
  /**
   * @description 存储类型
   * */
  storage: StorageInterface
  /**
   * @description 过期时间 (ms)
   * */
  expireTime: number
  /**
   * @description 前缀
   * */
  prefix: string
}

interface H5StorageCacheInterface {
  /**
   * @description 设置缓存
   * */
  set(key: string, value: any, expireTime?: number): void;

  /**
   * @description 获取指定 key 缓存
   * */
  get(key: string): any

  /**
   * @description 判断指定 key 是否存在
   * */
  has(key: string): boolean

  /**
   * @description 指定 key 是否已经过期
   * */
  isExpire(key: string): boolean

  /**
   * @description 移除指定 key
   * */
  remove(key: string): void

  /**
   * @description 清除所有缓存
   * */
  clear(): void

  /**
   * @description 获取缓存的数量
   * */
  getLength(): number

  /**
   * @description 获取缓存的所有 key
   * */
  getKeys(): string[]

  /**
   * @description 获取所有缓存
   * */
  getAll(): object[]

  /**
   * @description 清除已经过期的缓存
   * */
  clearExpire(): void
}

interface DataInterface {
  /**
   * @description 过期时间
   * */
  expireTime: number
  /**
   * @description 值
   * */
  value: any

  /**
   * @description 将本对象转成适合存储的 json
   * */
  toStorageJson(): string

  /**
   * @description 获取缓存值
   * */
  getValue(): string | null

  /**
   * @description 获取本对象是否已经过期
   * */
  isExpire(): boolean

}

class Data implements DataInterface {
  constructor(key, value, expireTime) {
    this.key = key;
    this.value = value;
    this.expireTime = expireTime;
  }

  expireTime: number;
  value: any;
  key: string;

  toStorageJson(): string {
    if (this.expireTime !== -1) {
      this.expireTime = new Date().getTime() + this.expireTime;
    }
    let json = JSON.parse(JSON.stringify(this));
    delete json.key;
    return JSON.stringify(json);
  }

  getValue(): string | null {
    if (this.isExpire()) {
      return this.value;
    }
    return null;
  }

  isExpire(): boolean {
    return new Date().getTime() < this.expireTime || this.expireTime === -1;
  }
}

class Cache implements CacheInterface {
  constructor(options: ConfigInterface) {
    let defaultConfig: ConfigInterface = {
      expireTime: -1,
      prefix: 'cache_',
      storage: window.localStorage,
    };
    !options && (options = defaultConfig);
    this.storage = options.storage || window.localStorage;
    this.config = Object.assign(defaultConfig, options);
  }

  /**
   * @description 配置
   * */
  config: ConfigInterface;
  /**
   * @description 存储方式
   * */
  storage: StorageInterface;

  /**
   * @description 获取配置文件
   * */
  getConfig(): object {
    return this.config;
  }


  makeKey(inputKey: string): string {
    return this.config.prefix + inputKey;
  }


  parseInputKey(storageKey: string): string {
    return storageKey.replace(new RegExp(`^` + this.config.prefix), '');
  }
}

class H5StorageCache extends Cache implements H5StorageCacheInterface {
  constructor(options: ConfigInterface) {
    super(options);
  }

  set(key: string, value: any, expireTime?: number): void {
    if (!['string'].includes(utils.valueType(key))) {
      throw new Error('Key can only be a \'string\'');
    }
    if (!['string', 'number', 'array', 'object'].includes(
      utils.valueType(value)
    )) {
      throw new Error('Value can only be a \'string\'、' +
        ' \'number、\' \'object\' and \'array\'');
    }
    if (expireTime !== undefined) {
      if (!['number'].includes(utils.valueType(expireTime))) {
        throw new Error('Expiration time can only be a \'number\'');
      }
    }
    !expireTime && (expireTime = this.config.expireTime);
    this.storage.setItem(this.makeKey(key), new Data(key, value, expireTime).toStorageJson());

  }

  get(key: string): any {
    if (!['string'].includes(utils.valueType(key))) {
      throw new Error('Key can only be a \'string\'');
    }
    let storageData: string | null = this.storage.getItem(this.makeKey(key));
    if (storageData === null) {
      return null;
    }
    let objStorageData = JSON.parse(storageData);
    return new Data(key, objStorageData.value, objStorageData.expireTime).getValue();
  }

  has(key: string): boolean {
    let storageData: string | null = this.storage.getItem(this.makeKey(key));
    if (storageData === null) {
      return false;
    }
    let objStorageData = JSON.parse(storageData);
    return new Data(key, objStorageData.value, objStorageData.expireTime).isExpire();
  }

  isExpire(key: string): boolean {
    let storageData: string | null = this.storage.getItem(this.makeKey(key));
    if (storageData === null) {
      return false;
    }
    let objStorageData = JSON.parse(storageData);
    return new Data(key, objStorageData.value, objStorageData.expireTime).isExpire();
  }

  remove(key: string): void {
    if (!['string'].includes(utils.valueType(key))) {
      throw new Error('Key can only be a \'string\'');
    }
    this.storage.removeItem(this.makeKey(key));
  }


  clear(): void {
    let keys: string[] = this.getKeys();
    keys.forEach(key => {
      this.storage.removeItem(key);
    });
  }

  getLength(): number {
    return this.getKeys().length;
  }

  getKeys(): string[] {
    let keys: string[] = [];
    for (let i = 0; i < this.storage.length; i++) {
      let key: string | null = this.storage.key(i);
      if (key !== null && new RegExp(`^` + this.config.prefix).test(key)) {
        keys.push(key);
      }
    }
    return keys;
  }

  getAll(): object[] {
    let keys = this.getKeys();
    let array: object[] = [];
    keys.forEach(key => {
      key = this.parseInputKey(key);
      let value = this.get(key);
      if (value !== null) {
        array.push({
          key: key,
          value: value
        });
      }
    });
    return array;
  }

  clearExpire(): void {
    let keys = this.getKeys();
    keys.forEach(key => {
      key = key.replace(new RegExp(`^` + this.config.prefix), '');
      if (!this.isExpire(key)) {
        this.remove(key);
      }
    });
  }
}

export default H5StorageCache;



