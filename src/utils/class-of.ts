const classOf = (
  Entity: typeof Function,
  targetClass: typeof Function,
  ...constructorArgs: any[]
) => {
  try {
    const instance = new Entity(...constructorArgs);
    return instance instanceof targetClass;
  } catch (error) {
    return false;
  }
};

module.exports = classOf;
