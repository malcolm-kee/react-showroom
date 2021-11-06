export const preCompileHtml = (html: string) => {
  return `<div dangerouslySetInnerHTML={{__html: \`${html}\`}}></div>`;
};
