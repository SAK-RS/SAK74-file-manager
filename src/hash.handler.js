import { createHash } from "node:crypto";
import { InvalidInpurError } from "./helpers/errors.js";
import { readFile } from "node:fs/promises";
import { normalize, resolve } from "node:path";

export async function hash(path_to_file) {
  if (!path_to_file) {
    throw new InvalidInpurError();
  }
  const hash = createHash("SHA256");
  hash.update(await readFile(resolve(normalize(path_to_file))));
  console.log(hash.digest("hex"));
}
