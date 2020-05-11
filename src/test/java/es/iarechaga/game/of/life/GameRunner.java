package es.iarechaga.game.of.life;

import es.iarechaga.game.of.life.storage.CellBlock;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import javax.inject.Inject;
import java.util.List;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = {ApplicationConfiguration.class})
public class GameRunner {

    private static final double MAX_ITERATIONS = 20;
    private static final int ONE_SECOND = 1000;

    @Inject
    private Game game;
    @Inject
    private ConsolePetriDishPrinter printer;
    @Inject
    private LivingCellBlockGenerator randomCellGenerator;

    @Test
    public void runTheGame() throws InterruptedException {
        initGame();

        System.out.println("Initial state :");
        printer.print(game.getPetriDish());
        for (int iteration = 1; iteration <= MAX_ITERATIONS; iteration++) {
            blockExecution();
            System.out.println("Iteration " + iteration);
            game.nextGeneration();
            printer.print(game.getPetriDish());
        }

    }

    private void blockExecution() throws InterruptedException {
        Thread.sleep(ONE_SECOND);
    }

    private void initGame() {
        List<CellBlock> cellsToAdd = randomCellGenerator.smallExploder(game.getPetriDish().getRange());
        cellsToAdd.forEach(game.getPetriDish()::add);
    }

}
