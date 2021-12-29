type TClassLike = new () => unknown;

export const classOf = (Entity: TClassLike, TargetClass: TClassLike): boolean => {
  return Entity.prototype instanceof TargetClass;
};
