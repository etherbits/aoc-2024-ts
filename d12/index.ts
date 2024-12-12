import {
  check2DInRange,
  straightDirs,
  vec2DAdd,
  type Vec2D,
} from "../utils/graph";
import { getLines } from "../utils/helper";

export async function p1() {
  const lines = await getLines("d12/p1.txt");
  const matrix = lines.map((line) => line.split(""));
  const visited = new Map<string, Set<string>>();

  let price = 0;
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[0].length; x++) {
      const plantVisited = visited.get(matrix[y][x]) ?? new Set();
      price += calcPrice({ y, x }, matrix, plantVisited);
      visited.set(matrix[y][x], plantVisited);
    }
  }

  console.log(price);
}

export async function p2() {
  const lines = await getLines("d12/p1.txt");
  const matrix = lines.map((line) => line.split(""));
  const visited = new Map<string, Set<string>>();

  let price = 0;
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[0].length; x++) {
      const plantVisited = visited.get(matrix[y][x]) ?? new Set();
      price += calcPriceV2({ y, x }, matrix, plantVisited);
      visited.set(matrix[y][x], plantVisited);
    }
  }

  console.log(price);
}

function calcPrice(start: Vec2D, matrix: string[][], visited: Set<string>) {
  function inRange(point: Vec2D) {
    return (
      check2DInRange(point, { x: matrix[0].length, y: matrix.length }) &&
      matrix[point.y][point.x] == matrix[start.y][start.x]
    );
  }

  const q = [start];
  let area = 0;
  let perimeter = 0;

  while (q.length) {
    const curr = q.shift()!;
    const key = `${curr.x}-${curr.y}`;
    if (visited.has(key)) continue;

    if (!inRange(curr)) {
      perimeter++;
      continue;
    }

    visited.add(key);

    area++;

    straightDirs.forEach((dir) => {
      const newPoint = vec2DAdd(curr, dir);
      q.push(newPoint);
    });
  }

  return area * perimeter;
}

function calcPriceV2(start: Vec2D, matrix: string[][], visited: Set<string>) {
  function inRange(point: Vec2D) {
    return (
      check2DInRange(point, { x: matrix[0].length, y: matrix.length }) &&
      matrix[point.y][point.x] == matrix[start.y][start.x]
    );
  }

  const q: Edge[] = [{ pos: start, dir: -1 }];
  let area = 0;
  let edgeMap = new Map<number, Edge[]>();

  while (q.length) {
    const curr = q.shift()!;
    const key = `${curr.pos.x}-${curr.pos.y}`;
    if (visited.has(key)) continue;

    if (!inRange(curr.pos)) {
      edgeMap.set(curr.dir, [...(edgeMap.get(curr.dir) ?? []), curr]);
      continue;
    }

    visited.add(key);

    area++;

    straightDirs.forEach((dir, i) => {
      const newPoint = vec2DAdd(curr.pos, dir);
      q.push({ pos: newPoint, dir: i });
    });
  }

  return area * countCombinedEdges(edgeMap);
}

function countCombinedEdges(edgeMap: Map<number, Edge[]>) {
  let edgeCount = 0;

  for (const dir of edgeMap.keys()) {
    const dirEdges = edgeMap.get(dir)!;
    const groupedEdges = new Map<number, Edge[]>();

    for (let i = 0; i < dirEdges.length; i++) {
      const edge = dirEdges[i];
      if (dir == 0 || dir == 2) {
        groupedEdges.set(edge.pos.x, [
          ...(groupedEdges.get(edge.pos.x) ?? []),
          edge,
        ]);
      } else {
        groupedEdges.set(edge.pos.y, [
          ...(groupedEdges.get(edge.pos.y) ?? []),
          edge,
        ]);
      }
    }

    for (const edges of groupedEdges.values()) {
      if (dir == 0 || dir == 2) {
        edges.sort((a, b) => a.pos.y - b.pos.y);
        for (let i = 0; i < edges.length; i++) {
          if (i > 0 && Math.abs(edges[i].pos.y - edges[i - 1].pos.y) == 1) {
            continue;
          }

          edgeCount++;
        }
      } else {
        edges.sort((a, b) => a.pos.x - b.pos.x);
        for (let i = 0; i < edges.length; i++) {
          if (i > 0 && Math.abs(edges[i].pos.x - edges[i - 1].pos.x) == 1) {
            continue;
          }

          edgeCount++;
        }
      }
    }
  }

  return edgeCount;
}

type Edge = {
  dir: number;
  pos: Vec2D;
};
