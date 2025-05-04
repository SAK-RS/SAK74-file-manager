import { EOL, cpus, homedir, userInfo, arch } from "node:os";
import { InvalidInpurError, OperationFailedError } from "./helpers/errors.js";
import { log, table } from "node:console";

export function os(input) {
  const arg = input.slice(2);
  if (!(arg in osArgs)) {
    throw new InvalidInpurError();
  }
  const output = arg === "cpus" ? table : log;
  output(osArgs[arg]);
}

const osArgs = {
  EOL: JSON.stringify(EOL),
  cpus: cpus().map((entry) => {
    const [model, clock] = entry.model.split(" @ ");
    return { model, clock };
  }),
  homedir: homedir(),
  username: userInfo().username,
  architecture: arch(),
};
