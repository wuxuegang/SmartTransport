package com.its.servlet.ITSServlet;

import java.io.*;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.net.*;
import java.text.*;

import javax.servlet.*;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;

@WebServlet("/HistoryConIndex")
public class HistoryConIndex extends javax.servlet.http.HttpServlet {
	private static final long serialVersionUID = 1L;
	private String servicePath = "http://www.bjtrc.org.cn/FlexChartService/GetWebService.asmx";
	private String protocolFilePath = "Data/GetFlexChartData.xml";
	private String soapActionString = "http://tempuri.org/GetFlexChartData";
	private String protocol = "";

	public HistoryConIndex() {
		super();
	}

	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws IOException, ServletException {	
		if (protocol == "")
			protocol = this.getSoapProtocol(request
					.getRealPath(protocolFilePath));

		byte[] entitydata = getEntityData();

		try {
			URL url = new URL(servicePath);
			HttpURLConnection conn = (HttpURLConnection) url.openConnection();
			conn.setConnectTimeout(5 * 1000);
			conn.setDoOutput(true);
			conn.setDoInput(true);
			conn.setRequestMethod("POST");
			conn.setRequestProperty("Content-Type", "application/soap+xml; charset=utf-8");
			conn.setRequestProperty("Content-Length",
					String.valueOf(entitydata.length));
			conn.setRequestProperty("soapActionString", soapActionString);
			OutputStream out = conn.getOutputStream();
			out.write(entitydata);
			out.flush();
			
			int returnCode = conn.getResponseCode();
			if(returnCode==200){
			    PrintWriter printWriter;
			    printWriter = response.getWriter();
			    printWriter.print(this.streamResolve(conn.getInputStream()));
			    printWriter.close();
			}
			else if(returnCode==500){
				System.out.println("Get congestionIndex History at "+(new Date())+"------------ERROR 500");
				System.out.println(this.streamResolve(conn.getErrorStream()));
			}
		} catch (Exception ex) {
	    	System.out.println("Get congestionIndex History at "+(new Date())+"------------ERROR");
	    	System.out.println(ex.getLocalizedMessage());
		}

	}

	private byte[] getEntityData() {
		String soapProtocol = "";
		java.text.DateFormat format = new java.text.SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
		String strDate = format.format(new Date());
		strDate = strDate.replace(' ', 'T');
		Map<String, Object> date = new HashMap<String, Object>();
		date.put("date", strDate);
		soapProtocol = replacePars(protocol, date);

		return soapProtocol.getBytes();
	}

	private String getSoapProtocol(String filePath) throws IOException {
		String protocolXml = "";
		try {
			java.io.File f = new java.io.File(filePath);
			if (!f.exists()) {
				System.out.println("ERROR:Can not find file " + filePath);
				return "";
			}
			java.io.FileReader fr = new java.io.FileReader(f);
			char[] buffer = new char[100];
			int length;
			StringBuffer sb = new StringBuffer();
			while ((length = fr.read(buffer)) != -1) {
				String str = new String(buffer, 0, length);
				sb.append(str);
			}
			fr.close();
			protocolXml = sb.toString();
		} catch (FileNotFoundException e) {
			System.out.println("ERROR:Can not find file " + filePath);
			e.printStackTrace();
		}
		return protocolXml;
	}

	private String replacePars(String module, Map<String, Object> pars) {
		String content = module;
		for (Map.Entry<String, Object> entry : pars.entrySet()) {
			String regex = "\\$" + "date";
			Pattern pat = Pattern.compile(regex);
			Matcher matcher = pat.matcher(content);
			if (matcher.find()) {
				content = matcher.replaceAll(entry.getValue().toString());
			}
		}
		return content;
	}

	private String streamResolve(InputStream inStream) throws ServletException, IOException, ParseException{
		StringBuilder sb = new StringBuilder();
		String line;
		String soapResult, soapYestorday, soapToday;
		String[] indexYestorday;
		String[] indexToday;
		String strSplit = "markerValue:[";
    	BufferedReader reader = new BufferedReader(new InputStreamReader(inStream,"UTF-8"));
    	while((line = reader.readLine()) !=null){
    		sb.append(line).append("\n");
    	}
    	soapResult = sb.toString();
    	soapResult = soapResult.substring(soapResult.indexOf(strSplit)+strSplit.length());
    	soapYestorday = soapResult.substring(0,soapResult.indexOf("|"));
    	soapToday = soapResult.substring(soapResult.indexOf("|")+1,soapResult.indexOf("]"));
    	indexYestorday = soapYestorday.split(",");
    	indexToday = soapToday.split(",");
    	
    	return FormartDatas(indexYestorday,indexToday);
	}
	
	private String FormartDatas(String[] datasYestorday, String[] datasToday) throws ParseException{
		int aDay = 86400;
		StringBuilder sb = new StringBuilder();
		java.text.DateFormat format0 = new java.text.SimpleDateFormat("yyyy-MM-dd");
		java.text.DateFormat format1 = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String strToday = format0.format(new Date())+" 00:00:00";
		long today = format1.parse(strToday).getTime()/1000;
		long yesterday = today - aDay;
		long interval = aDay/datasYestorday.length;
		
    	sb = new StringBuilder();
    	sb.append("{\"valuesYestorday\":[");
    	for(int i=0; i<datasYestorday.length; i++){
    		String val = datasYestorday[i];
    		if(val.equals("-1"))val="0";
    		sb.append("{\"x\":"+(today+i*interval)
    				+",\"y\":"+val+"}");
    		if(i!=datasYestorday.length-1){
    			sb.append(",");
    		}
    	}
    	sb.append("],");
    	sb.append("\"valuesToday\":[");
    	for(int j=0; j<datasToday.length; j++){
    		String val = datasToday[j];
    		if(val.equals("-1"))val="0";
    		sb.append("{\"x\":"+(today+j*interval)
    				+",\"y\":"+val+"}");
    		if(j!=datasToday.length-1){
    			sb.append(",");
    		}
    	}
    	sb.append("]}");
		return sb.toString();
	}
}
