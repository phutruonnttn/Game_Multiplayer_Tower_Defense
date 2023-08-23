package cmd.obj.friend;


public class MessageObject {
    public String content;
    public boolean isMine;
    public long sentTime;
    public boolean isRead;

    public MessageObject(String _content, boolean _isMine) {
        content = _content;
        isMine = _isMine;
        sentTime = System.currentTimeMillis();
        isRead = _isMine;
    }

}
