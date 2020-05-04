package es.iarechaga.game.of.life.storage;

public class BlockOutOfLimitsException extends RuntimeException {
    public BlockOutOfLimitsException(final String text) {
        super(text);
    }
}
