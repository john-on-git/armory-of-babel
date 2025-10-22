export { };
declare global {
  interface String {
    /**
     * Get this string with the first letter capitalized.
     * @returns the string with the first letter capitalized.
     */
    capFirst: () => string;
  }
}

export const capFirst = function (x: string) { return x.slice(0, 1).toUpperCase() + x.slice(1) }

if (!String.prototype.capFirst) {
  String.prototype.capFirst = function () { return capFirst(this as string) }
}

