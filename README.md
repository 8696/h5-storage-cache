# h5-storage-cache


#### 安装
##### (c)npm install h5-storage-cache -D

 
#### 使用
##### Browser
```javascript
  <script src="dist/h5-storage-cache.min.js"></script>
  
   let h5StorageCache = new H5StorageCache({
      /**
       * @description 存储类型，可选择 localStorage 、sessionStorage
       * @default localStorage
       * */
      storage: localStorage,
      /**
       * @description 过期时间 (ms)
       * @default -1 永久
       * */
      expireTime: -1,
      /**
       * @description 前缀
       * @default cache_
       * */
      prefix: 'prefix_'
    });
  
```
##### vue
```javascript

  import H5StorageCache from 'h5-storage-cache';

```
##### API

```javascript
 /**
   *
   * @property 配置
   * config: object
   *
   * @preserve 存储类型
   * storage: object
   *
   * @method 获取配置
   * getConfig(): object
   *
   * @method 设置缓存
   * set(key: string, value: any, expireTime?: number): void;
   *
   * @method 获取指定 key 缓存
   * get(key: string): any
   *
   * @method 判断指定 key 是否存在
   * has(key: string): boolean
   *
   * @method 指定 key 是否已经过期
   * isExpire(key: string): boolean
   *
   * @method 移除指定 key
   * remove(key: string): void
   *
   * @method 清除所有缓存
   * clear(): void
   *
   * @method 获取缓存的数量
   * getLength(): number
   *
   * @method 获取缓存的所有 key
   * getKeys(): string[]
   *
   * @method 获取所有缓存
   * getAll(): object[]
   *
   * @method 清除已经过期的缓存
   * clearExpire(): void
   * 
   * @method 获取指定 key 的信息
   * getInfo(key: string): object
   *
   * */

```

