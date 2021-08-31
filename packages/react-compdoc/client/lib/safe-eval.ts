export const safeEval = (code: string, variables: Record<string, any>) => {
  const variableEntries = Object.entries(variables);
  const runCode = new Function(...variableEntries.map(([key]) => key), code);

  return runCode(...variableEntries.map(([, val]) => val));
};
