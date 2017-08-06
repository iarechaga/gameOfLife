package es.iarechaga.gameOfLife;

import es.iarechaga.gameOfLife.cell.Cell;
import es.iarechaga.gameOfLife.storage.CellBlock;

import javax.inject.Named;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

@Named
public class LivingCellBlockGenerator {

    List<CellBlock> glider(final Integer range) {
        List<CellBlock> blocks = new ArrayList<>();

        int randomRow = ThreadLocalRandom.current().nextInt(3, range - 3);
        int randomColumn = ThreadLocalRandom.current().nextInt(3, range - 3);

        blocks.add(new CellBlock(randomRow - 1, randomColumn, new Cell()));
        blocks.add(new CellBlock(randomRow, randomColumn + 1, new Cell()));
        blocks.add(new CellBlock(randomRow + 1, randomColumn - 1, new Cell()));
        blocks.add(new CellBlock(randomRow + 1, randomColumn, new Cell()));
        blocks.add(new CellBlock(randomRow + 1, randomColumn + 1, new Cell()));

        return blocks;
    }

    List<CellBlock> smallExploder(final Integer range) {
        List<CellBlock> blocks = new ArrayList<>();

        int randomRow = ThreadLocalRandom.current().nextInt(3, range - 3);
        int randomColumn = ThreadLocalRandom.current().nextInt(3, range - 3);

        blocks.add(new CellBlock(randomRow - 1, randomColumn, new Cell()));
        blocks.add(new CellBlock(randomRow, randomColumn - 1, new Cell()));
        blocks.add(new CellBlock(randomRow, randomColumn, new Cell()));
        blocks.add(new CellBlock(randomRow, randomColumn + 1, new Cell()));
        blocks.add(new CellBlock(randomRow + 1, randomColumn - 1, new Cell()));
        blocks.add(new CellBlock(randomRow + 1, randomColumn + 1, new Cell()));
        blocks.add(new CellBlock(randomRow + 2, randomColumn, new Cell()));

        return blocks;
    }
}
