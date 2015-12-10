package com.csc.ux.canvas.dao;

import java.util.List;
import org.hibernate.Query;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import com.csc.ux.canvas.entity.UserLabelRecords;

@Repository
public class UserLabelRecordsDAOImpl implements UserLabelRecordsDAO {

	@Autowired
	private SessionFactory sessionFactory;

	@SuppressWarnings("unchecked")
	@Override
	public List<UserLabelRecords> getAllViews(String location, String masterCo, String policyCo, String lineBus, String insLine,
			String state, String product, String coverage, String item, String setType) {
		List<UserLabelRecords> rowList = null;
		Query query = sessionFactory.getCurrentSession().createSQLQuery(
				"SELECT * FROM ASCKREP WHERE " +
				"CKAACD = COALESCE(:ckaacd, CKAACD) AND " +
				"CKABCD = COALESCE(:ckabcd, CKABCD) AND " +
				"CKACCD = COALESCE(:ckaccd, CKACCD) AND " +
				"CKADTX = COALESCE(:ckadtx, CKADTX) AND " +
				"CKAGTX = COALESCE(:ckagtx, CKAGTX) AND " +
				"CKADCD = COALESCE(:ckadcd, CKADCD) AND " +
				"CKANTX = COALESCE(:ckantx, CKANTX) AND " +
				"CKAOTX = COALESCE(:ckaotx, CKAOTX) AND " +
				"CKPBTX = COALESCE(:ckpbtx, CKPBTX) AND " +
				"CKBUNB = :ckbunb ORDER BY CKIRST").addEntity(UserLabelRecords.class);
		
		if (location.compareTo("") == 0) {
			query.setParameter("ckaacd", ((Object) null));
		} else {
			query.setParameter("ckaacd", location);
		}
		if (masterCo.compareTo("") == 0) {
			query.setParameter("ckabcd", ((Object) null));
		} else {
			query.setParameter("ckabcd", masterCo);
		}
		if (policyCo.compareTo("") == 0) {
			query.setParameter("ckaccd", ((Object) null));
		} else {
			query.setParameter("ckaccd", policyCo);
		}
		if (lineBus.compareTo("") == 0) {
			query.setParameter("ckadtx", ((Object) null));
		} else {
			query.setParameter("ckadtx", lineBus);
		}
		if (insLine.compareTo("") == 0) {
			query.setParameter("ckagtx", ((Object) null));
		} else {
			query.setParameter("ckagtx", insLine);
		}
		if (state.compareTo("") == 0) {
			query.setParameter("ckadcd", ((Object) null));
		} else {
			query.setParameter("ckadcd", state);
		}
		if (product.compareTo("") == 0) {
			query.setParameter("ckantx", ((Object) null));
		} else {
			query.setParameter("ckantx", product);
		}
		if (coverage.compareTo("") == 0) {
			query.setParameter("ckaotx", ((Object) null));
		} else {
			query.setParameter("ckaotx", coverage);
		}
		if (item.compareTo("") == 0) {
			query.setParameter("ckpbtx", ((Object) null));
		} else {
			query.setParameter("ckpbtx", item);
		} 
		query.setParameter("ckbunb", setType);
		rowList = query.list();
		return rowList;
	}
}
