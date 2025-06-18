

export function memoizeSortBy(fn) {
  const cache = new Map();
  return (arr, key) => {
    const cacheKey = JSON.stringify(arr.map(t => t.id)) + key;
    if (cache.has(cacheKey)) return cache.get(cacheKey);
    const result = fn(arr, key);
    cache.set(cacheKey, result);
    return result;
  };
}

export function memoize(fn) {
  const cache = new Map();
  return function (...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

export function sortByNameAsc(tasks) {
  return [...tasks].sort((a, b) => a.name.localeCompare(b.name));
}

export function sortByNameDesc(tasks) {
  return [...tasks].sort((a, b) => b.name.localeCompare(a.name));
}

export function sortByDateAsc(tasks) {
  return [...tasks].sort((a, b) => a.createdAt - b.createdAt);
}

export function sortByDateDesc(tasks) {
  return [...tasks].sort((a, b) => b.createdAt - a.createdAt);
}

export function sortByPriorityAsc(tasks) {
  return [...tasks].sort((a, b) => a.priority - b.priority);
}

export function sortByPriorityDesc(tasks) {
  return [...tasks].sort((a, b) => b.priority - a.priority);
}

export default {
  memoizeSortBy,
  memoize,
  sortByNameAsc,
  sortByNameDesc,
  sortByDateAsc,
  sortByDateDesc,
  sortByPriorityAsc,
  sortByPriorityDesc,
};
