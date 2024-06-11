export function getRandomSortedValues<T>(
  length: number,
  callback: (_: unknown, index: number) => T
): Array<T> {
  const values = Array.from({ length }, callback);

  for (let i = values.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = values[i];
    values[i] = values[j];
    values[j] = temp;
  }

  return values;
}
