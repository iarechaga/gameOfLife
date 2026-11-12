# Game of Life — TypeScript + React

Variante declarativa en **TypeScript + React** (con Vite), mostrando cómo evolucionan los patrones del proyecto Java hacia el ecosistema React:

- **Inmutabilidad para React (`SquaredPetriDish.clone()` + `evolveImmutable()`)**: conserva el modelo de dominio (`Cell`, `NullCell`, `CellBlock`, `SquaredPetriDish`, calculadores en dos fases), generando nuevas referencias en cada generación para `useState`.
- **Inyección de dependencias con React Context (`GameDependenciesProvider` + `useGameDependencies`)**: equivalente idiomático en React a `ApplicationConfiguration` (`@Configuration` + `@Bean`) en Spring.
- **Custom Hook (`useGame`)**: sustituye a `Game` + `GameRunner` (`Thread.sleep` bloqueante) mediante `useState`, `useCallback` y `useEffect` con limpieza de `setInterval`.
- **Componentes declarativos (`<PetriDishBoard />` + `memo(CellTile)`)**: sustituyen al `ConsolePetriDishPrinter` imperativo.

## Uso

```bash
npm run dev        # arranca la interfaz React en modo desarrollo (Vite)
npm run build      # compila TypeScript + bundle de producción
npm run typecheck  # validación estática de tipos
npm test           # ejecuta tests del motor inmutable
```
