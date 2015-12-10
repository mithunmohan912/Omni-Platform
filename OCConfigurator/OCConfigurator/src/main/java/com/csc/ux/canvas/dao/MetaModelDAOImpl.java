package com.csc.ux.canvas.dao;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import org.hibernate.Query;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import com.csc.ux.canvas.entity.id.MetaModelId;

@Repository
public class MetaModelDAOImpl implements MetaModelDAO {
	@Autowired
	private SessionFactory sessionFactory;

	@Override
	public String getMetaModel(Object metaModelId) {
		Query query = sessionFactory.getCurrentSession().createSQLQuery(
						"SELECT DISTINCT RCLKURL, LOCATION, MASTERCO, POLICYCO, STATE, "
								+ "KEYFLD1, KEYFLD2, KEYFLD3, KEYFLD4, KEYFLD5, USERNAME FROM BASSYS07L1 "
								+ "WHERE FILENAME = :filename AND ISSUECODE = :issuecode AND FUNCCODE = :funccode "
								+ "AND ACTTYPE = :acttype AND LOCATION IN (:location, '99') AND MASTERCO IN (:masterco, '99') "
								+ "AND POLICYCO IN (:policyco, '99') AND STATE IN (:state, 'US') AND KEYFLD1 IN (:keyfld1, '') "
								+ "AND KEYFLD2 IN (:keyfld2, '') AND KEYFLD3 IN (:keyfld3, '') AND KEYFLD4 IN (:keyfld4, '') "
								+ "AND KEYFLD5 IN (:keyfld5, '') AND USERNAME IN (:username, '') "
								+ "ORDER BY LOCATION, MASTERCO, POLICYCO, STATE, KEYFLD1 DESC, KEYFLD2 DESC, "
								+ "KEYFLD3 DESC, KEYFLD4 DESC, KEYFLD5 DESC, USERNAME DESC");
		query.setParameter("filename", ((MetaModelId) metaModelId).getFilename());
		query.setParameter("issuecode", ((MetaModelId) metaModelId).getIssuecode());
		query.setParameter("funccode", ((MetaModelId) metaModelId).getFunccode());
		query.setParameter("acttype", ((MetaModelId) metaModelId).getActtype());
		query.setParameter("location", ((MetaModelId) metaModelId).getLocation());
		query.setParameter("masterco", ((MetaModelId) metaModelId).getMasterco());
		query.setParameter("policyco", ((MetaModelId) metaModelId).getPolicyco());
		query.setParameter("state", ((MetaModelId) metaModelId).getState());
		query.setParameter("keyfld1", ((MetaModelId) metaModelId).getKeyfld1());
		query.setParameter("keyfld2", ((MetaModelId) metaModelId).getKeyfld2());
		query.setParameter("keyfld3", ((MetaModelId) metaModelId).getKeyfld3());
		query.setParameter("keyfld4", ((MetaModelId) metaModelId).getKeyfld4());
		query.setParameter("keyfld5", ((MetaModelId) metaModelId).getKeyfld5());
		query.setParameter("username", ((MetaModelId) metaModelId).getUsername());
		List<?> resultList = query.list();
		if (resultList != null && resultList.size() > 0) {
			Object rowResult = resultList.get(0);
			Object[] arrayRowResult = (Object[]) rowResult;
			if (arrayRowResult[0] != null) {
				String rclkurl = (String) arrayRowResult[0];
				rclkurl = rclkurl.substring(rclkurl.lastIndexOf("/")+1,rclkurl.lastIndexOf("."));
				return rclkurl;
			}
		}
		return null;
	}

	@Override
	public List<List<Object>> fetchHierarchyUsingMetaModelName(String modelName) {
		List<List<Object>> hierarchyKey = new ArrayList<List<Object>>();
		Query query = sessionFactory.getCurrentSession().createSQLQuery(
						"SELECT DISTINCT LOCATION, MASTERCO, POLICYCO, STATE, " +
						"KEYFLD1, KEYFLD2, KEYFLD3, KEYFLD4, KEYFLD5, FILENAME " +
						"FROM BASSYS07L1 WHERE RCLKURL LIKE :modelname " +
						"ORDER BY LOCATION, MASTERCO, POLICYCO, STATE, KEYFLD1 DESC, " +
						"KEYFLD2 DESC, KEYFLD3 DESC, KEYFLD4 DESC, KEYFLD5 DESC, FILENAME");
		query.setParameter("modelname", "%"+modelName+"%");

		List<?> resultList = query.list();
		for (int i=0; resultList != null && resultList.size() > 0 && i < resultList.size(); i++) {
			Object[] arrayRowResult = (Object[]) resultList.get(i);			
			List<Object> row = Arrays.asList(arrayRowResult);
			hierarchyKey.add(row);
		}
		return hierarchyKey;
	}
	
	@Override
	public String getMessageName(String modelName){
		Query query = sessionFactory.getCurrentSession().createSQLQuery(
				"SELECT TOP 1 RCLKREQST " +
				"FROM BASSYS07L1 WHERE RCLKURL LIKE :modelname " +
				"ORDER BY LOCATION, MASTERCO, POLICYCO, STATE, KEYFLD1 DESC, " +
				"KEYFLD2 DESC, KEYFLD3 DESC, KEYFLD4 DESC, KEYFLD5 DESC, FILENAME");
		query.setParameter("modelname", "%"+modelName+"%");
		List<?> resultList = query.list();
		if (resultList != null && resultList.size() > 0) {
			Object rowResult = resultList.get(0);
			String rclkrqst = (String) rowResult;
			rclkrqst = rclkrqst.trim() ;
			if (rclkrqst.endsWith("Rq")) {
				rclkrqst = rclkrqst.trim().substring(0, rclkrqst.length() - 5);
				rclkrqst = rclkrqst + "Rq";
			}				
			return rclkrqst;
		}
		return null;
	}
}
