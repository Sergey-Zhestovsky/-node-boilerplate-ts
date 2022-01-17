import _ from 'lodash';

export const appendObject = <S extends object, T extends object>(source: S, target: T): S & T => {
  return _.mergeWith(source, target, (objValue, srcValue) => {
    if (Array.isArray(objValue)) return objValue.concat(srcValue) as unknown[];
    return undefined;
  });
};

export const appendArray = <T extends object>(
  arr: T[],
  data: T,
  comparator = (source: T, target: T) => false
) => {
  const target = arr.find((v) => comparator(v, data));
  if (target) appendObject(target, data);
  else arr.push(data);
  return arr;
};
