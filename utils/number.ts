// Limit the given number to the given range.
export const limit = (number: number, min: number, max: number) => {
  return Math.min(Math.max(number, min), max);
};
