export { };
declare global {
  interface String {
    /**
     * Get this string with the first letter of each word capitalized.
     * @returns the string with the first letter capitalized.
     */
    capWords: () => string;
  }
}

export const capWords = function (x: string) { return x.replaceAll(/(^[A-z])|(\s+[A-z])/g, (match) => match.toUpperCase()) }

if (!String.prototype.capWords) {
  String.prototype.capWords = function () { return capWords(this as string) }
}

