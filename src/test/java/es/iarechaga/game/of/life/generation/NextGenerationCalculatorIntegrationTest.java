package es.iarechaga.game.of.life.generation;

import es.iarechaga.game.of.life.ApplicationConfiguration;
import es.iarechaga.game.of.life.cell.Cell;
import es.iarechaga.game.of.life.storage.CellBlock;
import es.iarechaga.game.of.life.storage.SquaredPetriDish;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import javax.inject.Inject;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import static org.junit.Assert.assertTrue;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = {ApplicationConfiguration.class})
public class NextGenerationCalculatorIntegrationTest {

    @Inject
    private NextGenerationCalculator nextGenerationCalculator;

    @Test
    public void nextGenerationMiniExploder() {
        final SquaredPetriDish petriDish = new SquaredPetriDish(10);
        petriDish.addAll(buildMiniExploder());

        nextGenerationCalculator.evolve(petriDish);

        assertTrue(petriDish.getOccupiedCells().containsAll(buildFirstMiniExploderIteration()));
        assertTrue(petriDish.getOccupiedCells().size() == buildFirstMiniExploderIteration().size());
    }

    private Collection<CellBlock> buildMiniExploder() {
        List<CellBlock> blocks = new ArrayList<>();

        blocks.add(new CellBlock(2, 4, new Cell()));
        blocks.add(new CellBlock(3, 3, new Cell()));
        blocks.add(new CellBlock(3, 4, new Cell()));
        blocks.add(new CellBlock(3, 5, new Cell()));
        blocks.add(new CellBlock(4, 3, new Cell()));
        blocks.add(new CellBlock(4, 5, new Cell()));
        blocks.add(new CellBlock(5, 4, new Cell()));

        return blocks;
    }

    private Collection<CellBlock> buildFirstMiniExploderIteration() {
        List<CellBlock> blocks = new ArrayList<>();

        blocks.add(new CellBlock(2, 3, new Cell()));
        blocks.add(new CellBlock(2, 4, new Cell()));
        blocks.add(new CellBlock(2, 5, new Cell()));
        blocks.add(new CellBlock(3, 3, new Cell()));
        blocks.add(new CellBlock(3, 5, new Cell()));
        blocks.add(new CellBlock(4, 3, new Cell()));
        blocks.add(new CellBlock(4, 5, new Cell()));
        blocks.add(new CellBlock(5, 4, new Cell()));

        return blocks;
    }
}
