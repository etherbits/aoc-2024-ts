import { getLines } from "../utils/helper";

export async function p1(n = 25) {
  const lines = await getLines("d11/p1.txt");

  const count = multiTransformArrangement(lines[0], n);
  console.log(count);
}

export async function p2() {
  p1(75);
}

function multiTransformArrangement(stonesStr: string, n: number) {
  const cache = new Map<string, number>();
  let stones = stonesStr.split(" ").map((x) => parseInt(x));

  let count = stones.reduce(
    (acc, stone) => acc + recTransformStone(stone, n, cache),
    0,
  );

  return count;
}

function recTransformStone(
  stone: number,
  n: number,
  cache: Map<string, number>,
): number {
  if (n == 0) {
    return 1;
  }
  const key = `${stone}-${n}`;
  if (cache.has(key)) {
    return cache.get(key)!;
  }

  const transformedStones = transformStone(stone);

  const count = transformedStones.reduce(
    (acc, transformedStone) =>
      acc + recTransformStone(transformedStone, n - 1, cache),
    0,
  );

  cache.set(key, count);

  return count;
}

function transformStone(stone: number) {
  if (stone === 0) return [1];

  const len = `${stone}`.length;
  if (len % 2 === 0) {
    const cut = Math.pow(10, len / 2);
    return [Math.floor(stone / cut), stone % cut];
  }

  return [stone * 2024];
}
