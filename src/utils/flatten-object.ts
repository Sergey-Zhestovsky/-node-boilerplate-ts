type TPrimitives = string | number | boolean | null;

type TDeepObject<T extends TPrimitives = TPrimitives> = DeepObject<T>;

const filterKey = (key: string) => {
  return key.replace(/([\\.\\[\]])/g, (_, symbol) => `\\${symbol}`);
};

export const flattenObject = (obj: TDeepObject) => {
  const flatten = (
    nestedEl: Array<object | TPrimitives> | object | TPrimitives,
    parentName: string,
    resultedObj: Record<string, TPrimitives> = {}
  ) => {
    if (nestedEl === null || typeof nestedEl !== 'object') {
      resultedObj[parentName] = nestedEl;
      return resultedObj;
    }

    if (Array.isArray(nestedEl)) {
      for (const [i, v] of nestedEl.entries()) {
        flatten(v, `${parentName}[${i}]`, resultedObj);
      }

      return resultedObj;
    }

    for (const [key, value] of Object.entries(nestedEl)) {
      const targetKey = `${parentName ? `${parentName}.` : ''}${filterKey(key)}`;
      flatten(value, targetKey, resultedObj);
    }

    return resultedObj;
  };

  return flatten(obj, '');
};
