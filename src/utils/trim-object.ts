export type TFilter<T extends object> = (val: any, name: keyof T, obj: T) => boolean;

export interface ITrimOptions<T extends object> {
  trimNull?: boolean;
  trimUndefined?: boolean;
  filter?: TFilter<T>;
}

export const trimObject = <T extends object = Record<string, unknown>>(
  object: T,
  options: ITrimOptions<T> = {}
): Partial<T> => {
  const { trimNull = false, trimUndefined = true, filter } = options;
  const result: Partial<T> = {};

  for (const [key, value] of Object.entries(object)) {
    if (trimNull && value === null) continue;
    if (trimUndefined && value === undefined) continue;
    if (filter && !filter(value, key as keyof T, object)) continue;

    result[key as keyof T] = value;
  }

  return result;
};
