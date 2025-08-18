function buildCustomizationKey(obj = {}) {
  // Recursively sort keys to ensure consistent order
  const ordered = (o) =>
    Object.keys(o)
      .sort()
      .reduce((r, k) => {
        r[k] = typeof o[k] === "object" && o[k] !== null ? ordered(o[k]) : o[k];
        return r;
      }, {});
  return JSON.stringify(ordered(obj));
}

module.exports = { buildCustomizationKey };