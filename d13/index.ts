import { getLines } from "../utils/helper";

const ACost = 3;
const BCost = 1;

export async function p1() {
  const lines = await getLines("d13/p1.txt");

  const gameStates = getGameStates(lines);
  const tokenSum = gameStates.reduce(
    (acc, game) => acc + getPrizeTokenCost(game as GameState, 100),
    0,
  );

  console.log(tokenSum);
}

export async function p2() {
  const lines = await getLines("d13/p1.txt");

  const gameStates = getGameStates(lines);
  const tokenSum = gameStates.reduce((acc, game) => {
    game.P!.x += 10000000000000;
    game.P!.y += 10000000000000;
    return acc + getPrizeTokenCost(game as GameState, Infinity);
  }, 0);

  console.log(tokenSum);
}

function getGameStates(lines: string[]) {
  const gameStates: Partial<GameState>[] = [];

  for (let i = 0, j = 0; i < lines.length; i++, j++) {
    if (j == 3) {
      j = -1;
      continue;
    }

    const re = /\d+/g;

    const line = lines[i];

    const matches = line.matchAll(re);
    if (j == 0) {
      gameStates.push({
        A: { x: +matches.next().value!, y: +matches.next().value! },
      });
    } else if (j == 1) {
      gameStates[gameStates.length - 1].B = {
        x: +matches.next().value!,
        y: +matches.next().value!,
      };
    } else {
      gameStates[gameStates.length - 1].P = {
        x: +matches.next().value!,
        y: +matches.next().value!,
      };
    }
  }

  return gameStates;
}

function getPrizeTokenCost(game: GameState, maxPress: number) {
  const { A, B, P } = game;
  const s = P.y / P.x;
  const relBC = -((A.x * s - A.y) / (B.x * s - B.y));
  const AC = Math.round(P.x / (A.x + B.x * relBC));
  const BC = Math.round(AC * relBC);
  const isValid =
    AC * A.x + BC * B.x === P.x &&
    AC * A.y + BC * B.y === P.y &&
    AC <= maxPress &&
    BC <= maxPress;
  const tokenCost = AC * ACost + BC * BCost;

  console.log(
    `valid: ${isValid}\nA: ${AC}\nB: ${BC}\ntoken cost: ${tokenCost}`,
  );
  return isValid ? tokenCost : 0;
}

type GameState = {
  A: XY;
  B: XY;
  P: XY;
};

type XY = {
  x: number;
  y: number;
};
