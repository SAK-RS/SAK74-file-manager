import { table } from "node:console";
import { readdir, stat } from "node:fs/promises";
import { join, normalize, resolve } from "node:path";
import { chdir, cwd } from "node:process";

export function up() {
  chdir(resolve(cwd(), "../"));
}

export function cd(path_to_dir) {
  chdir(normalize(path_to_dir));
}

export async function ls(path) {
  const dir = (await readdir(path)).map(async (name) => ({
    Name: name,
    Type: (await stat(join(path, name))).isDirectory() ? "directory" : "file",
  }));

  const result = (await Promise.all(dir))
    .sort((a, b) => (a.Type === "directory" && b.Type === "file" ? -1 : 1))
    .sort();

  table(result);
}
