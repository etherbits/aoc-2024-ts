import { getLines } from "../utils/helper";

export async function p1() {
  const lines = await getLines("d9/p1.txt");
  const line = lines[0];

  const expandedDiskmap = expandDiskmap(line);
  const compressedDiskmap = compress(expandedDiskmap);
  const checksum = calcChecksum(compressedDiskmap);
  console.log(checksum);
}

export async function p2() {
  const lines = await getLines("d9/p2.txt");
  const line = lines[0];

  const expandedDiskmap = expandDiskmap(line);
  const compressedDiskmap = compressV2(expandedDiskmap);
  const checksum = calcChecksum(compressedDiskmap);
  console.log(checksum);
}

function expandDiskmap(diskmap: string) {
  const blocks = getDiskBlocks(diskmap);

  const expandedDiskmap = blocks
    .map((block, i) => expandDiskBlock(`${i}`, block))
    .flat();

  return expandedDiskmap;
}

function getDiskBlocks(diskmap: string) {
  diskmap += "0";
  const blocks: Block[] = [];

  for (let i = 0; i < diskmap.length - 1; i += 2) {
    blocks.push([+diskmap[i], +diskmap[i + 1]]);
  }

  return blocks;
}

function expandDiskBlock(id: string, block: Block) {
  const cells: string[] = [];
  for (let i = 0; i < block[0]; i++) {
    cells.push(id);
  }
  for (let i = 0; i < block[1]; i++) {
    cells.push(".");
  }

  return cells;
}

function compress(cells: string[]) {
  const firstEmptyIdx = cells.findIndex((cell) => cell === ".");
  const lastFilledIdx = cells.findLastIndex((cell) => cell !== ".");

  if (firstEmptyIdx > lastFilledIdx) return cells;

  cells[firstEmptyIdx] = cells[lastFilledIdx];
  cells[lastFilledIdx] = ".";
  return compress(cells);
}

function compressV2(ogCells: string[]) {
  const cells = [...ogCells];
  let fileID = +cells.findLast((cell) => cell !== ".")!;
  while (fileID) {
    const fileStart = cells.findIndex((cell) => +cell === fileID);
    const fileEnd = cells.findLastIndex((cell) => +cell === fileID);
    const fileSize = fileEnd - fileStart + 1;

    const validEmptyIdx = findEmptyValidIndex(
      cells.slice(0, fileStart),
      fileSize,
    );
    if (validEmptyIdx !== -1) {
      overwrite(validEmptyIdx, fileStart, fileSize, cells);
    }

    fileID--;
  }
  return cells;
}

function findEmptyValidIndex(cells: string[], minSize: number) {
  return cells.findIndex((_, idx) => {
    if (cells[idx] !== ".") return false;

    for (let i = 0; i < minSize; i++) {
      if (cells[idx + i] !== ".") return false;
    }
    return true;
  });
}

function overwrite(
  writeIdx: number,
  sourceIdx: number,
  size: number,
  cells: string[],
) {
  for (let i = 0; i < size; i++) {
    cells[writeIdx + i] = cells[sourceIdx + i];
    cells[sourceIdx + i] = ".";
  }
}

function calcChecksum(diskmap: string[]) {
  return diskmap.reduce((acc, char, i) => {
    if (char === ".") return acc;

    return acc + +char * i;
  }, 0);
}

type Block = [number, number];
