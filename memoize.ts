type MemoCache = { [key: string]: any };

function memoize<T extends (...args: any[]) => any>(func: T): T {
  const cache: MemoCache = {};

  function memoizedFunc(...args: Parameters<T>): ReturnType<T> {
    const key = JSON.stringify(args);

    if (cache.hasOwnProperty(key)) {
      return cache[key];
    }

    const result = func(...args);
    cache[key] = result;
    return result;
  }

  return memoizedFunc as T;
}
