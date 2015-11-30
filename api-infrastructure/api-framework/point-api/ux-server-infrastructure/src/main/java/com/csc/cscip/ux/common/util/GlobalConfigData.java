package com.csc.cscip.ux.common.util;

import java.io.Serializable;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;

import javax.faces.application.FacesMessage;
import javax.faces.context.FacesContext;
import javax.sql.DataSource;

import net.sf.ehcache.CacheManager;
import net.sf.ehcache.Ehcache;

import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.Cache.ValueWrapper;
import org.springframework.cache.ehcache.EhCacheCacheManager;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementSetter;
import org.springframework.jdbc.core.ResultSetExtractor;

public class GlobalConfigData implements Serializable {

	private final static org.slf4j.Logger logger = LoggerFactory.getLogger(GlobalConfigData.class);
	
	@Autowired
	ExceptionMessenger exceptionMessenger;
	
	private EhCacheCacheManager cacheManager;
	private Ehcache ehcacheSec;
	private Ehcache ehcacheACL;
	private JdbcTemplate jdbcTemplate;
	private Ehcache ehcacheSE3;
    private Ehcache ehcacheRules;
    private Ehcache ehcacheControlValues;
	private String se3CacheName = "se3Date";
    private String rulesCacheName = "globalRules";
    private String controlValuesCacheName = "controlTableElements";
    private String securityCacheName = "securedElements";
	private String aclCacheName = "aclCache";
	private int rulesCacheSize;
    private int controlValuesCacheSize;
    private int securityCacheSize;
	private int aclCacheSize;

	private static final long serialVersionUID = 1L;
	
	private static final String SELECT_ALL_CONTROL_VALUES = "select BIL_CRCRD_TYPE_CD, BCC_CRCRD_DES, BCC_CRCRD_ACT_LEN, BCC_CRCRD_EXP_FMT from BIL_CRCRD_DES";

	private static final String SELECT_ALL_EXCEED_RULES = "select BRT_RULE_ID, BIL_TYPE_CD, BIL_CLASS_CD, BIL_PLAN_CD, EFFECTIVE_DT, EXPIRATION_DT, BRT_RULE_CD, BRT_RULE_DES, BRT_PARM_LIST_TXT from BIL_RULES_UCT";

	public GlobalConfigData() {
	}

	public GlobalConfigData(DataSource dataSource,
			EhCacheCacheManager cacheManager) {

		jdbcTemplate = new JdbcTemplate(dataSource);
		this.cacheManager = cacheManager;

		CacheManager cm = cacheManager.getCacheManager();
		ehcacheSec = cm.getCache(securityCacheName);
		ehcacheACL = cm.getCache(aclCacheName);
		ehcacheSE3 = cm.getCache(se3CacheName);
		ehcacheControlValues = cm.getCache(controlValuesCacheName);
		ehcacheRules = cm.getCache(rulesCacheName);

		updateCacheSize();

	}

	public void updateCacheSize() {

		this.setSecurityCacheSize(ehcacheSec.getSize());
		this.setAclCacheSize(ehcacheSec.getSize());
		this.setRulesCacheSize(ehcacheRules.getSize());
		this.setControlValuesCacheSize(ehcacheControlValues.getSize());

		logger.debug("Ehcache Security size=" + securityCacheSize);
		logger.debug("Ehcache ACL size=" + aclCacheSize);

	}

	public void extractGlobalExceedData() {
		try {

			FacesContext context = FacesContext.getCurrentInstance();
			if (context != null) {
				context.addMessage("adminmessage", new FacesMessage(
						FacesMessage.SEVERITY_INFO, "Sync Successful",
						"Refresh Done!"));
			}

		} catch (Exception e) {
			logger.error(e.getMessage());
			FacesContext context = FacesContext.getCurrentInstance();
			if (context != null) {
				context.addMessage("adminmessage", new FacesMessage(
						FacesMessage.SEVERITY_ERROR,
						"Error in the Sync of data", "Error "));
			}

		}

	}

	public void refreshCache() {

		try {

			updateCacheSize();
			ehcacheSec.removeAll();
			ehcacheACL.removeAll();
			ehcacheRules.removeAll();
			ehcacheControlValues.removeAll();
			ehcacheSE3.removeAll();
			updateCacheSize();

			FacesContext context = FacesContext.getCurrentInstance();
			if (context != null) {
				context.addMessage("adminmessage", new FacesMessage(
						FacesMessage.SEVERITY_INFO, "Refresh successful",
						"Refresh Done! "));
			}

		} catch (Exception e) {
			logger.error("refreshCache(): " + e.getMessage());
			FacesContext context = FacesContext.getCurrentInstance();
			if (context != null) {
				context.addMessage("adminmessage", new FacesMessage(
						FacesMessage.SEVERITY_ERROR, "Error refreshing cache",
						"Error "));
			}

		}
	}
	
	public List<LinkedHashMap<String, Object>> getControlTableValues(
			final String screen) {

		List<LinkedHashMap<String, Object>> globalControlValueElements = null;
		try {
			// Check cache for the present sec list entry

			ValueWrapper wrap = cacheManager.getCache("controlTableElements")
					.get(screen);
			if (wrap != null)
				globalControlValueElements = (List<LinkedHashMap<String, Object>>) wrap
						.get();
			if (globalControlValueElements != null)
				return globalControlValueElements;

			// Decision making as well cache statretagey to be implemented for
			// optimim perf
			String sql = SELECT_ALL_CONTROL_VALUES;
			globalControlValueElements = jdbcTemplate.query(sql,
					new PreparedStatementSetter() {
						public void setValues(PreparedStatement ps)
								throws SQLException {
							// TODO Auto-generated method stub
							// ps.setString(1, screen);
						}
					}, new CustomResultSetExtractor());
			cacheManager.getCache("controlTableElements").put(screen,
					globalControlValueElements);
		} catch (Exception e) {
			// TODO: handle exception
			exceptionMessenger.getExceptionQueue().add(e);
			globalControlValueElements = null;
		}
		return globalControlValueElements;
	}

	public boolean getValueRule(String value) {
		List<LinkedHashMap<String, Object>> rulesList = this.getExceedRules("makePayment");
		for (LinkedHashMap<String, Object> item : rulesList) {
			if (item.get("BRT_RULE_ID").equals(value)) {
				return (item.get("BRT_RULE_CD").equals("Y")) ? true : false;
			}
		}
		return true;
	}

	public List<LinkedHashMap<String, Object>> getExceedRules(
			final String screen) {

		List<LinkedHashMap<String, Object>> rules = new LinkedList<LinkedHashMap<String, Object>>();
		try {
			// Check cache for the present sec list entry
			ValueWrapper wrap = cacheManager.getCache("globalRules")
					.get(screen);
			if (wrap != null)
				rules = (List<LinkedHashMap<String, Object>>) wrap.get();
			if (rules != null)
				return rules;

			// Decision making as well cache statretagey to be implemented for
			// optimim perf
			String sql = SELECT_ALL_EXCEED_RULES;
			rules = jdbcTemplate.query(sql, new CustomResultSetExtractorRules());

			cacheManager.getCache("globalRules").put(screen, rules);
		} catch (Exception e) {			
			logger.error("Error at getExceedRules method", e);
			exceptionMessenger.getExceptionQueue().add(e);
			rules = new LinkedList<LinkedHashMap<String, Object>>();
		}
		return rules;
	}

	public int getRulesCacheSize() {
	return rulesCacheSize;
    }

    public void setRulesCacheSize(int rulesCacheSize) {
	this.rulesCacheSize = rulesCacheSize;
    }

    public int getControlValuesCacheSize() {
	return controlValuesCacheSize;
    }

    public void setControlValuesCacheSize(int controlValuesCacheSize) {
	this.controlValuesCacheSize = controlValuesCacheSize;
    }
    
    public int getAclCacheSize() {
		return aclCacheSize;
	}

	public void setAclCacheSize(int aclCacheSize) {
		this.aclCacheSize = aclCacheSize;
	}

	public int getSecurityCacheSize() {
		return securityCacheSize;
	}

	public void setSecurityCacheSize(int securityCacheSize) {
		this.securityCacheSize = securityCacheSize;
	}
	
	// ~ Inner Classes
	// ==================================================================================================

	private class CustomResultSetExtractor implements
			ResultSetExtractor<LinkedList<LinkedHashMap<String, Object>>> {

		public LinkedList<LinkedHashMap<String, Object>> extractData(
				ResultSet rs) throws SQLException, DataAccessException {

			LinkedList<LinkedHashMap<String, Object>> rulesList = new LinkedList<LinkedHashMap<String, Object>>();
			while (rs.next()) {
				LinkedHashMap<String, Object> rule = new LinkedHashMap<String, Object>();

				rule.put("BIL_CRCRD_TYPE_CD", rs.getString("BIL_CRCRD_TYPE_CD"));
				rule.put("BCC_CRCRD_ACT_LEN", rs.getInt("BCC_CRCRD_ACT_LEN"));
				rule.put("BCC_CRCRD_EXP_FMT", rs.getString("BCC_CRCRD_EXP_FMT"));

				rulesList.add(rule);
			}
			return rulesList;
		}
	}
	
	// ~ Inner Classes
	// ==================================================================================================

	private class CustomResultSetExtractorRules implements
			ResultSetExtractor<LinkedList<LinkedHashMap<String, Object>>> {

		public LinkedList<LinkedHashMap<String, Object>> extractData(
				ResultSet rs) throws SQLException, DataAccessException {

			LinkedList<LinkedHashMap<String, Object>> rulesList = new LinkedList<LinkedHashMap<String, Object>>();
			while (rs.next()) {
				LinkedHashMap<String, Object> rule = new LinkedHashMap<String, Object>();

				rule.put("BRT_RULE_ID", rs.getString("BRT_RULE_ID"));
				rule.put("BRT_RULE_CD", rs.getString("BRT_RULE_CD"));

				rulesList.add(rule);
			}
			return rulesList;
		}
	}

}
