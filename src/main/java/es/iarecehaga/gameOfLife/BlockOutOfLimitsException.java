package es.iarecehaga.gameOfLife;

public class BlockOutOfLimitsException extends RuntimeException {
    public BlockOutOfLimitsException(final String text) {
        super(text);
    }
}
