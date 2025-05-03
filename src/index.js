import { exec } from "node:child_process";
import process, { argv, chdir, stdin, stdout } from "node:process";
import cwdMessage from "./helpers/cwd-message.js";
import { createInterface } from "node:readline/promises";
import colorized from "./utils/colorized.js";
import { homedir } from "node:os";
import { InvalidInpurError, OperationFailedError } from "./helpers/errors.js";
import { commands } from "./helpers/commands.js";

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
      "magenta"
    )
  );
  process.exit(0);
});

const rl = createInterface({
  input: stdin,
  output: stdout,
  signal: ac.signal,
});

async function readLine() {
  try {
    const response = await rl.question(
      colorized("Type the operation: >", "blue")
    );
    if (response === ".exit") {
      ac.abort();
      process.exit(0);
    }

    const [cmd, ...args] = response.trim().split(" ");

    if (cmd in commands) {
      try {
        await commands[cmd](...args.filter(Boolean));
      } catch (err) {
        if (err instanceof InvalidInpurError) {
          throw err;
        }
        throw new OperationFailedError();
      }
    } else {
      throw new InvalidInpurError();
    }
    cwdMessage();

    readLine();
  } catch (err) {
    if (
      err instanceof InvalidInpurError ||
      err instanceof OperationFailedError
    ) {
      console.log(colorized(err.message, "red"));
      cwdMessage();
      readLine();
    }
  }
}
readLine();
