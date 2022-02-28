export function debug(...args: any[]) {
  const { DEBUG } = process.env;

  if (DEBUG === "true") {
    console.log(...args);
  }
}

export function debugWarn(...args: any[]) {
  const { DEBUG } = process.env;

  if (DEBUG === "true") {
    console.warn(...args);
  }
}
export function debugError(...args: any[]) {
  const { DEBUG } = process.env;

  if (DEBUG === "true") {
    console.error(...args);
  }
}
