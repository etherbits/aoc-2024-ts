import { vec2DAdd, type Vec2D } from "../utils/graph";
import { getLines } from "../utils/helper";

export async function p1() {
  const lines = await getLines("d15/p1.txt");
  const [matrix, moves] = readData(lines);

  let robotPos = findRobot(matrix);
  for (const move of moves) {
    robotPos = moveRobot(robotPos, move, matrix);
  }
  const boxScore = calcBoxScore(matrix);

  console.log("box score: ", boxScore);
}

export async function p2() {
  const lines = await getLines("d15/p1.txt");
  const [unscaledMap, moves] = readData(lines);
  const matrix = scaleMap(unscaledMap);

  let robotPos = findRobot(matrix);
  for (const move of moves) {
    robotPos = moveRobotV2(robotPos, move, matrix);
  }
  console.log(matrix.map((row) => row.join("")).join("\n"));

  const boxScore = calcBoxScore(matrix);

  console.log("box score: ", boxScore);
}

function readData(lines: string[]): [Matrix, Move[]] {
  const matrix: Matrix = [];
  const moves: Move[] = [];

  let s = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line === "") {
      s++;
      continue;
    }

    switch (s) {
      case 0:
        matrix.push(line.split("") as Cell[]);
        break;
      case 1:
        moves.push(...(line.split("") as Move[]));
        break;
    }
  }

  return [matrix, moves];
}

function scaleMap(matrix: Matrix) {
  const newMatrix: Matrix = [];

  for (let y = 0; y < matrix.length; y++) {
    newMatrix.push([]);

    for (let x = 0; x < matrix[0].length; x++) {
      const cell = matrix[y][x];
      newMatrix[newMatrix.length - 1].push(...getWideCells(cell));
    }
  }

  return newMatrix;
}

function moveRobot(pos: Vec2D, move: Move, matrix: Matrix) {
  const dir = getDirVec(move);
  return moveObj(pos, dir, matrix) ? vec2DAdd(pos, dir) : pos;
}

function moveRobotV2(pos: Vec2D, move: Move, matrix: Matrix) {
  const dir = getDirVec(move);
  const validMoves = generateMoves(pos, dir, matrix);
  if (!validMoves || validMoves.length === 0) return pos;

  for (const move of validMoves) {
    move();
  }

  return vec2DAdd(pos, dir);
}

function moveObj(pos: Vec2D, dir: Vec2D, matrix: Matrix) {
  const cell = matrix[pos.y][pos.x];
  if (cell === ".") return true;
  if (cell === "#") return false;

  const newPos = vec2DAdd(pos, dir);

  const hasSpace = moveObj(newPos, dir, matrix);
  if (!hasSpace) return false;

  matrix[newPos.y][newPos.x] = cell;
  matrix[pos.y][pos.x] = ".";

  return true;
}

function generateMoves(
  pos: Vec2D,
  dir: Vec2D,
  matrix: Matrix,
  history = new Set<string>(),
): Function[] | null {
  const cell = matrix[pos.y][pos.x];
  const isWideBox = cell === "]" || cell === "[";

  if (isWideBox && Math.abs(dir.y) > 0)
    return generateWideMoves(pos, dir, matrix, history);

  const key = `${pos.x}-${pos.y}`;
  if (history.has(key)) return [];
  history.add(key);

  if (cell === ".") return [];
  if (cell === "#") return null;

  const newPos = vec2DAdd(pos, dir);

  const nextMoves = generateMoves(newPos, dir, matrix, history);
  if (nextMoves === null) return null;

  return [
    ...nextMoves,
    () => {
      matrix[newPos.y][newPos.x] = cell;
      matrix[pos.y][pos.x] = ".";
    },
  ];
}

function generateWideMoves(
  pos: Vec2D,
  dir: Vec2D,
  matrix: Matrix,
  history: Set<string>,
): Function[] | null {
  const lPos =
    matrix[pos.y][pos.x] === "[" ? pos : vec2DAdd(pos, { x: -1, y: 0 });

  const key = `${lPos.x}-${lPos.y}`;
  if (history.has(key)) {
    return [];
  }
  history.add(key);

  const rPos = vec2DAdd(lPos, { x: 1, y: 0 });
  const [cellL, cellR] = [matrix[lPos.y][lPos.x], matrix[rPos.y][rPos.x]];

  const newLPos = vec2DAdd(lPos, dir);
  const newRPos = vec2DAdd(rPos, dir);

  const nextLMoves = generateMoves(newLPos, dir, matrix, history);
  const nextRMoves = generateMoves(newRPos, dir, matrix, history);
  if (nextLMoves === null || nextRMoves === null) return null;

  return [
    ...nextLMoves,
    ...nextRMoves,
    () => {
      matrix[newLPos.y][newLPos.x] = cellL;
      matrix[lPos.y][lPos.x] = ".";
      matrix[newRPos.y][newRPos.x] = cellR;
      matrix[rPos.y][rPos.x] = ".";
    },
  ];
}

function findRobot(matrix: Matrix) {
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[0].length; x++) {
      if (matrix[y][x] === "@") return { y, x };
    }
  }

  return { y: -1, x: -1 };
}

function getWideCells(cell: Cell): [Cell, Cell] {
  switch (cell) {
    case "@":
      return ["@", "."];
    case "O":
      return ["[", "]"];
    default:
      return [cell, cell];
  }
}

function getDirVec(move: Move) {
  switch (move) {
    case "<":
      return { y: 0, x: -1 };
    case "^":
      return { y: -1, x: 0 };
    case ">":
      return { y: 0, x: 1 };
    case "v":
      return { y: 1, x: 0 };
    default:
      return { y: 0, x: 0 };
  }
}

const Y_SCORE = 100;

function calcBoxScore(matrix: Matrix) {
  const rowScores = matrix.map((row, y) =>
    row.reduce((acc, curr, x) => {
      if (curr !== "O" && curr !== "[") return acc;
      return acc + y * Y_SCORE + x;
    }, 0),
  );

  const totalScore = rowScores.reduce((acc, curr) => acc + curr, 0);

  return totalScore;
}

type Move = "<" | ">" | "^" | "v";
type Cell = "#" | "." | "O" | "@" | "[" | "]";
type Matrix = Cell[][];
