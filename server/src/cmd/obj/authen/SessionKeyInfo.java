package cmd.obj.authen;


public class SessionKeyInfo {

    public long id;
    public String username;
    public String social;
    public String socialname;
    public String socialacc;
    public String avatar;

    public SessionKeyInfo(long _id, String _username, String _social, String _socialName, String _socialAcc,
                          String _ava) {
        super();
        id = _id;
        username = _username;
        social = _social;
        socialname = _socialName;
        socialacc = _socialAcc;
        avatar = _ava;
    }
}
