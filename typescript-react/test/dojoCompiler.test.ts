import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { KATAS } from '../src/dojo/katas.ts';
import {
  compileKataCode,
  evaluateTranspiledKata,
} from '../src/dojo/tsBrowserCompiler.ts';

describe('In-Browser TypeScript + React Kata Dojo Compiler', () => {
  for (const kata of KATAS) {
    it(`Kata ${kata.number} (${kata.id}) solutionCode compiles with 0 strict diagnostics and exports ${kata.previewExportName}`, () => {
      const compiled = compileKataCode(
        kata.solutionCode,
        kata.rules,
        kata.extraTypeCheckSnippet,
      );
      assert.equal(
        compiled.ok,
        true,
        `Expected 0 diagnostics for ${kata.id}, got:\n` +
          compiled.diagnostics.map((d) => `${d.code} L${d.line}: ${d.message}`).join('\n'),
      );

      const evaluated = evaluateTranspiledKata(compiled.transpiledJs);
      assert.equal(
        typeof evaluated[kata.previewExportName],
        'function',
        `Expected ${kata.previewExportName} to be exported as a React component`,
      );
    });
  }

  it('rejects forbidden Type Assertions (`as`) and explicit `any` via AST rules', () => {
    const codeWithViolations = `
      export const x: any = 42;
      export const y = 'glider' as string;
      export function Demo() { return <div>{String(x)}{y}</div>; }
    `;
    const result = compileKataCode(codeWithViolations, {
      forbidExplicitAny: true,
      forbidTypeAssertions: true,
    });
    assert.equal(result.ok, false);
    assert.ok(result.diagnostics.some((d) => d.code === 'DOJO-NO-ANY'));
    assert.ok(result.diagnostics.some((d) => d.code === 'DOJO-NO-AS'));
  });

  it('reports genuine TypeScript semantic errors (TS2322) when types mismatch', () => {
    const brokenTs = `
      type State = { status: 'idle' } | { status: 'ready'; total: number };
      export const sample: State = { status: 'ready', total: 'not-a-number' };
    `;
    const result = compileKataCode(brokenTs);
    assert.equal(result.ok, false);
    assert.ok(result.diagnostics.some((d) => d.code === 'TS2322'));
  });
});
