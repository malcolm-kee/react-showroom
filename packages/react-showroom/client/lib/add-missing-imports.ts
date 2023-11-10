import { getSafeName } from '@showroomjs/core';

// we use callback style here because want to avoid paying the cost of Promise.tick if possible
// since those functions may get run many times

export const addMissingImports = (
  precompiledImports: Record<string, any>,
  importedPackages: Array<string>,
  onDone: (finalImports: Record<string, any>) => void
): void => {
  const newImporteds = importedPackages.filter(
    (pkg) =>
      nonLocalRegex.test(pkg) &&
      !hasOwnProperty.call(precompiledImports, getSafeName(pkg))
  );

  if (newImporteds.length > 0) {
    const result = { ...precompiledImports };

    let remaining = newImporteds.length;

    newImporteds.forEach((newPkg) => {
      loadRemotePackage(newPkg, (newModule) => {
        result[getSafeName(newPkg)] = newModule;
        remaining--;

        if (remaining <= 0) {
          onDone(result);
        }
      });
    });
  } else {
    onDone(precompiledImports);
  }
};

const nonLocalRegex = /^[a-z][a-zA-Z\-\/]+/;

const remotePackageMap = new Map<string, any>();

const hasOwnProperty = Object.prototype.hasOwnProperty;

const loadRemotePackage = (
  pkgName: string,
  onDone: (module: any) => void
): void => {
  const cached = remotePackageMap.get(pkgName);

  if (cached) {
    return onDone(cached);
  }

  (eval(`import("https://cdn.skypack.dev/${pkgName}")`) as Promise<any>).then(
    (result) => {
      remotePackageMap.set(pkgName, result);
      onDone(result);
    }
  );
};
