# Game of Life — Go

Versión equivalente en Go del Game of Life original en Java, manteniendo la misma separación de paquetes (`cell`, `storage`, `rules`, `generation`, `game`) y patrones (`NullCell` singleton / Null Object, almacenamiento disperso en `SquaredPetriDish`, evolución en dos fases con `CleanDeadCells()` diferido e inyección de dependencias por interfaces y constructores en `ApplicationConfiguration`).

Sin dependencias externas (100% librería estándar de Go).

## Uso

Ejecutar la simulación en consola (20 iteraciones con el patrón *Small Exploder*):

```bash
go run ./cmd/gamerunner
```

Ejecutar todos los tests unitarios y de integración:

```bash
go test -v ./...
```
