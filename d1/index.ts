import { compareNums, getLines } from "../utils/helper";

export async function p1() {
  const lines = await getLines("d1/p1.txt");
  const lNums = [];
  const rNums = [];
  let diff = 0;

  for (const line of lines) {
    const nums = line.split("   ");

    lNums.push(+nums[0]);
    rNums.push(+nums[1]);
  }

  lNums.sort(compareNums);
  rNums.sort(compareNums);

  for (let i = 0; i < lNums.length; i++) {
    diff += Math.abs(lNums[i] - rNums[i]);
  }

  console.log(`${diff}`);
}

export async function p2() {
  const lines = await getLines("d1/p2.txt");
  const lNums = [];
  const mults = new Map<number, number>();

  for (const line of lines) {
    const nums = line.split("   ");

    lNums.push(+nums[0]);

    const mult = mults.get(+nums[1]) ?? 0;
    mults.set(+nums[1], mult + 1);
  }

  const score = lNums.reduce(
    (acc, num) => acc + num * (mults.get(num) ?? 0),
    0,
  );

  console.log(`${score}`);
}
