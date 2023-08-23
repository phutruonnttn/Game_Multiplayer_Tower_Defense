package cmd.obj.authen;


public class ObjectSessionKey {
    public int error;
    public long id;
    public String username;
    public String social;
    public String socialName;
    public String avatar;
    public long time;

    public ObjectSessionKey(int _err, long _id, String _user, String _social, String _socialName, String _ava,
                            long _time) {
        super();
        error = _err;
        id = _id;
        username = _user;
        social = _social;
        socialName = _socialName;
        avatar = _ava;
        time = _time;
    }
}
