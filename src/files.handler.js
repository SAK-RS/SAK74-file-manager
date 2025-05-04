import { createReadStream, createWriteStream } from "node:fs";
import { basename, dirname, join, normalize, resolve } from "node:path";
import { stdout, cwd } from "node:process";
import isExist from "./utils/isExist.js";
import { InvalidInpurError } from "./helpers/errors.js";
import {
  open,
  mkdir as makeDirNode,
  rename,
  rm as rmNode,
} from "node:fs/promises";
import pathForCopy from "./utils/pathForCopy.js";

export async function cat(path_input) {
  if (!path_input) {
    throw new InvalidInpurError();
  }
  const path = normalize(path_input);
  await validatePath(path);
  return new Promise((resolve, reject) => {
    try {
      const readStream = createReadStream(path, { encoding: "utf-8" });
      readStream.on("end", () => {
        stdout.write("\n");
        resolve();
      });
      readStream.pipe(stdout);
    } catch {
      reject();
    }
  });
}

export async function add(fileName) {
  if (!fileName) {
    throw new InvalidInpurError();
  }
  const path = join(cwd(), fileName);
  try {
    const file = await open(path, "wx");
    await file.close();
  } catch (err) {
    if (err?.code === "EEXIST") {
      throw new InvalidInpurError();
    }
  }
}

export async function mkdir(dir_name) {
  if (!dir_name) {
    throw new InvalidInpurError();
  }
  const path = join(cwd(), dir_name);
  await makeDirNode(path);
}

export async function rn(path_to_file, new_file_name) {
  if (!path_to_file || !new_file_name) {
    throw new InvalidInpurError();
  }
  const path = join(cwd(), path_to_file);
  await validatePath(path);
  const newPath = join(dirname(path), new_file_name);
  await rename(path, newPath);
}

export async function cp(path_to_file, path_to_new_dir) {
  if (!path_to_file || !path_to_new_dir) {
    throw new InvalidInpurError();
  }
  const path = resolve(cwd(), normalize(path_to_file));

  await validatePath(path);

  return new Promise(async (res, rej) => {
    try {
      const fileName = basename(path);
      const newPath = resolve(path_to_new_dir, fileName);
      const copyPath = await pathForCopy(newPath);

      const readStream = createReadStream(path);

      const writeStream = createWriteStream(copyPath);
      writeStream.on("finish", () => {
        res();
      });
      writeStream.on("error", () => {
        rej();
      });

      readStream.pipe(writeStream);
    } catch {
      rej();
    }
  });
}

export async function mv(path_to_file, path_to_new_dir) {
  if (!path_to_file || !path_to_new_dir) {
    throw new InvalidInpurError();
  }
  await cp(path_to_file, path_to_new_dir);
  await rm(path_to_file);
}

export async function rm(path_to_file) {
  if (!path_to_file) {
    throw new InvalidInpurError();
  }
  const path = normalize(path_to_file);
  await validatePath(path);
  await rmNode(path);
}

async function validatePath(path) {
  if (!(await isExist(path))) {
    throw new InvalidInpurError();
  }
}
