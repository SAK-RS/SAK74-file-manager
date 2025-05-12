import { createReadStream, createWriteStream } from "node:fs";
import { normalize, resolve } from "node:path";
import { createBrotliCompress, createBrotliDecompress } from "node:zlib";
import { InvalidInpurError } from "./helpers/errors.js";
import isExist from "./utils/isExist.js";
import { stat } from "node:fs/promises";

export async function compress(path_to_file, path_to_dest) {
  if (!path_to_file || !path_to_dest) {
    throw new InvalidInpurError();
  }
  const inputPath = resolve(normalize(path_to_file));
  const outputPath = resolve(normalize(path_to_dest));

  await validate(inputPath, outputPath);
  return new Promise((res, rej) => {
    try {
      const zip = createBrotliCompress();
      const inputStream = createReadStream(resolve(normalize(inputPath)));
      const outputStream = createWriteStream(resolve(normalize(outputPath)));
      inputStream.pipe(zip).pipe(outputStream);
      outputStream.on("finish", () => {
        res();
      });
      inputStream.on("error", rej);
      outputStream.on("error", rej);
      zip.on("error", rej);
    } catch {
      rej();
    }
  });
}

export async function decompress(path_to_file, path_to_dest) {
  if (!path_to_file || !path_to_dest) {
    throw new InvalidInpurError();
  }
  const inputPath = resolve(normalize(path_to_file));
  const outputPath = resolve(normalize(path_to_dest));

  await validate(inputPath, outputPath);

  return new Promise((res, rej) => {
    try {
      const zip = createBrotliDecompress();
      const inputStream = createReadStream(resolve(normalize(inputPath)));
      const outputStream = createWriteStream(resolve(normalize(outputPath)));
      inputStream.pipe(zip).pipe(outputStream);
      outputStream.on("finish", () => {
        res();
      });
      inputStream.on("error", rej);
      outputStream.on("error", rej);
      zip.on("error", rej);
    } catch {
      rej();
    }
  });
}

async function validate(inputPath, outputPath) {
  if (!(await isExist(inputPath))) {
    throw new InvalidInpurError();
  }
  if (await isExist(outputPath)) {
    if ((await stat(outputPath)).isDirectory()) {
      console.log("Destination must be a File!");
      throw new InvalidInpurError();
    }
  }
}
