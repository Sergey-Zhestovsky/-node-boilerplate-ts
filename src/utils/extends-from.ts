type TClassLike = new () => unknown;

export const extendsFrom = (Entity: TClassLike, TargetClass: TClassLike): boolean => {
  return Entity.prototype instanceof TargetClass;
};
