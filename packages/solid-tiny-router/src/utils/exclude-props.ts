export function excludeProps<T extends object, K extends keyof T>(value: T, keys: K[]): Omit<T, K> {
  const omitted: PropertyKey[] = keys;
  const newObject = {};

  for (const key of Object.keys(value)) {
    if (!omitted.includes(key)) {
      Object.defineProperty(newObject, key, {
        get(): unknown {
          return Reflect.get(value, key);
        },
        enumerable: true,
      });
    }
  }

  // Each key of T other than K got a getter above.
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  return newObject as Omit<T, K>;
}

export function pickProps<T extends object, K extends keyof T>(value: T, keys: K[]): Pick<T, K> {
  const picked: PropertyKey[] = keys;
  const newObject = {};

  for (const key of Object.keys(value)) {
    if (picked.includes(key)) {
      Object.defineProperty(newObject, key, {
        get(): unknown {
          return Reflect.get(value, key);
        },
        enumerable: true,
      });
    }
  }

  // Each key in K got a getter above.
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  return newObject as Pick<T, K>;
}
