import { vec2DAdd, wrap2D, type Vec2D } from "../utils/graph";
import { getLines } from "../utils/helper";

export async function p1() {
  const lines = await getLines("d14/p1.txt");
  const robots = getRobots(lines);
  const rounds = 100;
  const bounds: Vec2D = { x: 101, y: 103 };

  for (let i = 0; i < rounds; i++) {
    updateState(robots, bounds);
  }

  const sf = getSafetyFactor(robots, bounds);
  console.log(sf);
}

export async function p2() {
  const lines = await getLines("d14/p1.txt");
  const robots = getRobots(lines);
  const rounds = 10000;
  const bounds: Vec2D = { x: 101, y: 103 };

  let v = 27;
  let h = 75;

  for (let i = 0; i < rounds; i++) {
    if (v == 0 || h == 0) {
      console.log(`round: ${i}`);
      displayMap(robots, bounds);
      v = v == 0 ? bounds.x : v;
      h = h == 0 ? bounds.y : h;
    }
    v--;
    h--;

    updateState(robots, bounds);
  }

  const sf = getSafetyFactor(robots, bounds);
  console.log(sf);
}

function getRobots(lines: string[]) {
  const re = /-?\d+/g;
  const robots: Robot[] = lines.map((line) => {
    const m = line.matchAll(re);
    return {
      p: { x: +m.next().value!, y: +m.next().value! },
      v: { x: +m.next().value!, y: +m.next().value! },
    };
  });

  return robots;
}

function updateState(robots: Robot[], bounds: Vec2D) {
  for (let i = 0; i < robots.length; i++) {
    const robot = robots[i];
    robot.p = wrap2D(vec2DAdd(robot.p, robot.v), bounds);
  }
}

function getSafetyFactor(robots: Robot[], bounds: Vec2D) {
  const quarterScores = [0, 0, 0, 0];

  for (let i = 0; i < robots.length; i++) {
    const robot = robots[i];
    const quarter = getQuarter(robot.p, bounds);
    if (quarter == -1) continue;
    quarterScores[quarter]++;
  }

  return quarterScores.reduce((acc, s) => acc * s, 1);
}

function getQuarter(pos: Vec2D, bounds: Vec2D) {
  const xSplit = Math.floor(bounds.x / 2);
  const ySplit = Math.floor(bounds.y / 2);

  if (pos.x < xSplit && pos.y < ySplit) {
    return 0;
  } else if (pos.x > xSplit && pos.y < ySplit) {
    return 1;
  } else if (pos.x < xSplit && pos.y > ySplit) {
    return 2;
  } else if (pos.x > xSplit && pos.y > ySplit) {
    return 3;
  } else {
    return -1;
  }
}

function displayMap(robots: Robot[], bounds: Vec2D) {
  const matrix = Array.from({ length: bounds.y }, () =>
    Array.from({ length: bounds.x }, () => 0),
  );

  for (let i = 0; i < robots.length; i++) {
    const robot = robots[i];
    matrix[robot.p.y][robot.p.x]++;
  }

  matrix.forEach((cells) => {
    cells.forEach((cell) => {
      if (cell > 0) {
        return process.stdout.write("██");
      }
      process.stdout.write("░░");
    });
    process.stdout.write("\n");
  });
}

type Robot = {
  p: Vec2D;
  v: Vec2D;
};
