import { argv } from "bun";
import * as d1 from "./d1";
import * as d5 from "./d5";
import * as d6 from "./d6";
import * as d7 from "./d7";
import * as d8 from "./d8";
import * as d9 from "./d9";
import * as d10 from "./d10";
import * as d11 from "./d11";

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
    case "7-1":
      console.log("Running 7 1");
      d7.p1();
      break;
    case "7-2":
      console.log("Running 7 2");
      d7.p2();
      break;
    case "8-1":
      console.log("Running 8 1");
      d8.p1();
      break;
    case "8-2":
      console.log("Running 8 2");
      d8.p2();
      break;
    case "9-1":
      console.log("Running 9 1");
      d9.p1();
      break;
    case "9-2":
      console.log("Running 9 2");
      d9.p2();
      break;
    case "10-1":
      console.log("Running 10 1");
      d10.p1();
      break;
    case "10-2":
      console.log("Running 10 2");
      d10.p2();
      break;
    case "11-1":
      console.log("Running 11 1");
      d11.p1();
      break;
    case "11-2":
      console.log("Running 11 2");
      d11.p2();
      break;
    default:
      console.log("No such solution");
      break;
  }
}

main();
