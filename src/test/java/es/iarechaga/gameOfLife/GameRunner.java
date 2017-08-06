package es.iarechaga.gameOfLife;

import es.iarechaga.gameOfLife.storage.CellBlock;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import javax.inject.Inject;
import java.util.List;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = {ConfigurationContext.class})
public class GameRunner {

    private static final double MAX_ITERATIONS = 20;
    @Inject
    private Game game;

    @Inject
    private ConsolePetriDishPrinter printer;

    @Inject
    private LivingCellBlockGenerator randomCellGenerator;

    // Remove comment to be able to start the application
    @Test
    public void runTheGame() throws InterruptedException {
        initGame();

        System.out.println("Initial state :");
        printer.print(game.getPetriDish());
        for (int iteration = 0; iteration < MAX_ITERATIONS; iteration++) {
            blockExecution();
            System.out.println("Iteration " + iteration);
            game.nextGeneration();
            printer.print(game.getPetriDish());
        }

    }

    private void blockExecution() throws InterruptedException {
        Thread.sleep(1000);
    }

    private void initGame() {
        List<CellBlock> cellsToAdd = randomCellGenerator.smallExploder(game.getPetriDish().getRange());
        for (CellBlock cellBlock : cellsToAdd) {
            game.getPetriDish().add(cellBlock);
        }
    }

}
