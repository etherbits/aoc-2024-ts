import { sleep } from "bun";
import {
  check2DInRange,
  straightDirs,
  vec2DAdd,
  vec2DEq,
  vec2DNeg,
  vec2DSub,
  type Vec2D,
} from "../utils/graph";
import { getLines } from "../utils/helper";

export async function p1() {
  const lines = await getLines("d16/p1.txt");
  const matrix: Matrix = lines.map((line) => line.split("") as Cell[]);
  const [s, e] = getPoints(matrix);

  const minScore = weightedBfs(s, e, matrix);

  console.log("min score: ", minScore);
}

export async function p2() {
  const lines = await getLines("d16/p1.txt");
  const matrix: Matrix = lines.map((line) => line.split("") as Cell[]);
  const [s, e] = getPoints(matrix);

  const minScore = weightedBfsV2(s, e, matrix);

  console.log("min score: ", minScore);
}

function weightedBfs(s: Vec2D, e: Vec2D, matrix: Matrix) {
  const visited = new Set<string>();
  const paths: Path[] = [
    { score: 0, head: s, prev: vec2DAdd(s, { x: -1, y: 0 }) },
  ];

  while (paths.length) {
    loadNextPath(paths);
    const curr = paths.shift()!;
    const key = `${curr.head.y}-${curr.head.x}`;

    if (
      !check2DInRange(curr.head, { x: matrix[0].length, y: matrix.length }) ||
      visited.has(key) ||
      matrix[curr.head.y][curr.head.x] === "#"
    ) {
      continue;
    }

    visited.add(key);

    if (vec2DEq(curr.head, e)) {
      return curr.score;
    }

    straightDirs.forEach((dir) => {
      const newHead = vec2DAdd(curr.head, dir);
      const updatedPath: Path = {
        score: calcScore(newHead, curr.head, curr.prev, curr.score),
        head: newHead,
        prev: curr.head,
      };

      paths.push(updatedPath);
    });
  }

  return -1;
}

function getBestPath(
  s: Vec2D,
  e: Vec2D,
  matrix: Matrix,
): [Map<string, number>, number] {
  const visited = new Map<string, number>();
  const paths: Path[] = [
    { score: 0, head: s, prev: vec2DAdd(s, { x: -1, y: 0 }) },
  ];

  while (paths.length) {
    loadNextPath(paths);
    const curr = paths.shift()!;
    const key = `${curr.head.y}-${curr.head.x}`;

    if (
      !check2DInRange(curr.head, { x: matrix[0].length, y: matrix.length }) ||
      visited.has(key) ||
      matrix[curr.head.y][curr.head.x] === "#"
    ) {
      continue;
    }

    visited.set(key, curr.score);

    if (vec2DEq(curr.head, e)) {
      return [visited, curr.score];
    }

    straightDirs.forEach((dir) => {
      const newHead = vec2DAdd(curr.head, dir);
      const updatedPath: Path = {
        score: calcScore(newHead, curr.head, curr.prev, curr.score),
        head: newHead,
        prev: curr.head,
      };

      paths.push(updatedPath);
    });
  }

  return [visited, -1];
}

function weightedBfsV2(s: Vec2D, e: Vec2D, matrix: Matrix) {
  const paths: PathV2[] = [
    {
      score: 0,
      head: s,
      prev: vec2DAdd(s, { x: -1, y: 0 }),
      visited: new Set(),
    },
  ];
  let [bestVisited, bestScore] = getBestPath(s, e, matrix);
  let tileSet = new Set();

  while (paths.length) {
    loadNextPath(paths);
    const curr = paths.shift()!;
    const key = `${curr.head.y}-${curr.head.x}`;

    if (
      (bestScore >= 0 && bestScore < curr.score) ||
      (bestVisited.get(key) ?? -1) < curr.score - TURN_COST ||
      curr.visited.has(key) ||
      matrix[curr.head.y][curr.head.x] === "#"
    ) {
      continue;
    }
    curr.visited.add(key);

    if (vec2DEq(curr.head, e)) {
      if (curr.score === bestScore) {
        tileSet = new Set([...tileSet, ...curr.visited]);
      }

      if (curr.score > bestScore) {
        break;
      }
    }

    straightDirs.forEach((dir) => {
      const newHead = vec2DAdd(curr.head, dir);
      const updatedPath: PathV2 = {
        score: calcScore(newHead, curr.head, curr.prev, curr.score),
        head: newHead,
        prev: curr.head,
        visited: new Set(curr.visited),
      };

      paths.push(updatedPath);
    });
  }

  return tileSet.size;
}

const TURN_COST = 1000;
const MOVE_COST = 1;

function calcScore(next: Vec2D, curr: Vec2D, prev: Vec2D, currScore: number) {
  let score = MOVE_COST;
  const prevDir = vec2DSub(curr, prev);
  const nextDir = vec2DSub(next, curr);

  if (!vec2DEq(prevDir, nextDir)) {
    score += TURN_COST;
  }

  return score + currScore;
}

function getPoints(matrix: Matrix) {
  let start = { y: -1, x: -1 };
  let end = { y: -1, x: -1 };

  matrix.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell === "S") start = { y, x };
      if (cell === "E") end = { y, x };
    });
  });

  return [start, end];
}

function loadNextPath(paths: Path[]) {
  const minIdx = paths.reduce((acc, curr, idx) => {
    if (paths[acc].score > curr.score) return idx;
    return acc;
  }, 0);

  paths.unshift(paths.splice(minIdx, 1)[0]);
}

type Cell = "#" | "." | "S" | "E";
type Matrix = Cell[][];
type Path = { score: number; head: Vec2D; prev: Vec2D };
type PathV2 = {
  score: number;
  head: Vec2D;
  prev: Vec2D;
  visited: Set<string>;
};
