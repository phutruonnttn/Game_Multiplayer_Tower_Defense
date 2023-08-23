package cmd.obj.friend;


public class HttpResponseError {
    public int error;
    public String reason;

    public HttpResponseError(int _error, String _reason) {
        super();
        error = _error;
        reason = _reason;
    }

}
