window.LEARNING_DATA = {
  modules: [
    {
      id: 'cell',
      step: '01 · cell',
      name: 'Cell y NullCell',
      tag: 'Null Object + Singleton',
      title: '1. Modelo Celular y Patrón Null Object (Cell & NullCell)',
      summary:
        'Tu diseño original evita comprobar null continuamente usando NullCell como Singleton. Mira cómo se expresa herencia frente a interfaces implícitas.',
      insights: [
        {
          type: 'ts',
          title: 'TypeScript: Clases OOP con override explícito',
          body: 'Muy cercano a Java: soporta <code>private</code>, <code>static readonly</code>, constructor privado para el Singleton y <code>override</code> para asegurar en compilación que el método existe en <code>Cell</code>.',
        },
        {
          type: 'react',
          title: 'TS + React: Dominio puro desacoplado de la UI',
          body: 'En React no hace falta meter todo en hooks: tus clases de dominio (<code>Cell</code> y <code>NullCell</code>) se reutilizan intactas sin importar React, manteniendo la lógica de negocio testeable en Node.',
        },
        {
          type: 'go',
          title: 'Golang: Sin herencia — Interfaces implícitas',
          body: 'Go no tiene <code>class</code> ni <code>extends</code>. Defines <code>type Cell interface</code> y cualquier struct con <code>Alive() bool</code> y <code>Die() error</code> la cumple automáticamente. El Singleton es un puntero privado <code>&nullCell{}</code>.',
        },
      ],
      code: {
        java: {
          path: 'src/main/java/.../cell/Cell.java + NullCell.java',
          source: `public class Cell {
    private boolean alive = true;

    public boolean alive() { return alive; }

    public void die() {
        if (!alive()) {
            throw new CellAlreadyKilledException();
        }
        alive = false;
    }
}

public final class NullCell extends Cell {
    private static final NullCell NULL_CELL = new NullCell();

    public static Cell getInstance() { return NULL_CELL; }
    private NullCell() {}

    @Override
    public boolean alive() { return false; }

    @Override
    public void die() {
        throw new InvalidUsageOfNullException("Trying to kill a null cell");
    }
}`,
        },
        ts: {
          path: 'typescript/src/cell/Cell.ts + NullCell.ts',
          source: `export class Cell {
  private isAlive = true;

  public alive(): boolean { return this.isAlive; }

  public die(): void {
    if (!this.alive()) {
      throw new CellAlreadyKilledException();
    }
    this.isAlive = false;
  }
}

export class NullCell extends Cell {
  private static readonly NULL_CELL = new NullCell();

  public static getInstance(): Cell { return NullCell.NULL_CELL; }
  private constructor() { super(); }

  public override alive(): boolean { return false; }

  public override die(): void {
    throw new InvalidUsageOfNullException('Trying to kill a null cell');
  }
}`,
        },
        react: {
          path: 'typescript-react/src/cell/Cell.ts + NullCell.ts',
          source: `// En React + TS el modelo de dominio se mantiene puro (sin dependencias de UI).
// La diferencia clave aparecerá en la capa superior (SquaredPetriDish.clone()),
// donde creamos nuevas instancias de Cell en cada generación para no mutar
// referencias previas guardadas en React useState.

export class Cell {
  private isAlive = true;

  public alive(): boolean { return this.isAlive; }

  public die(): void {
    if (!this.alive()) {
      throw new CellAlreadyKilledException();
    }
    this.isAlive = false;
  }
}

// NullCell.getInstance() funciona igual como centinela inmutable:
// como nunca cambia de estado, compartir el Singleton entre renders es 100% seguro.`,
        },
        go: {
          path: 'golang/cell/cell.go + null_cell.go',
          source: `type Cell interface {
	Alive() bool
	Die() error
}

type livingCell struct { alive bool }

func NewCell() Cell { return &livingCell{alive: true} }

func (c *livingCell) Alive() bool { return c.alive }

func (c *livingCell) Die() error {
	if !c.Alive() {
		return ErrCellAlreadyKilled
	}
	c.alive = false
	return nil
}

type nullCell struct{}
var nullCellInstance Cell = &nullCell{}

func GetNullCell() Cell           { return nullCellInstance }
func (n *nullCell) Alive() bool   { return false }
func (n *nullCell) Die() error    { return ErrInvalidUsageOfNull }`,
        },
      },
    },
    {
      id: 'errors',
      step: '02 · errors',
      name: 'Excepciones vs Errores',
      tag: 'throw vs return error',
      title: '2. Gestión de Errores de Dominio',
      summary:
        'Java y TypeScript interrumpen el flujo con excepciones (throw), mientras que Go trata los errores como valores explícitos en la firma de retorno.',
      insights: [
        {
          type: 'ts',
          title: 'TypeScript: No existen Checked Exceptions',
          body: 'Heredas de <code>Error</code> y asignas <code>this.name</code>. A diferencia de Java, las funciones no declaran <code>throws</code> en su tipo.',
        },
        {
          type: 'react',
          title: 'TS + React: Prevenir errores desde la UI',
          body: 'Además de conservar las excepciones en el dominio, los componentes React restringen las coordenadas al tablero renderizado (<code>0..range-1</code>), evitando entradas fuera de rango del usuario.',
        },
        {
          type: 'go',
          title: 'Golang: Errores como valores + Unwrap()',
          body: 'En vez de <code>try/catch</code>, devuelves <code>error</code>. Para errores simples usas centinelas (<code>errors.New</code>) y para errores con datos (<code>X, Y, Limit</code>) un struct con <code>Error() string</code> y <code>Unwrap() error</code>, comprobable con <code>errors.Is</code>.',
        },
      ],
      code: {
        java: {
          path: 'src/main/java/.../storage/BlockOutOfLimitsException.java',
          source: `public class BlockOutOfLimitsException extends RuntimeException {
    public BlockOutOfLimitsException(final String text) {
        super(text);
    }
}

// Uso en SquaredPetriDish.java:
if (outOfBounds(cellBlock)) {
    throw new BlockOutOfLimitsException(
        String.format("Trying to access %d,%d with limit of %d",
            cellBlock.getX(), cellBlock.getY(), size)
    );
}`,
        },
        ts: {
          path: 'typescript/src/storage/BlockOutOfLimitsException.ts',
          source: `export class BlockOutOfLimitsException extends Error {
  constructor(text: string) {
    super(text);
    this.name = 'BlockOutOfLimitsException';
  }
}

// Uso en SquaredPetriDish.ts (Template Literals):
if (this.outOfBoundsBlock(cellBlock)) {
  throw new BlockOutOfLimitsException(
    \`Trying to access \${cellBlock.getX()},\${cellBlock.getY()} with limit of \${this.size}\`,
  );
}`,
        },
        react: {
          path: 'typescript-react/src/context/GameDependenciesContext.tsx',
          source: `// En React también lanzamos Error si un Hook se usa fuera de su Provider
// (fail-fast en desarrollo, equivalente a NoSuchBeanDefinitionException):

export function useGameDependencies(): GameDependencies {
  const context = useContext(GameDependenciesContext);
  if (!context) {
    throw new Error(
      'useGameDependencies must be used inside <GameDependenciesProvider>'
    );
  }
  return context;
}`,
        },
        go: {
          path: 'golang/storage/errors.go',
          source: `var ErrBlockOutOfLimits = errors.New("block out of limits")

type BlockOutOfLimitsError struct {
	X, Y, Limit int
}

func (e *BlockOutOfLimitsError) Error() string {
	return fmt.Sprintf("Trying to access %d,%d with limit of %d", e.X, e.Y, e.Limit)
}

func (e *BlockOutOfLimitsError) Unwrap() error {
	return ErrBlockOutOfLimits
}

// Uso en Go (propagación explícita):
if err := dish.Add(cellBlock); err != nil {
	return err // comprobable en tests con errors.Is(err, ErrBlockOutOfLimits)
}`,
        },
      },
    },
    {
      id: 'cellblock',
      step: '03 · storage',
      name: 'CellBlock',
      tag: 'Constructores e Igualdad',
      title: '3. Constructores, Parámetros Opcionales e Igualdad (CellBlock)',
      summary:
        'Pieza clave de tu algoritmo: containsCell() sigue siendo true aunque la célula haya muerto en Fase 1, mientras containsLivingCell() pasa a false.',
      insights: [
        {
          type: 'pattern',
          title: 'El secreto de tu diseño en Java',
          body: 'Separar <code>containsCell()</code> de <code>containsLivingCell()</code> permite matar células en Fase 1 sin alterar el conteo de vecinos del resto de la generación hasta llamar a <code>cleanDeadCells()</code>.',
        },
        {
          type: 'ts',
          title: 'TypeScript: Valor por defecto en vez de sobrecarga',
          body: 'En lugar de dos constructores como en Java, TS usa un parámetro con valor por defecto: <code>cell: Cell = NullCell.getInstance()</code>. En <code>equals(other: unknown)</code>, <code>instanceof</code> estrecha el tipo automáticamente.',
        },
        {
          type: 'go',
          title: 'Golang: Funciones constructoras con nombre',
          body: 'Go no tiene sobrecarga de funciones ni constructores especiales. El patrón estándar es definir factorías descriptivas: <code>NewEmptyCellBlock(x, y)</code> y <code>NewCellBlock(x, y, c)</code>.',
        },
      ],
      code: {
        java: {
          path: 'src/main/java/.../storage/CellBlock.java',
          source: `public class CellBlock {
    private final Integer x;
    private final Integer y;
    private final Cell content;

    public CellBlock(final Integer x, final Integer y) {
        this.x = x;
        this.y = y;
        content = NullCell.getInstance();
    }

    public CellBlock(final Integer x, final Integer y, final Cell cell) {
        this.x = x;
        this.y = y;
        this.content = cell;
    }

    public Boolean containsCell() {
        return !NullCell.getInstance().equals(content);
    }

    public boolean containsLivingCell() {
        return containsCell() && content.alive();
    }
}`,
        },
        ts: {
          path: 'typescript/src/storage/CellBlock.ts',
          source: `export class CellBlock {
  private readonly x: number;
  private readonly y: number;
  private readonly content: Cell;

  constructor(x: number, y: number, cell: Cell = NullCell.getInstance()) {
    this.x = x;
    this.y = y;
    this.content = cell;
  }

  public containsCell(): boolean {
    return !NullCell.getInstance().equals(this.content);
  }

  public containsLivingCell(): boolean {
    return this.containsCell() && this.content.alive();
  }

  public equals(other: unknown): boolean {
    if (!(other instanceof CellBlock)) return false;
    return this.x === other.x && this.y === other.y &&
           this.containsCell() === other.containsCell();
  }
}`,
        },
        react: {
          path: 'typescript-react/src/components/PetriDishBoard.tsx',
          source: `// En React, además de la igualdad de dominio, usamos React.memo()
// con props primitivas (row, column, alive) para evitar re-renderizar
// las 400 casillas cuando solo cambian unas pocas células:

const CellTile = memo(function CellTile({
  row, column, alive, onToggle,
}: CellTileProps) {
  return (
    <button
      type="button"
      className={\`cell-tile \${alive ? 'cell-alive' : 'cell-empty'}\`}
      onClick={() => onToggle(row, column)}
    />
  );
});`,
        },
        go: {
          path: 'golang/storage/cell_block.go',
          source: `type CellBlock struct {
	x, y    int
	content cell.Cell
}

func NewEmptyCellBlock(x, y int) *CellBlock {
	return &CellBlock{x: x, y: y, content: cell.GetNullCell()}
}

func NewCellBlock(x, y int, c cell.Cell) *CellBlock {
	if c == nil { c = cell.GetNullCell() }
	return &CellBlock{x: x, y: y, content: c}
}

func (b *CellBlock) ContainsCell() bool {
	return b.content != cell.GetNullCell() // identidad de puntero singleton
}

func (b *CellBlock) ContainsLivingCell() bool {
	return b.ContainsCell() && b.content.Alive()
}`,
        },
      },
    },
    {
      id: 'petridish',
      step: '04 · storage',
      name: 'SquaredPetriDish',
      tag: 'Mapas Dispersos + Inmutabilidad',
      title: '4. Almacenamiento Disperso (TreeMap vs Map vs map de Go vs Snapshot React)',
      summary:
        'En lugar de una matriz 2D fija, guardas solo bloques ocupados en un mapa anidado fila → columna. Observa cómo cambia el acceso nulo y la inmutabilidad.',
      insights: [
        {
          type: 'ts',
          title: 'TypeScript: Optional Chaining (?.) y Nullish Coalescing (??)',
          body: 'El <code>getOrDefault</code> encadenado de Java se reduce a una sola línea limpísima: <code>this.cellStorage.get(row)?.get(column) ?? new CellBlock(row, column)</code>.',
        },
        {
          type: 'react',
          title: 'TS + React: ¿Por qué necesitamos clone()?',
          body: 'React detecta cambios comparando referencias con <code>Object.is(prevState, nextState)</code>. Si mutas el mismo <code>SquaredPetriDish</code> in-place, React no re-renderiza la pantalla. <code>clone()</code> crea un nuevo snapshot limpio.',
        },
        {
          type: 'go',
          title: 'Golang: Mapas con make(), comma-ok y ordenación explícita',
          body: 'En Go los mapas deben inicializarse con <code>make(...)</code> y su orden de iteración es aleatorio por diseño. Para replicar el orden determinista de <code>TreeMap</code>, extraemos las claves y usamos <code>slices.Sort</code>.',
        },
      ],
      code: {
        java: {
          path: 'src/main/java/.../storage/SquaredPetriDish.java',
          source: `public class SquaredPetriDish {
    private final Integer size;
    private final Map<Integer, Map<Integer, CellBlock>> cellStorage = new TreeMap<>();

    public CellBlock getCell(final int row, final int column) {
        return cellStorage.getOrDefault(row, new TreeMap<>())
                .getOrDefault(column, new CellBlock(row, column));
    }

    public void cleanDeadCells() {
        this.getOccupiedCells().stream()
            .filter(cellBlock -> !cellBlock.containsLivingCell())
            .forEach(cell -> cellStorage.get(cell.getX()).remove(cell.getY()));
    }
}`,
        },
        ts: {
          path: 'typescript/src/storage/SquaredPetriDish.ts',
          source: `export class SquaredPetriDish {
  private readonly size: number;
  private readonly cellStorage = new Map<number, Map<number, CellBlock>>();

  public getCell(row: number, column: number): CellBlock {
    return this.cellStorage.get(row)?.get(column) ?? new CellBlock(row, column);
  }

  public cleanDeadCells(): void {
    this.getOccupiedCells()
      .filter((cellBlock) => !cellBlock.containsLivingCell())
      .forEach((cell) => {
        this.cellStorage.get(cell.getX())?.delete(cell.getY());
      });
  }
}`,
        },
        react: {
          path: 'typescript-react/src/storage/SquaredPetriDish.ts',
          source: `export class SquaredPetriDish {
  // ...misma estructura Map<number, Map<number, CellBlock>>...

  public remove(row: number, column: number): void {
    this.cellStorage.get(row)?.delete(column);
  }

  // Nuevo en variante React: genera una nueva referencia para useState
  public clone(): SquaredPetriDish {
    const copy = new SquaredPetriDish(this.size);
    for (const block of this.getOccupiedCells()) {
      if (block.containsLivingCell()) {
        copy.add(new CellBlock(block.getX(), block.getY(), new Cell()));
      }
    }
    return copy;
  }
}`,
        },
        go: {
          path: 'golang/storage/squared_petri_dish.go',
          source: `type SquaredPetriDish struct {
	size        int
	cellStorage map[int]map[int]*CellBlock
}

func (d *SquaredPetriDish) Cell(row, column int) *CellBlock {
	if blocksRow, ok := d.cellStorage[row]; ok {
		if block, ok := blocksRow[column]; ok {
			return block
		}
	}
	return NewEmptyCellBlock(row, column)
}

func (d *SquaredPetriDish) CleanDeadCells() {
	for _, block := range d.OccupiedCells() {
		if !block.ContainsLivingCell() {
			delete(d.cellStorage[block.X()], block.Y())
		}
	}
}`,
        },
      },
    },
    {
      id: 'calculators',
      step: '05 · generation',
      name: 'Calculadores de Evolución',
      tag: 'Streams vs Arrays vs Bucles Go',
      title: '5. Calculadores de Generación en Dos Fases',
      summary:
        'Compara los Streams y method references de Java frente a métodos de Array en TS, evolución inmutable en React y bucles explícitos en Go.',
      insights: [
        {
          type: 'ts',
          title: 'TypeScript: .filter() directo sobre Arrays',
          body: 'En Java necesitas <code>.stream().filter(...).collect(Collectors.toList())</code>. En TypeScript los arrays ya tienen <code>.filter()</code>, <code>.map()</code> y <code>.some()</code> nativamente sin paso de conversión.',
        },
        {
          type: 'react',
          title: 'TS + React: evolveImmutable() puentea OOP y React',
          body: '<code>evolveImmutable(dish)</code> clona el plato, ejecuta exactamente tus dos calculadores mutables internos sobre la copia y devuelve la nueva instancia lista para <code>setPetriDish</code>.',
        },
        {
          type: 'go',
          title: 'Golang: Preferencia por bucles for-range simples',
          body: 'Go evita deliberadamente cadenas funcionales de map/filter. Un simple <code>for _, cellBlock := range cellList</code> es más legible en Go, no aloja closures extra y facilita el manejo de errores.',
        },
      ],
      code: {
        java: {
          path: 'src/main/java/.../generation/NextGenerationCalculator.java',
          source: `@Named
public class NextGenerationCalculator {
    private final OccupiedBlockGenerationCalculator occupiedCalc;
    private final EmptyBlockGenerationCalculator emptyCalc;

    @Inject
    public NextGenerationCalculator(
            final OccupiedBlockGenerationCalculator occupiedCalc,
            final EmptyBlockGenerationCalculator emptyCalc) {
        this.occupiedCalc = occupiedCalc;
        this.emptyCalc = emptyCalc;
    }

    public void evolve(final SquaredPetriDish petriDish) {
        occupiedCalc.evolve(petriDish);
        emptyCalc.evolve(petriDish);
        petriDish.cleanDeadCells();
    }
}`,
        },
        ts: {
          path: 'typescript/src/generation/NextGenerationCalculator.ts',
          source: `export class NextGenerationCalculator {
  private readonly occupiedCalc: OccupiedBlockGenerationCalculator;
  private readonly emptyCalc: EmptyBlockGenerationCalculator;

  constructor(
    occupiedCalc: OccupiedBlockGenerationCalculator,
    emptyCalc: EmptyBlockGenerationCalculator,
  ) {
    this.occupiedCalc = occupiedCalc;
    this.emptyCalc = emptyCalc;
  }

  public evolve(petriDish: SquaredPetriDish): void {
    this.occupiedCalc.evolve(petriDish);
    this.emptyCalc.evolve(petriDish);
    petriDish.cleanDeadCells();
  }
}`,
        },
        react: {
          path: 'typescript-react/src/generation/GenerationCalculators.ts',
          source: `export class NextGenerationCalculator {
  // ...mismos colaboradores inyectados por constructor...

  public evolve(petriDish: SquaredPetriDish): void {
    this.occupiedBlockGenerationCalculator.evolve(petriDish);
    this.emptyBlockGenerationCalculator.evolve(petriDish);
    petriDish.cleanDeadCells();
  }

  // Puente inmutable para actualizaciones funcionales de estado en React:
  public evolveImmutable(petriDish: SquaredPetriDish): SquaredPetriDish {
    const nextDish = petriDish.clone();
    this.evolve(nextDish);
    return nextDish;
  }
}`,
        },
        go: {
          path: 'golang/generation/next_generation_calculator.go',
          source: `type GenerationStep interface {
	Evolve(petriDish storage.PetriDish) error
}

type NextGenerationCalculator struct {
	occupiedCalc GenerationStep
	emptyCalc    GenerationStep
}

func NewNextGenerationCalculator(occ, emp GenerationStep) *NextGenerationCalculator {
	return &NextGenerationCalculator{occupiedCalc: occ, emptyCalc: emp}
}

func (c *NextGenerationCalculator) Evolve(petriDish storage.PetriDish) error {
	if err := c.occupiedCalc.Evolve(petriDish); err != nil {
		return err
	}
	if err := c.emptyCalc.Evolve(petriDish); err != nil {
		return err
	}
	petriDish.CleanDeadCells()
	return nil
}`,
        },
      },
    },
    {
      id: 'di',
      step: '06 · config & DI',
      name: 'Inyección de Dependencias',
      tag: 'Spring vs Context vs Constructores',
      title: '6. Inyección de Dependencias (Spring @Configuration vs TS vs React Context vs Go)',
      summary:
        'En Java usaste Spring (@Configuration, @ComponentScan, @Named, @Inject). Mira cómo se resuelve el grafo de dependencias sin reflexión mágica en los demás.',
      insights: [
        {
          type: 'ts',
          title: 'TypeScript: Composition Root explícito',
          body: 'En TS moderno suele preferirse ensamblar el grafo explícitamente en una clase/función factoría tipada (<code>createContext()</code>) antes que usar decoradores pesados de reflexión en runtime.',
        },
        {
          type: 'react',
          title: 'TS + React: createContext + Provider = tu contenedor IoC',
          body: '<code>&lt;GameDependenciesProvider&gt;</code> inyecta servicios en todo el árbol de componentes. En los tests puedes pasarle un prop <code>dependencies={mockDeps}</code> igual que un perfil de test en Spring.',
        },
        {
          type: 'go',
          title: 'Golang: "Accept interfaces, return structs"',
          body: 'En Go la inyección es 100% manual mediante funciones <code>NewX(...)</code> en el arranque. Cada paquete declara interfaces diminutas con solo los métodos que consume.',
        },
      ],
      code: {
        java: {
          path: 'src/main/java/.../ApplicationConfiguration.java',
          source: `@Configuration
@ComponentScan(basePackages = "es.iarechaga.game.of.life")
public class ApplicationConfiguration {

    private static final int PETRI_DISH_SIZE = 20;

    @Bean
    public SquaredPetriDish configureDish() {
        return new SquaredPetriDish(PETRI_DISH_SIZE);
    }
}`,
        },
        ts: {
          path: 'typescript/src/ApplicationConfiguration.ts',
          source: `export class ApplicationConfiguration {
  public static readonly PETRI_DISH_SIZE = 20;

  public createContext(dishSize = ApplicationConfiguration.PETRI_DISH_SIZE) {
    const petriDish = new SquaredPetriDish(dishSize);
    const counter = new NeighbourLivingCellsCounter();
    const occupied = new OccupiedBlockGenerationCalculator(
      counter, new LivingCellGameRules()
    );
    const empty = new EmptyBlockGenerationCalculator(
      new EmptyBlockGameRules(), counter, new EmptyBlockRetriever()
    );
    const nextGenerationCalculator = new NextGenerationCalculator(occupied, empty);

    return {
      game: new Game(petriDish, nextGenerationCalculator),
      printer: new ConsolePetriDishPrinter(),
      livingCellBlockGenerator: new LivingCellBlockGenerator(),
    };
  }
}`,
        },
        react: {
          path: 'typescript-react/src/context/GameDependenciesContext.tsx',
          source: `const GameDependenciesContext = createContext<GameDependencies | null>(null);

export function GameDependenciesProvider({
  children,
  dependencies,
}: GameDependenciesProviderProps) {
  const value = useMemo(
    () => dependencies ?? createDefaultDependencies(),
    [dependencies],
  );

  return (
    <GameDependenciesContext.Provider value={value}>
      {children}
    </GameDependenciesContext.Provider>
  );
}`,
        },
        go: {
          path: 'golang/game/application_configuration.go',
          source: `func (c *ApplicationConfiguration) CreateContext(dishSize int) *ApplicationContext {
	petriDish := storage.NewSquaredPetriDish(dishSize)
	counter := generation.NewNeighbourLivingCellsCounter()
	occupied := generation.NewOccupiedBlockGenerationCalculator(
		counter, rules.NewLivingCellGameRules(),
	)
	empty := generation.NewEmptyBlockGenerationCalculator(
		rules.NewEmptyBlockGameRules(), counter, generation.NewEmptyBlockRetriever(),
	)
	nextCalc := generation.NewNextGenerationCalculator(occupied, empty)

	return &ApplicationContext{
		Game:    NewGame(petriDish, nextCalc),
		Printer: NewConsolePetriDishPrinter(),
	}
}`,
        },
      },
    },
    {
      id: 'runner',
      step: '07 · loop & UI',
      name: 'Bucle Temporal y Vista',
      tag: 'Thread.sleep vs async vs useEffect',
      title: '7. Bucle de Ejecución y Renderizado (GameRunner & Printer)',
      summary:
        'Aquí es donde más cambia el modelo mental: hilos bloqueantes en Java, Event Loop con Promises en Node TS, Hooks declarativos en React y Goroutines/CLI en Go.',
      insights: [
        {
          type: 'ts',
          title: 'TypeScript (Node): async / await no bloqueante',
          body: 'En JavaScript/TS hay un único hilo principal (Event Loop). Nunca se bloquea el hilo; usamos <code>await delay(1000)</code> de <code>node:timers/promises</code> para pausar la función asíncrona.',
        },
        {
          type: 'react',
          title: 'TS + React: De bucle imperativo a estado + useEffect',
          body: 'En React no escribes un bucle <code>for</code> de 20 pasos que imprime: declaras el estado (<code>petriDish, isRunning</code>), un <code>useEffect</code> programa <code>setInterval</code> con función de limpieza, y JSX proyecta la vista automáticamente.',
        },
        {
          type: 'go',
          title: 'Golang: time.Sleep bloquea solo la goroutine actual',
          body: 'En Go el código vuelve a leerse secuencial y sencillo como en Java (<code>time.Sleep(time.Second)</code>), pero bajo el capó el scheduler de Go suspende una goroutine ultraligera (~2 KB) sin bloquear hilos del SO.',
        },
      ],
      code: {
        java: {
          path: 'src/test/java/.../GameRunner.java',
          source: `public void runTheGame() throws InterruptedException {
    initGame();
    System.out.println("Initial state :");
    printer.print(game.getPetriDish());

    for (int iteration = 1; iteration <= MAX_ITERATIONS; iteration++) {
        Thread.sleep(ONE_SECOND);
        System.out.println("Iteration " + iteration);
        game.nextGeneration();
        printer.print(game.getPetriDish());
    }
}`,
        },
        ts: {
          path: 'typescript/src/GameRunner.ts',
          source: `import { setTimeout as delay } from 'node:timers/promises';

public async runTheGame(iterations = 20): Promise<void> {
  this.initGame();
  console.log('Initial state :');
  this.printer.print(this.game.getPetriDish());

  for (let iteration = 1; iteration <= iterations; iteration++) {
    await delay(this.sleepMs);
    console.log(\`Iteration \${iteration}\`);
    this.game.nextGeneration();
    this.printer.print(this.game.getPetriDish());
  }
}`,
        },
        react: {
          path: 'typescript-react/src/hooks/useGame.ts',
          source: `export function useGame() {
  const [petriDish, setPetriDish] = useState<SquaredPetriDish>(createSeededDish);
  const [iteration, setIteration] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const nextGeneration = useCallback(() => {
    setPetriDish((curr) => nextGenerationCalculator.evolveImmutable(curr));
    setIteration((n) => n + 1);
  }, [nextGenerationCalculator]);

  useEffect(() => {
    if (!isRunning) return;
    const timerId = window.setInterval(nextGeneration, intervalMs);
    return () => window.clearInterval(timerId); // cleanup al desmontar o pausar
  }, [isRunning, intervalMs, nextGeneration]);
}`,
        },
        go: {
          path: 'golang/cmd/gamerunner/main.go',
          source: `func runTheGame(g *game.Game, printer *game.ConsolePetriDishPrinter,
	gen *game.LivingCellBlockGenerator, iterations int, sleep time.Duration) error {

	for _, block := range gen.SmallExploder(g.PetriDish().Range()) {
		if err := g.PetriDish().Add(block); err != nil { return err }
	}
	fmt.Println("Initial state :")
	printer.Print(g.PetriDish())

	for iteration := 1; iteration <= iterations; iteration++ {
		time.Sleep(sleep)
		fmt.Printf("Iteration %d\\n", iteration)
		if err := g.NextGeneration(); err != nil { return err }
		printer.Print(g.PetriDish())
	}
	return nil
}`,
        },
      },
    },
    {
      id: 'testing',
      step: '08 · testing',
      name: 'Testing y Mocks',
      tag: 'Mockito vs node:test vs Go Spies',
      title: '8. Estrategias de Testing Unitario y Verificación de Orden',
      summary:
        'En Java usaste JUnit 4 + Mockito (InOrder) para verificar la secuencia exacta de llamadas. Mira cómo se hace sin frameworks pesados en TS y Go.',
      insights: [
        {
          type: 'ts',
          title: 'TypeScript: Runner y Mocks integrados en Node',
          body: 'Node incluye <code>node:test</code> y <code>node:assert/strict</code> de serie: <code>describe</code>, <code>it</code> y <code>mock.method(obj, "fn")</code> funcionan directamente sobre archivos <code>.ts</code>.',
        },
        {
          type: 'react',
          title: 'TS + React: Testear inmutabilidad de estado',
          body: 'En React es fundamental verificar que al evolucionar una generación la referencia anterior (<code>initialDish</code>) permanece intacta y <code>nextDish !== initialDish</code>.',
        },
        {
          type: 'go',
          title: 'Golang: Table-Driven Tests + Spies sin reflexión',
          body: 'En Go rara vez se usa un Mockito mágico: como las interfaces tienen 1 o 2 métodos, implementas un pequeño struct espía (<code>spyStep</code>) en 5 líneas y usas <code>t.Run</code> para casos parametrizados.',
        },
      ],
      code: {
        java: {
          path: 'src/test/java/.../NextGenerationCalculatorTest.java',
          source: `@RunWith(MockitoJUnitRunner.class)
public class NextGenerationCalculatorTest {
    @Mock private OccupiedBlockGenerationCalculator occupiedCalc;
    @Mock private EmptyBlockGenerationCalculator emptyCalc;
    @InjectMocks private NextGenerationCalculator nextGenCalc;

    @Test
    public void shouldEvolveFirstCellsAndThenEmptyBlocks() {
        SquaredPetriDish petriDish = new SquaredPetriDish(10);
        nextGenCalc.evolve(petriDish);

        InOrder inOrder = inOrder(occupiedCalc, emptyCalc);
        inOrder.verify(occupiedCalc).evolve(petriDish);
        inOrder.verify(emptyCalc).evolve(petriDish);
    }
}`,
        },
        ts: {
          path: 'typescript/test/generation/NextGenerationCalculator.test.ts',
          source: `describe('NextGenerationCalculatorTest', () => {
  it('shouldEvolveFirstCellsAndThenEmptyBlocks', () => {
    const sequence: string[] = [];
    mock.method(occupiedCalc, 'evolve', () => { sequence.push('occupied'); });
    mock.method(emptyCalc, 'evolve', () => { sequence.push('empty'); });

    const nextGenCalc = new NextGenerationCalculator(occupiedCalc, emptyCalc);
    nextGenCalc.evolve(new SquaredPetriDish(10));

    assert.deepEqual(sequence, ['occupied', 'empty']);
  });
});`,
        },
        react: {
          path: 'typescript-react/test/generation.test.ts',
          source: `it('evolves Mini Exploder immutably without mutating previous snapshot', () => {
  const nextDish = calculator.evolveImmutable(initialDish);

  // Garantiza que React detectará el cambio de referencia en useState:
  assert.notEqual(nextDish, initialDish);
  assert.equal(initialDish.getOccupiedCells().length, 7);
  assert.equal(nextDish.getOccupiedCells().length, 8);
});`,
        },
        go: {
          path: 'golang/generation/next_generation_calculator_test.go',
          source: `type spyStep struct {
	name  string
	calls *[]string
}
func (s *spyStep) Evolve(_ storage.PetriDish) error {
	*s.calls = append(*s.calls, s.name)
	return nil
}

func TestShouldEvolveFirstCellsAndThenEmptyBlocks(t *testing.T) {
	var calls []string
	occ := &spyStep{name: "occupied", calls: &calls}
	emp := &spyStep{name: "empty", calls: &calls}
	dish := &spyDish{calls: &calls}

	_ = generation.NewNextGenerationCalculator(occ, emp).Evolve(dish)
	if !slices.Equal(calls, []string{"occupied", "empty", "CleanDeadCells"}) {
		t.Fatalf("unexpected sequence: %v", calls)
	}
}`,
        },
      },
    },
  ],

  cheatSheet: [
    {
      concept: 'Sistema de Tipos',
      java: 'Nominal y estático (<code>implements</code> explícito)',
      ts: 'Estructural y estático (si tiene la misma forma, encaja; se borra en runtime)',
      react: 'Estructural + tipos JSX (<code>ReactNode</code>, genéricos en <code>useState&lt;T&gt;</code>)',
      go: 'Estático con interfaces implícitas (duck typing verificado en compilación)',
    },
    {
      concept: 'Visibilidad / Encapsulación',
      java: '<code>public</code>, package-private, <code>protected</code>, <code>private</code>',
      ts: '<code>public</code>, <code>protected</code>, <code>private</code> + <code>export</code> por módulo ES',
      react: 'Módulos ES; componentes exportados en <code>PascalCase</code> y hooks con prefijo <code>use*</code>',
      go: 'Inicial <code>Mayúscula</code> = exportado fuera del paquete; <code>minúscula</code> = privado al paquete',
    },
    {
      concept: 'Ausencia de Valor / Nulos',
      java: '<code>null</code> en cualquier referencia (riesgo de <code>NullPointerException</code>)',
      ts: '<code>strictNullChecks</code> obliga a declarar <code>Cell | null | undefined</code> explícitamente',
      react: '<code>null</code> en JSX no renderiza nada; contextos se inicializan como <code>T | null</code>',
      go: 'Zero values (<code>0</code>, <code>""</code>, <code>false</code>); <code>nil</code> solo en punteros, interfaces, slices y maps',
    },
    {
      concept: 'Constructores y Sobrecarga',
      java: 'Múltiples constructores sobrecargados con el nombre de la clase',
      ts: 'Un único <code>constructor(...)</code> con parámetros opcionales (<code>?</code>) o por defecto (<code>=</code>)',
      react: 'Funciones componente que reciben un único objeto <code>props</code> desestructurado',
      go: 'Funciones factoría por convención: <code>NewCell()</code>, <code>NewEmptyCellBlock(x, y)</code>',
    },
    {
      concept: 'Errores y Excepciones',
      java: '<code>throw new ...Exception()</code> + <code>try / catch</code>',
      ts: '<code>throw new Error()</code> + <code>try / catch</code> (sin checked exceptions)',
      react: '<code>throw</code> en hooks/dominio + Error Boundaries para fallos de renderizado',
      go: 'Retorno múltiple <code>(val, error)</code> + comprobación explícita <code>if err != nil</code>',
    },
    {
      concept: 'Mutabilidad de Estado',
      java: 'Objetos mutables con campos <code>final</code> para referencias fijas',
      ts: '<code>readonly</code> en propiedades y tipos <code>ReadonlyArray&lt;T&gt;</code>',
      react: 'Inmutabilidad estricta en el estado: siempre crear nueva referencia (<code>clone()</code> / <code>[...arr]</code>)',
      go: 'Paso por valor por defecto; mutación explícita solo cuando recibes puntero <code>*Struct</code>',
    },
    {
      concept: 'Colecciones Clave',
      java: '<code>List&lt;T&gt;</code>, <code>TreeMap&lt;K,V&gt;</code> + API <code>Stream</code>',
      ts: '<code>T[]</code>, <code>Map&lt;K,V&gt;</code>, <code>Set&lt;T&gt;</code> + métodos directos (<code>.filter</code>, <code>.map</code>)',
      react: '<code>.map()</code> para transformar listas de datos en elementos JSX con prop <code>key</code> única',
      go: 'Slices <code>[]T</code> (<code>append</code>) y <code>map[K]V</code> (<code>make</code>, <code>delete</code>, <code>v, ok := m[k]</code>)',
    },
    {
      concept: 'Inyección de Dependencias',
      java: 'Spring IoC Container (<code>@Configuration</code>, <code>@Bean</code>, <code>@Inject</code>)',
      ts: 'Constructores puros ensamblados en un Composition Root',
      react: '<code>createContext</code> + <code>&lt;Provider&gt;</code> + Custom Hook consumidor',
      go: 'Interfaces pequeñas en el consumidor + cableado explícito en <code>main()</code>',
    },
    {
      concept: 'Espera / Concurrencia',
      java: 'Hilos del SO / Virtual Threads (<code>Thread.sleep(1000)</code>)',
      ts: 'Event Loop monohilo + <code>async / await</code> con <code>Promise</code>',
      react: 'Efectos declarativos con <code>useEffect</code> + <code>setInterval</code> y cleanup',
      go: 'Goroutines (<code>go fn()</code>), canales (<code>chan</code>) y <code>time.Sleep</code>',
    },
    {
      concept: 'Build & Tooling',
      java: 'Maven (<code>pom.xml</code>, <code>mvn test</code>)',
      ts: '<code>package.json</code> + <code>tsconfig.json</code> (<code>tsc --noEmit</code>, <code>node --test</code>)',
      react: 'Vite + TypeScript (<code>npm run dev</code> con HMR instantáneo, <code>vite build</code>)',
      go: 'Binario único oficial: <code>go.mod</code>, <code>go run</code>, <code>go test ./...</code>, <code>go vet</code>',
    },
  ],

  quiz: [
    {
      question: 'En tu Java original, NullCell extiende Cell. ¿Cómo se logra el mismo polimorfismo en Go si Go no tiene herencia (extends)?',
      snippet: `// Java:
public final class NullCell extends Cell { ... }`,
      options: [
        'Embebiendo Cell dentro de NullCell y usando la palabra clave override',
        'Definiendo una interfaz Cell { Alive() bool; Die() error } que tanto livingCell como nullCell satisfacen implícitamente al implementar sus métodos',
        'Usando punteros void* (unsafe.Pointer) para convertir NullCell en Cell',
        'No es posible el patrón Null Object en Go; hay que usar nil obligatoriamente',
      ],
      correctIndex: 1,
      explanation:
        '¡Exacto! En Go las interfaces son implícitas: no existe "implements" ni "extends". Basta con que *livingCell y *nullCell tengan los métodos Alive() bool y Die() error para que ambos sean valores válidos de tipo Cell.',
    },
    {
      question: '¿Por qué en la variante TypeScript + React añadimos petriDish.clone() dentro de evolveImmutable() antes de evolucionar la generación?',
      snippet: `setPetriDish((currentDish) => nextGenerationCalculator.evolveImmutable(currentDish));`,
      options: [
        'Porque TypeScript prohíbe modificar mapas (Map) en tiempo de compilación',
        'Porque React compara referencias de estado (Object.is): si mutamos la misma instancia de SquaredPetriDish y la devolvemos, React asume que nada cambió y no re-renderiza el tablero',
        'Porque el Garbage Collector del navegador borra los Map automáticamente tras cada render',
        'Solo por estética; mutar currentDish directamente funcionaría igual con useState',
      ],
      correctIndex: 1,
      explanation:
        '¡Correcto! React decide si debe actualizar el DOM comparando prevDish === nextDish. Si mutas la instancia existente in-place y devuelves la misma referencia, React ignora la actualización.',
    },
    {
      question: 'En SquaredPetriDish.java usaste getOrDefault anidados. ¿Cuál es su traducción idiomática en TypeScript?',
      snippet: `// Java:
return cellStorage.getOrDefault(row, new TreeMap<>())
        .getOrDefault(column, new CellBlock(row, column));`,
      options: [
        'this.cellStorage.get(row)?.get(column) ?? new CellBlock(row, column)',
        'this.cellStorage[row][column] || NullCell',
        'Optional.ofNullable(this.cellStorage.get(row)).orElseGet(...)',
        'try { return this.cellStorage.get(row).get(column); } catch { ... }',
      ],
      correctIndex: 0,
      explanation:
        'El operador Optional Chaining (?.) cortocircuita a undefined si la fila no existe, y Nullish Coalescing (??) crea el CellBlock vacío por defecto solo cuando el resultado es null o undefined.',
    },
    {
      question: 'En Go, ¿qué diferencia hay entre func (d *SquaredPetriDish) Add(...) y func (d *SquaredPetriDish) outOfBoundsPosition(...)?',
      snippet: `func (d *SquaredPetriDish) Add(cellBlock *CellBlock) error
func (d *SquaredPetriDish) outOfBoundsPosition(position int) bool`,
      options: [
        'Add es asíncrona y outOfBoundsPosition es síncrona',
        'Add es pública/exportada fuera del paquete storage (empieza por Mayúscula) y outOfBoundsPosition es privada al paquete (empieza por minúscula)',
        'Add recibe una copia por valor y outOfBoundsPosition recibe un puntero',
        'No hay ninguna diferencia de visibilidad en Go',
      ],
      correctIndex: 1,
      explanation:
        'En Go no existen las palabras clave public ni private: la visibilidad a nivel de paquete la determina exclusivamente si la primera letra del identificador es Mayúscula (exportado) o minúscula (privado al paquete).',
    },
    {
      question: '¿Qué sustituye idiomáticamente en React + TypeScript al @Configuration + @Bean de Spring y al bucle Thread.sleep(1000) de GameRunner?',
      snippet: `// Java:
@Configuration class ApplicationConfiguration { @Bean ... }
// + Thread.sleep(ONE_SECOND) en bucle for`,
      options: [
        'Variables globales window.* y un bucle while(true) síncrono',
        'React Context (<GameDependenciesProvider>) para inyección de dependencias + un Custom Hook (useGame) con useState y useEffect + setInterval con cleanup',
        'Un contenedor Maven ejecutado en WebAssembly',
        'Decoradores @Autowired nativos de React DOM',
      ],
      correctIndex: 1,
      explanation:
        '¡Perfecto! React Context actúa como contenedor de inversión de control para proveer dependencias al árbol de componentes, y useEffect gestiona efectos laterales temporizados limpiando el intervalo al pausar o desmontar.',
    },
  ],
};
