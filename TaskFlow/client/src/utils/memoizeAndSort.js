// src/utils/memoizeAndSort.js

const createCacheKey = (args) => JSON.stringify(args);

/**

 * @param {Function} fn 
 * @param {Object} options
 * @param {number} options.maxSize 
 * @param {'LRU'|'LFU'|'TTL'|Function} options.policy 
 * @param {number|null} options.ttl 
 * @returns {Function}
 */
export function memoize(fn, options = {}) {
  const {
    maxSize = Infinity,
    policy = 'LRU',
    ttl = null,
  } = options;

  const cache = new Map();
  const accessCount = new Map();
  const accessTime = new Map();
  const expiryTime = new Map();

  const evict = () => {
    if (cache.size < maxSize) return;

    if (policy === 'LRU') {
      const oldestKey = [...accessTime.entries()]
        .reduce((a, b) => (a[1] < b[1] ? a : b))[0];
      [cache, accessCount, accessTime, expiryTime]
        .forEach(m => m.delete(oldestKey));

    } else if (policy === 'LFU') {
      const leastUsedKey = [...accessCount.entries()]
        .reduce((a, b) => (a[1] < b[1] ? a : b))[0];
      [cache, accessCount, accessTime, expiryTime]
        .forEach(m => m.delete(leastUsedKey));

    } else if (policy === 'TTL') {
      const now = Date.now();
      for (const [key, exp] of expiryTime.entries()) {
        if (exp <= now) {
          [cache, accessCount, accessTime, expiryTime]
            .forEach(m => m.delete(key));
        }
      }

    } else if (typeof policy === 'function') {
      policy(cache, accessCount, accessTime, expiryTime);
    }
  };

  const cleanExpired = () => {
    if (ttl === null) return;
    const now = Date.now();
    for (const [key, exp] of expiryTime.entries()) {
      if (exp <= now) {
        [cache, accessCount, accessTime, expiryTime]
          .forEach(m => m.delete(key));
      }
    }
  };

  return (...args) => {
    cleanExpired();
    const key = createCacheKey(args);

    if (cache.has(key)) {
      accessCount.set(key, (accessCount.get(key) || 0) + 1);
      accessTime.set(key, Date.now());
      return cache.get(key);
    }

    const result = fn(...args);
    evict();
    cache.set(key, result);
    accessCount.set(key, 1);
    accessTime.set(key, Date.now());
    if (ttl !== null) {
      expiryTime.set(key, Date.now() + ttl);
    }

    return result;
  };
}

//Функції сортування 
export const sortByNameAsc =  (tasks) =>
  [...tasks].sort((a, b) => a.title.localeCompare(b.title));

export const sortByNameDesc = (tasks) =>
  [...tasks].sort((a, b) => b.title.localeCompare(a.title));

export const sortByDateAsc =  (tasks) =>
  [...tasks].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

export const sortByDateDesc = (tasks) =>
  [...tasks].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

export const sortByColor =    (tasks) =>
  [...tasks].sort((a, b) => {
    const ca = a.color ?? '#ffffff';
    const cb = b.color ?? '#ffffff';
    return ca.localeCompare(cb);
  });

const SORT_MAP = {
  'title-asc':  sortByNameAsc,
  'title-desc': sortByNameDesc,
  'date-asc':   sortByDateAsc,
  'date-desc':  sortByDateDesc,
  'color':      sortByColor,
};

const memoizeAndSort = memoize(
  (tasks = [], sortOrder = 'date-desc') => {
    const sorter = SORT_MAP[sortOrder] || sortByDateDesc;
    return sorter(tasks);
  },
  {
    maxSize: 50,       
    policy: 'LRU',     
    ttl:    5 * 60_000 
  }
);

export default memoizeAndSort;
