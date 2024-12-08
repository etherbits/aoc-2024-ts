import { sleep } from "bun";
import { getLines } from "../utils/helper";

export async function p1() {
  const lines = await getLines("d6/p1.txt");
  const map = lines.map((line) => line.split(""));
  let playerStartingCoord = [-1, -1];

  for (let r = 0; r < map.length; r++)
    for (let c = 0; c < map[1].length; c++) {
      if (map[r][c] === "^") {
        playerStartingCoord = [c, r];
        r = map.length;
        break;
      }
    }

  const player = new Player(playerStartingCoord, map);

  for (let cell = player.scan(); cell !== ""; cell = player.scan()) {
    if (cell === "#") {
      player.turnR();
      continue;
    }

    player.moveForward();
  }

  console.log(player.uniqueCellCount);
}

export async function p2() {
  const lines = await getLines("d6/p2.txt");
  const map = lines.map((line) => line.split(""));
  let playerStartingCoord = [-1, -1];

  for (let r = 0; r < map.length; r++)
    for (let c = 0; c < map[1].length; c++) {
      if (map[r][c] === "^") {
        playerStartingCoord = [c, r];
        r = map.length;
        break;
      }
    }

  const player = new Player(playerStartingCoord, map);

  for (let cell = player.scan(); cell !== ""; cell = player.scan()) {
    if (cell === "#") {
      player.turnR();
      continue;
    }

    player.moveForward();
  }

  const checkedBlocks = new Set<string>();
  let blockCount = 0;
  let checkCount = 0;

  for (const pathCoord of [
    ...new Set(player.path.slice(1).map((c) => c.coord)),
  ]) {
    checkCount++;
    const pathCoordKey = pathCoord.join("-");
    if (checkedBlocks.has(pathCoordKey)) continue;
    checkedBlocks.add(pathCoordKey);

    const altMap = map.map((r) => r.map((c) => c));
    altMap[pathCoord[1]][pathCoord[0]] = "#";
    const newPlayer = new Player(playerStartingCoord, altMap);

    for (let cell = newPlayer.scan(); cell !== ""; cell = newPlayer.scan()) {
      const willLoop = newPlayer.path
        .slice(0, newPlayer.path.length - 1)
        .some(
          (prevCell) =>
            newPlayer.coord[0] == prevCell.coord[0] &&
            newPlayer.coord[1] == prevCell.coord[1] &&
            newPlayer.dir[0] == prevCell.dir[0] &&
            newPlayer.dir[1] == prevCell.dir[1],
        );

      if (willLoop) {
        blockCount++;
        console.log(pathCoord);
        console.log(
          `progress: ${checkCount}/${player.path.length} - ${checkCount / player.path.length}`,
        );
        break;
      }

      if (cell === "#") {
        newPlayer.turnR();
        continue;
      }

      newPlayer.moveForward();
    }
  }

  console.log(blockCount);
}

class Player {
  dir = [0, -1];
  coord = [0, 0];
  uniqueCellCount = 0;
  map: string[][] = [[]];
  visited: boolean[][];
  path: { coord: number[]; dir: number[] }[] = [];

  constructor(sCoord: number[], map: string[][]) {
    this.coord = sCoord;
    this.map = map;
    this.visited = Array.from({ length: map.length }, () =>
      Array.from({ length: map[0].length }, () => false),
    );
    this.updateVisited();
    this.updatePath();
  }

  turnR() {
    const rTurnMatrix = [
      [0, -1],
      [1, 0],
    ];

    this.dir = [
      this.dir[0] * rTurnMatrix[0][0] + this.dir[1] * rTurnMatrix[0][1],
      this.dir[0] * rTurnMatrix[1][0] + this.dir[1] * rTurnMatrix[1][1],
    ];
  }

  getNextCellCoord() {
    return [this.coord[0] + this.dir[0], this.coord[1] + this.dir[1]];
  }

  moveForward() {
    const nextCoord = this.getNextCellCoord();
    if (!this.inBounds(nextCoord)) return;

    this.coord = nextCoord;
    this.updatePath();

    if (this.visited[this.coord[0]][this.coord[1]]) return;
    this.updateVisited();
  }

  scan() {
    const nextCellCoord = this.getNextCellCoord();
    if (!this.inBounds(nextCellCoord)) return "";

    return this.map[nextCellCoord[1]][nextCellCoord[0]];
  }

  private inBounds(coord: number[]) {
    if (
      coord[0] < 0 ||
      coord[0] >= this.map[0].length ||
      coord[1] < 0 ||
      coord[1] >= this.map.length
    )
      return false;

    return true;
  }

  private updateVisited() {
    this.visited[this.coord[0]][this.coord[1]] = true;
    this.uniqueCellCount++;
  }

  private updatePath() {
    this.path.push({ coord: this.coord, dir: this.dir });
  }
}
