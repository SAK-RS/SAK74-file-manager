import { cwd } from "node:process";
import colorized from "../utils/colorized.js";

export default function () {
  console.log(colorized(`You are currently in ${cwd()}`, "yellow"));
}
