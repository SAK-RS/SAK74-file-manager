import { exec } from "node:child_process";

export default function () {
  return new Promise((res) => {
    exec("node -v", (_, output) => {
      res(output);
    });
  });
}
