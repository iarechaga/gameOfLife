import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { KATAS, type KataDefinition, type KataTestCaseResult } from './katas.ts';
import { PreviewErrorBoundary } from './PreviewErrorBoundary.tsx';
import {
  compileKataCode,
  evaluateTranspiledKata,
  type CompileResult,
} from './tsBrowserCompiler.ts';

const SOLVED_STORAGE_KEY = 'gol_dojo_solved_v1';
const DRAFT_STORAGE_PREFIX = 'gol_dojo_draft_v1_';

function loadSolvedSet(): Set<string> {
  try {
    const raw = window.localStorage.getItem(SOLVED_STORAGE_KEY);
    if (!raw) return new Set();
    const arr: unknown = JSON.parse(raw);
    if (!Array.isArray(arr)) return new Set();
    return new Set(arr.filter((v): v is string => typeof v === 'string'));
  } catch {
    return new Set();
  }
}

function loadDraftForKata(kata: KataDefinition): string {
  try {
    return window.localStorage.getItem(DRAFT_STORAGE_PREFIX + kata.id) ?? kata.starterCode;
  } catch {
    return kata.starterCode;
  }
}

interface DojoExecutionReport {
  compile: CompileResult;
  tests: KataTestCaseResult[];
  runtimeEvalError: string | null;
  PreviewComponent: React.ComponentType | null;
  allGreen: boolean;
  runNonce: number;
}

interface DojoViewProps {
  initialKataId?: string | null;
  onJumpToPhase: (phaseNumber: number) => void;
}

export function DojoView({ initialKataId, onJumpToPhase }: DojoViewProps) {
  const [selectedKataId, setSelectedKataId] = useState<string>(
    () => KATAS.find((k) => k.id === initialKataId)?.id ?? KATAS[0].id,
  );
  const activeKata = useMemo(
    () => KATAS.find((k) => k.id === selectedKataId) ?? KATAS[0],
    [selectedKataId],
  );

  const [code, setCode] = useState<string>(() => loadDraftForKata(activeKata));
  const [visibleHints, setVisibleHints] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [solvedIds, setSolvedIds] = useState<Set<string>>(loadSolvedSet);
  const [report, setReport] = useState<DojoExecutionReport | null>(null);

  useEffect(() => {
    if (initialKataId && KATAS.some((k) => k.id === initialKataId)) {
      setSelectedKataId(initialKataId);
    }
  }, [initialKataId]);

  useEffect(() => {
    const draft = loadDraftForKata(activeKata);
    setCode(draft);
    setVisibleHints(0);
    setReport(null);
  }, [activeKata]);

  const updateCode = (next: string) => {
    setCode(next);
    try {
      window.localStorage.setItem(DRAFT_STORAGE_PREFIX + activeKata.id, next);
    } catch {
      // ignore storage errors
    }
  };

  const executeKata = useCallback(
    async (sourceToRun: string) => {
      setIsRunning(true);
      try {
        const compile = compileKataCode(
          sourceToRun,
          activeKata.rules,
          activeKata.extraTypeCheckSnippet,
        );

        let runtimeEvalError: string | null = null;
        let PreviewComponent: React.ComponentType | null = null;
        let tests: KataTestCaseResult[] = [];

        try {
          const evaluatedExports = evaluateTranspiledKata(compile.transpiledJs);
          const maybeComp = evaluatedExports[activeKata.previewExportName];
          if (typeof maybeComp === 'function') {
            PreviewComponent = maybeComp as React.ComponentType;
          }
          tests = await activeKata.runTests(evaluatedExports);
        } catch (err) {
          runtimeEvalError = err instanceof Error ? err.message : String(err);
        }

        const allTestsPassed = tests.length > 0 && tests.every((t) => t.passed);
        const allGreen = compile.ok && !runtimeEvalError && allTestsPassed;

        if (allGreen) {
          setSolvedIds((prev) => {
            const next = new Set(prev);
            next.add(activeKata.id);
            try {
              window.localStorage.setItem(SOLVED_STORAGE_KEY, JSON.stringify([...next]));
            } catch {
              // ignore
            }
            return next;
          });
        }

        setReport((prev) => ({
          compile,
          tests,
          runtimeEvalError,
          PreviewComponent,
          allGreen,
          runNonce: (prev?.runNonce ?? 0) + 1,
        }));
      } finally {
        setIsRunning(false);
      }
    },
    [activeKata],
  );

  // Compile & mount initial preview automatically when switching katas
  useEffect(() => {
    const initialSource = loadDraftForKata(activeKata);
    void executeKata(initialSource);
  }, [activeKata, executeKata]);

  const handleEditorKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      void executeKata(code);
      return;
    }
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const nextValue = code.slice(0, start) + '  ' + code.slice(end);
      updateCode(nextValue);
      requestAnimationFrame(() => {
        target.selectionStart = start + 2;
        target.selectionEnd = start + 2;
      });
    }
  };

  const lineCount = useMemo(() => code.split('\n').length, [code]);

  return (
    <div className="dojo-container">
      <div className="dojo-kata-strip" role="tablist" aria-label="Selector de Katas">
        {KATAS.map((kata) => {
          const isSolved = solvedIds.has(kata.id);
          const isSelected = kata.id === activeKata.id;
          return (
            <button
              key={kata.id}
              type="button"
              role="tab"
              aria-selected={isSelected}
              className={`kata-tab-pill ${isSelected ? 'active' : ''} ${isSolved ? 'solved' : ''}`}
              onClick={() => setSelectedKataId(kata.id)}
            >
              <span className="kata-num">{isSolved ? '✓' : `K${kata.number}`}</span>
              <span className="kata-tab-text">
                <strong>Kata {kata.number}</strong>
                <small>{kata.difficulty}</small>
              </span>
            </button>
          );
        })}
        <div className="dojo-score-pill">
          Superadas: <strong>{solvedIds.size}</strong> / {KATAS.length}
        </div>
      </div>

      <div className="dojo-workspace">
        {/* LEFT COLUMN: BRIEFING + EDITOR */}
        <section className="dojo-left-pane">
          <div className="dojo-brief-card">
            <div className="dojo-brief-top">
              <div>
                <span className={`difficulty-tag diff-${activeKata.difficulty.toLowerCase()}`}>
                  {activeKata.difficulty}
                </span>
                <button
                  type="button"
                  className="phase-link-btn"
                  onClick={() => onJumpToPhase(activeKata.phaseRef)}
                >
                  📖 Repasar Fase {activeKata.phaseRef} en la Guía
                </button>
              </div>
              {solvedIds.has(activeKata.id) && (
                <span className="solved-banner-chip">🏆 Kata Superada</span>
              )}
            </div>

            <h2>
              Kata {activeKata.number}: {activeKata.title}
            </h2>
            <p className="kata-subtitle">{activeKata.subtitle}</p>

            <div className="java-parallel-box">
              <strong>☕ Paralelismo Java → TS+React:</strong> {activeKata.javaParallel}
            </div>

            <p className="kata-scenario">{activeKata.scenario}</p>

            <div className="kata-reqs">
              <strong>Criterios de aceptación:</strong>
              <ul>
                {activeKata.requirements.map((req) => (
                  <li key={req}>{req}</li>
                ))}
              </ul>
            </div>

            <div className="hints-bar">
              <button
                type="button"
                className="btn-subtle"
                disabled={visibleHints >= activeKata.hints.length}
                onClick={() => setVisibleHints((n) => Math.min(activeKata.hints.length, n + 1))}
              >
                💡 Desbloquear pista ({visibleHints}/{activeKata.hints.length})
              </button>
              {visibleHints > 0 && (
                <ul className="hints-list">
                  {activeKata.hints.slice(0, visibleHints).map((hint, idx) => (
                    <li key={hint}>
                      <strong>Pista {idx + 1}:</strong> {hint}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="dojo-editor-card">
            <div className="editor-toolbar">
              <span className="editor-filename">
                <code>kata-{activeKata.number}.tsx</code>
                <small>TypeScript 5.9 (`strict: true`) + React 19</small>
              </span>

              <div className="editor-actions">
                <button
                  type="button"
                  className="btn-subtle"
                  onClick={() => {
                    updateCode(activeKata.starterCode);
                    void executeKata(activeKata.starterCode);
                  }}
                >
                  ↺ Reiniciar Kata
                </button>
                <button
                  type="button"
                  className="btn-subtle"
                  onClick={() => {
                    updateCode(activeKata.solutionCode);
                    void executeKata(activeKata.solutionCode);
                  }}
                >
                  👁 Cargar Solución
                </button>
                <button
                  type="button"
                  className="btn-run-kata"
                  disabled={isRunning}
                  onClick={() => void executeKata(code)}
                  title="Atajo: Cmd+Enter / Ctrl+Enter"
                >
                  {isRunning ? 'Compilando...' : '▶ Compilar y Pasar Tests (⌘↵)'}
                </button>
              </div>
            </div>

            <div className="editor-body">
              <div className="editor-gutter" aria-hidden="true">
                {Array.from({ length: lineCount }, (_, idx) => (
                  <div key={idx + 1}>{idx + 1}</div>
                ))}
              </div>
              <textarea
                className="editor-textarea"
                spellCheck={false}
                autoCapitalize="off"
                autoComplete="off"
                autoCorrect="off"
                aria-label={`Editor de código para Kata ${activeKata.number}`}
                value={code}
                onChange={(e) => updateCode(e.target.value)}
                onKeyDown={handleEditorKeyDown}
              />
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN: COMPILER + TESTS + LIVE REACT SANDBOX */}
        <section className="dojo-right-pane">
          {report?.allGreen && (
            <div className="all-green-celebration" role="status">
              <strong>✅ ¡Kata {activeKata.number} superada con 0 errores estáticos y todos los tests en verde!</strong>
              {activeKata.number < KATAS.length && (
                <button
                  type="button"
                  onClick={() => setSelectedKataId(KATAS[activeKata.number].id)}
                >
                  Ir a Kata {activeKata.number + 1} →
                </button>
              )}
            </div>
          )}

          {/* 1. COMPILER DIAGNOSTICS */}
          <div className="result-panel">
            <div className="result-panel-header">
              <h3>1. Compilador TypeScript (`tsc --strict` en navegador)</h3>
              {report && (
                <span className={`status-pill ${report.compile.ok ? 'ok' : 'fail'}`}>
                  {report.compile.ok
                    ? `0 errores (${report.compile.elapsedMs} ms)`
                    : `${report.compile.diagnostics.length} error(es)`}
                </span>
              )}
            </div>

            {report?.compile.ok ? (
              <p className="panel-ok-msg">
                ✓ Tipado estático verificado (`strict`, `noImplicitAny`, `strictNullChecks`
                {activeKata.rules.forbidTypeAssertions ? ', sin casts `as`' : ''}).
              </p>
            ) : (
              <ul className="diag-list">
                {report?.compile.diagnostics.map((d, idx) => (
                  <li key={`${d.code}-${d.line}-${idx}`} className={`diag-item ${d.severity}`}>
                    <span className="diag-loc">
                      {d.code} · L{d.line}:{d.column}
                    </span>
                    <span>{d.message}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* 2. AUTOMATED TEST SUITE */}
          <div className="result-panel">
            <div className="result-panel-header">
              <h3>2. Suite de Tests Unitarios y DOM (React 19)</h3>
              {report && (
                <span
                  className={`status-pill ${
                    !report.runtimeEvalError &&
                    report.tests.length > 0 &&
                    report.tests.every((t) => t.passed)
                      ? 'ok'
                      : 'fail'
                  }`}
                >
                  {report.tests.filter((t) => t.passed).length}/{report.tests.length} PASS
                </span>
              )}
            </div>

            {report?.runtimeEvalError && (
              <div className="preview-runtime-error">
                <strong>Error al evaluar el módulo:</strong>
                <pre>{report.runtimeEvalError}</pre>
              </div>
            )}

            <ul className="test-results-list">
              {report?.tests.map((test) => (
                <li key={test.name} className={`test-item ${test.passed ? 'pass' : 'fail'}`}>
                  <div className="test-item-title">
                    <span>{test.passed ? '✓ PASS' : '✗ FAIL'}</span>
                    <strong>{test.name}</strong>
                  </div>
                  {test.error && <pre className="test-error-msg">{test.error}</pre>}
                </li>
              ))}
            </ul>
          </div>

          {/* 3. LIVE INTERACTIVE REACT PREVIEW */}
          <div className="result-panel live-preview-panel">
            <div className="result-panel-header">
              <h3>3. Sandbox Interactivo en Vivo (`&lt;{activeKata.previewExportName} /&gt;`)</h3>
              <span className="live-dot">● LIVE REACT 19</span>
            </div>

            <div className="live-preview-stage">
              <PreviewErrorBoundary resetKey={report?.runNonce ?? 0}>
                {report?.PreviewComponent ? (
                  <report.PreviewComponent key={report.runNonce} />
                ) : (
                  <p className="muted-note">
                    Exporta la función <code>{activeKata.previewExportName}</code> para verla montada aquí.
                  </p>
                )}
              </PreviewErrorBoundary>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
