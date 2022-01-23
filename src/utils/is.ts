import originalIs, { Class, Predicate } from '@sindresorhus/is';

type TOneOfPredicate = TypeofValues | Class | Predicate;

type TIs = typeof originalIs & {
  instanceOf: <T>(TargetClass: Class<T>, instance: unknown) => instance is T;
  extendsOf: <T>(TargetClass: Class<T>, Entity: unknown) => Entity is Class<T>;
  oneOf: (predicate: MaybeArray<TOneOfPredicate>, ...values: unknown[]) => boolean;
};

const is = originalIs as TIs;

is.instanceOf = <T>(TargetClass: Class<T>, instance: unknown): instance is T => {
  return instance instanceof TargetClass;
};

is.extendsOf = <T>(TargetClass: Class<T>, Entity: unknown): Entity is Class<T> => {
  return is.class_(Entity) && Entity.prototype instanceof TargetClass;
};

is.oneOf = (predicate: MaybeArray<TOneOfPredicate>, ...values: unknown[]): boolean => {
  const arrPredicate = is.array(predicate) ? predicate : [predicate];

  const process = (val: unknown) => {
    for (const p of arrPredicate) {
      if (typeof p === 'string') {
        if (typeof val === p) return true;
      } else if (is.class_(p)) {
        if (is.instanceOf(p, val)) return true;
      } else {
        if (p(val)) return true;
      }
    }

    return false;
  };

  return values.every(process);
};

export { is };
