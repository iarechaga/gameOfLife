export interface GuideCodeComparison {
  badLabel: string;
  badCode: string;
  goodLabel: string;
  goodCode: string;
}

export interface GuidePhase {
  phase: number;
  title: string;
  tagline: string;
  readingMinutes: number;
  relatedKataId?: string;
  repoFiles: string[];
  javaMentalTrap: string;
  reactMentalShift: string;
  deepDivePoints: Array<{ heading: string; body: string }>;
  codeComparison: GuideCodeComparison;
  seniorChecklist: string[];
}

export const GUIDE_PHASES: GuidePhase[] = [
  {
    phase: 1,
    title: 'Event Loop Monohilo, `this` Dinámico y Stale Closures',
    tagline: 'Reprograma tu intuición de concurrencia JVM antes de tocar JSX',
    readingMinutes: 8,
    relatedKataId: 'kata-4-effects-stale-closures',
    repoFiles: ['src/hooks/useGame.ts'],
    javaMentalTrap:
      'En Java cada petición o bucle puede bloquear su hilo (`Thread.sleep(1000)` en `GameRunner.java`), `dish::cleanDeadCells` ata `this` al objeto receptor y las lambdas solo leen variables locales effectively final.',
    reactMentalShift:
      'Tu JS y el motor de renderizado a 60/120 Hz comparten UN único hilo. `this` depende de cómo se invoca la función (no de dónde se declaró), y cada render de React crea un ámbito léxico (closure) distinto con sus propias constantes.',
    deepDivePoints: [
      {
        heading: 'Call Stack → Microtasks → Render Frame → Macrotask',
        body: 'Tras vaciar la pila síncrona, V8 ejecuta TODAS las microtareas encoladas (`Promise.then`, código tras `await`) antes de permitir al navegador pintar un solo píxel. Después toma una macrotarea (`setInterval`, `setTimeout`, click). Un bucle pesado síncrono o de microtasks congela toda la pestaña.',
      },
      {
        heading: 'Pérdida de `this` al pasar referencias a métodos',
        body: 'Pasar `onClick={dish.cleanDeadCells}` desvincula el receptor (`this === undefined` en strict mode). Envuelve siempre en arrow function `() => dish.cleanDeadCells()` o usa funciones puras.',
      },
      {
        heading: 'La semilla de los Stale Closures',
        body: 'Cuando React renderiza por 1ª vez `const iteration = 0`, los callbacks creados en ese render capturan esa constante `0`. En el render #2 existe OTRA constante `const iteration = 1` en otro scope. Si un timer viejo nunca se actualiza ni usa `useRef`, leerá `0` eternamente.',
      },
    ],
    codeComparison: {
      badLabel: '❌ Intuición Java (bloqueo + pérdida de this)',
      badCode: `// 1. Pérdida de receptor this:
const clean = petriDish.cleanDeadCells;
clean(); // TypeError: Cannot read properties of undefined

// 2. Espera activa que congela el hilo de UI:
const end = Date.now() + 1000;
while (Date.now() < end) { /* 0 FPS, navegador muerto */ }`,
      goodLabel: '✅ Idiomático en TS Asíncrono y Closures limpios',
      goodCode: `// 1. Arrow léxica preserva la instancia receptora:
const clean = () => petriDish.cleanDeadCells();

// 2. Cesión cooperativa al Event Loop:
const sleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

await sleep(1000); // El hilo queda libre para pintar a 60fps`,
    },
    seniorChecklist: [
      'Distingo qué va a la cola de Microtasks (`await`) frente a Macrotasks (`setInterval`).',
      'Entiendo por qué dos renders distintos de la misma función componente tienen scopes independientes en memoria.',
    ],
  },
  {
    phase: 2,
    title: 'Álgebra de Tipos en TypeScript: Estructural, Uniones y `never`',
    tagline: 'Ve mucho más allá de clases e interfaces nominales estilo Java',
    readingMinutes: 12,
    relatedKataId: 'kata-1-type-guards',
    repoFiles: ['src/rules/GameRules.ts', 'src/context/GameDependenciesContext.tsx'],
    javaMentalTrap:
      'En Java el tipado es nominal (`RowIndex` != `ColumnIndex`) y `instanceof` o Jackson validan tipos en runtime. En TS muchos seniors abusan de `as MiDto` creyendo que convierte o comprueba algo.',
    reactMentalShift:
      'En TypeScript los tipos son conjuntos estructurales que se borran al 100% al compilar (`0 bytes` en JS). El código más robusto modela estados con Uniones Discriminadas, verifica exhaustividad con `never` y valida fronteras externas tratando la entrada como `unknown`.',
    deepDivePoints: [
      {
        heading: 'Uniones Discriminadas > Jerarquías de clases o flags sueltos',
        body: 'En lugar de `{ loading: boolean; data: T | null; error: Error | null }` (que permite 8 combinaciones, la mitad inválidas), defines una unión por literal `status: "idle" | "loading" | "ready" | "error"`. Solo los estados legales compilan.',
      },
      {
        heading: 'Type Guards (`val is Preset`) frente a la mentira `as`',
        body: '`valor as PatternPreset` silencia al compilador sin ejecutar ni una instrucción en runtime. Un Type Predicate real ejecuta una comprobación booleana y estrecha el tipo en la rama verdadera.',
      },
      {
        heading: 'Teoría de conjuntos: `never` ⊂ literal ⊂ `string` ⊂ `unknown` (y `any` rompe el sistema)',
        body: '`unknown` es el equivalente seguro a `java.lang.Object`: obliga a estrechar antes de invocar propiedades. `never` es el conjunto vacío: ideal en el `default:` de un `switch` para que añadir un nuevo estado rompa la compilación en todos los puntos olvidados.',
      },
      {
        heading: 'Utility Types y Branded Types',
        body: 'Calcula DTOs derivados sin duplicar clases: `Readonly<T>`, `Partial<Omit<User, "id">>`, `Record<PatternPreset, Config>`. Si necesitas impedir mezclar `Row` y `Col` numéricos, usa `type Row = number & { readonly __brand: unique symbol }`.',
      },
    ],
    codeComparison: {
      badLabel: '❌ Cast inseguro + Flags booleanos acoplados',
      badCode: `interface BadState {
  loading: boolean;
  cells?: number;
  error?: string;
}

// ¡Mentira en compilación! Si el DOM trae "hack", colapsa luego:
const preset = event.target.value as PatternPreset;`,
      goodLabel: '✅ Unión Discriminada + Type Guard + never',
      goodCode: `type LoadState =
  | { status: 'loading' }
  | { status: 'ready'; cells: number }
  | { status: 'error'; message: string };

function isPatternPreset(v: string): v is PatternPreset {
  return Object.prototype.hasOwnProperty.call(PATTERNS, v);
}

function assertNever(x: never): never {
  throw new Error(\`Caso no cubierto: \${JSON.stringify(x)}\`);
}`,
    },
    seniorChecklist: [
      'He eliminado `any` y `as Tipo` de mi vocabulario habitual en favor de `unknown` y Type Guards.',
      'Sé forzar errores de compilación exhaustivos asignando el caso `default` a `never`.',
    ],
  },
  {
    phase: 3,
    title: 'Inmutabilidad Estructural e Identidad Referencial (`Object.is`)',
    tagline: 'Por qué redefinir `.equals()` no sirve de nada en React',
    readingMinutes: 9,
    relatedKataId: 'kata-3-reducer-timetravel',
    repoFiles: ['src/storage/SquaredPetriDish.ts', 'src/generation/GenerationCalculators.ts'],
    javaMentalTrap:
      'En tu `CellBlock.java` sobreescribes `equals()` y `hashCode()`, mutas el mismo `SquaredPetriDish` en cada turno y confías en igualdad estructural.',
    reactMentalShift:
      'React jamás llama a `.equals()`. Decide si el estado o las props han cambiado mediante `Object.is(prev, next)` (comparación de puntero O(1)). Si mutas un objeto in-place y pasas la misma referencia a `setState`, React aborta el renderizado asumiendo que no hubo cambios.',
    deepDivePoints: [
      {
        heading: 'Por qué creamos `clone()` y `evolveImmutable()` en `typescript-react/`',
        body: 'En consola (`typescript/`) podíamos mutar `petriDish` porque imprimíamos imperativamente en cada vuelta del bucle. En React, `setPetriDish(prev => calc.evolveImmutable(prev))` garantiza `prev !== next`, dispara el repintado y conserva intacto el snapshot anterior.',
      },
      {
        heading: 'Structural Sharing (Copia superficial del camino modificado)',
        body: 'Al hacer `{ ...state, iteration: state.iteration + 1 }`, NO clonas todo el árbol de memoria: creas un objeto raíz nuevo cuyas demás propiedades apuntan en O(1) a las referencias existentes que no cambiaron.',
      },
      {
        heading: 'Métodos trampa del estándar Array de JS',
        body: '`push`, `pop`, `splice`, `reverse` y `sort` MUTAN el array original y corrompen React. Usa `[...arr, x]`, `arr.filter(...)`, `arr.map(...)`, `arr.slice(...)` o los nuevos `arr.toSorted(...)` / `arr.toReversed(...)`. Para grafos anidados profundos usa `Immer`.',
      },
    ],
    codeComparison: {
      badLabel: '❌ Mutación in-place (React NO re-renderiza)',
      badCode: `const handleToggleBroken = (r: number, c: number) => {
  petriDish.add(new CellBlock(r, c, new Cell()));
  // Misma referencia en memoria -> Object.is(prev, petriDish) === true
  setPetriDish(petriDish); // ¡Pantalla congelada!
};`,
      goodLabel: '✅ Transición inmutable (typescript-react/src/hooks/useGame.ts)',
      goodCode: `const toggleCell = useCallback((row: number, column: number) => {
  setPetriDish((currentDish) => {
    const nextDish = currentDish.clone();
    if (nextDish.getCell(row, column).containsLivingCell()) {
      nextDish.remove(row, column);
    } else {
      nextDish.add(new CellBlock(row, column, new Cell()));
    }
    return nextDish; // Nueva referencia -> React reconcilia
  });
}, []);`,
    },
    seniorChecklist: [
      'Comprendo por qué `Object.is` en O(1) exige crear nuevas referencias en toda la ruta desde la raíz del estado hasta el nodo modificado.',
      'Uso tipos `readonly` y `ReadonlyArray<T>` para que el propio compilador me impida hacer `.push()` por accidente.',
    ],
  },
  {
    phase: 4,
    title: 'Motor Interno de React: `UI = f(state)`, Fiber y Reconciliación',
    tagline: 'Qué pasa exactamente entre `setState` y los píxeles de la pantalla',
    readingMinutes: 10,
    repoFiles: ['src/components/PetriDishBoard.tsx', 'src/main.tsx'],
    javaMentalTrap:
      'Pensar en componentes como widgets Swing/JavaFX con vida mutable cuyos métodos invocas (`tile.setAlive(true)`), o creer que JSX concatena strings HTML.',
    reactMentalShift:
      'Un componente es una función pura que recibe datos y devuelve un árbol de descriptores ligeros (`ReactElement`). El motor Fiber separa el cálculo puro del diff (Render Phase) de la mutación real del DOM (Commit Phase).',
    deepDivePoints: [
      {
        heading: 'Render Phase (Pura e interrumpible) vs Commit Phase (Efectos DOM)',
        body: 'En Render Phase React llama a tus componentes para calcular qué cambiaría. En `<StrictMode>` (desarrollo) React invoca tus componentes DOS veces a propósito para destapar mutaciones ocultas. Solo en Commit Phase toca el DOM real.',
      },
      {
        heading: 'El verdadero algoritmo de `key`',
        body: '`key` es la clave primaria con la que Fiber asocia instancias entre dos renders consecutivos. Si usas `key={index}` y eliminas el primer elemento, todos los demás heredan la instancia y el estado interno del vecino anterior. En `PetriDishBoard.tsx` usamos `key={`${row}-${column}`}`.',
      },
      {
        heading: 'Resetear estado intencionalmente cambiando `key`',
        body: 'Truco de Senior en React: si quieres destruir y reiniciar limpio todo el estado interno de `<EditorFormulario />` al cambiar de cliente, pásale `<EditorFormulario key={customerId} />` en lugar de escribir `useEffect` reseteadores.',
      },
    ],
    codeComparison: {
      badLabel: '❌ Render impuro + key basada en índice volátil',
      badCode: `let globalRenders = 0;
function BadList({ items }: { items: Item[] }) {
  globalRenders++; // ¡Efecto lateral en Render Phase! StrictMode lo duplica
  return items.map((it, idx) => <Row key={idx} item={it} />);
}`,
      goodLabel: '✅ Render 100% puro + identidad de dominio estable',
      goodCode: `function CleanList({ items }: { items: readonly Item[] }) {
  return (
    <ul>
      {items.map((item) => (
        <Row key={item.id} item={item} />
      ))}
    </ul>
  );
}`,
    },
    seniorChecklist: [
      'Sé explicar por qué `<StrictMode>` duplica renders y montajes de efectos en modo desarrollo.',
      'Trato `key` como identidad semántica de negocio (e incluso como herramienta para forzar remounts limpios).',
    ],
  },
  {
    phase: 5,
    title: 'Anatomía de los Hooks en Memoria: `useState`, `useReducer` y `useRef`',
    tagline: 'Cómo mantiene estado una simple función y cuándo usar cada primitiva',
    readingMinutes: 11,
    relatedKataId: 'kata-3-reducer-timetravel',
    repoFiles: ['src/hooks/useGame.ts'],
    javaMentalTrap:
      'Meter un Hook dentro de un `if (isAdmin)` o esperar que tras `setIteration(iteration + 1)` la variable local `iteration` ya valga `1` en la línea siguiente.',
    reactMentalShift:
      'Cada nodo Fiber guarda una lista indexada por orden de llamada (`slot[0]`, `slot[1]`...). Por eso el orden de Hooks debe ser idéntico en cada render. Además, el estado de un render es una fotografía inmutable hasta el siguiente render.',
    deepDivePoints: [
      {
        heading: 'Lazy Initialization y Actualizadores Funcionales',
        body: 'En `useGame.ts:25`, `useState(createSeededDish)` pasa la referencia sin `()` para ejecutar la fábrica solo en el primer render. Y `setIteration(c => c + 1)` encadena transformaciones puras sobre el último valor en cola.',
      },
      {
        heading: '`useReducer`: Tu patrón Command / Máquina de Estados finita',
        body: 'Cuando una acción de dominio actualiza múltiples propiedades coordinadas (`TICK`, `STEP_BACK`, `RESET`), un reducer `(state, action) => nextState` centraliza las invariantes fuera del JSX y permite testear toda la lógica sin montar React.',
      },
      {
        heading: '`useRef<T>`: El equivalente al campo privado mutable sin repintado',
        body: '`useRef` devuelve una caja `{ current: T }` estable entre renders. Cambiar `ref.current = valor` NO solicita re-render: perfecto para IDs de timers, sockets, nodos `<canvas>` o recordar el valor del render anterior.',
      },
    ],
    codeComparison: {
      badLabel: '❌ Inicialización ansiosa + lectura de snapshot viejo',
      badCode: `// Construye y tira a la basura un tablero en CADA render:
const [dish, setDish] = useState(createExpensiveDish());

const advanceTwiceBroken = () => {
  setIteration(iteration + 1); // 0 + 1
  setIteration(iteration + 1); // ¡vuelve a calcular 0 + 1 = 1!
};`,
      goodLabel: '✅ Lazy init + actualizador funcional puro',
      goodCode: `// Solo invoca la fábrica en el montaje inicial:
const [dish, setDish] = useState(createExpensiveDish);

const advanceTwice = () => {
  setIteration((c) => c + 1); // 0 -> 1
  setIteration((c) => c + 1); // 1 -> 2
};`,
    },
    seniorChecklist: [
      'Sé elegir entre `useState` (estado independiente), `useReducer` (transiciones coordinadas) y `useRef` (mutable sin impacto visual).',
      'Nunca muto `ref.current` durante el cuerpo puro del render.',
    ],
  },
  {
    phase: 6,
    title: '`useEffect` Sin Dolor: Sincronización con Sistemas Externos',
    tagline: 'Desaprende el anti-patrón nº1: `useEffect` NO es un listener de modelo',
    readingMinutes: 12,
    relatedKataId: 'kata-4-effects-stale-closures',
    repoFiles: ['src/hooks/useGame.ts'],
    javaMentalTrap:
      'Usar `useEffect` como un `@EventListener` interno para sincronizar dos `useState` entre sí (`useEffect(() => setLivingCount(dish.count()), [dish])`) o disparar peticiones POST de un botón.',
    reactMentalShift:
      'Si un dato deriva de props/state, calcúlalo directamente durante el render. Si ocurre por un click, ejecútalo en el handler `onClick`. Reserva `useEffect` exclusivamente para conectar el componente con APIs externas (timers, `window`, WebSockets, red) con su `cleanup` simétrico.',
    deepDivePoints: [
      {
        heading: 'El ciclo exacto de vida de un Efecto (NO es mount/unmount)',
        body: 'Piensa en ciclos de sincronización start/stop: cada vez que cambia `[isRunning, intervalMs]` en `useGame.ts:59-65`, React ejecuta primero el `clearInterval` del intervalo viejo y acto seguido arranca el `setInterval` con la velocidad nueva.',
      },
      {
        heading: 'Patrón Latest Ref (o `useEffectEvent`) para listeners estables',
        body: 'Cuando te suscribes a `window.addEventListener("keydown", ...)` no quieres desuscribirte en cada tick del juego, pero tampoco quieres leer variables obsoletas. Guardas el callback fresco en un `useRef` actualizado tras cada commit y el listener estable delega en `ref.current(event)`.',
      },
      {
        heading: 'Cancelación obligatoria de peticiones con `AbortController`',
        body: 'En cualquier efecto asíncrono manual, aborta en el cleanup (`return () => controller.abort()`) para impedir Race Conditions donde una petición antigua sobrescribe datos más recientes.',
      },
    ],
    codeComparison: {
      badLabel: '❌ Anti-patrón: Estado derivado en useEffect (doble render)',
      badCode: `const [livingCount, setLivingCount] = useState(0);
useEffect(() => {
  // Renderiza primero con el número viejo y fuerza un 2º render inmediato
  setLivingCount(petriDish.getOccupiedCells().length);
}, [petriDish]);`,
      goodLabel: '✅ Derivación directa en render + Efecto real con cleanup',
      goodCode: `// 1. Dato derivado calculado en el mismo pase de render:
const livingCount = petriDish.getOccupiedCells().length;

// 2. Sincronización real con el reloj del navegador:
useEffect(() => {
  if (!isRunning) return;
  const id = window.setInterval(nextGeneration, intervalMs);
  return () => window.clearInterval(id);
}, [isRunning, intervalMs, nextGeneration]);`,
    },
    seniorChecklist: [
      'Antes de escribir un `useEffect`, verifico siempre si es estado derivado (render/`useMemo`) o una acción de usuario (`onClick`).',
      'Todo `addEventListener`, `setInterval`, WebSocket o `fetch` en mis efectos tiene su `cleanup` simétrico.',
    ],
  },
  {
    phase: 7,
    title: 'Rendimiento Quirúrgico: `React.memo`, `useMemo` y `useCallback`',
    tagline: 'Controla exactamente cuándo cortocircuitar subárboles pesados',
    readingMinutes: 10,
    relatedKataId: 'kata-5-memo-usecallback',
    repoFiles: ['src/components/PetriDishBoard.tsx', 'src/hooks/useGame.ts'],
    javaMentalTrap:
      'Asumir que React solo re-ejecuta los hijos cuyas props cambian, o envolver funciones en `useCallback` sin envolver el componente hijo en `React.memo` (lo cual no ahorra ningún render).',
    reactMentalShift:
      'Por defecto, re-renderizar un padre re-renderiza todos sus hijos. En rejillas densas (400+ celdas), cortocircuitamos con `React.memo(CellTile)` + referencias de callback estables (`useCallback(..., [])` apoyado en actualizadores funcionales).',
    deepDivePoints: [
      {
        heading: 'Por qué `memo` sin `useCallback` fracasa',
        body: 'Cada vez que se ejecuta el padre, `const fn = (r, c) => ...` aloja un nuevo objeto `Function` (`Object.is(prevFn, nextFn) === false`). `React.memo` ve que la prop `onToggle` cambió de dirección de memoria y vuelve a renderizar las 400 celdas.',
      },
      {
        heading: 'Cuándo usar `useMemo` de verdad',
        body: 'Solo en dos casos: (1) cálculos puramente CPU-intensivos (> 1–2ms sobre colecciones grandes) o (2) preservar la identidad referencial de un objeto/array que entra en las props de un hijo `memo` o en las dependencias de un `useEffect` (como `value` en `GameDependenciesContext.tsx:53`).',
      },
      {
        heading: 'React 19 Compiler',
        body: 'El nuevo compilador de React memoiza automáticamente bloques JSX y closures en tiempo de build, pero solo puede optimizar componentes que cumplan estrictamente las reglas de pureza e inmutabilidad.',
      },
    ],
    codeComparison: {
      badLabel: '❌ Arrow inline en bucle rompe React.memo en las 400 celdas',
      badCode: `{cells.map((cell) => (
  <MemoizedCellTile
    key={cell.id}
    alive={cell.alive}
    // ¡Nueva función en cada render para cada una de las 400 celdas!
    onToggle={(r, c) => toggleCell(r, c)}
  />
))}`,
      goodLabel: '✅ Referencia estable + memo (PetriDishBoard.tsx)',
      goodCode: `// En useGame.ts: 0 dependencias gracias a currentDish => ...
const toggleCell = useCallback((row: number, col: number) => {
  setPetriDish((currentDish) => /* ... */);
}, []);

// En PetriDishBoard.tsx: 394 celdas saltan el render en O(1)
<CellTile key={\`\${row}-\${col}\`} row={row} column={col} alive={alive} onToggle={toggleCell} />`,
    },
    seniorChecklist: [
      'Mido con React DevTools Profiler ("Highlight updates / Why did this render?") antes de micro-optimizar componentes pequeños.',
      'Entiendo que `useCallback` sirve para estabilizar identidad referencial ante `memo` o `useEffect`, no para evitar crear el closure.',
    ],
  },
  {
    phase: 8,
    title: 'Arquitectura Limpia, Composición e Inyección de Dependencias',
    tagline: 'Traduce Spring IoC y Hexagonal Architecture al mundo React sin acoplamiento',
    readingMinutes: 10,
    relatedKataId: 'kata-6-context-di-boundary',
    repoFiles: ['src/context/GameDependenciesContext.tsx', 'src/App.tsx'],
    javaMentalTrap:
      'Intentar heredar componentes (`class CustomGrid extends BaseGrid`), importar singletons directamente en las vistas dificultando el testing, o usar un único React Context gigante como store global de alta frecuencia.',
    reactMentalShift:
      'Separamos 4 capas limpias: Dominio TS puro (0 React) → Infraestructura/DI (`Context Provider`) → Aplicación (`Custom Hooks`) → Vistas declarativas compuestas por `children` y Slots.',
    deepDivePoints: [
      {
        heading: 'Context como Contenedor IoC por Subárbol (`GameDependenciesContext.tsx`)',
        body: 'Definir `createContext<Deps | null>(null)` + `<GameDependenciesProvider dependencies={...}>` + `useGameDependencies()` te da exactamente la misma inversión de control que `@Configuration` y `@TestConfiguration` en Spring.',
      },
      {
        heading: 'Límite crítico de escalabilidad de Context',
        body: 'Cuando cambia el `value` de un Provider, TODOS los componentes suscritos a ese Context se re-renderizan ignorando `React.memo`. Nunca mezcles servicios estables con coordenadas de ratón o ticks de 60Hz en el mismo Context.',
      },
      {
        heading: 'Composición mediante Slots (adiós a plantillas heredadas)',
        body: 'En React un componente puede recibir otros árboles React por cualquier prop (`toolbar={<GameControls />}`, `footer={...}`, `children`), logrando polimorfismo visual limpio y tipado.',
      },
    ],
    codeComparison: {
      badLabel: '❌ Context monolítico volátil + sin validación de Provider',
      badCode: `// Mezcla servicios estables con estado que cambia cada 100ms:
const AppContext = createContext<any>({});
// Un botón que solo lee config se re-renderizará 10 veces por segundo.`,
      goodLabel: '✅ DI Context estabilizado con useMemo + Hook guardián',
      goodCode: `const GameDepsContext = createContext<GameDependencies | null>(null);

export function useGameDependencies(): GameDependencies {
  const ctx = useContext(GameDepsContext);
  if (!ctx) throw new Error('Falta <GameDependenciesProvider> en el árbol');
  return ctx;
}`,
    },
    seniorChecklist: [
      'Mi capa de dominio (`cell/`, `rules/`, `storage/`, `generation/`) tiene 0 imports de `react` y puede ejecutarse en Node o Web Workers.',
      'Separo estrictamente Contexts de inyección de servicios estables frente al estado reactivo de alta frecuencia.',
    ],
  },
  {
    phase: 9,
    title: 'Stack Enterprise en Producción (React 19, Server State y Formularios)',
    tagline: 'Qué piezas completan a React en un sistema corporativo real',
    readingMinutes: 9,
    relatedKataId: 'kata-2-discriminated-unions',
    repoFiles: ['package.json'],
    javaMentalTrap:
      'Intentar construir a mano en `useEffect` + `Redux/useState` la caché HTTP, reintentos, invalidación, deduplicación y estados de carga de 50 endpoints REST.',
    reactMentalShift:
      'Separamos radicalmente *Server State* (gestionado con TanStack Query como una caché Caffeine + SWR reactiva) de *Client UI State* (`useState`, URL Search Params o Zustand), y validamos formularios/DTOs con Zod.',
    deepDivePoints: [
      {
        heading: 'TanStack Query (React Query) = Tu Caffeine + Resilience4j en cliente',
        body: '`useQuery({ queryKey: ["dish", id], queryFn })` deduplica llamadas simultáneas desde 5 componentes distintos, cachea con `staleTime`, reintenta fallos transitorios e invalida automáticamente cachés tras un `useMutation`.',
      },
      {
        heading: 'La URL como fuente de verdad de primer nivel',
        body: 'Filtros de búsqueda, paginación, orden y preset activo pertenecen a los query params de la URL (`?preset=glider&speed=200`), no a `useState` efímero: así la pantalla es enlazable y sobrevive a F5.',
      },
      {
        heading: 'APIs modernas de React 19',
        body: '`ref` entra como una prop normal sin `forwardRef`; `useActionState` y `useOptimistic` simplifican mutaciones asíncronas con UI optimista reversible; y `use(promise)` se integra con `<Suspense>` y `<ErrorBoundary>`.',
      },
    ],
    codeComparison: {
      badLabel: '❌ Boilerplate manual frágil para cada endpoint REST',
      badCode: `const [data, setData] = useState<Order[] | null>(null);
const [loading, setLoading] = useState(false);
useEffect(() => {
  setLoading(true); // Sin caché, sin deduplicación, con race condition:
  fetch('/api/orders').then(r => r.json()).then(setData);
}, []);`,
      goodLabel: '✅ Patrón Enterprise declarativo (TanStack Query + Zod)',
      goodCode: `const { data, isPending, error } = useQuery({
  queryKey: ['orders', statusFilter],
  queryFn: async ({ signal }) => {
    const res = await fetch(\`/api/orders?status=\${statusFilter}\`, { signal });
    return OrderListSchema.parse(await res.json()); // Validado con Zod
  },
  staleTime: 30_000,
});`,
    },
    seniorChecklist: [
      'Distingo al instante si un dato es Server State (caché remota asíncrona) o Client UI State.',
      'Guardo el estado navegable/compartible en la URL validándolo defensivamente al hidratar.',
    ],
  },
  {
    phase: 10,
    title: 'Pirámide de Testing Profesional (Dominio → Hooks → Testing Library)',
    tagline: 'Testea comportamiento observable y accesibilidad, no detalles internos',
    readingMinutes: 9,
    relatedKataId: 'kata-6-context-di-boundary',
    repoFiles: ['test/generation.test.ts'],
    javaMentalTrap:
      'Abusar de mocks sobre componentes hijos o buscar elementos por clases CSS internas (`.btn-blue-2`), haciendo que cualquier ajuste visual rompa 80 tests aunque la aplicación funcione.',
    reactMentalShift:
      'El grueso algorítmico vive en TS puro con tests unitarios instantáneos (`generation.test.ts`); la UI se prueba montando componentes reales con `@testing-library/react`, localizando elementos por rol accesible (`getByRole`) y simulando la red con MSW (el WireMock del navegador).',
    deepDivePoints: [
      {
        heading: 'Nivel 1: Dominio y Reducers puros (70% de tus casos borde)',
        body: 'Tus reglas de Conway, `SquaredPetriDish.clone()`, `timeTravelReducer` y parsers `parseQueryCoords` son funciones/clases puras: corren en Node/Vitest a miles de tests por segundo sin JSDOM.',
      },
      {
        heading: 'Nivel 2 y 3: Testing Library + accesibilidad como contrato',
        body: 'Buscar con `getByRole("button", { name: /Celda \\(2, 3\\) viva/i })` fuerza automáticamente a que tu interfaz tenga `aria-label` y semántica correcta (como en `PetriDishBoard.tsx:16`).',
      },
      {
        heading: 'MSW (Mock Service Worker) > mockear `axios`/`fetch` a mano',
        body: 'Igual que en Spring Boot prefieres WireMock sobre mockear `RestTemplate` línea a línea, MSW intercepta tráfico HTTP real permitiendo ejercitar tus adaptadores, serialización y esquemas Zod reales.',
      },
    ],
    codeComparison: {
      badLabel: '❌ Test frágil acoplado a clases CSS e implementación',
      badCode: `// Si cambias la clase CSS o divides un subcomponente, el test explota:
const btn = container.querySelector('div.toolbar > button.primary-v2');
btn.click();
expect(componentInstance.state.internalCounter).toBe(1);`,
      goodLabel: '✅ Test resiliente orientado al usuario e IoC Context',
      goodCode: `render(
  <GameDependenciesProvider dependencies={deterministicTestDeps}>
    <App />
  </GameDependenciesProvider>
);
await user.click(screen.getByRole('button', { name: /Siguiente generación/i }));
expect(screen.getByText(/Generación:/i)).toHaveTextContent('1');`,
    },
    seniorChecklist: [
      'Mis tests sobreviven a refactorizaciones internas (p. ej. pasar de `useState` a `useReducer`) sin cambiar una línea del test.',
      'Inyecto dependencias deterministas envolviendo el árbol bajo prueba en su Provider correspondiente.',
    ],
  },
];
