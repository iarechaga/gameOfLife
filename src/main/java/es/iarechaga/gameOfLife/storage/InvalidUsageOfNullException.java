package es.iarechaga.gameOfLife.storage;

public class InvalidUsageOfNullException extends RuntimeException {
    public InvalidUsageOfNullException(final String message) {
        super(message);
    }
}
