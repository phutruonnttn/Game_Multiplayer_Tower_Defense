package cmd.obj.demo;

/**
 * Created by hieupt on 11/8/18.
 */
public enum DemoDirection{
    UP((short)1),
    DOWN((short)2),
    LEFT((short)3),
    RIGHT((short)4);

    private final short value;
    private DemoDirection(short value){
        this.value = value;
    }

    public short getValue(){
        return this.value;
    }
}

