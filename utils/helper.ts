export async function getLines(relPath: string) {
  const file = Bun.file(relPath);

  const text = await file.text();
  const lines = text.split("\n");
  lines.pop();

  return lines;
}

export function compareNums(a: number, b: number) {
  return a - b;
}
