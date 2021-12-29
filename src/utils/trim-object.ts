/* eslint-disable @typescript-eslint/no-explicit-any */

export type TFilter<T extends object> = (val: any, name: keyof T, obj: T) => boolean;

export const trimObject = <T extends object = Record<string, unknown>>(
  object: T,
  filter: TFilter<T> = (val, name, obj) => true
): Partial<T> => {
  const result: Partial<T> = {};

  for (const name in object) {
    const val: any = object[name];
    if (val === null || val === undefined) continue;
    if (!filter(val, name, object)) continue;
    result[name] = val;
  }

  return result;
};
