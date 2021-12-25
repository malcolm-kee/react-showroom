export const getSafeName = (pkgName: string): string => {
  if (!pkgName) {
    return pkgName;
  }

  return pkgName
    .replace(/(-)([a-z])/g, function (_, __, x) {
      return x.toUpperCase();
    })
    .replace(/\//, '__')
    .replace(/[^a-zA-Z\_]/g, '');
};
