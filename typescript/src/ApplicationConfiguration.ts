import { ConsolePetriDishPrinter } from './ConsolePetriDishPrinter.ts';
import { Game } from './Game.ts';
import { LivingCellBlockGenerator } from './LivingCellBlockGenerator.ts';
import { EmptyBlockGenerationCalculator } from './generation/EmptyBlockGenerationCalculator.ts';
import { EmptyBlockRetriever } from './generation/EmptyBlockRetriever.ts';
import { NeighbourLivingCellsCounter } from './generation/NeighbourLivingCellsCounter.ts';
import { NextGenerationCalculator } from './generation/NextGenerationCalculator.ts';
import { OccupiedBlockGenerationCalculator } from './generation/OccupiedBlockGenerationCalculator.ts';
import { EmptyBlockGameRules } from './rules/EmptyBlockGameRules.ts';
import { LivingCellGameRules } from './rules/LivingCellGameRules.ts';
import { SquaredPetriDish } from './storage/SquaredPetriDish.ts';

export interface ApplicationContext {
  game: Game;
  printer: ConsolePetriDishPrinter;
  livingCellBlockGenerator: LivingCellBlockGenerator;
  nextGenerationCalculator: NextGenerationCalculator;
  petriDish: SquaredPetriDish;
}

export class ApplicationConfiguration {
  public static readonly PETRI_DISH_SIZE = 20;

  public configureDish(size = ApplicationConfiguration.PETRI_DISH_SIZE): SquaredPetriDish {
    return new SquaredPetriDish(size);
  }

  public createContext(dishSize = ApplicationConfiguration.PETRI_DISH_SIZE): ApplicationContext {
    const petriDish = this.configureDish(dishSize);
    const counter = new NeighbourLivingCellsCounter();
    const livingCellRules = new LivingCellGameRules();
    const emptyBlockRules = new EmptyBlockGameRules();
    const emptyBlockRetriever = new EmptyBlockRetriever();

    const occupiedCalculator = new OccupiedBlockGenerationCalculator(counter, livingCellRules);
    const emptyCalculator = new EmptyBlockGenerationCalculator(
      emptyBlockRules,
      counter,
      emptyBlockRetriever,
    );
    const nextGenerationCalculator = new NextGenerationCalculator(
      occupiedCalculator,
      emptyCalculator,
    );

    const game = new Game(petriDish, nextGenerationCalculator);
    const printer = new ConsolePetriDishPrinter();
    const livingCellBlockGenerator = new LivingCellBlockGenerator();

    return {
      game,
      printer,
      livingCellBlockGenerator,
      nextGenerationCalculator,
      petriDish,
    };
  }
}
