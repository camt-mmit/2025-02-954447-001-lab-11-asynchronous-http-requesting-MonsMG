export function purnEmptyProperties<T extends object>(
  data: T,
): {
  [K in keyof T]?: NonNullable<T[K]>;
} {
  return Object.fromEntries(Object.entries(data).filter(([, value]) => !!value)) as {
    [K in keyof T]?: NonNullable<T[K]>;
  };
}
