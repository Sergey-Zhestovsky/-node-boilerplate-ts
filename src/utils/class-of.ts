const classOf = <T = unknown, R = unknown, A extends unknown[] = unknown[]>(
  Entity: new () => T,
  targetClass: new () => R,
  ...constructorArgs: A
): boolean => {
  try {
    // @ts-ignore: Legit spreading of arguments to the class constructor
    const instance = new Entity(...constructorArgs);
    return instance instanceof targetClass;
  } catch (error) {
    return false;
  }
};

export default classOf;
