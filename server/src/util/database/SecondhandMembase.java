package util.database;

import bitzero.server.config.ConfigHandle;
import bitzero.util.common.business.Debug;
import net.spy.memcached.CASResponse;
import net.spy.memcached.CASValue;
import net.spy.memcached.CachedData;
import net.spy.memcached.MemcachedClient;
import net.spy.memcached.transcoders.SerializingTranscoder;

import java.net.InetSocketAddress;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

public class SecondhandMembase {
    public static final int COMPRESSION_THRESHOLD = 50;

    static SecondhandMembase _instance;
    static final Object lock = new Object();

    MemcachedClient cli;

    private SecondhandMembase() {
        try {
            String host = ConfigHandle.instance().get("dservers");
            int port = ConfigHandle.instance().getLong("dport").intValue();

            //            ConnectionFactoryBuilder cfb = new ConnectionFactoryBuilder();
            //            cfb.setOpQueueMaxBlockTime(ConfigHandle.instance().getLong("opsBlockTime").longValue());
            //            cfb.setOpTimeout(ConfigHandle.instance().getLong("opsTimeOut").longValue());

            //cli = new MemcachedClient(cfb.build(), AddrUtil.getAddresses(host));

            cli = new MemcachedClient(new InetSocketAddress(host, port));
            ((SerializingTranscoder) cli.getTranscoder()).setCompressionThreshold(COMPRESSION_THRESHOLD);
        } catch (Exception e) {
            Debug.trace(e.getMessage());
        }
    }

    public static SecondhandMembase instance() {
        if (_instance == null) {
            synchronized (lock) {
                if (_instance == null) {
                    _instance = new SecondhandMembase();
                }
            }
        }
        return _instance;
    }

    public Object get(String name) {
        return cli.get(name);
    }

    public Map<String, Object> multiget(List<String> keys) {
        return cli.getBulk(keys);
    }

    public void set(String name, Object data) throws Exception {
        cli.set(name, 0, data);
    }

    public void set(String name, CachedData data) throws Exception {
        cli.set(name, 0, data);
    }

    public void add(String name, Object data) throws Exception {
        cli.add(name, 0, data);
    }

    public void delete(String name) throws Exception {
        cli.delete(name);
    }

    public void shutdown() {
        if (cli != null)
            cli.shutdown(3, TimeUnit.SECONDS);
    }

    public long getCASValue(String name) throws DataControllerException {
        CASValue casVak = cli.gets(name);
        if (casVak == null)
            return 0;
        return casVak.getCas();
    }

    public CASValue getS(String name) {
        return cli.gets(name);
    }

    public CASResponse checkAndSet(String name, long casValue, Object data) throws DataControllerException {
        return cli.cas(name, casValue, data);
    }
}
