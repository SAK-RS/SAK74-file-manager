import { compress, decompress } from "../compression.handler.js";
import { add, cat, cp, mkdir, mv, rm, rn } from "../files.handler.js";
import { hash } from "../hash.handler.js";
import { up, cd, ls } from "../navigation.handler.js";
import { os } from "../os.handler.js";

export const commands = {
  up,
  cd,
  ls,
  cat,
  add,
  mkdir,
  rn,
  cp,
  mv,
  rm,
  os,
  hash,
  compress,
  decompress,
};
