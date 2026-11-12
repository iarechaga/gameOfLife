# Game of Life — TypeScript + React 19 (Academia Senior Java + Dojo de Katas en Vivo)

Esta carpeta incluye **tres experiencias integradas** construidas con **React 19 + TypeScript 5.9 + Vite 6**:

1. **🥋 Dojo Interactivo de Katas en el Navegador (`src/dojo/`)**:
   - Compilador **TypeScript real (`ts.createProgram` con `strict: true`, `noImplicitAny`, `strictNullChecks`)** ejecutándose en memoria dentro del navegador (~15–30 ms por compilación) + reglas AST personalizadas (prohibición de `as` y `any`).
   - **Suite automática de tests unitarios y de DOM (React 19)** tras cada cambio (`⌘+Enter` / `Ctrl+Enter`).
   - **Sandbox en vivo** con `ErrorBoundary` que monta tu componente mientras programas.
   - **6 Katas progresivas**:
     1. Álgebra de tipos, `Record` exhaustivo y *Type Guards* (`val is PatternPreset`).
     2. Uniones Discriminadas y verificación de exhaustividad estática con `never`.
     3. Inmutabilidad estructural, `useReducer` y *Time-Travel* (`STEP_BACK`) sobre `SquaredPetriDish`.
     4. `useEffect`, limpieza simétrica y eliminación de *Stale Closures* (`useRef` *Latest Pattern*).
     5. Rendimiento quirúrgico con `React.memo` + `useCallback` funcional en tableros densos.
     6. Inyección de dependencias estilo Spring con React Context + validación defensiva de fronteras (`unknown`).

2. **📚 Guía Interactiva Paso a Paso para Senior Java (`src/academy/` y `GUIA_SENIOR_JAVA_A_TS_REACT.md`)**:
   - Recorrido completo en **10 Fases** desde el modelo mental de concurrencia/OOP/Spring en Java hasta arquitectura de producción en React 19.

3. **🎮 Juego Game of Life React (`src/hooks/useGame.ts`, `src/components/`)**:
   - Evolución inmutable (`clone()` + `evolveImmutable()`), DI con `<GameDependenciesProvider>` y renderizado optimizado.

## Comandos

```bash
npm install
npm run dev        # Modo desarrollo con HMR (Vite)
npm test           # Tests de dominio + verificación del compilador y soluciones de las 6 Katas
npm run typecheck  # Verificación estática tsc --noEmit
npm run build      # Genera dist/ (servido también automáticamente por ../web/server.mjs)
```
