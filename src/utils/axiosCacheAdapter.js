/**
 * 参考axios-extensions库
 * 缓存get请求
 */
import LRUCache from 'lru-cache';
import { buildKey, getUrlPath } from './url'

const THREE_MINUTES = 1000 * 60 * 3;

const clearCacheAdapter = (adapter, options) => {
    options = {
        cacheEnabledByDefault: false, // 默认是否开启缓存
        enableCacheFlag: 'cache', // 开启缓存flag
        clearCacheFlag: 'clearCache', // 删除路径下的缓存flag
        maxAge: THREE_MINUTES,
        ...options
    }
    const { clearCacheFlag, enableCacheFlag, cacheEnabledByDefault } = options

    const cache = new LRUCache({ maxAge: options.maxAge }) // 缓存保存在内存中

    // 将请求传给上一个adapter，获得响应后保存起来 
    const requestAndStoreCache = (index, config) => {
        const responsePromise = (async () => {
            try {
                const response = await adapter(config)
                cache.set(index, Promise.resolve(response))
                return { ...response }

            } catch (error) {
                cache.del(index)
                return Promise.reject(error)
            }

        })()

        // 暂不清楚为什么这里还要存储多一次
        cache.set(index, responsePromise)
        return responsePromise
    }

    // 删除路径下的所有缓存，比如path为/user, 会删除以下缓存：/user, /user?page=1, /user?page=1&per_page=20          
    const removeCache = (url) => {
        let urlPath = getUrlPath(url)

        cache.forEach((value, key) => {
            if (key.startsWith(urlPath) != -1) {
                cache.del(key)
            }
        })
    }

    return config => {
        const useCache = config[enableCacheFlag] !== void 0 ? config[enableCacheFlag] : cacheEnabledByDefault;
        if (config.method !== 'get' || !useCache) {
            return adapter(config)
        }

        if (config[clearCacheFlag]) {
            removeCache(config.url)
        }

        const { url, method, params } = config;
        const index = buildKey(url, params);

        let responsePromise = cache.get(index);
        if (!responsePromise) {
            return requestAndStoreCache(index, config)
        }

        if (process.env.NODE_ENV !== 'production') {
            // eslint-disable-next-line no-console
            console.info(`request cached by cache adapter: ${index}`);
        }
        return responsePromise

    }

}
export default clearCacheAdapter