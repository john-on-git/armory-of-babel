export { };
declare global {
  interface String {
    /**
     * Convert this string to Title Case https://en.wikipedia.org/wiki/Title_case
     * Capitalising the first letter of the first word, and the first letter of every other word longer than 4 letters.
     * @returns the string with the first letter capitalized.
     */
    toTitleCase: () => string;
  }
}

export const titleCase = function (x: string) { return x.replaceAll(/(^[A-z])|([-–—]+[A-z](?=[A-z]{3,}))|(\s+[A-z](?=[A-z]{3,}))/g, (match) => match.toUpperCase()) }

if (!String.prototype.toTitleCase) {
  String.prototype.toTitleCase = function () { return titleCase(this as string) }
}

