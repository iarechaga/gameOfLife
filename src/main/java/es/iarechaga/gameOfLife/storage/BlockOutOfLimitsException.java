package es.iarechaga.gameOfLife.storage;

public class BlockOutOfLimitsException extends RuntimeException {
    public BlockOutOfLimitsException(final String text) {
        super(text);
    }
}
