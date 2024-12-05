import { getLines } from "../utils/helper";

export async function p1() {
  const lines = await getLines("d5/p1.txt");
  const preceeders = new Map<number, number[]>();
  const validNumLines: number[][] = [];

  let i = 0;

  for (; lines[i] != ""; i++) {
    const [prec, succ] = lines[i].split("|").map((x) => parseInt(x));

    preceeders.set(succ, [...(preceeders.get(succ) ?? []), prec]);
  }
  i++;
  for (; i < lines.length; i++) {
    const nums = lines[i].split(",").map((x) => parseInt(x));

    if (nums.every((prec, j) => isValid(prec, nums.slice(j + 1), preceeders))) {
      validNumLines.push(nums);
    }
  }

  const midSums = sumMids(validNumLines);
  console.log(midSums);
}

export async function p2() {
  const lines = await getLines("d5/p1.txt");
  const preceeders = new Map<number, number[]>();
  const invalidNumLines: number[][] = [];

  let i = 0;

  for (; lines[i] != ""; i++) {
    const [prec, succ] = lines[i].split("|").map((x) => parseInt(x));

    preceeders.set(succ, [...(preceeders.get(succ) ?? []), prec]);
  }
  i++;
  for (; i < lines.length; i++) {
    const nums = lines[i].split(",").map((x) => parseInt(x));

    if (nums.some((prec, j) => !isValid(prec, nums.slice(j + 1), preceeders))) {
      invalidNumLines.push(nums);
    }
  }

  const validNums = invalidNumLines.map((nums) => makeValid(nums, preceeders));

  const midSums = sumMids(validNums);
  console.log(midSums);
}

function isValid(prec: number, succs: number[], precs: Map<number, number[]>) {
  return !succs.some((succ) => (precs.get(prec) ?? []).includes(succ));
}

function makeValid(nums: number[], precs: Map<number, number[]>) {
  const validNums = [...nums].map(() => {
    const mostPrec = nums.find((prec) =>
      isValid(prec, nums.toSpliced(nums.indexOf(prec), 1), precs),
    )!;

    nums.splice(nums.indexOf(mostPrec), 1);

    return mostPrec;
  });

  return validNums;
}

function sumMids(numLines: number[][]) {
  return numLines.reduce(
    (acc, nums) => acc + nums[Math.floor(nums.length / 2)],
    0,
  );
}
