export const isSupportedExt = (
  ext: string
): ext is 'js' | 'ts' | 'jsx' | 'tsx' => {
  return ['js', 'ts', 'jsx', 'tsx'].includes(ext);
};
