import React from 'react';
import { domainRuntimeModule } from './domainBridge.ts';
import {
  assert,
  assertEqual,
  assertThrows,
  mountForTest,
} from './testHarness.ts';
import type { CompilerRules } from './tsBrowserCompiler.ts';

export interface KataTestCaseResult {
  name: string;
  passed: boolean;
  error?: string;
}

export interface KataDefinition {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  phaseRef: number;
  difficulty: 'Intermedia' | 'Avanzada' | 'Arquitecto';
  javaParallel: string;
  scenario: string;
  requirements: string[];
  hints: string[];
  rules: CompilerRules;
  extraTypeCheckSnippet?: string;
  previewExportName: string;
  starterCode: string;
  solutionCode: string;
  runTests: (mod: Record<string, unknown>) => Promise<KataTestCaseResult[]>;
}

async function runSuite(
  cases: Array<{ name: string; fn: () => void | Promise<void> }>,
): Promise<KataTestCaseResult[]> {
  const results: KataTestCaseResult[] = [];
  for (const testCase of cases) {
    try {
      await testCase.fn();
      results.push({ name: testCase.name, passed: true });
    } catch (err) {
      results.push({
        name: testCase.name,
        passed: false,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }
  return results;
}

export const KATAS: KataDefinition[] = [
  // =========================================================================
  // KATA 1: ÁLGEBRA DE TIPOS, RECORD EXHAUSTIVO Y TYPE GUARDS
  // =========================================================================
  {
    id: 'kata-1-type-guards',
    number: 1,
    title: 'Álgebra de Tipos, Record Exhaustivo y Type Guards (`is`)',
    subtitle: 'Domina uniones literales y estrechamiento seguro sin casts (`as` prohibido)',
    phaseRef: 2,
    difficulty: 'Intermedia',
    javaParallel:
      'En Java usarías un `enum PatternPreset` con `PatternPreset.valueOf(str)` capturando `IllegalArgumentException`. En TypeScript las uniones de literales pesan 0 bytes en runtime y usamos Type Predicates (`val is PatternPreset`) para estrechar `string` sin mentirle al compilador con `as`.',
    scenario:
      'Necesitas un selector de patrones iniciales para el tablero. El valor que sale de un `<select>` HTML siempre es `string` genérico (`e.target.value`), porque el usuario o una extensión podrían alterar el DOM. Está terminantemente prohibido usar `as PatternPreset` o `any`.',
    requirements: [
      'Define y exporta `type PatternPreset = "small-exploder" | "glider" | "blinker" | "beacon"`.',
      'Completa `PATTERNS: Record<PatternPreset, PatternDefinition>` incluyendo las 4 entradas (si falta una, `Record` debe fallar en compilación).',
      'Implementa `export function isPatternPreset(value: string): value is PatternPreset` comprobando en runtime si la clave pertenece a `PATTERNS` (p. ej. `Object.prototype.hasOwnProperty.call(PATTERNS, value)` o `value in PATTERNS`).',
      'En `<PatternSelectorDemo />`, usa `isPatternPreset(nextValue)` en el `onChange` del `<select data-testid="preset-select">` para actualizar el estado solo si es válido.',
    ],
    hints: [
      'Fíjate en la firma de retorno del Type Guard: si devuelves `: boolean`, TypeScript NO estrecha el tipo dentro del `if`. Debe ser `: value is PatternPreset`.',
      'Para comprobar pertenencia sin necesitar `as`: `Object.prototype.hasOwnProperty.call(PATTERNS, value)` devuelve `boolean` limpiamente.',
      'El patrón `"beacon"` clásico tiene 6 u 8 celdas vivas (por ejemplo dos bloques 2x2 en diagonal: `[1,1],[1,2],[2,1],[4,4],[4,3],[3,4]`). Cualquier lista con >= 6 coordenadas `[row, col]` dentro de 20x20 es válida.',
    ],
    rules: {
      forbidTypeAssertions: true,
      forbidExplicitAny: true,
    },
    extraTypeCheckSnippet: `
      import { isPatternPreset, PATTERNS, type PatternPreset } from './kata';
      const candidate: string = 'glider';
      if (isPatternPreset(candidate)) {
        const narrowed: PatternPreset = candidate;
        const def = PATTERNS[narrowed];
        const count: number = def.coords.length;
        void count;
      }
    `,
    previewExportName: 'PatternSelectorDemo',
    starterCode: `import React, { useState } from 'react';

export type PatternPreset = 'small-exploder' | 'glider' | 'blinker' | 'beacon';

export interface PatternDefinition {
  label: string;
  coords: ReadonlyArray<readonly [number, number]>;
}

// TODO 1: Completa el Record exhaustivo con los 4 patrones (falta 'beacon')
export const PATTERNS: Record<PatternPreset, PatternDefinition> = {
  'small-exploder': {
    label: 'Small Exploder',
    coords: [[9, 10], [10, 9], [10, 10], [10, 11], [11, 9], [11, 11], [12, 10]],
  },
  glider: {
    label: 'Glider',
    coords: [[1, 2], [2, 3], [3, 1], [3, 2], [3, 3]],
  },
  blinker: {
    label: 'Blinker',
    coords: [[5, 4], [5, 5], [5, 6]],
  },
};

// TODO 2: Cambia el tipo de retorno por un Type Predicate (value is PatternPreset)
// y comprueba en runtime si value es una clave propia de PATTERNS.
export function isPatternPreset(value: string): boolean {
  return false;
}

export function PatternSelectorDemo() {
  const [selected, setSelected] = useState<PatternPreset>('small-exploder');
  const current = PATTERNS[selected];

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const rawValue = e.target.value;
    // TODO 3: Usa isPatternPreset(rawValue) para llamar a setSelected sin usar \`as\`
    void rawValue;
  };

  return (
    <div style={{ display: 'grid', gap: 10 }}>
      <label htmlFor="preset-picker" style={{ fontWeight: 600 }}>
        Patrón semilla:
      </label>
      <select
        id="preset-picker"
        data-testid="preset-select"
        value={selected}
        onChange={handleChange}
      >
        <option value="small-exploder">Small Exploder</option>
        <option value="glider">Glider</option>
        <option value="blinker">Blinker</option>
        <option value="beacon">Beacon</option>
      </select>

      <p data-testid="cells-summary" style={{ margin: 0 }}>
        Seleccionado: <strong>{current.label}</strong> ({current.coords.length} células)
      </p>
    </div>
  );
}
`,
    solutionCode: `import React, { useState } from 'react';

export type PatternPreset = 'small-exploder' | 'glider' | 'blinker' | 'beacon';

export interface PatternDefinition {
  label: string;
  coords: ReadonlyArray<readonly [number, number]>;
}

export const PATTERNS: Record<PatternPreset, PatternDefinition> = {
  'small-exploder': {
    label: 'Small Exploder',
    coords: [[9, 10], [10, 9], [10, 10], [10, 11], [11, 9], [11, 11], [12, 10]],
  },
  glider: {
    label: 'Glider',
    coords: [[1, 2], [2, 3], [3, 1], [3, 2], [3, 3]],
  },
  blinker: {
    label: 'Blinker',
    coords: [[5, 4], [5, 5], [5, 6]],
  },
  beacon: {
    label: 'Beacon',
    coords: [[2, 2], [2, 3], [3, 2], [4, 5], [5, 4], [5, 5]],
  },
};

export function isPatternPreset(value: string): value is PatternPreset {
  return Object.prototype.hasOwnProperty.call(PATTERNS, value);
}

export function PatternSelectorDemo() {
  const [selected, setSelected] = useState<PatternPreset>('small-exploder');
  const current = PATTERNS[selected];

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const rawValue = e.target.value;
    if (isPatternPreset(rawValue)) {
      setSelected(rawValue);
    }
  };

  return (
    <div style={{ display: 'grid', gap: 10 }}>
      <label htmlFor="preset-picker" style={{ fontWeight: 600 }}>
        Patrón semilla:
      </label>
      <select
        id="preset-picker"
        data-testid="preset-select"
        value={selected}
        onChange={handleChange}
      >
        <option value="small-exploder">Small Exploder</option>
        <option value="glider">Glider</option>
        <option value="blinker">Blinker</option>
        <option value="beacon">Beacon</option>
      </select>

      <p data-testid="cells-summary" style={{ margin: 0 }}>
        Seleccionado: <strong>{current.label}</strong> ({current.coords.length} células)
      </p>
    </div>
  );
}
`,
    async runTests(mod) {
      const isPatternPreset = mod.isPatternPreset as (v: string) => boolean;
      const PATTERNS = mod.PATTERNS as Record<string, { label: string; coords: unknown[] }>;
      const Comp = mod.PatternSelectorDemo as React.ComponentType;

      return runSuite([
        {
          name: 'PATTERNS contiene las 4 definiciones válidas incluyendo beacon',
          fn() {
            assert(Boolean(PATTERNS?.beacon), 'Falta la clave "beacon" en PATTERNS');
            assert(
              Array.isArray(PATTERNS.beacon.coords) && PATTERNS.beacon.coords.length >= 6,
              '"beacon" debe tener al menos 6 coordenadas vivas',
            );
          },
        },
        {
          name: 'isPatternPreset acepta los 4 literales y rechaza strings arbitrarios o heredados',
          fn() {
            assertEqual(isPatternPreset('glider'), true, 'isPatternPreset("glider")');
            assertEqual(isPatternPreset('beacon'), true, 'isPatternPreset("beacon")');
            assertEqual(isPatternPreset('unknown-preset'), false, 'isPatternPreset("unknown")');
            assertEqual(isPatternPreset('toString'), false, 'isPatternPreset("toString")');
          },
        },
        {
          name: '<PatternSelectorDemo /> actualiza la vista al elegir "beacon" e ignora valores inválidos',
          async fn() {
            const mounted = await mountForTest(React.createElement(Comp));
            try {
              const select = mounted.container.querySelector(
                '[data-testid="preset-select"]',
              ) as HTMLSelectElement | null;
              await mounted.changeValue(select, 'beacon', 'preset-select');
              const summary = mounted.container.querySelector('[data-testid="cells-summary"]');
              assert(
                summary?.textContent?.includes('Beacon'),
                `Tras elegir "beacon", el resumen debía mostrar "Beacon", pero muestra: "${summary?.textContent}"`,
              );
            } finally {
              await mounted.unmount();
            }
          },
        },
      ]);
    },
  },

  // =========================================================================
  // KATA 2: UNIONES DISCRIMINADAS Y EXHAUSTIVIDAD CON `never`
  // =========================================================================
  {
    id: 'kata-2-discriminated-unions',
    number: 2,
    title: 'Uniones Discriminadas y Exhaustividad Estática (`never`)',
    subtitle: 'Haz que los estados imposibles sean irrepresentables en compilación',
    phaseRef: 2,
    difficulty: 'Intermedia',
    javaParallel:
      'Equivale a `sealed interface RemoteCatalogState permits Idle, Loading, Ready, Failed` + `switch` exhaustivo de Java 21, pero usando un campo discriminante literal (`status`) sin clases boilerplate.',
    scenario:
      'Un compañero procedente de Java creó una clase con `{ loading: boolean; error: string | null; cells: number | null }` que acababa mostrando "Cargando... Error: null (0 células)" en producción. Refactorízalo a una Unión Discriminada con verificación exhaustiva mediante `never`.',
    requirements: [
      'Completa `assertNever(value: never): never` lanzando un `Error` descriptivo.',
      'Implementa `formatCatalogBanner(state: CatalogState): string` con un `switch (state.status)` que cubra `"idle"`, `"loading"`, `"ready"` y `"error"`, llamando a `assertNever(state)` en el `default`.',
      'Formato requerido: idle -> `"Esperando selección"`, loading -> `"Cargando <presetName>..."`, ready -> `"Listo: <presetName> (<livingCells> células)"`, error -> `"Error: <reason>"`.',
      'Conecta los 4 botones de `<AsyncStatePlayground />` para probar todas las transiciones en vivo.',
    ],
    hints: [
      'En `assertNever(value: never): never`, basta con hacer `throw new Error("Estado no soportado: " + JSON.stringify(value));`. Como lanza siempre, su tipo de retorno inferido es `never`.',
      'Dentro de `case "ready":`, TypeScript ya sabe automáticamente que `state.presetName` y `state.livingCells` existen sin ningún cast.',
      'Si te dejas algún `case` sin `return`, caerá al `default` y `assertNever(state)` marcará error de compilación `TS2345` indicando exactamente qué variante olvidaste.',
    ],
    rules: {
      forbidTypeAssertions: true,
      forbidExplicitAny: true,
    },
    extraTypeCheckSnippet: `
      import { assertNever, formatCatalogBanner, type CatalogState } from './kata';
      const checkAssertNever: (x: never) => never = assertNever;
      const sample: CatalogState = { status: 'ready', presetName: 'Glider', livingCells: 5 };
      const text: string = formatCatalogBanner(sample);
      void checkAssertNever;
      void text;
    `,
    previewExportName: 'AsyncStatePlayground',
    starterCode: `import React, { useState } from 'react';

export type CatalogState =
  | { status: 'idle' }
  | { status: 'loading'; presetName: string }
  | { status: 'ready'; presetName: string; livingCells: number }
  | { status: 'error'; reason: string };

// TODO 1: Implementa assertNever recibiendo \`value: never\` y devolviendo \`never\`
export function assertNever(value: never): never {
  throw new Error(String(value));
}

// TODO 2: Cubre las 4 ramas de CatalogState y usa assertNever en default
export function formatCatalogBanner(state: CatalogState): string {
  switch (state.status) {
    case 'idle':
      return 'Esperando selección';
    default:
      // Si descomentas assertNever(state) ahora mismo, verás a tsc quejarse de las 3 ramas que faltan:
      return 'Pendiente';
  }
}

export function AsyncStatePlayground() {
  const [state, setState] = useState<CatalogState>({ status: 'idle' });

  return (
    <div style={{ display: 'grid', gap: 10 }}>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        <button type="button" data-testid="btn-idle" onClick={() => setState({ status: 'idle' })}>
          Idle
        </button>
        <button
          type="button"
          data-testid="btn-loading"
          onClick={() => setState({ status: 'loading', presetName: 'Pulsar' })}
        >
          Simular Carga
        </button>
        <button
          type="button"
          data-testid="btn-ready"
          onClick={() => setState({ status: 'ready', presetName: 'Pulsar', livingCells: 48 })}
        >
          Simular Éxito
        </button>
        <button
          type="button"
          data-testid="btn-error"
          onClick={() => setState({ status: 'error', reason: 'Timeout HTTP 504' })}
        >
          Simular Fallo
        </button>
      </div>

      <div
        data-testid="status-banner"
        style={{ padding: '10px 12px', borderRadius: 8, background: 'rgba(15,23,42,0.7)' }}
      >
        {formatCatalogBanner(state)}
      </div>
    </div>
  );
}
`,
    solutionCode: `import React, { useState } from 'react';

export type CatalogState =
  | { status: 'idle' }
  | { status: 'loading'; presetName: string }
  | { status: 'ready'; presetName: string; livingCells: number }
  | { status: 'error'; reason: string };

export function assertNever(value: never): never {
  throw new Error(\`Estado inesperado en runtime: \${JSON.stringify(value)}\`);
}

export function formatCatalogBanner(state: CatalogState): string {
  switch (state.status) {
    case 'idle':
      return 'Esperando selección';
    case 'loading':
      return \`Cargando \${state.presetName}...\`;
    case 'ready':
      return \`Listo: \${state.presetName} (\${state.livingCells} células)\`;
    case 'error':
      return \`Error: \${state.reason}\`;
    default:
      return assertNever(state);
  }
}

export function AsyncStatePlayground() {
  const [state, setState] = useState<CatalogState>({ status: 'idle' });

  return (
    <div style={{ display: 'grid', gap: 10 }}>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        <button type="button" data-testid="btn-idle" onClick={() => setState({ status: 'idle' })}>
          Idle
        </button>
        <button
          type="button"
          data-testid="btn-loading"
          onClick={() => setState({ status: 'loading', presetName: 'Pulsar' })}
        >
          Simular Carga
        </button>
        <button
          type="button"
          data-testid="btn-ready"
          onClick={() => setState({ status: 'ready', presetName: 'Pulsar', livingCells: 48 })}
        >
          Simular Éxito
        </button>
        <button
          type="button"
          data-testid="btn-error"
          onClick={() => setState({ status: 'error', reason: 'Timeout HTTP 504' })}
        >
          Simular Fallo
        </button>
      </div>

      <div
        data-testid="status-banner"
        style={{ padding: '10px 12px', borderRadius: 8, background: 'rgba(15,23,42,0.7)' }}
      >
        {formatCatalogBanner(state)}
      </div>
    </div>
  );
}
`,
    async runTests(mod) {
      const formatCatalogBanner = mod.formatCatalogBanner as (s: unknown) => string;
      const assertNever = mod.assertNever as (x: unknown) => never;
      const Comp = mod.AsyncStatePlayground as React.ComponentType;

      return runSuite([
        {
          name: 'formatCatalogBanner formatea exactamente las 4 variantes discriminadas',
          fn() {
            assertEqual(formatCatalogBanner({ status: 'idle' }), 'Esperando selección', 'idle');
            assertEqual(
              formatCatalogBanner({ status: 'loading', presetName: 'Glider' }),
              'Cargando Glider...',
              'loading',
            );
            assertEqual(
              formatCatalogBanner({ status: 'ready', presetName: 'Glider', livingCells: 5 }),
              'Listo: Glider (5 células)',
              'ready',
            );
            assertEqual(
              formatCatalogBanner({ status: 'error', reason: '503' }),
              'Error: 503',
              'error',
            );
          },
        },
        {
          name: 'assertNever lanza excepción si recibe un estado corrupto en runtime',
          fn() {
            assertThrows(() => assertNever({ status: 'corrupt' }), 'assertNever');
          },
        },
        {
          name: '<AsyncStatePlayground /> transiciona visualmente entre estados en el DOM',
          async fn() {
            const mounted = await mountForTest(React.createElement(Comp));
            try {
              await mounted.click(
                mounted.container.querySelector('[data-testid="btn-ready"]'),
                'btn-ready',
              );
              const banner = mounted.container.querySelector('[data-testid="status-banner"]');
              assertEqual(banner?.textContent, 'Listo: Pulsar (48 células)', 'banner tras éxito');

              await mounted.click(
                mounted.container.querySelector('[data-testid="btn-error"]'),
                'btn-error',
              );
              assertEqual(banner?.textContent, 'Error: Timeout HTTP 504', 'banner tras error');
            } finally {
              await mounted.unmount();
            }
          },
        },
      ]);
    },
  },

  // =========================================================================
  // KATA 3: INMUTABILIDAD, USEREDUCER Y TIME-TRAVEL
  // =========================================================================
  {
    id: 'kata-3-reducer-timetravel',
    number: 3,
    title: 'Inmutabilidad, `useReducer` y Time-Travel (`STEP_BACK`)',
    subtitle: 'Aprovecha instancias inmutables de `SquaredPetriDish` para viajar atrás en el tiempo',
    phaseRef: 5,
    difficulty: 'Avanzada',
    javaParallel:
      'En tu Java original `nextGenerationCalculator.evolve(dish)` mutaba el `TreeMap` in-place: retroceder habría exigido implementar el patrón Memento con copias profundas manuales. En React, como cada estado ya es un snapshot inmutable (`evolveImmutable`), guardar historial cuesta casi cero.',
    scenario:
      'Sustituye múltiples `useState` sueltos por un `timeTravelReducer` puro sobre tu dominio real (`./domain`) capaz de avanzar generaciones (`TICK`), alternar celdas (`TOGGLE_CELL`), retroceder en el tiempo (`STEP_BACK`) hasta 20 pasos y reiniciar (`RESET`).',
    requirements: [
      'En `TICK`: empuja el `state.dish` actual al final de `history` (recortando a los últimos `MAX_HISTORY = 20` elementos), calcula el nuevo `dish` con `calculator.evolveImmutable(state.dish)` e incrementa `iteration + 1`.',
      'En `STEP_BACK`: si `state.history.length === 0`, devuelve `state` sin cambios. Si hay historial, restaura el último `SquaredPetriDish` de `history`, quítalo de `history` (sin usar `.pop()` mutador) y decrementa `iteration - 1`.',
      'En `TOGGLE_CELL`: clona `state.dish` (`state.dish.clone()`), alterna `(action.row, action.col)` sin mutar el `state.dish` previo y guarda el tablero anterior en `history`.',
      'En `<TimeTravelDemo />`, deshabilita el botón `data-testid="btn-back"` cuando `state.history.length === 0`.',
    ],
    hints: [
      'Para añadir un elemento sin mutar y limitar a `MAX_HISTORY`: `const nextHistory = [...state.history, state.dish].slice(-MAX_HISTORY);`.',
      'Para sacar el último elemento sin mutar el array `readonly`: `const prevDish = state.history[state.history.length - 1]; const rest = state.history.slice(0, -1);`.',
      'Recuerda: jamás llames a `state.dish.add(...)` directamente; haz `const nextDish = state.dish.clone();` primero para que `Object.is(state.dish, nextDish)` sea `false` y no corrompas el historial.',
    ],
    rules: {
      forbidExplicitAny: true,
    },
    previewExportName: 'TimeTravelDemo',
    starterCode: `import React, { useMemo, useReducer } from 'react';
import {
  Cell,
  CellBlock,
  SquaredPetriDish,
  createDefaultDependencies,
} from './domain';

export const MAX_HISTORY = 20;

export interface TimeTravelState {
  readonly dish: SquaredPetriDish;
  readonly history: readonly SquaredPetriDish[];
  readonly iteration: number;
}

export type TimeTravelAction =
  | { type: 'TICK' }
  | { type: 'STEP_BACK' }
  | { type: 'TOGGLE_CELL'; row: number; col: number }
  | { type: 'RESET' };

const deps = createDefaultDependencies(8);

export function createInitialState(): TimeTravelState {
  const dish = new SquaredPetriDish(8);
  // Blinker horizontal en el centro (fila 3, cols 2-4)
  dish.add(new CellBlock(3, 2, new Cell()));
  dish.add(new CellBlock(3, 3, new Cell()));
  dish.add(new CellBlock(3, 4, new Cell()));
  return { dish, history: [], iteration: 0 };
}

export function timeTravelReducer(
  state: TimeTravelState,
  action: TimeTravelAction,
): TimeTravelState {
  switch (action.type) {
    case 'TICK': {
      // TODO 1: Guarda state.dish en history (máx MAX_HISTORY), evoluciona con
      // deps.nextGenerationCalculator.evolveImmutable(state.dish) y sube iteration
      return state;
    }
    case 'STEP_BACK': {
      // TODO 2: Si history está vacío devuelve state; si no, recupera el último dish de forma inmutable
      return state;
    }
    case 'TOGGLE_CELL': {
      // TODO 3: Clona state.dish, añade/elimina la celda y registra el dish anterior en history
      return state;
    }
    case 'RESET':
      return createInitialState();
  }
}

export function TimeTravelDemo() {
  const [state, dispatch] = useReducer(timeTravelReducer, undefined, createInitialState);
  const coords = useMemo(() => {
    const items: Array<{ r: number; c: number; alive: boolean }> = [];
    for (let r = 0; r < state.dish.getRange(); r++) {
      for (let c = 0; c < state.dish.getRange(); c++) {
        items.push({ r, c, alive: state.dish.getCell(r, c).containsLivingCell() });
      }
    }
    return items;
  }, [state.dish]);

  return (
    <div style={{ display: 'grid', gap: 10 }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <button
          type="button"
          data-testid="btn-back"
          disabled={state.history.length === 0}
          onClick={() => dispatch({ type: 'STEP_BACK' })}
        >
          ⏪ Atrás ({state.history.length})
        </button>
        <button type="button" data-testid="btn-tick" onClick={() => dispatch({ type: 'TICK' })}>
          ⏭ Siguiente Gen
        </button>
        <button type="button" data-testid="btn-reset" onClick={() => dispatch({ type: 'RESET' })}>
          ↺ Reset
        </button>
        <span data-testid="gen-counter">Gen: {state.iteration}</span>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: \`repeat(\${state.dish.getRange()}, 22px)\`,
          gap: 3,
        }}
      >
        {coords.map(({ r, c, alive }) => (
          <button
            key={\`\${r}-\${c}\`}
            type="button"
            data-testid={\`cell-\${r}-\${c}\`}
            onClick={() => dispatch({ type: 'TOGGLE_CELL', row: r, col: c })}
            style={{
              width: 22,
              height: 22,
              padding: 0,
              borderRadius: 4,
              border: '1px solid #334155',
              background: alive ? '#22c55e' : '#0f172a',
              cursor: 'pointer',
            }}
          />
        ))}
      </div>
    </div>
  );
}
`,
    solutionCode: `import React, { useMemo, useReducer } from 'react';
import {
  Cell,
  CellBlock,
  SquaredPetriDish,
  createDefaultDependencies,
} from './domain';

export const MAX_HISTORY = 20;

export interface TimeTravelState {
  readonly dish: SquaredPetriDish;
  readonly history: readonly SquaredPetriDish[];
  readonly iteration: number;
}

export type TimeTravelAction =
  | { type: 'TICK' }
  | { type: 'STEP_BACK' }
  | { type: 'TOGGLE_CELL'; row: number; col: number }
  | { type: 'RESET' };

const deps = createDefaultDependencies(8);

export function createInitialState(): TimeTravelState {
  const dish = new SquaredPetriDish(8);
  dish.add(new CellBlock(3, 2, new Cell()));
  dish.add(new CellBlock(3, 3, new Cell()));
  dish.add(new CellBlock(3, 4, new Cell()));
  return { dish, history: [], iteration: 0 };
}

export function timeTravelReducer(
  state: TimeTravelState,
  action: TimeTravelAction,
): TimeTravelState {
  switch (action.type) {
    case 'TICK': {
      const nextDish = deps.nextGenerationCalculator.evolveImmutable(state.dish);
      const nextHistory = [...state.history, state.dish].slice(-MAX_HISTORY);
      return {
        dish: nextDish,
        history: nextHistory,
        iteration: state.iteration + 1,
      };
    }
    case 'STEP_BACK': {
      if (state.history.length === 0) {
        return state;
      }
      const previousDish = state.history[state.history.length - 1];
      return {
        dish: previousDish,
        history: state.history.slice(0, -1),
        iteration: Math.max(0, state.iteration - 1),
      };
    }
    case 'TOGGLE_CELL': {
      const nextDish = state.dish.clone();
      if (nextDish.getCell(action.row, action.col).containsLivingCell()) {
        nextDish.remove(action.row, action.col);
      } else {
        nextDish.add(new CellBlock(action.row, action.col, new Cell()));
      }
      return {
        dish: nextDish,
        history: [...state.history, state.dish].slice(-MAX_HISTORY),
        iteration: state.iteration,
      };
    }
    case 'RESET':
      return createInitialState();
  }
}

export function TimeTravelDemo() {
  const [state, dispatch] = useReducer(timeTravelReducer, undefined, createInitialState);
  const coords = useMemo(() => {
    const items: Array<{ r: number; c: number; alive: boolean }> = [];
    for (let r = 0; r < state.dish.getRange(); r++) {
      for (let c = 0; c < state.dish.getRange(); c++) {
        items.push({ r, c, alive: state.dish.getCell(r, c).containsLivingCell() });
      }
    }
    return items;
  }, [state.dish]);

  return (
    <div style={{ display: 'grid', gap: 10 }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <button
          type="button"
          data-testid="btn-back"
          disabled={state.history.length === 0}
          onClick={() => dispatch({ type: 'STEP_BACK' })}
        >
          ⏪ Atrás ({state.history.length})
        </button>
        <button type="button" data-testid="btn-tick" onClick={() => dispatch({ type: 'TICK' })}>
          ⏭ Siguiente Gen
        </button>
        <button type="button" data-testid="btn-reset" onClick={() => dispatch({ type: 'RESET' })}>
          ↺ Reset
        </button>
        <span data-testid="gen-counter">Gen: {state.iteration}</span>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: \`repeat(\${state.dish.getRange()}, 22px)\`,
          gap: 3,
        }}
      >
        {coords.map(({ r, c, alive }) => (
          <button
            key={\`\${r}-\${c}\`}
            type="button"
            data-testid={\`cell-\${r}-\${c}\`}
            onClick={() => dispatch({ type: 'TOGGLE_CELL', row: r, col: c })}
            style={{
              width: 22,
              height: 22,
              padding: 0,
              borderRadius: 4,
              border: '1px solid #334155',
              background: alive ? '#22c55e' : '#0f172a',
              cursor: 'pointer',
            }}
          />
        ))}
      </div>
    </div>
  );
}
`,
    async runTests(mod) {
      const createInitialState = mod.createInitialState as () => {
        dish: InstanceType<typeof domainRuntimeModule.SquaredPetriDish>;
        history: readonly InstanceType<typeof domainRuntimeModule.SquaredPetriDish>[];
        iteration: number;
      };
      const reducer = mod.timeTravelReducer as (
        s: ReturnType<typeof createInitialState>,
        a: { type: string; row?: number; col?: number },
      ) => ReturnType<typeof createInitialState>;
      const Comp = mod.TimeTravelDemo as React.ComponentType;

      return runSuite([
        {
          name: 'TICK evoluciona el Blinker a vertical de forma inmutable (s0.dish !== s1.dish)',
          fn() {
            const s0 = createInitialState();
            const s1 = reducer(s0, { type: 'TICK' });
            assert(s0.dish !== s1.dish, 'TICK debe devolver una instancia nueva de SquaredPetriDish');
            assertEqual(s1.iteration, 1, 'iteration tras TICK');
            assertEqual(s1.history.length, 1, 'history.length tras 1 TICK');
            assertEqual(s1.dish.getCell(2, 3).containsLivingCell(), true, 'Blinker vertical (2,3)');
            assertEqual(s0.dish.getCell(2, 3).containsLivingCell(), false, 's0 original intacto');
          },
        },
        {
          name: 'STEP_BACK restaura la generación anterior sin mutar y acota el historial a MAX_HISTORY (20)',
          fn() {
            let state = createInitialState();
            for (let i = 0; i < 25; i++) {
              state = reducer(state, { type: 'TICK' });
            }
            assertEqual(state.history.length, 20, 'Historial recortado a MAX_HISTORY=20');
            const back = reducer(state, { type: 'STEP_BACK' });
            assertEqual(back.iteration, 24, 'iteration tras STEP_BACK');
            assertEqual(back.history.length, 19, 'history tras STEP_BACK');
          },
        },
        {
          name: '<TimeTravelDemo /> habilita "Atrás" tras avanzar y permite deshacer desde la UI',
          async fn() {
            const mounted = await mountForTest(React.createElement(Comp));
            try {
              const btnBack = mounted.container.querySelector(
                '[data-testid="btn-back"]',
              ) as HTMLButtonElement | null;
              assertEqual(btnBack?.disabled, true, 'btn-back inicialmente disabled');

              await mounted.click(
                mounted.container.querySelector('[data-testid="btn-tick"]'),
                'btn-tick',
              );
              assertEqual(btnBack?.disabled, false, 'btn-back habilitado tras TICK');
              assertEqual(
                mounted.container.querySelector('[data-testid="gen-counter"]')?.textContent,
                'Gen: 1',
                'Contador en Gen: 1',
              );

              await mounted.click(btnBack, 'btn-back');
              assertEqual(
                mounted.container.querySelector('[data-testid="gen-counter"]')?.textContent,
                'Gen: 0',
                'Contador restaurado a Gen: 0',
              );
            } finally {
              await mounted.unmount();
            }
          },
        },
      ]);
    },
  },

  // =========================================================================
  // KATA 4: USEEFFECT, CLEANUP Y STALE CLOSURES CON USEREF
  // =========================================================================
  {
    id: 'kata-4-effects-stale-closures',
    number: 4,
    title: '`useEffect`, Cleanup y Caza de Stale Closures (`useRef`)',
    subtitle: 'El bug nº1 del Senior Java al suscribir eventos globales en React',
    phaseRef: 6,
    difficulty: 'Avanzada',
    javaParallel:
      'En Java un listener registrado lee campos actuales de `this`. En React cada render crea un closure distinto: si pones `[]` en `useEffect`, tu listener queda atrapado leyendo el estado del render #1 para siempre; y si pones `[stepCount, isPaused]`, das de baja y alta el listener en cada tick.',
    scenario:
      'El componente `<KeyboardShortcutLab />` tiene el bug clásico: usa `useEffect(..., [])` leyendo `isPaused` y `stepCount` directamente del closure inicial, ¡además se olvidó del `removeEventListener` en el cleanup y dispara atajos incluso cuando el usuario escribe en un `<input>`!',
    requirements: [
      'Registra `window.addEventListener("keydown", listener)` UNA sola vez al montar y límpialo simétricamente con `window.removeEventListener("keydown", listener)` al desmontar.',
      'Usa el patrón *Latest Ref* (`useRef` sincronizado) para que el listener lea siempre el último callback/estado sin re-ejecutar la suscripción a `window` en cada render.',
      'Si `event.target instanceof HTMLInputElement`, ignora el atajo para no secuestrar la escritura del usuario.',
      'Teclas: `" "` (Espacio) alterna pausa/ejecución (`isPaused`); `"ArrowRight"` suma `+1` a `stepCount` SOLO cuando `isPaused === true`.',
    ],
    hints: [
      'Guarda el callback más reciente en un ref: `const latestHandlerRef = useRef(onKey); useEffect(() => { latestHandlerRef.current = onKey; });` (¡nunca mutes `ref.current` durante el render si trabajas en Concurrent React; actualízalo en un efecto!).',
      'Luego en el `useEffect(..., [])` de suscripción a `window`, crea `const listener = (e: KeyboardEvent) => latestHandlerRef.current(e);`, regístralo y retorna `() => window.removeEventListener("keydown", listener)`.',
      'No olvides comprobar `if (event.target instanceof HTMLInputElement) return;` al principio del manejador.',
    ],
    rules: {
      forbidExplicitAny: true,
    },
    previewExportName: 'KeyboardShortcutLab',
    starterCode: `import React, { useEffect, useRef, useState } from 'react';

export function useStableKeydown(handler: (event: KeyboardEvent) => void): void {
  // ❌ BUG ACTUAL:
  // 1) Captura el \`handler\` del primer render para siempre (Stale Closure)
  // 2) No devuelve función de cleanup -> fuga de listeners al desmontar
  void useRef;
  useEffect(() => {
    window.addEventListener('keydown', handler);
  }, []);
}

export function KeyboardShortcutLab() {
  const [isPaused, setIsPaused] = useState(true);
  const [stepCount, setStepCount] = useState(0);
  const [notes, setNotes] = useState('');

  useStableKeydown((event) => {
    // TODO: Ignora el evento si event.target es un HTMLInputElement
    if (event.key === ' ') {
      event.preventDefault();
      setIsPaused(!isPaused);
    } else if (event.key === 'ArrowRight') {
      if (isPaused) {
        setStepCount(stepCount + 1);
      }
    }
  });

  return (
    <div style={{ display: 'grid', gap: 10 }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <span data-testid="pause-status">
          Estado: <strong>{isPaused ? 'PAUSADO' : 'CORRIENDO'}</strong>
        </span>
        <span data-testid="step-counter">Pasos manuales: {stepCount}</span>
      </div>

      <p style={{ margin: 0, fontSize: 13, opacity: 0.85 }}>
        Pulsa <kbd>Espacio</kbd> para alternar pausa y <kbd>→</kbd> (ArrowRight) para avanzar en pausa.
      </p>

      <input
        data-testid="notes-input"
        placeholder="Escribe aquí: Espacio no debe pausar mientras escribes..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
    </div>
  );
}
`,
    solutionCode: `import React, { useEffect, useRef, useState } from 'react';

export function useStableKeydown(handler: (event: KeyboardEvent) => void): void {
  const latestHandlerRef = useRef(handler);

  useEffect(() => {
    latestHandlerRef.current = handler;
  });

  useEffect(() => {
    const stableListener = (event: KeyboardEvent) => {
      latestHandlerRef.current(event);
    };
    window.addEventListener('keydown', stableListener);
    return () => {
      window.removeEventListener('keydown', stableListener);
    };
  }, []);
}

export function KeyboardShortcutLab() {
  const [isPaused, setIsPaused] = useState(true);
  const [stepCount, setStepCount] = useState(0);
  const [notes, setNotes] = useState('');

  useStableKeydown((event) => {
    if (event.target instanceof HTMLInputElement) {
      return;
    }
    if (event.key === ' ') {
      event.preventDefault();
      setIsPaused((prev) => !prev);
    } else if (event.key === 'ArrowRight') {
      if (isPaused) {
        setStepCount((prev) => prev + 1);
      }
    }
  });

  return (
    <div style={{ display: 'grid', gap: 10 }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <span data-testid="pause-status">
          Estado: <strong>{isPaused ? 'PAUSADO' : 'CORRIENDO'}</strong>
        </span>
        <span data-testid="step-counter">Pasos manuales: {stepCount}</span>
      </div>

      <p style={{ margin: 0, fontSize: 13, opacity: 0.85 }}>
        Pulsa <kbd>Espacio</kbd> para alternar pausa y <kbd>→</kbd> (ArrowRight) para avanzar en pausa.
      </p>

      <input
        data-testid="notes-input"
        placeholder="Escribe aquí: Espacio no debe pausar mientras escribes..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
    </div>
  );
}
`,
    async runTests(mod) {
      const Comp = mod.KeyboardShortcutLab as React.ComponentType;

      return runSuite([
        {
          name: 'ArrowRight suma múltiples pasos consecutivos sin congelarse en 1 (sin Stale Closure)',
          async fn() {
            const mounted = await mountForTest(React.createElement(Comp));
            try {
              await mounted.dispatchWindowKey('ArrowRight');
              await mounted.dispatchWindowKey('ArrowRight');
              await mounted.dispatchWindowKey('ArrowRight');
              assertEqual(
                mounted.container.querySelector('[data-testid="step-counter"]')?.textContent,
                'Pasos manuales: 3',
                '3 pulsaciones de ArrowRight deben sumar 3',
              );
            } finally {
              await mounted.unmount();
            }
          },
        },
        {
          name: 'Espacio alterna PAUSADO <-> CORRIENDO y bloquea ArrowRight mientras está CORRIENDO',
          async fn() {
            const mounted = await mountForTest(React.createElement(Comp));
            try {
              await mounted.dispatchWindowKey(' ');
              assert(
                mounted.container
                  .querySelector('[data-testid="pause-status"]')
                  ?.textContent?.includes('CORRIENDO'),
                'Primera pulsación de Espacio debe pasar a CORRIENDO',
              );
              await mounted.dispatchWindowKey('ArrowRight');
              assertEqual(
                mounted.container.querySelector('[data-testid="step-counter"]')?.textContent,
                'Pasos manuales: 0',
                'ArrowRight no debe avanzar cuando está CORRIENDO',
              );
              await mounted.dispatchWindowKey(' ');
              assert(
                mounted.container
                  .querySelector('[data-testid="pause-status"]')
                  ?.textContent?.includes('PAUSADO'),
                'Segunda pulsación de Espacio debe volver a PAUSADO',
              );
            } finally {
              await mounted.unmount();
            }
          },
        },
        {
          name: 'Registra keydown 1 sola vez, ignora teclas dentro del <input> y limpia el listener al desmontar',
          async fn() {
            let addCalls = 0;
            let removeCalls = 0;
            const origAdd = window.addEventListener.bind(window);
            const origRemove = window.removeEventListener.bind(window);

            window.addEventListener = ((type: string, listener: EventListenerOrEventListenerObject) => {
              if (type === 'keydown') addCalls++;
              origAdd(type, listener);
            }) as typeof window.addEventListener;

            window.removeEventListener = ((type: string, listener: EventListenerOrEventListenerObject) => {
              if (type === 'keydown') removeCalls++;
              origRemove(type, listener);
            }) as typeof window.removeEventListener;

            try {
              const mounted = await mountForTest(React.createElement(Comp));
              try {
                const input = mounted.container.querySelector(
                  '[data-testid="notes-input"]',
                ) as HTMLInputElement | null;
                assert(Boolean(input), 'Falta notes-input');
                await mounted.dispatchWindowKey(' ', input!);
                assert(
                  mounted.container
                    .querySelector('[data-testid="pause-status"]')
                    ?.textContent?.includes('PAUSADO'),
                  'Pulsar Espacio dentro del <input> no debe cambiar PAUSADO',
                );
                await mounted.dispatchWindowKey('ArrowRight');
                await mounted.dispatchWindowKey('ArrowRight');
                assertEqual(
                  addCalls,
                  1,
                  'window.addEventListener("keydown") debe llamarse exactamente 1 vez aunque cambie el estado',
                );
              } finally {
                await mounted.unmount();
              }
              assertEqual(
                removeCalls,
                1,
                'window.removeEventListener("keydown") debe llamarse exactamente 1 vez al desmontar',
              );
            } finally {
              window.addEventListener = origAdd;
              window.removeEventListener = origRemove;
            }
          },
        },
      ]);
    },
  },

  // =========================================================================
  // KATA 5: RENDIMIENTO QUIRÚRGICO CON REACT.MEMO + USECALLBACK
  // =========================================================================
  {
    id: 'kata-5-memo-usecallback',
    number: 5,
    title: 'Optimización Quirúrgica: `React.memo` + `useCallback` Funcional',
    subtitle: 'Evita re-renderizar 64 celdas cuando solo cambia 1 o un estado hermano',
    phaseRef: 7,
    difficulty: 'Arquitecto',
    javaParallel:
      'En Java dos referencias al mismo singleton son `==`. En JS `() => toggle(r, c)` crea una instancia de función NUEVA en cada render (`fn1 !== fn2`), rompiendo la comparación `Object.is` de `React.memo` si no estabilizas la referencia con `useCallback`.',
    scenario:
      'Este mini-tablero 8x8 instrumenta cada ejecución de `CellButton` llamando a `onCellRender?.(row, col)`. Ahora mismo, hacer click en "Refrescar HUD" o alternar una sola celda provoca 64 re-renders innecesarios. Optimízalo a coste O(1) en celdas no afectadas.',
    requirements: [
      'Envuelve `CellButton` en `memo(...)` (de `react`).',
      'Haz que `CellButton` reciba `row: number`, `col: number`, `alive: boolean` y una función estable `onToggle: (row: number, col: number) => void` (¡NO le pases una arrow inline `() => toggle(r, c)` creada dentro del `.map` del padre!).',
      'En `<OptimizedMiniBoard />`, envuelve `toggleCell` en `useCallback(..., [])` usando el actualizador funcional `setAliveSet(prev => ...)` para que su identidad referencial no dependa de `aliveSet`.',
      'Mantén intacta la llamada `onRender?.(row, col)` dentro del cuerpo de `CellButton` para que tanto la UI como los tests puedan medir los renders reales.',
    ],
    hints: [
      'Si `toggleCell` tiene `[aliveSet]` en su array de dependencias de `useCallback`, cada vez que cambie una celda cambiará la referencia de `toggleCell` y se re-renderizarán las 64 celdas. Usa `setAliveSet((prev) => { const next = new Set(prev); ...; return next; })` con `[]` vacío.',
      'Ojo también con `onRender`: en los tests se pasa la misma función estable `onCellRender`, y para el contador visual del componente padre evita pasar una función nueva en cada render al hijo (puedes usar un `useRef` para el contador visual o no pasarlo como prop cambiante).',
      'Dentro de `CellButton`, ahí sí puedes hacer `onClick={() => onToggle(row, col)}`, porque eso está DENTRO del hijo ya protegido por `memo`, no en las props que `memo` compara desde fuera.',
    ],
    rules: {
      forbidExplicitAny: true,
    },
    previewExportName: 'OptimizedMiniBoard',
    starterCode: `import React, { memo, useCallback, useRef, useState } from 'react';

interface CellButtonProps {
  row: number;
  col: number;
  alive: boolean;
  onToggle: (row: number, col: number) => void;
  onRender?: (row: number, col: number) => void;
}

// TODO 1: Envuelve CellButton con memo(...)
function CellButton({ row, col, alive, onToggle, onRender }: CellButtonProps) {
  onRender?.(row, col);
  return (
    <button
      type="button"
      data-testid={\`mini-cell-\${row}-\${col}\`}
      onClick={() => onToggle(row, col)}
      style={{
        width: 22,
        height: 22,
        padding: 0,
        borderRadius: 4,
        border: '1px solid #334155',
        background: alive ? '#38bdf8' : '#0f172a',
        cursor: 'pointer',
      }}
    />
  );
}

export interface OptimizedMiniBoardProps {
  onCellRender?: (row: number, col: number) => void;
}

export function OptimizedMiniBoard({ onCellRender }: OptimizedMiniBoardProps) {
  void memo;
  void useCallback;
  const [aliveSet, setAliveSet] = useState<ReadonlySet<string>>(
    () => new Set(['2:2', '2:3', '2:4']),
  );
  const [hudRefreshCount, setHudRefreshCount] = useState(0);
  const totalCellRendersRef = useRef(0);

  const trackRender = useCallback(
    (r: number, c: number) => {
      totalCellRendersRef.current += 1;
      onCellRender?.(r, c);
    },
    [onCellRender],
  );

  // ❌ BUG ACTUAL: función recreada en cada render leyendo aliveSet directamente
  const toggleCell = (row: number, col: number) => {
    const key = \`\${row}:\${col}\`;
    const next = new Set(aliveSet);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setAliveSet(next);
  };

  const cells = [];
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      cells.push(
        <CellButton
          key={\`\${r}-\${c}\`}
          row={r}
          col={c}
          alive={aliveSet.has(\`\${r}:\${c}\`)}
          onToggle={(row, col) => toggleCell(row, col)}
          onRender={trackRender}
        />,
      );
    }
  }

  return (
    <div style={{ display: 'grid', gap: 10 }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
        <button
          type="button"
          data-testid="btn-hud"
          onClick={() => setHudRefreshCount((n) => n + 1)}
        >
          Refrescar HUD ({hudRefreshCount})
        </button>
        <span style={{ fontSize: 13 }}>
          Ejecuciones acumuladas de <code>CellButton</code>:{' '}
          <strong>{totalCellRendersRef.current}</strong>
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 22px)', gap: 3 }}>
        {cells}
      </div>
    </div>
  );
}
`,
    solutionCode: `import React, { memo, useCallback, useRef, useState } from 'react';

interface CellButtonProps {
  row: number;
  col: number;
  alive: boolean;
  onToggle: (row: number, col: number) => void;
  onRender?: (row: number, col: number) => void;
}

const CellButton = memo(function CellButton({
  row,
  col,
  alive,
  onToggle,
  onRender,
}: CellButtonProps) {
  onRender?.(row, col);
  return (
    <button
      type="button"
      data-testid={\`mini-cell-\${row}-\${col}\`}
      onClick={() => onToggle(row, col)}
      style={{
        width: 22,
        height: 22,
        padding: 0,
        borderRadius: 4,
        border: '1px solid #334155',
        background: alive ? '#38bdf8' : '#0f172a',
        cursor: 'pointer',
      }}
    />
  );
});

export interface OptimizedMiniBoardProps {
  onCellRender?: (row: number, col: number) => void;
}

export function OptimizedMiniBoard({ onCellRender }: OptimizedMiniBoardProps) {
  const [aliveSet, setAliveSet] = useState<ReadonlySet<string>>(
    () => new Set(['2:2', '2:3', '2:4']),
  );
  const [hudRefreshCount, setHudRefreshCount] = useState(0);
  const totalCellRendersRef = useRef(0);

  const trackRender = useCallback(
    (r: number, c: number) => {
      totalCellRendersRef.current += 1;
      onCellRender?.(r, c);
    },
    [onCellRender],
  );

  const toggleCell = useCallback((row: number, col: number) => {
    const key = \`\${row}:\${col}\`;
    setAliveSet((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  const cells = [];
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      cells.push(
        <CellButton
          key={\`\${r}-\${c}\`}
          row={r}
          col={c}
          alive={aliveSet.has(\`\${r}:\${c}\`)}
          onToggle={toggleCell}
          onRender={trackRender}
        />,
      );
    }
  }

  return (
    <div style={{ display: 'grid', gap: 10 }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
        <button
          type="button"
          data-testid="btn-hud"
          onClick={() => setHudRefreshCount((n) => n + 1)}
        >
          Refrescar HUD ({hudRefreshCount})
        </button>
        <span style={{ fontSize: 13 }}>
          Ejecuciones acumuladas de <code>CellButton</code>:{' '}
          <strong>{totalCellRendersRef.current}</strong>
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 22px)', gap: 3 }}>
        {cells}
      </div>
    </div>
  );
}
`,
    async runTests(mod) {
      const Comp = mod.OptimizedMiniBoard as React.ComponentType<{
        onCellRender?: (r: number, c: number) => void;
      }>;

      return runSuite([
        {
          name: 'Actualizar el estado hermano (btn-hud) produce 0 re-renders en las 64 celdas',
          async fn() {
            const rendered: string[] = [];
            const onCellRender = (r: number, c: number) => rendered.push(`${r}:${c}`);
            const mounted = await mountForTest(React.createElement(Comp, { onCellRender }));
            try {
              assertEqual(rendered.length, 64, 'Montaje inicial debe renderizar las 64 celdas');
              rendered.length = 0;

              await mounted.click(
                mounted.container.querySelector('[data-testid="btn-hud"]'),
                'btn-hud',
              );
              assertEqual(
                rendered.length,
                0,
                'Al refrescar el HUD del padre, 0 celdas debían re-renderizarse',
              );
            } finally {
              await mounted.unmount();
            }
          },
        },
        {
          name: 'Hacer click en la celda (4, 5) re-renderiza EXCLUSIVAMENTE esa celda (1 de 64)',
          async fn() {
            const rendered: string[] = [];
            const onCellRender = (r: number, c: number) => rendered.push(`${r}:${c}`);
            const mounted = await mountForTest(React.createElement(Comp, { onCellRender }));
            try {
              rendered.length = 0;
              await mounted.click(
                mounted.container.querySelector('[data-testid="mini-cell-4-5"]'),
                'mini-cell-4-5',
              );
              assertEqual(
                rendered.length,
                1,
                `Solo debía re-renderizarse 1 celda, pero se re-renderizaron ${rendered.length}`,
              );
              assertEqual(rendered[0], '4:5', 'La única celda re-renderizada debe ser 4:5');
            } finally {
              await mounted.unmount();
            }
          },
        },
      ]);
    },
  },

  // =========================================================================
  // KATA 6: DI CON REACT CONTEXT + VALIDACIÓN DE FRONTERA (UNKNOWN)
  // =========================================================================
  {
    id: 'kata-6-context-di-boundary',
    number: 6,
    title: 'DI estilo Spring con Context + Parser Defensivo (`unknown`)',
    subtitle: 'Inversión de control testable por subárbol y frontera inmune a entradas corruptas',
    phaseRef: 8,
    difficulty: 'Arquitecto',
    javaParallel:
      'Une tus dos pilares de backend Spring: `@Configuration` + `@Inject` (desacoplando consumidores para inyectar dobles en tests) y Bean Validation en el controlador tratando todo input externo como `unknown` hostil.',
    scenario:
      'Construye un contenedor IoC `<SeedSourceProvider>` con su hook guardián `useSeedSource()`, y el parser de frontera `parseQueryCoords(raw: unknown, size: number)` capaz de hidratar coordenadas desde un query string `"1:2,3:4"` descartando entradas fuera de rango, duplicadas o malformadas.',
    requirements: [
      '`useSeedSource()` debe leer el `Context` y lanzar un `Error` explícito si se invoca fuera de `<SeedSourceProvider>` (igual que `NoSuchBeanDefinitionException`).',
      '`<SeedSourceProvider source={...}>` debe permitir inyectar una implementación opcional `source` (para tests) o crear una por defecto si no se pasa.',
      '`parseQueryCoords(raw: unknown, size: number)`: si `typeof raw !== "string"` o está vacío, devuelve `[]`. Separa por `","`, extrae pares `row:col` enteros (`Number.isInteger`) con `0 <= row < size` y `0 <= col < size`, ignorando tokens inválidos (como `"abc"`, `"99:1"`, `"-1:2"`, `"1.5:2"`) y eliminando duplicados.',
      '`<SeedImporterCard />` debe usar `useSeedSource().readRawQuery()` y mostrar cuántas celdas válidas se importaron en `data-testid="imported-count"`.',
    ],
    hints: [
      'Crea el contexto con `const SeedSourceContext = createContext<SeedSource | null>(null);`. Así obligas al hook `useSeedSource()` a verificar `if (!ctx) throw new Error(...)`.',
      'Cuidado con `Number("")` en JavaScript: ¡devuelve `0`! Asegúrate de que ambas partes `rowStr.trim()` y `colStr.trim()` no estén vacías antes de convertir con `Number(...)` y comprobar `Number.isInteger(r)`.',
      'Usa un `Set<string>` (`seen.has(\`\${r}:\${c}\`)`) para filtrar coordenadas duplicadas conservando el orden.',
    ],
    rules: {
      forbidTypeAssertions: true,
      forbidExplicitAny: true,
    },
    previewExportName: 'SeedImporterPreview',
    starterCode: `import React, { createContext, useContext, useMemo, useState } from 'react';

export interface Coord {
  readonly row: number;
  readonly col: number;
}

export interface SeedSource {
  readRawQuery(): unknown;
}

const defaultSource: SeedSource = {
  readRawQuery: () => '1:2, 2:3, basura, 99:0, 1:2, 3:1',
};

const SeedSourceContext = createContext<SeedSource | null>(null);

export function SeedSourceProvider({
  source,
  children,
}: {
  source?: SeedSource;
  children: React.ReactNode;
}) {
  const value = useMemo(() => source ?? defaultSource, [source]);
  return (
    <SeedSourceContext.Provider value={value}>
      {children}
    </SeedSourceContext.Provider>
  );
}

// TODO 1: Lee SeedSourceContext; si es null lanza un Error claro
export function useSeedSource(): SeedSource {
  void useContext;
  void SeedSourceContext;
  return defaultSource;
}

// TODO 2: Parsea raw: unknown de forma 100% defensiva para un tablero [0 .. size - 1]
export function parseQueryCoords(raw: unknown, size: number): Coord[] {
  void raw;
  void size;
  return [];
}

export function SeedImporterCard({ boardSize = 10 }: { boardSize?: number }) {
  const source = useSeedSource();
  const coords = useMemo(
    () => parseQueryCoords(source.readRawQuery(), boardSize),
    [source, boardSize],
  );

  return (
    <div style={{ display: 'grid', gap: 6 }}>
      <div data-testid="imported-count">
        Celdas válidas importadas: <strong>{coords.length}</strong>
      </div>
      <code style={{ fontSize: 12, opacity: 0.85 }}>
        {coords.map((c) => \`(\${c.row},\${c.col})\`).join(' ') || 'ninguna'}
      </code>
    </div>
  );
}

export function SeedImporterPreview() {
  const [rawInput, setRawInput] = useState('1:2, 2:3, basura, 99:0, 1:2, 3:1');
  const liveSource = useMemo<SeedSource>(
    () => ({ readRawQuery: () => rawInput }),
    [rawInput],
  );

  return (
    <SeedSourceProvider source={liveSource}>
      <div style={{ display: 'grid', gap: 10 }}>
        <label style={{ fontSize: 13, fontWeight: 600 }}>
          Simular query string externo (hostil / sin tipar):
        </label>
        <input
          value={rawInput}
          onChange={(e) => setRawInput(e.target.value)}
        />
        <SeedImporterCard boardSize={10} />
      </div>
    </SeedSourceProvider>
  );
}
`,
    solutionCode: `import React, { createContext, useContext, useMemo, useState } from 'react';

export interface Coord {
  readonly row: number;
  readonly col: number;
}

export interface SeedSource {
  readRawQuery(): unknown;
}

const defaultSource: SeedSource = {
  readRawQuery: () => '1:2, 2:3, basura, 99:0, 1:2, 3:1',
};

const SeedSourceContext = createContext<SeedSource | null>(null);

export function SeedSourceProvider({
  source,
  children,
}: {
  source?: SeedSource;
  children: React.ReactNode;
}) {
  const value = useMemo(() => source ?? defaultSource, [source]);
  return (
    <SeedSourceContext.Provider value={value}>
      {children}
    </SeedSourceContext.Provider>
  );
}

export function useSeedSource(): SeedSource {
  const context = useContext(SeedSourceContext);
  if (!context) {
    throw new Error('useSeedSource debe invocarse dentro de <SeedSourceProvider>');
  }
  return context;
}

export function parseQueryCoords(raw: unknown, size: number): Coord[] {
  if (typeof raw !== 'string' || raw.trim().length === 0) {
    return [];
  }

  const seen = new Set<string>();
  const valid: Coord[] = [];

  for (const token of raw.split(',')) {
    const parts = token.trim().split(':');
    if (parts.length !== 2) continue;

    const rowText = parts[0].trim();
    const colText = parts[1].trim();
    if (rowText.length === 0 || colText.length === 0) continue;

    const row = Number(rowText);
    const col = Number(colText);
    if (!Number.isInteger(row) || !Number.isInteger(col)) continue;
    if (row < 0 || row >= size || col < 0 || col >= size) continue;

    const key = \`\${row}:\${col}\`;
    if (seen.has(key)) continue;
    seen.add(key);
    valid.push({ row, col });
  }

  return valid;
}

export function SeedImporterCard({ boardSize = 10 }: { boardSize?: number }) {
  const source = useSeedSource();
  const coords = useMemo(
    () => parseQueryCoords(source.readRawQuery(), boardSize),
    [source, boardSize],
  );

  return (
    <div style={{ display: 'grid', gap: 6 }}>
      <div data-testid="imported-count">
        Celdas válidas importadas: <strong>{coords.length}</strong>
      </div>
      <code style={{ fontSize: 12, opacity: 0.85 }}>
        {coords.map((c) => \`(\${c.row},\${c.col})\`).join(' ') || 'ninguna'}
      </code>
    </div>
  );
}

export function SeedImporterPreview() {
  const [rawInput, setRawInput] = useState('1:2, 2:3, basura, 99:0, 1:2, 3:1');
  const liveSource = useMemo<SeedSource>(
    () => ({ readRawQuery: () => rawInput }),
    [rawInput],
  );

  return (
    <SeedSourceProvider source={liveSource}>
      <div style={{ display: 'grid', gap: 10 }}>
        <label style={{ fontSize: 13, fontWeight: 600 }}>
          Simular query string externo (hostil / sin tipar):
        </label>
        <input
          value={rawInput}
          onChange={(e) => setRawInput(e.target.value)}
        />
        <SeedImporterCard boardSize={10} />
      </div>
    </SeedSourceProvider>
  );
}
`,
    async runTests(mod) {
      const parseQueryCoords = mod.parseQueryCoords as (
        raw: unknown,
        size: number,
      ) => Array<{ row: number; col: number }>;
      const SeedSourceProvider = mod.SeedSourceProvider as React.ComponentType<{
        source?: { readRawQuery(): unknown };
        children?: React.ReactNode;
      }>;
      const SeedImporterCard = mod.SeedImporterCard as React.ComponentType<{
        boardSize?: number;
      }>;

      return runSuite([
        {
          name: 'parseQueryCoords filtra tipos no-string, fuera de límites, decimales, vacíos y duplicados',
          fn() {
            assertEqual(parseQueryCoords(null, 10).length, 0, 'null -> []');
            assertEqual(parseQueryCoords({ evil: true }, 10).length, 0, 'object -> []');
            const parsed = parseQueryCoords('0:0, -1:2, 2:10, 1.5:2, :, hola, 4:5, 0:0', 10);
            assertEqual(parsed.length, 2, 'Solo (0,0) y (4,5) son válidas y únicas');
            assertEqual(parsed[0].row, 0, 'coord[0].row');
            assertEqual(parsed[1].col, 5, 'coord[1].col');
          },
        },
        {
          name: '<SeedImporterCard /> lanza error explícito si se monta sin <SeedSourceProvider>',
          async fn() {
            let caught = false;
            const prevConsoleError = console.error;
            console.error = () => {};
            try {
              const mounted = await mountForTest(React.createElement(SeedImporterCard));
              await mounted.unmount();
            } catch {
              caught = true;
            } finally {
              console.error = prevConsoleError;
            }
            assert(caught, 'Montar SeedImporterCard fuera del Provider debía lanzar Error');
          },
        },
        {
          name: 'Inyección de dependencias funciona con un mock SeedSource en tests',
          async fn() {
            const mockSource = { readRawQuery: () => '1:1, 2:2, 3:3, corrupto, 99:99' };
            const mounted = await mountForTest(
              React.createElement(
                SeedSourceProvider,
                { source: mockSource },
                React.createElement(SeedImporterCard, { boardSize: 8 }),
              ),
            );
            try {
              const text = mounted.container.querySelector(
                '[data-testid="imported-count"]',
              )?.textContent;
              assert(
                text?.includes('3'),
                `Con el mock inyectado debía mostrar 3 celdas válidas, pero mostró: "${text}"`,
              );
            } finally {
              await mounted.unmount();
            }
          },
        },
      ]);
    },
  },
];
