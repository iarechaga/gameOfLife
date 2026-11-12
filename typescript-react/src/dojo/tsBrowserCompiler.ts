import * as ReactNamespace from 'react';
import ts from 'typescript';
import { domainRuntimeModule } from './domainBridge.ts';
import {
  VIRTUAL_DOMAIN_DTS,
  VIRTUAL_ES_DOM_LIB_DTS,
  VIRTUAL_REACT_DTS,
} from './virtualLibs.ts';

export interface CompilerRules {
  forbidTypeAssertions?: boolean;
  forbidExplicitAny?: boolean;
}

export interface CompilerDiagnosticItem {
  code: string;
  line: number;
  column: number;
  message: string;
  severity: 'error' | 'rule';
}

export interface CompileResult {
  ok: boolean;
  diagnostics: CompilerDiagnosticItem[];
  transpiledJs: string;
  elapsedMs: number;
}

const STATIC_VIRTUAL_FILES: Record<string, string> = {
  '/lib.es.dom.d.ts': VIRTUAL_ES_DOM_LIB_DTS,
  '/react.d.ts': VIRTUAL_REACT_DTS,
  '/domain.d.ts': VIRTUAL_DOMAIN_DTS,
};

const cachedLibSourceFiles = new Map<string, ts.SourceFile>();

function getCachedStaticSourceFile(fileName: string): ts.SourceFile | undefined {
  const content = STATIC_VIRTUAL_FILES[fileName];
  if (content === undefined) {
    return undefined;
  }
  let sf = cachedLibSourceFiles.get(fileName);
  if (!sf) {
    sf = ts.createSourceFile(fileName, content, ts.ScriptTarget.ES2022, true, ts.ScriptKind.TS);
    cachedLibSourceFiles.set(fileName, sf);
  }
  return sf;
}

const COMPILER_OPTIONS: ts.CompilerOptions = {
  strict: true,
  noImplicitAny: true,
  strictNullChecks: true,
  strictFunctionTypes: true,
  noImplicitReturns: true,
  target: ts.ScriptTarget.ES2022,
  module: ts.ModuleKind.ESNext,
  jsx: ts.JsxEmit.React,
  esModuleInterop: true,
  allowSyntheticDefaultImports: true,
  skipLibCheck: false,
};

function checkCustomAstRules(
  sourceFile: ts.SourceFile,
  rules: CompilerRules,
): CompilerDiagnosticItem[] {
  const violations: CompilerDiagnosticItem[] = [];

  function visit(node: ts.Node): void {
    if (rules.forbidTypeAssertions) {
      if (ts.isAsExpression(node)) {
        const typeText = node.type.getText(sourceFile).trim();
        if (typeText !== 'const') {
          const pos = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
          violations.push({
            code: 'DOJO-NO-AS',
            line: pos.line + 1,
            column: pos.character + 1,
            severity: 'rule',
            message:
              'Prohibido usar `as` (Type Assertion) en esta kata. Usa un Type Guard real (`val is Tipo`) o estrechamiento de flujo.',
          });
        }
      } else if (ts.isTypeAssertionExpression(node)) {
        const pos = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
        violations.push({
          code: 'DOJO-NO-AS',
          line: pos.line + 1,
          column: pos.character + 1,
          severity: 'rule',
          message:
            'Prohibido usar `<Tipo>valor` (Type Assertion). Usa estrechamiento seguro.',
        });
      }
    }

    if (rules.forbidExplicitAny && node.kind === ts.SyntaxKind.AnyKeyword) {
      const pos = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
      violations.push({
        code: 'DOJO-NO-ANY',
        line: pos.line + 1,
        column: pos.character + 1,
        severity: 'rule',
        message:
          'Prohibido usar `any` explícito: apaga el compilador. Usa `unknown`, genéricos o el tipo de dominio concreto.',
      });
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return violations;
}

export function compileKataCode(
  userCode: string,
  rules: CompilerRules = { forbidExplicitAny: true },
  extraTypeCheckSnippet?: string,
): CompileResult {
  const start = performance.now();
  const entryFileName = '/kata.tsx';
  const probeFileName = '/__probe__.ts';

  // Ensure React is in scope for classic JSX transform even if user only imports named hooks
  const hasDefaultReactImport =
    /import\s+React\b/.test(userCode) || /import\s+\*\s+as\s+React\b/.test(userCode);
  const augmentedCode = hasDefaultReactImport
    ? userCode
    : `import React from 'react';\n${userCode}`;
  const lineOffset = hasDefaultReactImport ? 0 : 1;

  const userSourceFile = ts.createSourceFile(
    entryFileName,
    augmentedCode,
    ts.ScriptTarget.ES2022,
    true,
    ts.ScriptKind.TSX,
  );

  const probeSourceFile = extraTypeCheckSnippet
    ? ts.createSourceFile(
        probeFileName,
        extraTypeCheckSnippet,
        ts.ScriptTarget.ES2022,
        true,
        ts.ScriptKind.TS,
      )
    : undefined;

  const host: ts.CompilerHost = {
    getSourceFile(fileName) {
      if (fileName === entryFileName) return userSourceFile;
      if (fileName === probeFileName) return probeSourceFile;
      return getCachedStaticSourceFile(fileName);
    },
    getDefaultLibFileName: () => '/lib.es.dom.d.ts',
    writeFile: () => {},
    getCurrentDirectory: () => '/',
    getCanonicalFileName: (f) => f,
    useCaseSensitiveFileNames: () => true,
    getNewLine: () => '\n',
    fileExists(fileName) {
      if (fileName === entryFileName) return true;
      if (fileName === probeFileName && probeSourceFile) return true;
      return fileName in STATIC_VIRTUAL_FILES;
    },
    readFile(fileName) {
      if (fileName === entryFileName) return augmentedCode;
      if (fileName === probeFileName && extraTypeCheckSnippet) return extraTypeCheckSnippet;
      return STATIC_VIRTUAL_FILES[fileName];
    },
    resolveModuleNames(moduleNames) {
      return moduleNames.map((name) => {
        if (name === 'react') {
          return { resolvedFileName: '/react.d.ts', isExternalLibraryImport: true };
        }
        if (name === './domain' || name === './domain.ts') {
          return { resolvedFileName: '/domain.d.ts', isExternalLibraryImport: false };
        }
        if (name === './kata' || name === './kata.tsx') {
          return { resolvedFileName: entryFileName, isExternalLibraryImport: false };
        }
        return undefined;
      });
    },
  };

  const rootNames = probeSourceFile
    ? ['/react.d.ts', '/domain.d.ts', entryFileName, probeFileName]
    : ['/react.d.ts', '/domain.d.ts', entryFileName];

  const program = ts.createProgram(rootNames, COMPILER_OPTIONS, host);
  const rawDiagnostics = [
    ...program.getSyntacticDiagnostics(userSourceFile),
    ...program.getSemanticDiagnostics(userSourceFile),
    ...(probeSourceFile ? program.getSemanticDiagnostics(probeSourceFile) : []),
  ];

  const diagnostics: CompilerDiagnosticItem[] = rawDiagnostics.map((diag) => {
    let line = 1;
    let column = 1;
    if (diag.file && diag.start !== undefined) {
      const pos = diag.file.getLineAndCharacterOfPosition(diag.start);
      if (diag.file.fileName === entryFileName) {
        line = Math.max(1, pos.line + 1 - lineOffset);
        column = pos.character + 1;
      } else {
        line = 1;
        column = 1;
      }
    }
    const prefix =
      diag.file && diag.file.fileName === probeFileName
        ? '[Contrato de tipos exportados] '
        : '';
    return {
      code: `TS${diag.code}`,
      line,
      column,
      severity: 'error',
      message: prefix + ts.flattenDiagnosticMessageText(diag.messageText, '\n'),
    };
  });

  const rawUserAst = ts.createSourceFile(
    '/user-raw.tsx',
    userCode,
    ts.ScriptTarget.ES2022,
    true,
    ts.ScriptKind.TSX,
  );
  diagnostics.push(...checkCustomAstRules(rawUserAst, rules));

  const transpiled = ts.transpileModule(augmentedCode, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.CommonJS,
      jsx: ts.JsxEmit.React,
      esModuleInterop: true,
    },
  });

  return {
    ok: diagnostics.length === 0,
    diagnostics,
    transpiledJs: transpiled.outputText,
    elapsedMs: Math.round((performance.now() - start) * 10) / 10,
  };
}

export function evaluateTranspiledKata(transpiledJs: string): Record<string, unknown> {
  const exportsObj: Record<string, unknown> = {};
  const moduleObj = { exports: exportsObj };

  const reactInterop = {
    __esModule: true,
    default: ReactNamespace,
    ...ReactNamespace,
  };

  const domainInterop = {
    __esModule: true,
    ...domainRuntimeModule,
  };

  const customRequire = (specifier: string): unknown => {
    if (specifier === 'react') return reactInterop;
    if (specifier === './domain' || specifier === './domain.ts') return domainInterop;
    throw new Error(`Módulo no permitido en el sandbox del Dojo: "${specifier}"`);
  };

  const runner = new Function('exports', 'module', 'require', 'React', transpiledJs);
  runner(exportsObj, moduleObj, customRequire, ReactNamespace);
  return moduleObj.exports;
}
