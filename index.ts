import { argv } from "bun";
import * as d1 from "./d1";
import * as d5 from "./d5";
import * as d6 from "./d6";

async function main() {
  if (argv.length != 4) {
    console.log("usage: bun run index.ts {day} {part}");
    process.exit(1);
  }

  const q = `${argv[2]}-${argv[3]}`;

  switch (q) {
    case "1-1":
      console.log("Running 1 1");
      d1.p1();
      break;
    case "1-2":
      console.log("Running 1 2");
      d1.p2();
      break;
    case "5-1":
      console.log("Running 5 1");
      d5.p1();
      break;
    case "5-2":
      console.log("Running 5 2");
      d5.p2();
      break;
    case "6-1":
      console.log("Running 6 1");
      d6.p1();
      break;
    case "6-2":
      console.log("Running 6 2");
      d6.p2();
      break;
    default:
      console.log("No such solution");
      break;
  }
}

main();
