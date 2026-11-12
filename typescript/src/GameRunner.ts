import { setTimeout as delay } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';
import { ApplicationConfiguration } from './ApplicationConfiguration.ts';
import { ConsolePetriDishPrinter } from './ConsolePetriDishPrinter.ts';
import { Game } from './Game.ts';
import { LivingCellBlockGenerator } from './LivingCellBlockGenerator.ts';

export class GameRunner {
  private static readonly MAX_ITERATIONS = 20;
  private static readonly ONE_SECOND = 1000;

  private readonly game: Game;
  private readonly printer: ConsolePetriDishPrinter;
  private readonly randomCellGenerator: LivingCellBlockGenerator;
  private readonly sleepMs: number;

  constructor(
    game: Game,
    printer: ConsolePetriDishPrinter,
    randomCellGenerator: LivingCellBlockGenerator,
    sleepMs = GameRunner.ONE_SECOND,
  ) {
    this.game = game;
    this.printer = printer;
    this.randomCellGenerator = randomCellGenerator;
    this.sleepMs = sleepMs;
  }

  public async runTheGame(iterations = GameRunner.MAX_ITERATIONS): Promise<void> {
    this.initGame();

    console.log('Initial state :');
    this.printer.print(this.game.getPetriDish());

    for (let iteration = 1; iteration <= iterations; iteration++) {
      await this.blockExecution();
      console.log(`Iteration ${iteration}`);
      this.game.nextGeneration();
      this.printer.print(this.game.getPetriDish());
    }
  }

  private async blockExecution(): Promise<void> {
    await delay(this.sleepMs);
  }

  private initGame(): void {
    const cellsToAdd = this.randomCellGenerator.smallExploder(this.game.getPetriDish().getRange());
    cellsToAdd.forEach((cellBlock) => this.game.getPetriDish().add(cellBlock));
  }
}

const currentPath = fileURLToPath(import.meta.url);
if (process.argv[1] === currentPath) {
  const config = new ApplicationConfiguration();
  const { game, printer, livingCellBlockGenerator } = config.createContext();
  const runner = new GameRunner(game, printer, livingCellBlockGenerator);
  await runner.runTheGame();
}
