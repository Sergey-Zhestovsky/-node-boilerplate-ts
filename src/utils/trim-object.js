const trimObject = (object, filter = (val, name, obj) => true) => {
  const result = {};

  for (const name in object) {
    const val = object[name];
    if (val === null || val === undefined) continue;
    if (!filter(val, name, object)) continue;
    result[name] = val;
  }

  return result;
};

module.exports = trimObject;
