package model.user.base;

import bitzero.server.entities.User;

public abstract class BaseService {

    /**
     *
     * @param user
     * @return
     * lay model trong cache ra
     */
    public abstract AbstractUserModel getModelFromCache(User user);

    /**
     *
     * @param user
     * luu model vao database
     */
    public void saveModelToDatabase(User user){
        getModelFromCache(user).save();
    }
}
