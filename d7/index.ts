import { getLines } from "../utils/helper";

export async function p1() {
  const lines = await getLines("d7/p1.txt");
  const ops: Operator[] = ["+", "*"];

  const score = lines.reduce((acc, line) => {
    const [targetStr, numsStr] = line.split(":");
    const target = +targetStr;
    const nums = numsStr
      .trim()
      .split(" ")
      .map((x) => parseInt(x));
    const doesEval = doesRecEvalMatch(target, nums, ops);
    return doesEval ? acc + target : acc;
  }, 0);

  console.log("score: ", score);
}

export async function p2() {
  const lines = await getLines("d7/p2.txt");
  const ops: Operator[] = ["+", "*", "||"];

  const score = lines.reduce((acc, line) => {
    const [targetStr, numsStr] = line.split(":");
    const target = +targetStr;
    const nums = numsStr
      .trim()
      .split(" ")
      .map((x) => parseInt(x));
    const doesEval = doesRecEvalMatch(target, nums, ops);
    return doesEval ? acc + target : acc;
  }, 0);

  console.log("score: ", score);
}

function doesRecEvalMatch(
  target: number,
  nums: number[],
  operators: Operator[],
): boolean {
  if (nums.length <= 1) return nums[0] === target;

  const [l, r] = nums.splice(0, 2);

  return operators.some((op) => {
    const firstEval = evalOp(l, r, op);
    return doesRecEvalMatch(target, [firstEval, ...nums], operators);
  });
}

function evalOp(a: number, b: number, op: Operator) {
  switch (op) {
    case "+":
      return a + b;
    case "*":
      return a * b;
    case "||":
      return +`${a}${b}`;
  }
}

type Operator = "*" | "+" | "||";
