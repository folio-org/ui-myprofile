const prefixKeys = (obj, prefix = 'stripes-inventory-components') => {
  const res = {};

  for (const key of Object.keys(obj)) {
    res[`${prefix}.${key}`] = obj[key];
  }

  return res;
};

export default prefixKeys;
