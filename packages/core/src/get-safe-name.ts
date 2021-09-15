export const getSafeName = (pkgName: string): string => {
  if (!pkgName) {
    return pkgName;
  }

  return pkgName
    .replace(/-([a-z])/g, function (m, w) {
      return w.toUpperCase();
    })
    .replace(/\W/, '');
};
