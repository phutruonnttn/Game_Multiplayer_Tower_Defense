package cmd.receive.demo;

import bitzero.server.extensions.data.BaseCmd;
import bitzero.server.extensions.data.DataCmd;
import bitzero.util.common.business.CommonHandle;
import cmd.obj.demo.DemoDirection;

import java.nio.ByteBuffer;


public class RequestMove extends BaseCmd{
    private short direction;
    public RequestMove(DataCmd dataCmd) {
        super(dataCmd);
        unpackData();
    }
    
    @Override
    public void unpackData() {
        ByteBuffer bf = makeBuffer();
        try {
            direction = readShort(bf);            
        } catch (Exception e) {
            direction = DemoDirection.UP.getValue();
            CommonHandle.writeErrLog(e);
        }
    }

    public short getDirection(){
        return direction;
    }
}
