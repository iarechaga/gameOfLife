# Game of Life — TypeScript

Versión equivalente en TypeScript del Game of Life original en Java, manteniendo la misma arquitectura por capas y patrones (`NullCell` / Null Object, almacenamiento disperso en `SquaredPetriDish`, evaluación en dos fases con limpieza diferida e inyección de dependencias por constructor en `ApplicationConfiguration`).

## Requisitos

- Node.js >= 22.6 (probado con Node 24)

## Uso

Ejecutar la simulación en consola (20 iteraciones con el patrón *Small Exploder*):

```bash
npm start
```

Ejecutar los tests unitarios y de integración:

```bash
npm test
```

Comprobar tipos con TypeScript:

```bash
npm run typecheck
```
