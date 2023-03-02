/**
 * Shallow compare values of keys between 2 objects.
 * Returns true if any value differs.
 */
export const keyDiff = (
  // TODO fix any. GraphicProps not working with Record
  obj1: any | Record<string, unknown> | undefined,
  obj2: any | Record<string, unknown> | undefined,
  keys: string[]
) => {
  if (!obj1 || !obj2) {
    return true;
  }
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (obj1[key] !== obj2[key]) {
      return true;
    }
  }
  return false;
};
