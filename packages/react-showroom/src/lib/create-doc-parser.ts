import * as fs from 'fs';
import * as path from 'path';
import * as docgen from 'react-docgen-typescript';
import * as ts from 'typescript';
import { createHash } from './create-hash';

export function createDocParser(options: {
  tsconfigPath: string;
  parserOptions: docgen.ParserOptions;
}) {
  const docgenParser = docgen.withCustomConfig(
    options.tsconfigPath,
    options.parserOptions
  );

  const tsConfigFile = getTSConfigFile(options.tsconfigPath);

  let languageService: ts.LanguageService;
  const fileCache = new Map<
    string,
    { version: number | string; text: string }
  >();

  return {
    parse: (filePath: string, content: string) => {
      fileCache.set(filePath, { version: content, text: content });

      const parseResults = docgenParser.parseWithProgramProvider(
        filePath,
        function () {
          const currentProgram =
            languageService && languageService.getProgram();

          if (currentProgram) {
            return currentProgram;
          }

          const serviceHost = createServiceHost(
            tsConfigFile.options,
            fileCache
          );

          languageService = ts.createLanguageService(
            serviceHost,
            ts.createDocumentRegistry()
          );

          return languageService.getProgram()!;
        }
      );

      const parseResult = parseResults[0];

      return (
        parseResult &&
        Object.assign({ id: createHash(parseResult.filePath) }, parseResult)
      );
    },
  };
}

function getTSConfigFile(tsconfigPath: string) {
  const basePath = path.dirname(tsconfigPath);
  const configFile = ts.readConfigFile(tsconfigPath, ts.sys.readFile);
  return ts.parseJsonConfigFileContent(
    configFile.config,
    ts.sys,
    basePath,
    {},
    tsconfigPath
  );
}

function createServiceHost(
  compilerOptions: ts.CompilerOptions,
  files: Map<string, { version: number | string; text: string }>
) {
  return {
    getScriptFileNames: () => {
      return [...files.keys()];
    },
    getScriptVersion: (fileName: string) => {
      const file = files.get(fileName);
      return (file && file.version.toString()) || '';
    },
    getScriptSnapshot: (fileName: string) => {
      if (!fs.existsSync(fileName)) {
        return undefined;
      }

      let file = files.get(fileName);

      if (file === undefined) {
        const text = fs.readFileSync(fileName, 'utf-8');

        file = { version: 0, text };
        files.set(fileName, file);
      }

      return ts.ScriptSnapshot.fromString(file.text);
    },
    getCurrentDirectory: () => process.cwd(),
    getCompilationSettings: () => compilerOptions,
    getDefaultLibFileName: (options: ts.CompilerOptions) =>
      ts.getDefaultLibFilePath(options),
    fileExists: ts.sys.fileExists,
    readFile: ts.sys.readFile,
    readDirectory: ts.sys.readDirectory,
  };
}
