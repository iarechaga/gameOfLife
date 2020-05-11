package es.iarechaga.game.of.life;

import es.iarechaga.game.of.life.cell.Cell;
import es.iarechaga.game.of.life.storage.CellBlock;

import javax.inject.Named;
import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.List;

@Named
public class LivingCellBlockGenerator {


    public List<CellBlock> smallExploder(final Integer range) {
        final List<CellBlock> blocks = new ArrayList<>();

        final int randomRow = getRandomValue(range);
        final int randomColumn = getRandomValue(range);

        blocks.add(new CellBlock(randomRow - 1, randomColumn, new Cell()));
        blocks.add(new CellBlock(randomRow, randomColumn - 1, new Cell()));
        blocks.add(new CellBlock(randomRow, randomColumn, new Cell()));
        blocks.add(new CellBlock(randomRow, randomColumn + 1, new Cell()));
        blocks.add(new CellBlock(randomRow + 1, randomColumn - 1, new Cell()));
        blocks.add(new CellBlock(randomRow + 1, randomColumn + 1, new Cell()));
        blocks.add(new CellBlock(randomRow + 2, randomColumn, new Cell()));

        return blocks;
    }

    private static int getRandomValue(Integer range) {
        return new SecureRandom().nextInt() % range;
    }
}
