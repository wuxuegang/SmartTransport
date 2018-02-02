package com.its.servlet.ITSServlet;

import java.io.*;
import java.util.*;
import java.net.*;

import javax.servlet.*;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;

@WebServlet("/RoadCongestion")
public class RoadCongestion extends javax.servlet.http.HttpServlet {
	private static final long serialVersionUID = 1L;
	
	public RoadCongestion(){
		super();
	}
	
	protected void doGet(HttpServletRequest request,HttpServletResponse response)throws IOException,ServletException{
		String reqUrl = request.getParameter("url");

		try{
			URL url = new URL(reqUrl);
			HttpURLConnection con = (HttpURLConnection)url.openConnection();
			con.setDoOutput(true);
			con.setUseCaches(false);
			con.setRequestMethod(request.getMethod());
			if(request.getContentType() != null) {
			  con.setRequestProperty("Content-Type", request.getContentType());
			}
		    con.setRequestProperty("Referer", request.getHeader("Referer"));
		    response.setContentType(con.getContentType());
		    
		    PrintWriter out;
		    out = response.getWriter();
		    out.print(this.streamResolve(con.getInputStream()));
		    out.close();
		}
		catch(Exception ex){
			ex.printStackTrace();
		}
	}
	
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		this.doGet(request, response);
	}
	
	private String streamResolve(InputStream inStream) throws ServletException, IOException{
		String result = "";
		String line;
		StringBuilder sb = new StringBuilder();
		try{
			BufferedReader reader = new BufferedReader(new InputStreamReader(inStream,"UTF-8"));
			while((line = reader.readLine()) !=null){
	    		sb.append(line).append("\n");
	    	}
			result = sb.toString();
		}
		catch(Exception ex){
			result = "{}";
			ex.printStackTrace();
		}
		finally{
	    	inStream.close();
	    	result.replaceAll("[,]", "[]");
	    }
		return result;
	}
}
