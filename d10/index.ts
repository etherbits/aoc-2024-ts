import {
  check2DInRange,
  straightDirs,
  vec2DAdd,
  type Vec2D,
} from "../utils/graph";
import { getLines } from "../utils/helper";

export async function p1() {
  const lines = await getLines("d10/p1.txt");
  const matrix = lines.map((line) => line.split(""));

  const scores = matrix.flatMap((line, y) =>
    line.map((char, x) => {
      if (char !== "0") return 0;
      return getTrailScore({ x, y }, matrix);
    }),
  );

  const score = scores.reduce((acc, s) => acc + s, 0);

  console.log(score);
}

export async function p2() {
  const lines = await getLines("d10/p2.txt");
  const matrix = lines.map((line) => line.split(""));

  const scores = matrix.flatMap((line, y) =>
    line.map((char, x) => {
      if (char !== "0") return 0;
      return getTrailScore({ x, y }, matrix);
    }),
  );

  const score = scores.reduce((acc, s) => acc + s, 0);

  console.log(score);
}

function getTrailScore(head: Vec2D, matrix: string[][]) {
  const q = [{ point: head, visited: new Set<string>() }];
  let score = 0;

  while (q.length) {
    const { point: curr, visited } = q.shift()!;
    const key = `${curr.x}-${curr.y}`;
    if (
      !check2DInRange(curr, { x: matrix[0].length, y: matrix.length }) ||
      visited.has(key)
    )
      continue;

    visited.add(key);

    const currLevel = +matrix[curr.y][curr.x];
    if (currLevel === 9) {
      score++;
      continue;
    }

    straightDirs.forEach((dir) => {
      const newPoint = vec2DAdd(curr, dir);
      if (!check2DInRange(newPoint, { x: matrix[0].length, y: matrix.length }))
        return;

      const newLevel = +matrix[newPoint.y][newPoint.x];

      if (newLevel !== currLevel + 1) return;
      q.push({ point: newPoint, visited: new Set(visited) });
    });
  }

  return score;
}
