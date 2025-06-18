// Async generator — імітує надходження задач по одній
export async function* simulateTaskStream(count = 100) {
  for (let i = 0; i < count; i++) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    yield {
      id: Date.now() + i,
      name: `Задача ${i + 1}`,
      description: `Автоматично згенерована задача ${i + 1}`,
      priority: (i % 3) + 1,
      color: randomColor(),
      createdAt: Date.now() + i,
    };
  }
}

function randomColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0")}`;
}