import { fork } from 'child_process';

export const createPrerenderBundle = (tempDir: string) =>
  new Promise<void>((fulfill, reject) => {
    const proc = fork(
      require.resolve('./create-prerender-bundle-worker'),
      [tempDir],
      {
        stdio: 'inherit',
      }
    );

    proc.on('message', (ok: boolean) => {
      if (ok) {
        fulfill();
      } else {
        reject(new Error('Fails'));
      }
    });

    proc.on('error', reject);
  });
