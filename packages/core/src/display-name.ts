const regex = /[A-Z]/g;

export const encodeDisplayName = (displayName: string) =>
  displayName.replace(regex, (char) => `-${char.toLowerCase()}`);

const regex2 = /\-([a-z])/g;

export const decodeDisplayName = (decodedName: string) =>
  decodedName.replace(regex2, (_, p: string) => p.toUpperCase());
