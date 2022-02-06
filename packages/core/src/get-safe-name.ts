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

export const stringToIdentifier = (oriString: string): string => {
  if (!oriString) {
    return oriString;
  }

  return ('_' + oriString)
    .replace(/(\s)([a-z])/g, function (_, __, x) {
      return x.toUpperCase();
    })
    .replace(/[^A-Za-z0-9_$]/g, '');
};
