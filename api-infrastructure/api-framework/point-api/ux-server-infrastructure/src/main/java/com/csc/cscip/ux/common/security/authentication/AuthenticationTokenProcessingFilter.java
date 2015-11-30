package com.csc.cscip.ux.common.security.authentication;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.GenericFilterBean;

import com.csc.cscip.ux.common.security.util.TokenUtils;

public class AuthenticationTokenProcessingFilter extends GenericFilterBean {

	private final AuthenticationManager authManager;

	private final UserDetailsService userService;

	public AuthenticationTokenProcessingFilter(AuthenticationManager authManager, UserDetailsService userService) {

		this.authManager = authManager;
		this.userService = userService;
	}

	@Override
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {

		HttpServletRequest httpRequest = (HttpServletRequest) request;
		HttpServletResponse httpResponse = (HttpServletResponse) response;

		// Save in String the header called Authentication inside the request.
		String authToken = httpRequest.getHeader("Authentication");

		// Checks if the tokes is null, if it is, continue the filter chain
		if (authToken != null) {

			// Load the username from the token
			String userName = TokenUtils.getUserNameFromToken(authToken);
			if (userName != null) {

				// If username exists, validate the token and set to the Security Context the authentication
				UserDetails userDetails = this.userService.loadUserByUsername(userName);

				if (TokenUtils.validateToken(authToken, userDetails)) {

					UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userDetails.getUsername(), userDetails.getPassword());
					authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails((HttpServletRequest) request));
					SecurityContextHolder.getContext().setAuthentication(this.authManager.authenticate(authentication));

					// Avoid to have pages loaded in browser cache
					httpResponse.addHeader("Pragma", "No-cache");
					httpResponse.addHeader("Cache-Control", "no-cache,no-store,max-age=0");
					httpResponse.addIntHeader("Expires", 1);
					chain.doFilter(request, httpResponse);
					return;
				}
			}
		}

		httpResponse.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
	}

}
