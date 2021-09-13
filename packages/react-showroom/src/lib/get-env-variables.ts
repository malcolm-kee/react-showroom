import { Packages } from '@showroomjs/core';
import { ImportConfig } from '@showroomjs/core/react';
import { omit } from 'lodash';
import { getClientImportMap } from './get-client-import-map';

export const getEnvVariables = (
  importConfigs: undefined | Array<ImportConfig>
) => {
  return {
    packages: Object.entries(
      getClientImportMap(importConfigs)
    ).reduce<Packages>(
      (result, [key, value]) => ({
        ...result,
        [key]: omit(value, ['path']),
      }),
      {}
    ),
  };
};
