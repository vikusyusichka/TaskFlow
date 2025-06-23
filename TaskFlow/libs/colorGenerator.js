
function getRandomColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0")}`;
}

// Генератор випадкових кольорів
export function* randomColorGenerator() {
  while (true) {
    yield getRandomColor();
  }
}

