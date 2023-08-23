package cmd.obj.friend;


public class MessageItem {
    public long fromId;
    public long sentTime;
    public String content = "";
    public int messageType;

    public int fromGameId;
    public String acceptLink = "";
    public String ignoreLink = "";
    public String itemIcon = "";

    public MessageItem(long fromId, int messageType, String content) {
        this.fromId = fromId;
        this.messageType = messageType;
        this.sentTime = System.currentTimeMillis();
        this.content = content;
    }

}
