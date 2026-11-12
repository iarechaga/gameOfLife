# Game of Life — Polyglot Learning Lab + Dojo TS/React en Vivo

Interfaz web interactiva para acelerar el salto desde tu diseño original en **Java** hacia **TypeScript**, **TypeScript + React 19** y **Golang**.

## Vistas incluidas

1. **Comparador de Código (4 variantes)**: Java 11, TypeScript OOP, TypeScript + React y Golang lado a lado en las 8 capas de tu arquitectura.
2. **Simulador Rayos X (3 sub-fases)**: Visualiza paso a paso `OccupiedBlockGenerationCalculator` → `EmptyBlockGenerationCalculator` → `cleanDeadCells()` y el estado interno de `cellStorage`.
3. **Chuleta Mental filtrable**: Equivalencias rápidas entre los 4 stacks.
4. **Autoevaluación**: Quiz práctico sobre decisiones reales del repositorio.
5. **Guía Senior Java → TS+React (10 Fases)**: Manual interactivo con seguimiento de progreso y contraste directo de anti-patrones Java vs patrones idiomáticos en React.
6. **🥋 Dojo de Katas en Vivo**: Editor en navegador con **compilador TypeScript real (`tsc --strict`)**, suite de tests automáticos y vista previa React 19 en tiempo real para practicar las 6 katas sin salir del navegador.

## Cómo levantarlo en local

```bash
node web/server.mjs
```

Abre:
- Laboratorio completo: [http://localhost:3030](http://localhost:3030)
- Directo al Dojo de Katas: [http://localhost:3030/?tab=dojo](http://localhost:3030/?tab=dojo)
- Directo a la Guía Senior Java: [http://localhost:3030/?tab=guide](http://localhost:3030/?tab=guide)
