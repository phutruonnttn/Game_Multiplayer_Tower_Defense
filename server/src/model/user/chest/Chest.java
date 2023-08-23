/**
 * @author huynv6
 */

package model.user.chest;

public class Chest {
    int index;
    int id;
    int status;
    public Chest(int index) {
        this.index = index; this.status = 0 ;
    }

    public int getIndex() {
        return index;
    }

    public int getId() {
        return id;
    }

    public int getStatus() {
        return status;
    }
}
