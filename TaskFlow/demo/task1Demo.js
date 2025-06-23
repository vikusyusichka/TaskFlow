import { randomColorGenerator } from "../libs/colorGenerator.js";
import { runWithTimeout } from "../libs/timeoutIterator.js";

async function demo() {
  const gen = randomColorGenerator();
  await runWithTimeout(gen, 5, (c) => console.log("🔁", c));
}

demo();
