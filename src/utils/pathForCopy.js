import { basename, dirname, extname, join } from "node:path";
import isExist from "./isExist.js";

export default async function pathForCopy(path) {
  if (!(await isExist(path))) {
    return path;
  } else {
    const ext = extname(path);
    const newName = basename(path, ext) + "(copy)" + ext;
    return pathForCopy(join(dirname(path), newName));
  }
}
