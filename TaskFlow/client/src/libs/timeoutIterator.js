
export async function runWithTimeout(iterator, seconds, onValue) {
  const end = Date.now() + seconds * 1000;
  for await (const value of iterator) {
    if (Date.now() > end) break;
    onValue(value);
    await new Promise((res) => setTimeout(res, 500));
  }
}
