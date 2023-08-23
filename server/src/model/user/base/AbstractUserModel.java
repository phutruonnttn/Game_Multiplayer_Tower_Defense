package model.user.base;

import util.database.DataModel;

public class AbstractUserModel extends DataModel {
    int uid;

    public AbstractUserModel(int uid) {
        this.uid = uid;
    }

    public void save() {
        try {
            saveModel(uid);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
