package util.server;

import bitzero.util.common.business.Debug;
import org.apache.commons.lang.exception.ExceptionUtils;

import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;
import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.lang.reflect.Field;
import java.net.HttpURLConnection;
import java.net.URL;
import java.security.SecureRandom;
import java.security.cert.X509Certificate;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

public class ServerUtil {
    public static String SQL_DATABASE = "Portal";

    public ServerUtil() {
        super();
    }

    public static String getUserInfoKeyName(String userId) {
        StringBuilder sb = new StringBuilder();
        sb.append(ServerConstant.USER_INFO_KEY);
        sb.append(ServerConstant.SEPERATOR);
        sb.append(userId);

        return sb.toString();
    }

    public static String getLastSnapshotKeyName(int userId) {
        StringBuilder sb = new StringBuilder();
        sb.append(ServerConstant.LAST_SNAPSHOT_KEY);
        sb.append(ServerConstant.SEPERATOR);
        sb.append(userId);

        return sb.toString();
    }


    public static String getModelKeyName(String model, String key) {
        StringBuilder sb = new StringBuilder();
        sb.append(ServerConstant.GAME_DATA_KEY_PREFIX);
        sb.append(ServerConstant.SEPERATOR);
        sb.append(key);
        sb.append(ServerConstant.SEPERATOR);
        sb.append(model);

        return sb.toString();
    }

    public static String getModelKeyName(String model, int userId) {
        StringBuilder sb = new StringBuilder();
        sb.append(ServerConstant.GAME_DATA_KEY_PREFIX);
        sb.append(ServerConstant.SEPERATOR);
        sb.append(userId);
        sb.append(ServerConstant.SEPERATOR);
        sb.append(model);

        return sb.toString();
    }

    public static String getModelKeyName(String model, long userId) {
        StringBuilder sb = new StringBuilder();
        sb.append(ServerConstant.GAME_DATA_KEY_PREFIX);
        sb.append(ServerConstant.SEPERATOR);
        sb.append(userId);
        sb.append(ServerConstant.SEPERATOR);
        sb.append(model);

        return sb.toString();
    }

    public static String getSocialModelKeyName(String model, long userId) {
        StringBuilder sb = new StringBuilder();
        sb.append(ServerConstant.GAME_DATA_KEY_PREFIX);
        sb.append(ServerConstant.SEPERATOR);
        sb.append(userId);
        sb.append(ServerConstant.SEPERATOR);
        sb.append(model);

        return sb.toString();
    }

    static public StringBuffer sendRequest(String _method, String _url, String _postFiled) throws IOException {
        URL obj = new URL(_url);
        HttpURLConnection con = (HttpURLConnection) obj.openConnection();
        con.setRequestProperty("User-Agent", "GSN");
        con.setRequestProperty("Accept-Language", "en-US,en;q=0.5");

        if (_method == "GET") {
            // optional default is GET
            con.setRequestMethod("GET");

            int responseCode = con.getResponseCode();
            //System.out.println("\nSending 'GET' request to URL : " + _url);
            //System.out.println("Response Code : " + responseCode);

            BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()));
            String inputLine;
            StringBuffer response = new StringBuffer();

            while ((inputLine = in.readLine()) != null) {
                response.append(inputLine);
            }
            in.close();

            //print result
            return response;
        } else if (_method == "POST") {
            //add reuqest header
            con.setRequestMethod("POST");

            // Send post request
            con.setDoOutput(true);
            DataOutputStream wr = new DataOutputStream(con.getOutputStream());
            wr.writeBytes(_postFiled);
            wr.flush();
            wr.close();

            int responseCode = con.getResponseCode();
            //System.out.println("\nSending 'POST' request to URL : " + _url);
            //System.out.println("Post parameters : " + _postFiled);
            //System.out.println("Response Code : " + responseCode);

            BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()));
            String inputLine;
            StringBuffer response = new StringBuffer();

            while ((inputLine = in.readLine()) != null) {
                response.append(inputLine);
            }
            in.close();

            //print result
            return response;
        }

        return null;
    }

    static public StringBuffer sendRequestHTTPS(String _method, String _url, String _postFiled) throws IOException {
        URL obj = new URL(_url);

        TrustManager[] trustAllCerts = new TrustManager[] { new X509TrustManager() {
            public X509Certificate[] getAcceptedIssuers() {
                return null;
            }

            public void checkClientTrusted(X509Certificate[] certs, String authType) {

            }

            public void checkServerTrusted(X509Certificate[] certs, String authType) {

            }
        }
        };

        try {
            SSLContext sc = SSLContext.getInstance("SSL");
            sc.init(null, trustAllCerts, new SecureRandom());
            HttpsURLConnection.setDefaultSSLSocketFactory(sc.getSocketFactory());
            HttpsURLConnection con = (HttpsURLConnection) obj.openConnection();
            con.setRequestProperty("User-Agent", "GSN");
            con.setRequestProperty("Accept-Language", "en-US,en;q=0.5");


            if (_method == "GET") {
                // optional default is GET
                con.setRequestMethod("GET");

                int responseCode = con.getResponseCode();
                //System.out.println("\nSending 'GET' request to URL : " + _url);
                //System.out.println("Response Code : " + responseCode);

                BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()));
                String inputLine;
                StringBuffer response = new StringBuffer();

                while ((inputLine = in.readLine()) != null) {
                    response.append(inputLine);
                }
                in.close();

                //print result
                return response;
            } else if (_method == "POST") {
                //add reuqest header
                con.setRequestMethod("POST");

                // Send post request
                con.setDoOutput(true);
                DataOutputStream wr = new DataOutputStream(con.getOutputStream());
                wr.writeBytes(_postFiled);
                wr.flush();
                wr.close();

                int responseCode = con.getResponseCode();


                BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()));
                String inputLine;
                StringBuffer response = new StringBuffer();

                while ((inputLine = in.readLine()) != null) {
                    response.append(inputLine);
                }
                in.close();

                //print result
                return response;
            }

        } catch (Exception e) {
            Debug.warn("TRUST MANAGER EXCEPTION " + e.getMessage());
            Debug.warn(ExceptionUtils.getStackTrace(e));
        }


        return null;
    }


    static public void setData(Object sourceObj, Object destinationObj) {
        Field[] sourceFields = sourceObj.getClass().getFields();
        Field[] destinationFields = destinationObj.getClass().getFields();
        for (Field sourceField : sourceFields) {
            for (Field destinationField : destinationFields) {
                if (sourceField.getName().equals(destinationField.getName())) {
                    Object value;
                    try {
                        value = sourceField.get(sourceObj);
                        destinationField.set(destinationObj, value);
                        //                      System.out.println("value = " + value.toString() + " | field=" + sourceField.getName().toString());
                    } catch (IllegalAccessException e) {
                        e.printStackTrace();
                    }
                }
            }
        }
    }

    static public ResultSet executeSQLQuery(String dbName, String query) {
        ResultSet resultSet = null;
        Connection connect = null;
        Statement statement = null;
        try {
            Class.forName("com.mysql.jdbc.Driver");
            String mysqlAddress = "jdbc:mysql://192.168.56.21:3306/";
            String user = "dongtq";
            String password = "dongtq";
            connect = DriverManager.getConnection(mysqlAddress + dbName, user, password);
            statement = connect.createStatement();
            resultSet = statement.executeQuery(query);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                //	    		if(resultSet != null)
                //	    			resultSet.close();
                //	    		if(statement != null)
                //	    			statement.close();
                //	    		if(connect!= null)
                //	    			connect.close();
            } catch (Exception er) {
                er.printStackTrace();
            }
        }
        return resultSet;
    }

    static public int executeSQLUpdate(String dbName, String query) {
        int resultSet = -1;
        Connection connect = null;
        Statement statement = null;
        try {
            Class.forName("com.mysql.jdbc.Driver");
            String mysqlAddress = "jdbc:mysql://192.168.56.21:3306/";
            String user = "dongtq";
            String password = "dongtq";
            connect = DriverManager.getConnection(mysqlAddress + dbName, user, password);
            statement = connect.createStatement();
            resultSet = statement.executeUpdate(query);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                if (statement != null)
                    statement.close();
                if (connect != null)
                    connect.close();
            } catch (Exception er) {
                er.printStackTrace();
            }
        }
        return resultSet;
    }
}
