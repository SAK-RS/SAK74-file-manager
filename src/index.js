import { exec } from "node:child_process";
import process, { argv, chdir, stdin, stdout } from "node:process";
import cwdMessage from "./helpers/cwd-message.js";
import { normalize } from "node:path";
import { Readline, createInterface } from "node:readline/promises";
import colorized from "./utils/colorized.js";
import { homedir, userInfo } from "node:os";
import { InvalidInpurError, OperationFailedError } from "./helpers/errors.js";

await new Promise((res) => {
  exec("node -v", (_, output) => {
    res(console.log(colorized("Node version: " + output, "green")));
  });
});

const userName = argv.slice(2)[1].slice(2);
console.log(`Welcome to the File Manager, ${userName}!`);

chdir(homedir());
cwdMessage();

const ac = new AbortController();
process.on("exit", () => {
  ac.abort();
  console.log(
    colorized(
      `\nThank you for using File Manager, ${userName}, goodbye!`,
      "red"
    )
  );
  process.exit(0);
});

// const rl = new Readline(stdout);
// rl.cursorTo(34);
// rl.clearLine(0);

const rl = createInterface({
  input: stdin,
  output: stdout,
  // prompt: "prompt",
  signal: ac.signal,
});

async function readLine() {
  try {
    const response = await rl.question(
      colorized("Type the operation: >", "blue")
    );
    throw new InvalidInpurError();

    cwdMessage();
    // do sth...
    console.log({ response });
    readLine();
  } catch (err) {
    if (
      err instanceof InvalidInpurError ||
      err instanceof OperationFailedError
    ) {
      console.log(err.message);
      readLine();
    }
  }
}
readLine();
