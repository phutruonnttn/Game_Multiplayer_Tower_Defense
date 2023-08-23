package battle.model.shootableMonster;

/**
 * @author huynv6
 */
public class Ability {
    public Monster owner;

    public Ability(Monster owner) {
        this.owner = owner;
    }

    /**
     * @return
     * kiem tra xem co the kich hoat ky nang
     */
    public boolean canActive(){
        return false;
    }

    /**
     * @return
     * kiem tra xem ki nang cua quai co dang duoc su dung
     */
    public boolean isActive(){
        return false;
    }

    /**
     * kich hoat ki nang
     */
    public void active(){
        //do something
    }
}
