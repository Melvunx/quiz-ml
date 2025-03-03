export default function isArrayOrIsEmpty(array: unknown) {
  if (!Array.isArray(array)) {
    throw new Error("Input is not an array");
  }
  return array.length > 0;
}
