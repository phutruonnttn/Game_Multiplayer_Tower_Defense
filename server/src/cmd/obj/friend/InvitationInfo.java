package cmd.obj.friend;


public class InvitationInfo {
    public long id;
    public String accountName;
    public String displayName;
    public String avatarURL;
    public long sentTime;

    public InvitationInfo(long id, String name, String socialDisplayName, String avatar) {
        this.id = id;
        this.accountName = name;
        this.displayName = socialDisplayName;
        this.avatarURL = avatar;
        this.sentTime = System.currentTimeMillis();
    }

    public String toString() {
        return String.format("%s|%s|%s|%s", new Object[] { id, accountName, displayName, avatarURL });
    }


}
