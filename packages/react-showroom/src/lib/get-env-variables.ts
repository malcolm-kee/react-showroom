import { omit } from 'lodash';
import { getClientImportMap } from './get-client-import-map';
import { Packages } from '@showroomjs/core';

export const getEnvVariables = () => {
  return {
    packages: Object.entries(getClientImportMap()).reduce<Packages>(
      (result, [key, value]) => ({
        ...result,
        [key]: omit(value, ['path']),
      }),
      {}
    ),
  };
};
