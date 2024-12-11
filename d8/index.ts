import { getLines } from "../utils/helper";

export async function p1() {
  const lines = await getLines("d8/p1.txt");
  const antennaMap = new Map<string, Coord[]>();

  lines.forEach((line, y) =>
    line.split("").forEach((char, x) => {
      if (char === ".") return;
      antennaMap.set(char, [...(antennaMap.get(char) ?? []), [x, y]]);
    }),
  );

  const uniqueAntinodes: Antinode[] = [];

  for (const freq of antennaMap.keys()) {
    const coords = antennaMap.get(freq)!;

    const antinodes = calcAntennaAntinodes(freq, coords);
    console.log(antinodes);
    const fittingAntinodes = antinodes.filter((antinode) => {
      return !(
        antinode.coord[0] < 0 ||
        antinode.coord[0] >= lines[0].length ||
        antinode.coord[1] < 0 ||
        antinode.coord[1] >= lines.length
      );
    });

    fittingAntinodes.forEach((antinode) => {
      if (
        uniqueAntinodes.some((uniqueAnti) =>
          coordEq(uniqueAnti.coord, antinode.coord),
        )
      )
        return;
      uniqueAntinodes.push(antinode);
    });
  }

  console.log(uniqueAntinodes.length);
}

export async function p2() {
  const lines = await getLines("d8/p2.txt");
  const antennaMap = new Map<string, Coord[]>();

  lines.forEach((line, y) =>
    line.split("").forEach((char, x) => {
      if (char === ".") return;
      antennaMap.set(char, [...(antennaMap.get(char) ?? []), [x, y]]);
    }),
  );

  const uniqueAntinodes: Antinode[] = [];

  for (const freq of antennaMap.keys()) {
    const coords = antennaMap.get(freq)!;

    const antinodes = calcAntennaAntinodesV2(freq, coords, [
      lines[0].length,
      lines.length,
    ]);
    console.log(antinodes);
    const fittingAntinodes = antinodes.filter((antinode) => {
      return !(
        antinode.coord[0] < 0 ||
        antinode.coord[0] >= lines[0].length ||
        antinode.coord[1] < 0 ||
        antinode.coord[1] >= lines.length
      );
    });

    fittingAntinodes.forEach((antinode) => {
      if (
        uniqueAntinodes.some((uniqueAnti) =>
          coordEq(uniqueAnti.coord, antinode.coord),
        )
      )
        return;
      uniqueAntinodes.push(antinode);
    });
  }

  console.log(uniqueAntinodes.length);
}

function calcAntennaAntinodes(freq: string, coords: Coord[]) {
  const antinodes: Antinode[] = [];

  for (let i = 0; i < coords.length; i++) {
    for (let j = i + 1; j < coords.length; j++) {
      const [p1, p2] = [coords[i], coords[j]];
      const diff: Coord = coordSub(p2, p1);

      const antinodeCoords = [coordSub(p1, diff), coordAdd(p2, diff)];
      antinodes.push(...antinodeCoords.map((coord) => ({ freq, coord })));
    }
  }

  return antinodes;
}

function calcAntennaAntinodesV2(freq: string, coords: Coord[], bounds: Coord) {
  const antinodes: Antinode[] = [];

  for (let i = 0; i < coords.length; i++) {
    for (let j = i + 1; j < coords.length; j++) {
      const [p1, p2] = [coords[i], coords[j]];
      const diff: Coord = coordSub(p2, p1);

      const antinodeCoords = [
        ...getInlinePoints(p1, diff, bounds),
        ...getInlinePoints(p2, coordNeg(diff), bounds),
      ];

      antinodes.push(...antinodeCoords.map((coord) => ({ freq, coord })));
    }
  }

  return antinodes;
}

function getInlinePoints(rel: Coord, diff: Coord, bounds: Coord) {
  const points: Coord[] = [];
  let currPoint = rel;

  while (
    !(
      currPoint[0] < 0 ||
      currPoint[0] >= bounds[0] ||
      currPoint[1] < 0 ||
      currPoint[1] >= bounds[1]
    )
  ) {
    points.push(currPoint);
    currPoint = coordSub(currPoint, diff);
  }

  return points;
}

type Antinode = {
  freq: string;
  coord: Coord;
};

type Coord = [number, number];

function coordSub(a: Coord, b: Coord): Coord {
  return [a[0] - b[0], a[1] - b[1]];
}

function coordAdd(a: Coord, b: Coord): Coord {
  return [a[0] + b[0], a[1] + b[1]];
}

function coordNeg(a: Coord): Coord {
  return [-a[0], -a[1]];
}

function coordEq(a: Coord, b: Coord) {
  return a[0] == b[0] && a[1] == b[1];
}
