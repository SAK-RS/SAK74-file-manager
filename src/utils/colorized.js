export default function colorized(text, color) {
  return `\x1b[${colors[color]}m ${text} \x1b[0m`;
}

const colors = {
  black: 30,
  red: 31,
  green: 32,
  yellow: 33,
  blue: 34,
  magenta: 35,
  cyan: 36,
  white: 37,
};
