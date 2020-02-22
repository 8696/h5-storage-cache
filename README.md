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

