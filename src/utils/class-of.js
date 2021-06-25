const classOf = (Entity, targetClass, ...constructorArgs) => {
  try {
    const instance = new Entity(...constructorArgs);
    return instance instanceof targetClass;
  } catch (error) {
    return false;
  }
};

module.exports = classOf;
