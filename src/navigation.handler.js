import { table } from "node:console";
import { readdir } from "node:fs/promises";
import { normalize, resolve } from "node:path";
import { chdir, cwd } from "node:process";

export function up() {
  chdir(resolve(cwd(), "../"));
}

export function cd(path_to_dir) {
  if (!path_to_dir) {
    throw new InvalidInpurError();
  }
  chdir(normalize(path_to_dir));
}

export async function ls() {
  const path = cwd();
  const dir = (await readdir(path, { withFileTypes: true }))
    .map((dir) => ({
      Name: dir.name,
      Type: dir.isDirectory() ? "directory" : "file",
    }))
    .sort((a, b) => (a.Type === "directory" && b.Type === "file" ? -1 : 1))
    .sort();

  table(dir);
}
