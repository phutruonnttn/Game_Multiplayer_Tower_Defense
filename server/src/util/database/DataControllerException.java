package util.database;


public class DataControllerException extends Exception {
    public DataControllerException(Throwable throwable) {
        super(throwable);
    }

    public DataControllerException(String string, Throwable throwable) {
        super(string, throwable);
    }

    public DataControllerException(String string) {
        super(string);
    }

    public DataControllerException() {
        super();
    }
}
