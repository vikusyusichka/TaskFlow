

// 1. Callback-based filterMap
export function asyncFilterMapCallback(array, asyncFn, done) {
  let result = [];
  let count = 0;
  let hasError = false;

  array.forEach((item, index) => {
    asyncFn(item, (err, value) => {
      if (hasError) return;
      if (err) {
        hasError = true;
        return done(err);
      }
      if (value !== undefined) result.push(value);
      count++;
      if (count === array.length) done(null, result);
    });
  });
}

// 2. Promise-based filterMap
export function asyncFilterMapPromise(array, asyncFn) {
  return Promise.all(array.map(asyncFn)).then(results =>
    results.filter(val => val !== undefined)
  );
}

// 3. Async/Await filterMap
export async function asyncFilterMap(array, asyncFn) {
  const results = await Promise.all(array.map(asyncFn));
  return results.filter(val => val !== undefined);
}

// 4. Abortable filterMap
export async function asyncFilterMapAbortable(array, asyncFn, signal) {
  const results = [];
  for (const item of array) {
    if (signal?.aborted) throw new Error("Aborted");
    const value = await asyncFn(item);
    if (value !== undefined) results.push(value);
  }
  return results;
}