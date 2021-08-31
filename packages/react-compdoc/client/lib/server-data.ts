interface ImportMapData {
  name: string;
  varName: string;
}

export interface ServerData {
  packages: Record<string, ImportMapData>;
}

/**
 * Data injected as env variable via webpack.
 */
export const serverData = JSON.parse(
  process.env.serverData as string
) as ServerData;
