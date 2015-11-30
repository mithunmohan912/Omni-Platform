package com.csc.cscip.ux.common.security.util;

import java.io.IOException;
import java.util.StringTokenizer;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.csc.cscip.ux.common.util.UXAppConfig;


public class CrossScriptingFilter implements Filter {

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
    }

    @Override
    public void destroy() {
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
        throws IOException, ServletException {

      	HttpServletRequest reqobj = (HttpServletRequest)request;
    	HttpServletResponse resobj = (HttpServletResponse)response;

    	System.out.println("In Cross Scripting Filter");
    	
    	String originname = reqobj.getHeader("origin")==null?"":reqobj.getHeader("origin");
    	System.out.println("Origin Name - "+originname);
    	
    	String AccessControlAllowOrigins = UXAppConfig.getProperty(UXAppConfig.ACCESS_CONTROL_ALLOW_ORIGIN);
    	String AccessControlAllowHeaders = UXAppConfig.getProperty(UXAppConfig.ACCESS_CONTROL_ALLOW_HEADERS);
    	
    	StringTokenizer stringTokenizerstr = new StringTokenizer(AccessControlAllowOrigins, ",");
    	 
		while (stringTokenizerstr.hasMoreElements()) {
			if(originname.equals(stringTokenizerstr.nextElement()))
			{
				System.out.println("Inside Access control Allow Origin Area");
				resobj.addHeader("Access-Control-Allow-Origin", originname);
		    	break;
			}	
		}
    	resobj.addHeader("Access-Control-Allow-Headers", AccessControlAllowHeaders); 
        chain.doFilter(new XSSRequestWrapper((HttpServletRequest) request), response);
    }

}