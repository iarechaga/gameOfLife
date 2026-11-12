# Guía Completa y Profunda: De Senior Java a TypeScript + React

> Diseñada específicamente para un ingeniero **Senior Java (Spring, OOP, concurrencia JVM, testing estricto)** usando como hilo conductor real la arquitectura de este repositorio (`src/main/java/...` vs `typescript-react/`).

---

## Mapa Mental Rápido: Qué conservar de Java y qué desaprender

| Concepto en tu cabeza Java | Equivalente / Cambio de paradigma en TypeScript + React | Peligro nº1 al migrar |
| :--- | :--- | :--- |
| Hilos bloqueantes (`Thread.sleep`, Virtual Threads) | **Event Loop monohilo** + colas de microtareas (`Promise` / `async-await`) y macrotareas (`setInterval`) | Bloquear el hilo principal congela el navegador entero (0 FPS). |
| Tipado nominal (`class A`, `implements B`) | **Tipado estructural** (forma compatible = tipo compatible) + **borrado total** en runtime | Creer que una `interface` existe en runtime o valida un JSON entrante de red. |
| Identidad por contenido (`equals()` / `hashCode()`) | **Identidad referencial estricta (`Object.is(a, b)` / `===`)** | Mutar un objeto (`dish.add(...)`) y pasarlo a `setState(dish)`: React cree que nada cambió y **no repinta**. |
| Jerarquías de clases + herencia | **Funciones puras, Uniones Discriminadas (ADTs) y Composición (`children` / Hooks)** | Intentar crear clases base `AbstractComponent` o abusar de OOP donde una unión tipada es más segura. |
| Contenedor IoC (`@Configuration`, `@Bean`, `@Inject`) | **React Context + Custom Hooks** (`GameDependenciesProvider` + `useGameDependencies`) | Meter estado que cambia cada 100ms en un Context global y provocar re-renders masivos. |
| Ciclo de vida (`@PostConstruct`, `@PreDestroy`, Listeners) | **Sincronización declarativa (`useEffect` + función de `cleanup`)** | Usar `useEffect` como "listener de cambios de variables" para lógica de negocio o estado derivado. |
| `private volatile` / campos mutables internos | **`useRef<T>`** (caja mutable cuya mutación `.current` NO provoca re-render) | Guardar variables auxiliares en `let` fuera del componente (estado compartido entre instancias) o dentro (se resetean en cada render). |

---

## Fase 1: El Modelo de Ejecución — Event Loop, `this` y Closures Léxicos

Antes de tocar una sola etiqueta JSX, necesitas dominar tres mecánicas de JavaScript que funcionan **al revés** que en la JVM.

### 1.1 Event Loop Monohilo: Microtasks vs Macrotasks
En tu `GameRunner.java` hacías:
```java
for (int i = 0; i < 20; i++) {
    game.nextGeneration();
    Thread.sleep(1000); // Duermes el hilo; la JVM sigue viva en otros hilos
}
```
En el navegador tu código JS y el motor de pintado (Layout + Paint a 60/120 Hz) **comparten el mismo único hilo**:
1. Se ejecuta todo el *Call Stack* síncrono hasta vaciarse.
2. Se vacía **toda** la cola de **Microtasks** (`Promise.then`, continuaciones tras `await`, `queueMicrotask`). *Ojo: un bucle infinito de microtasks congela la pestaña igual que un `while(true)`.*
3. El navegador aprovecha para recalcular estilos y **pintar un frame en pantalla** si toca.
4. Toma **una** tarea de la cola de **Macrotasks** (`setTimeout`, `setInterval`, eventos de click/teclado) y vuelve al paso 1.

### 1.2 El problema de `this` (Method References rotos)
En Java, `dish::cleanDeadCells` captura la instancia receptora `dish`. En JavaScript, `this` dentro de un método de clase depende de **cómo se invoca en el punto de llamada**, no de dónde se declaró:
```ts
const fn = dish.cleanDeadCells;
fn(); // 💥 TypeError: Cannot read properties of undefined (this es undefined en strict mode)

// Solución idiomática al pasar callbacks:
const safeFn = () => dish.cleanDeadCells();
```

### 1.3 Closures y "Stale Closures" (La raíz del 70% de los bugs sutiles en React)
En Java, una lambda solo puede capturar variables locales *effectively final*. En JS/TS, una función captura el **ámbito léxico (scope)** donde fue creada.
En React, **cada render ejecuta la función del componente de arriba abajo creando un scope nuevo** con constantes nuevas (`const iteration = 0`, luego en otro render `const iteration = 1`). Si un `setInterval` creado en el render #1 capturó `iteration` (que valía `0`) y nunca recreas el intervalo, verá `iteration === 0` para toda la eternidad aunque la pantalla vaya por la generación 50. Eso es un **Stale Closure**.

---

## Fase 2: TypeScript Avanzado para Mentes Java

TypeScript no es C# ni Java transpilado: es un **sistema de tipos estructurales, algebraicos y de flujo de control** sobre los valores reales de JavaScript, con **Type Erasure del 100%**.

### 2.1 Tipado Estructural vs Nominal (y Branded Types)
En Java:
```java
record RowIndex(int value) {}
record ColumnIndex(int value) {}
// Incompatibles entre sí aunque ambos envuelvan un int
```
En TypeScript, si dos tipos tienen la misma estructura, **son compatibles**:
```ts
interface LivingRule { shouldApply(neighbours: number): boolean }
interface EmptyRule  { shouldApply(neighbours: number): boolean }
// ¡En TS puedes pasar un EmptyRule donde se espera un LivingRule!
```
Cuando en dominio rico quieres impedir mezclar un `UserId` con un `OrderId` (ambos `string` en runtime), usas **Branded Types** (coste cero en runtime):
```ts
declare const brand: unique symbol;
type Brand<T, B extends string> = T & { readonly [brand]: B };

type Row = Brand<number, 'Row'>;
type Col = Brand<number, 'Col'>;

function toRow(n: number): Row { return n as Row; }
function getCell(r: Row, c: Col) { /* ... */ }

const r = toRow(3);
const c = 4 as Col;
getCell(c, r); // ❌ Error de compilación: 'Col' no es asignable a 'Row'
```

### 2.2 Álgebra de Tipos: Uniones Discriminadas + Exhaustividad (`never`)
En Java 17+ tienes `sealed interface` + `switch` pattern matching. En TypeScript este es **el patrón rey** y reemplaza jerarquías enteras de herencia y estados booleanos imposibles (`isLoading && isError`):

```ts
// MAL (estilo flags mutables propenso a estados inválidos):
interface BadFetchState<T> {
  loading: boolean;
  data: T | null;
  error: Error | null; // ¿Qué pasa si loading=true y error!=null a la vez?
}

// BIEN (Unión Discriminada — solo los estados válidos son representables):
type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };

function renderState<T>(state: AsyncState<T>, renderData: (d: T) => string): string {
  switch (state.status) {
    case 'idle':
      return 'Esperando...';
    case 'loading':
      return 'Cargando...';
    case 'success':
      // Aquí TS sabe al 100% (Control Flow Narrowing) que state.data: T existe
      return renderData(state.data);
    case 'error':
      // Aquí TS sabe que state.error: Error existe
      return `Fallo: ${state.error.message}`;
    default: {
      // Garantía en compilación: si mañana alguien añade { status: 'retrying' }
      // este bloque deja de compilar automáticamente:
      const _exhaustiveCheck: never = state;
      return _exhaustiveCheck;
    }
  }
}
```

### 2.3 `unknown` vs `any` vs `never` (Teoría de Conjuntos)
Piensa en cada tipo de TS como el **conjunto de valores** que admite:
- **`never`** = Conjunto vacío $\emptyset$ (función que lanza excepción siempre o rama inalcanzable; equivalente al *bottom type*).
- **Literal Types** (`'alive'`, `42`, `true`) = Conjuntos unitarios $\{ \text{'alive'} \}$ (¡un valor concreto ES un tipo!).
- **`unknown`** = Conjunto universal seguro (equivalente honesto a `java.lang.Object`: no te deja llamar a nada sin antes hacer *narrowing* con `typeof`, `instanceof`, Type Guard o Zod).
- **`any`** = **Desactiva el compilador** (contagia silenciosamente todo lo que toca; trátalo como un `@SuppressWarnings` radioactivo prohibido en código de producción).

### 2.4 Transformadores de Tipos (`keyof`, Mapped Types, Utility Types)
En Java, si tienes una entidad `User` y necesitas un `UpdateUserPatchDto` con todos los campos opcionales y sin `id`, creas otra clase o usas MapStruct. En TS lo calculas en el sistema de tipos:
```ts
interface User {
  id: string;
  email: string;
  role: 'admin' | 'viewer';
}

type UpdateUserPatch = Partial<Omit<User, 'id'>>;
// Resultado exacto: { email?: string; role?: 'admin' | 'viewer' }

type ReadonlyUser = Readonly<User>;
type UserByIdMap = Record<User['id'], User>;
```

### 2.5 Borrado Total de Tipos y Validación de Frontera (El equivalente a Jackson + `@Valid`)
```ts
// ⚠️ TRAMPA CLÁSICA DE JAVA SENIOR:
const user = (await response.json()) as User;
// ¡`as User` NO convierte ni comprueba NADA en runtime! Es un cast ciego que se borra al compilar.
```
Si el backend devuelve `{ "id": 123 }` en vez de `"123"`, `user.id.toUpperCase()` explotará en producción minutos después lejos del `fetch`.
En TS profesional, en las fronteras I/O (`fetch`, `localStorage`, `URLSearchParams`, WebSockets) recibes `unknown` y parseas con un esquema ejecutable como **Zod** (que valida en runtime Y te infiere el tipo TS estático desde una única fuente de verdad).

---

## Fase 3: Inmutabilidad e Identidad Referencial (`Object.is` vs `equals`)

Mira tu `CellBlock.java` original:
```java
@Override
public boolean equals(Object o) {
    // Comparas contenido lógico: x, y y si contiene célula
}
```
Y en `Game.java` mutabas el mismo `SquaredPetriDish` generación tras generación (`nextGenerationCalculator.evolve(petriDish)`).

### Por qué eso falla en React
React necesita saber miles de veces por segundo qué subárboles de la UI han cambiado sin recorrer grafos profundos en $O(N)$. Por diseño, React usa **`Object.is(estadoAnterior, estadoNuevo)`** (prácticamente idéntico a `===` en referencias), que cuesta **$O(1)$**.

```ts
// ❌ BUG CLÁSICO VENIDO DE JAVA:
const nextGenerationBroken = () => {
  nextGenerationCalculator.evolve(petriDish); // Muta el Map interno in-place
  setPetriDish(petriDish); // Object.is(prevDish, petriDish) === true -> ¡React ignora el render!
};
```

Ahora mira cómo lo resolvimos en `typescript-react/src/generation/GenerationCalculators.ts` y `useGame.ts`:
```ts
// ✅ PATRÓN INMUTABLE (typescript-react/src/hooks/useGame.ts:30-33):
const nextGeneration = useCallback(() => {
  setPetriDish((currentDish) => nextGenerationCalculator.evolveImmutable(currentDish));
  setIteration((current) => current + 1);
}, [nextGenerationCalculator]);
```
`evolveImmutable` clona el tablero (`currentDish.clone()`), aplica la evolución sobre la copia y devuelve una **nueva instancia** (`prevDish !== nextDish`). La instancia anterior permanece intacta (lo que permite concurrencia de React, deshacer/rehacer trivial y debugging predecible).

### Reglas prácticas de actualización inmutable en TS:
- **Objetos planos**: `{ ...prevUser, email: newEmail }` (copia superficial *shallow copy*: reutiliza las referencias de las demás propiedades sin copiarlas — *structural sharing*).
- **Arrays**:
  - Añadir: `[...items, newItem]` (nunca `items.push(...)`)
  - Eliminar: `items.filter(item => item.id !== idToRemove)` (nunca `items.splice(...)`)
  - Actualizar uno: `items.map(item => item.id === targetId ? { ...item, active: true } : item)`
  - Ordenar: `items.toSorted(compareFn)` o `[...items].sort(compareFn)` (¡cuidado! `Array.prototype.sort()` en JS muta el array original in-place).
- **Estructuras anidadas complejas en apps enterprise**: librería **Immer** (`produce(state, draft => { draft.a.b.push(x); })`), que usa `Proxy` de ES6 para grabar mutaciones sobre un borrador y producir automáticamente un árbol inmutable con *structural sharing*.

---

## Fase 4: El Motor de React por Dentro — `UI = f(state)`, Fiber y Reconciliación

### 4.1 De Controlador Imperativo a Proyección Declarativa
En Swing / JavaFX / DOM clásico tú escribes **transiciones**:
> *"Cuando muere la celda (3,4), busca el botón `grid[3][4]`, quítale la clase `cell-alive` y ponle `cell-empty`."*

A medida que tienes $N$ estados, el número de transiciones posibles crece a $O(N^2)$ y aparecen desincronizaciones visuales.
En React escribes una **proyección pura del estado actual**:
$$\text{UI} = f(\text{props}, \text{state})$$

Mira `typescript-react/src/components/PetriDishBoard.tsx`:
```tsx
<button
  type="button"
  className={`cell-tile ${alive ? 'cell-alive' : 'cell-empty'}`}
  onClick={() => onToggle(row, column)}
/>
```
JSX **no es HTML ni un motor de plantillas String**. El compilador TypeScript transforma `<CellTile row={1} alive={true} />` en una llamada JS normal:
```ts
jsx(CellTile, { row: 1, alive: true })
// Que devuelve un simple objeto plano inmutable en memoria (React Element):
// { type: CellTile, key: "1-0", props: { row: 1, alive: true } }
```
Crear 400 objetos JS planos en el heap V8 tarda microsegundos; tocar 400 nodos reales del DOM C++ del navegador es órdenes de magnitud más caro.

### 4.2 Las Dos Fases de React: Render vs Commit
```text
[ Disparador: montaje inicial o setState ]
                 │
                 ▼
┌──────────────────────────────────────────────────────────┐
│ 1. RENDER PHASE (100% Pura, sin efectos laterales)       │
│  - React invoca tus funciones de componente: App()...    │
│  - Construye el nuevo árbol Fiber y calcula el diff      │
│  - Puede pausarse, abortarse o repetirse (StrictMode x2) │
└──────────────────────────────────────────────────────────┘
                 │ (solo mutaciones reales necesarias)
                 ▼
┌──────────────────────────────────────────────────────────┐
│ 2. COMMIT PHASE (Síncrona e ininterrumpible)             │
│  - Aplica los cambios mínimos al DOM real                │
│  - Ejecuta useLayoutEffect (antes de pintar en pantalla) │
│  - El navegador pinta el frame                           │
│  - Ejecuta cleanups previos y nuevos useEffect           │
└──────────────────────────────────────────────────────────┘
```
**Por qué `<StrictMode>` ejecuta tus componentes y efectos DOS veces en desarrollo (`main.tsx`)**:
No es un bug. React monta → desmonta → vuelve a montar en modo `dev` para desenmascarar al instante componentes que mutan variables externas durante el render o `useEffect` a los que se les olvidó limpiar su suscripción/`setInterval`.

### 4.3 Reconciliación y por qué `key` NO es "para quitar un warning"
Cuando renderizas una lista de componentes hijos, React compara el árbol anterior con el nuevo:
1. Si cambia el **tipo** (`<div>` → `<section>`), destruye todo el subárbol DOM y su estado interno desde cero.
2. En listas dinámicas, React empareja elementos entre renders usando **`key`**.
   - **Anti-patrón grave**: `items.map((item, index) => <Row key={index} item={item} />)`. Si borras la fila 0, la antigua fila 1 pasa a tener `key={0}`: React reutiliza la instancia interna de la antigua fila 0 (por ejemplo, ¡dejando escrito el texto de un `<input>` no controlado en la fila equivocada!).
   - **Regla**: `key` debe ser un identificador de dominio estable y único entre hermanos (`item.id`, o la coordenada fija `${row}-${column}` en `PetriDishBoard.tsx`).

---

## Fase 5: Dominio Profundo de los Hooks de Estado y Referencias

### 5.1 Cómo funcionan los Hooks en memoria (Por qué existen las "Rules of Hooks")
Una función JS no tiene campos de instancia `private` que sobrevivan entre llamadas. ¿Dónde guarda React el estado de `useState`?
Cada nodo **Fiber** (la instancia viva del componente en el árbol interno de React) mantiene un **array / lista enlazada de celdas de estado (`memoizedState`)**.
- Llamada #1 en el componente (`useState(dish)`) → lee celda `[0]`.
- Llamada #2 (`useState(0)`) → lee celda `[1]`.
- Llamada #3 (`useState(false)`) → lee celda `[2]`.

Si metes un `if (condicion) { useState(...) }`, en el siguiente render cuando `condicion` sea `false`, la llamada #3 leerá la celda `[1]` y todo el estado del componente se desplazará y corromperá. **Por eso los Hooks SIEMPRE se llaman en el nivel superior incondicional de un componente o Custom Hook.**

### 5.2 `useState`: Snapshot vs Actualizador Funcional
```tsx
const [count, setCount] = useState(0);

function handleTripleClickBad() {
  // En este render `count` es la constante 0:
  setCount(count + 1); // pide poner 0 + 1 = 1
  setCount(count + 1); // pide poner 0 + 1 = 1
  setCount(count + 1); // pide poner 0 + 1 = 1
  console.log(count);  // ¡Sigue imprimiendo 0! El nuevo render aún no ha ocurrido.
}

function handleTripleClickGood() {
  // Encola funciones puras (prev => next) sobre el último estado encolado:
  setCount(c => c + 1); // 0 -> 1
  setCount(c => c + 1); // 1 -> 2
  setCount(c => c + 1); // 2 -> 3
}
```
Además, fíjate en la línea 25 de `typescript-react/src/hooks/useGame.ts`:
```ts
// ✅ Lazy initialization: pasamos la FUNCIÓN createSeededDish, NO createSeededDish()
const [petriDish, setPetriDish] = useState<SquaredPetriDish>(createSeededDish);
```
Si pusieras `useState(createSeededDish())`, construirías un `SquaredPetriDish` nuevo con su `TreeMap` y sus células **en cada render** para que React tire el resultado a la basura del render 2 en adelante. Pasando la función `() => T`, React solo la invoca una vez en el montaje inicial.

### 5.3 `useReducer`: Cuando `useState` se queda corto (Máquina de Estados / Command Pattern)
Cuando varias transiciones tocan varios campos a la vez con invariantes de dominio (en nuestro `useGame`, `reset` siempre apaga `isRunning`, pone `iteration = 0` y regenera el tablero), en un componente complejo un ingeniero Java se siente como en casa con **`useReducer`**:

```ts
interface SimulationState {
  readonly dish: SquaredPetriDish;
  readonly iteration: number;
  readonly isRunning: boolean;
}

type SimulationAction =
  | { type: 'TICK'; calculator: NextGenerationCalculator }
  | { type: 'TOGGLE_RUNNING' }
  | { type: 'TOGGLE_CELL'; row: number; col: number }
  | { type: 'RESET'; seedDish: SquaredPetriDish };

function simulationReducer(state: SimulationState, action: SimulationAction): SimulationState {
  switch (action.type) {
    case 'TICK':
      return {
        ...state,
        dish: action.calculator.evolveImmutable(state.dish),
        iteration: state.iteration + 1,
      };
    case 'TOGGLE_RUNNING':
      return { ...state, isRunning: !state.isRunning };
    case 'RESET':
      return { dish: action.seedDish, iteration: 0, isRunning: false };
    case 'TOGGLE_CELL': {
      const nextDish = state.dish.clone();
      // ... toggle
      return { ...state, dish: nextDish };
    }
  }
}
```
Ventaja enorme para testing: **`simulationReducer` es una función pura 100% TypeScript sin React**, testeable directamente en milisegundos igual que una clase de dominio Java.

### 5.4 `useRef`: Campos de Instancia Mutables + Acceso al DOM Real
`const ref = useRef<T>(initialValue)` te da un objeto estable `{ current: T }` que vive durante toda la vida del componente.
Dos usos fundamentales:
1. **Estado técnico que NO afecta a lo que se pinta**: IDs de timers, sockets, contadores de métricas, último valor previo, o el patrón *Latest Ref* para evitar recrear efectos. Mutar `ref.current = x` **no dispara re-render**.
2. **Referencia imperativa a un nodo DOM** (`const canvasRef = useRef<HTMLCanvasElement>(null)` → `<canvas ref={canvasRef} />`) para hacer focus, medir dimensiones con `getBoundingClientRect()` o dibujar en WebGL/Canvas 2D.

---

## Fase 6: `useEffect` Sin Dolor — Sincronización, NO Eventos ni Estado Derivado

Si solo pudieras tatuarte una regla de esta guía para tu día a día en React, que sea esta:

> **`useEffect` NO es un listener de cambios de modelo ni un lugar para calcular datos derivados. Es exclusivamente un mecanismo para sincronizar tu componente con un sistema externo a React (red, timers del navegador, WebSockets, DOM imperativo, `window.addEventListener`).**

### 6.1 Los 3 Anti-Patrones Clásicos de un Desarrollador Nuevo en React

#### Anti-patrón 1: Estado derivado con `useEffect`
```tsx
// ❌ HORRIBLE: Provoca doble render innecesario y estados intermedios inconsistentes
const [livingCount, setLivingCount] = useState(0);
useEffect(() => {
  setLivingCount(petriDish.getOccupiedCells().length);
}, [petriDish]);

// ✅ CORRECTO (mira useGame.ts línea 72): ¡Calcúlalo directamente durante el render!
const livingCount = petriDish.getOccupiedCells().length;
// (Y si el cálculo costara >1-2ms sobre miles de elementos, envuélvelo en useMemo, NUNCA en useEffect)
```

#### Anti-patrón 2: Resetear estado de un hijo con `useEffect` cuando cambia una prop
```tsx
// ❌ MAL: Renderiza primero con el estado viejo del usuario anterior y luego parpadea
function UserProfileEditor({ userId }: { userId: string }) {
  const [draftBio, setDraftBio] = useState('');
  useEffect(() => { setDraftBio(''); }, [userId]);
  // ...
}

// ✅ BIEN: Pasa `key={userId}` desde el padre:
// <UserProfileEditor key={selectedUserId} userId={selectedUserId} />
// React destruye limpiamente la instancia anterior y monta una fresca al cambiar userId.
```

#### Anti-patrón 3: Lógica de acción de usuario metida en `useEffect`
Si al pulsar "Comprar" quieres enviar un `POST /orders` y mostrar una notificación, hazlo **en el event handler `onClick={handleBuy}`**, no poniendo un `setIsBuying(true)` para que un `useEffect` lo detecte y dispare el `POST`.

### 6.2 Anatomía de un `useEffect` impecable (Estudio de `useGame.ts` + Peticiones con Cancelación)
Mira las líneas 59–65 de `typescript-react/src/hooks/useGame.ts`:
```ts
useEffect(() => {
  if (!isRunning) {
    return;
  }
  const timerId = window.setInterval(nextGeneration, intervalMs);
  return () => window.clearInterval(timerId);
}, [isRunning, intervalMs, nextGeneration]);
```
Observa qué ocurre cuando el usuario mueve el slider de velocidad de `450ms` a `150ms` mientras el juego corre:
1. `intervalMs` pasa de `450` a `150`.
2. React renderiza con `intervalMs = 150`.
3. React ejecuta **primero el cleanup del efecto anterior** (`clearInterval` del timer de 450ms).
4. React ejecuta el **nuevo efecto** (`setInterval` a 150ms).
Nunca hay dos timers duplicados ni fugas de memoria al desmontar el componente.

**Cómo evitar Race Conditions al hacer `fetch` en `useEffect`** (si el usuario cambia rápido del filtro `A` al `B` y la petición `A` tarda más en responder que `B`, machacando la pantalla con datos viejos):
```tsx
useEffect(() => {
  const controller = new AbortController();

  async function loadPattern() {
    try {
      const res = await fetch(`/api/patterns/${patternId}`, {
        signal: controller.signal,
      });
      const data: unknown = await res.json();
      setPattern(parsePattern(data));
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return;
      setError(err instanceof Error ? err : new Error(String(err)));
    }
  }

  void loadPattern();
  return () => controller.abort(); // Cancela la petición en vuelo si patternId cambia o desmonta
}, [patternId]);
```
*(Nota: En aplicaciones enterprise reales, en lugar de escribir este boilerplate a mano en cada pantalla, delegamos esto en **TanStack Query**, que veremos en la Fase 9).*

---

## Fase 7: Rendimiento Real — `React.memo`, `useMemo` y `useCallback`

### 7.1 La regla por defecto de React que sorprende a todo Senior Java
> **Cuando un componente padre se re-renderiza, React re-renderiza recursivamente a TODOS sus componentes hijos por defecto, aunque las props de esos hijos no hayan cambiado.**

¿Por qué? Porque normalmente ejecutar funciones ligeras es baratísimo, y comparar props en todos los nodos de la aplicación suele costar más que simplemente re-ejecutarlos.
**EXCEPCIÓN**: Tableros densos, listas grandes, gráficos o árboles pesados — como las **400 celdas** ($20 \times 20$) de nuestro `PetriDishBoard.tsx` actualizándose varias veces por segundo.

### 7.2 Cómo trabajan juntos `React.memo` y `useCallback` en tu proyecto
Mira qué pasaría en `PetriDishBoard.tsx` si **solo** pusiéramos `memo(CellTile)` pero en `useGame.ts` definiéramos `toggleCell` sin `useCallback`:
```tsx
// Si toggleCell fuera: const toggleCell = (r, c) => { ... } (sin useCallback)
// En cada tick del reloj:
//   useGame crea una NUEVA instancia de función toggleCell (fn_tick1 !== fn_tick2)
//   CellTile recibe: row=0 (igual), column=0 (igual), alive=false (igual), onToggle=fn_tick2 (¡DISTINTA!)
//   React.memo compara Object.is(fn_tick1, fn_tick2) === false -> ¡Re-renderiza las 400 celdas igual!
```
Por eso en nuestro código trabajan **en pareja**:
1. En `useGame.ts`:
   ```ts
   const toggleCell = useCallback((row: number, column: number) => {
     setPetriDish((currentDish) => { /* usa currentDish funcional -> 0 dependencias! */ });
   }, []); // <-- La referencia de toggleCell NO cambia jamás en toda la vida de la app
   ```
2. En `PetriDishBoard.tsx`:
   ```tsx
   const CellTile = memo(function CellTile({ row, column, alive, onToggle }: CellTileProps) { ... });
   ```
Resultado: En cada generación, si solo nacen/mueren 6 células, **394 componentes `CellTile` hacen cortocircuito en $O(1)$** sin siquiera ejecutar su cuerpo.

*(Nota sobre React 19: Con **React Compiler** activado en el pipeline de build, el compilador analiza el AST y genera automáticamente esta memoización de valores, funciones y JSX sin escribir `useMemo`/`useCallback` manuales, siempre que respetes las reglas de pureza e inmutabilidad).*

---

## Fase 8: Arquitectura, Inyección de Dependencias y Composición

### 8.1 Composición sobre Herencia (`children` y Slots)
En Java/Wicket/Vaadin era habitual crear `AbstractBasePage` o `BaseModalDialog` y heredar. En React **nunca se hereda entre componentes**. Todo se resuelve con composición explícita:
```tsx
interface PanelProps {
  title: string;
  headerActions?: ReactNode; // "Slot" nombrado (como pasar un fragmento de vista por constructor)
  children: ReactNode;       // Contenido principal compuesto
}

export function Panel({ title, headerActions, children }: PanelProps) {
  return (
    <section className="panel">
      <header>
        <h2>{title}</h2>
        {headerActions && <div className="actions">{headerActions}</div>}
      </header>
      <div className="body">{children}</div>
    </section>
  );
}
```

### 8.2 Inyección de Dependencias estilo Spring con React Context (`GameDependenciesContext.tsx`)
Compara tu `ApplicationConfiguration.java` con `typescript-react/src/context/GameDependenciesContext.tsx`:
- En Spring defines `@Bean` en un `ApplicationContext`.
- En React creas un `Context` con valor por defecto `null` + un **Provider** + un **Custom Hook guardián** (`useGameDependencies`) que lanza un error claro si alguien intenta usar el hook fuera del árbol del Provider.
- **Superpoder arquitectónico**:
  - En `main.tsx` (producción): `<GameDependenciesProvider><App /></GameDependenciesProvider>` inyecta las implementaciones reales.
  - En un test unitario o Storybook: `<GameDependenciesProvider dependencies={fakeDeps}><App /></GameDependenciesProvider>` inyecta dobles de prueba **por subárbol** (incluso puedes tener dos `<App />` en la misma página con configuraciones distintas a la vez, algo mucho más limpio que singletons estáticos).

### 8.3 El Peligro Oculto de Context: Cuándo NO usarlo
Si metes en un único `GameContext` tanto `dependencies` como `petriDish`, `iteration` y `mousePosition`:
- Cada vez que cambie `iteration`, **absolutamente todos los componentes que llamen a `useContext(GameContext)` se re-renderizarán**, incluso un botón que solo leía `defaultDishSize` (`memo` NO detiene un cambio de Context interno).
- **Regla de arquitectura**:
  1. Usa Context para **dependencias de infraestructura/dominio estables** (clientes HTTP, calculadores, feature flags, sesión de usuario, tema, idioma).
  2. Si usas Context para estado, **divide los Contexts por frecuencia de cambio** o separa `StateContext` de `DispatchContext`.
  3. Para estado global de cliente con actualizaciones frecuentes y selección granular por campo, usa una store externa basada en `useSyncExternalStore` como **Zustand** (`const iteration = useSimStore(s => s.iteration)` solo re-renderiza si cambia `iteration`).

### 8.4 Arquitectura Limpia en Frontend (Capas en tu `typescript-react/`)
Fíjate cómo está partido `typescript-react/src/` — esta misma estructura escala a proyectos de cientos de pantallas:
1. **Dominio Puro (0 imports de React)**: `cell/`, `rules/`, `storage/`, `generation/`. Clases, funciones puras, tipos e invariantes. Se puede llevar tal cual a Node, Web Worker o CLI.
2. **Infraestructura / DI**: `context/GameDependenciesContext.tsx` (adaptadores REST, repositorios, cableado de servicios).
3. **Aplicación / Orquestación (Custom Hooks)**: `hooks/useGame.ts`. Traduce el estado inmutable y efectos temporales de React en un contrato limpio para la vista.
4. **Presentación / UI Pura**: `components/PetriDishBoard.tsx`, `components/GameControls.tsx`. Reciben datos y callbacks por props; casi sin lógica, triviales de previsualizar y testear.

---

## Fase 9: El Stack Real de Producción en 2026 (Más Allá de React Core)

En Java nadie escribe una aplicación empresarial solo con `java.lang` sin Spring Boot, Jackson, Caffeine o JUnit. En React ocurre igual: React es **solo la librería de interfaz**, no un framework monolítico. Este es el mapa mental para el mundo real:

### 9.1 La Distinción Más Importante: *Client State* vs *Server State*
Hace años (era Redux clásico 2016–2019), se cometía el error de copiar toda la base de datos del backend dentro de un store global en memoria del cliente con decenas de acciones `FETCH_USERS_REQUEST`, `FETCH_USERS_SUCCESS`, `FETCH_USERS_FAILURE`.
Hoy separamos estrictamente:
1. **Server State** (datos cuyo dueño es el backend, tú solo tienes una caché asíncrona potencialmente obsoleta):
   - Estándar de facto: **TanStack Query (`@tanstack/react-query`)**.
   - Piensa en él como **Caffeine Cache + Resilience4j + SWR reactivo** en el navegador: gestiona caché por clave (`queryKey: ['orders', orderId]`), deduplicación de peticiones concurrentes idénticas, invalidación automática tras mutaciones (`useMutation` → `invalidateQueries`), reintentos con backoff exponencial, paginación y *Optimistic Updates*.
2. **Client UI State** (modales abiertos, pestaña activa, zoom del tablero, selección múltiple, borradores locales):
   - Local al componente/subárbol → `useState` / `useReducer`.
   - Compartido en URL (filtros, ordenación, página actual, tab activo) → **URL Search Params** (¡el estado más infravalorado: permite compartir enlaces y usar Atrás/Adelante del navegador!).
   - Global en memoria cliente → **Zustand** o React Context si cambia poco.

### 9.2 Formularios Complejos: Controlados vs React Hook Form + Zod
- Para 1–3 inputs simples (como el slider de velocidad en `GameControls.tsx`), un **input controlado** (`value={intervalMs}` + `onChange={e => setIntervalMs(Number(e.target.value))}`) es perfecto.
- Para un formulario empresarial de 40 campos con validaciones cruzadas y arrays dinámicos de líneas de pedido, usa **React Hook Form + `@hookform/resolvers/zod`**: evita re-renderizar todo el formulario en cada pulsación de tecla y comparte las reglas de validación con el esquema Zod tipado.

### 9.3 Qué trae React 19 que debes conocer
- **`ref` como prop ordinaria**: Ya no hace falta envolver componentes en el verboso `forwardRef(...)`; `ref` llega directamente en las props.
- **Actions y Transiciones asíncronas (`useTransition`, `useActionState`, `useOptimistic`)**: Soporte nativo de primera clase para mutaciones asíncronas, estados `isPending` sin gestionar flags manuales y actualizaciones optimistas reversibles automáticamente si la promesa falla.
- **API `use(promise | context)`**: Permite leer un Context incluso dentro de un `if` y suspender el renderizado leyendo una `Promise` integrada con `<Suspense fallback={<Spinner />}>` y `<ErrorBoundary>`.

---

## Fase 10: Testing Profesional (De JUnit 5 + Mockito a Vitest + Testing Library)

Tu instinto de Java con Mockito te tentará a mockear componentes hijos o espiar estados internos. **En React moderno eso es un anti-patrón** porque acopla los tests a detalles de refactorización interna sin garantizar que el usuario pueda usar la pantalla.

### La Pirámide Ideal en TypeScript + React:
1. **Tests Unitarios de Dominio (70% de la lógica compleja — milisegundos)**
   Exactamente como tienes en `typescript-react/test/generation.test.ts`: pruebas `NextGenerationCalculator`, `SquaredPetriDish`, reducers puros y validadores sin montar un solo nodo DOM.
2. **Tests de Custom Hooks (`renderHook`)**
   Cuando un hook como `useGame` tiene orquestación temporal compleja (`vi.useFakeTimers()`), lo montas envuelto en `<GameDependenciesProvider dependencies={testDeps}>`, avanzas el reloj virtual `act(() => vi.advanceTimersByTime(450))` y verificas `result.current.iteration === 1`.
3. **Tests de Integración de Componentes con `@testing-library/react`**
   - Renderizas el árbol real (`<App />` con un backend simulado a nivel de red con **MSW - Mock Service Worker**, equivalente en frontend a WireMock en Spring Boot).
   - Buscas elementos **igual que un usuario o un lector de pantalla**: `screen.getByRole('button', { name: /Siguiente generación/i })` (evitando `querySelector('.btn-primary')` o IDs frágiles).
   - Interactúas con `@testing-library/user-event` (`await user.click(...)`) y verificas el DOM resultante.

---

## Plan de Entrenamiento Práctico: 5 Katas Progresivas sobre tu `typescript-react/`

La mejor forma de fijar todo lo anterior como Senior es escribir código con restricciones reales sobre el proyecto que ya conoces. Hazlas en orden dentro de `typescript-react/`:

### Kata 1 — Álgebra de Tipos y Presets Tipados (Fases 2 y 3)
- **Objetivo**: Crea un tipo unión literal `type PatternPreset = 'small-exploder' | 'glider' | 'blinker' | 'pulsar'` y un mapa exhaustivo `Record<PatternPreset, { label: string; create: (range: number) => CellBlock[] }>`.
- **Reto TS**: Añade un selector `<select>` en `GameControls.tsx` sin usar ni un solo cast inseguro (`as PatternPreset` prohibido al leer `e.target.value`: escribe un *Type Guard* `isPatternPreset(value: string): value is PatternPreset`).

### Kata 2 — Máquina de Estados + Historial *Time-Travel* (Fases 3 y 5)
- **Objetivo**: Refactoriza los `useState` de `useGame.ts` a un único **`useReducer`** con acciones tipadas mediante Uniones Discriminadas (`TICK`, `STEP_BACK`, `TOGGLE_CELL`, `PLAY`, `PAUSE`, `RESET`).
- **Reto de Inmutabilidad**: Como cada generación ya produce un `SquaredPetriDish` inmutable nuevo, guarda una pila acotada `history: readonly SquaredPetriDish[]` (máx. 50 pasos) e implementa el botón **"⏪ Generación anterior"** en menos de 15 líneas gracias a la inmutabilidad. Comprueba que está deshabilitado cuando `history.length === 0`.

### Kata 3 — Sincronización con el Mundo Exterior y Atajos de Teclado sin Stale Closures (Fase 6)
- **Objetivo**: Crea un Custom Hook reutilizable `useKeyboardShortcuts` que escuche `window.addEventListener('keydown', ...)`:
  - `Espacio` → Play / Pause
  - `Flecha Derecha` → Siguiente generación (solo si está en pausa)
  - `R` → Reset
- **Trampa a superar**: Evita dar de alta y baja el listener del `window` en cada tick del juego usando el patrón *Latest Callback Ref* (`useRef` actualizado en un efecto o `useEffectEvent`), verificando que no sufres *Stale Closures* ni si el foco está dentro de un `<input>`.

### Kata 4 — Persistencia en URL + Validación de Frontera (Fases 2 y 9)
- **Objetivo**: Añade botones **"Compartir estado por URL"** y carga inicial desde `window.location.search` codificando las coordenadas vivas (ej. `?cells=9.10,10.9,10.10...&speed=300`).
- **Reto de robustez**: Trata el query string como `unknown` hostil: si alguien escribe en la barra del navegador `?cells=basura,999.-4&speed=abc`, tu parser debe rechazar coordenadas fuera de `[0..size]` sin romper el árbol de React y mostrar un banner de aviso controlado.

### Kata 5 — Perfilado de Rendimiento y Escalado a $60 \times 60$ (Fase 7)
- **Objetivo**: Sube `PETRI_DISH_SIZE` de `20` (400 celdas) a `60` (3.600 celdas) a intervalos de `60ms`.
- **Experimento científico**:
  1. Abre *React DevTools → Profiler* con "Record why each component rendered".
  2. Quita temporalmente `memo` de `CellTile` en `PetriDishBoard.tsx` y mide los milisegundos de Render Phase por tick.
  3. Vuelve a poner `memo`, pero pasa una arrow inline `onToggle={(r, c) => toggleCell(r, c)}` dentro del bucle de `PetriDishBoard.tsx` y observa en el Profiler cómo **se rompe la memoización** aunque exista `memo`.
  4. Restaura `onToggle={onToggleCell}` estable y compara el flamegraph.
  5. **Bonus Nivel Arquitecto**: Crea una vista alternativa `<PetriDishCanvas dish={petriDish} />` renderizando sobre `<canvas>` HTML5 usando `useRef<HTMLCanvasElement>` + `useEffect` para comparar cuándo conviene DOM declarativo vs escape imperativo a Canvas.
