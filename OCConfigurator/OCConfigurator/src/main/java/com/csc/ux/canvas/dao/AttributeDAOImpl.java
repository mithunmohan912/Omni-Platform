package com.csc.ux.canvas.dao;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.hibernate.HibernateException;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import com.csc.ux.canvas.entity.Attribute;
import com.csc.ux.canvas.entity.AttributeDesc;
import com.csc.ux.canvas.entity.id.AttributeDescId;
import com.csc.ux.canvas.entity.id.AttributeId;

@Repository
public class AttributeDAOImpl implements AttributeDAO {

	@Autowired
	private SessionFactory sessionFactory;

	@Override
	public void addAttribute(Object attr) {
		sessionFactory.getCurrentSession().save((Attribute) attr);
	}

	@Override
	public void removeAttribute(Object attr) {
		Session session  = sessionFactory.getCurrentSession();
		Attribute attrDB = (Attribute) session.get(attr.getClass(), (Serializable) ((Attribute) attr).getId());
		if (attrDB == null) {
			throw new HibernateException("Attribute not found");
		} else {
			session.delete(attrDB);
		}
	}

	@Override
	public void changeAttribute(Object attr) {
		Session session = sessionFactory.getCurrentSession();
		Attribute attrDB = (Attribute) getAttribute(((Attribute) attr).getId());
		if (attrDB == null) {
			throw new HibernateException("Attribute not found - ".concat(((Attribute) attr).getId().getAttributeName())
					.concat(" for Screen Type ").concat(Integer.toString(((Attribute) attr).getId().getSetTypeNumber())));
		} else {
			Query query = session
					.createSQLQuery("UPDATE ASAJREP SET AJCCTX = :ajcctx, AJBDST = :ajbdst, AJDPST = :ajdpst, AJAANB = :ajaanb, AJALTX = :ajaltx, " +
							"AJABNB = :ajabnb, AJA4NB = :aja4nb, AJE5TX = :aje5tx, AJAAVN = :ajaavn, AJAKDT = :ajakdt, AJABTM = :ajabtm "
							+ "WHERE AJBUNB = :ajbunb AND AJAJTX = :ajajtx");
			query.setParameter("ajcctx", ((Attribute)attr).getId().getAttributeHeading());
			query.setParameter("ajbdst", ((Attribute)attr).getId().getRequiredByRating());
			query.setParameter("ajdpst", ((Attribute)attr).getId().getDisplayIndicator());
			query.setParameter("ajaanb", ((Attribute)attr).getId().getStartPosition());
			query.setParameter("ajaltx", ((Attribute)attr).getId().getDataType());
			query.setParameter("ajabnb", ((Attribute)attr).getId().getLength());
			query.setParameter("aja4nb", ((Attribute)attr).getId().getDecimalPositions());
			query.setParameter("aje5tx", ((Attribute)attr).getId().getLevelIndicator());
			query.setParameter("ajaavn", ((Attribute)attr).getId().getRecordWrittenUser());
			query.setParameter("ajakdt", ((Attribute)attr).getId().getRecordWrittenDate());
			query.setParameter("ajabtm", ((Attribute)attr).getId().getRecordWrittenTime());
			query.setParameter("ajbunb", ((Attribute)attr).getId().getSetTypeNumber());
			query.setParameter("ajajtx", ((Attribute)attr).getId().getAttributeName());
			query.executeUpdate();
		}
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<Object> listAttribute() {
		return sessionFactory.getCurrentSession().createQuery("from AttributeDesc").list();
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<BigDecimal> listSetTypes() {
		return sessionFactory.getCurrentSession().createSQLQuery("select distinct AJBUNB from ASAJREL1").list();
	}

	@Override
	public Map<BigDecimal, String> listScreens() {
		Map<BigDecimal, String> setTypeList = new LinkedHashMap<BigDecimal, String>();
		Query query = sessionFactory.getCurrentSession().createSQLQuery(
				"select distinct AJBUNB, AJELTX from ASAJREL1 ORDER BY AJBUNB");
		List<?> resultList = query.list();
		for (int i = 0; resultList != null && i < resultList.size(); i++) {
			Object rowResult = resultList.get(i);
			Object[] arrayRowResult = (Object[]) rowResult;
			if (arrayRowResult[0] != null) {
				String desc = (arrayRowResult[1] == null) ? "Not available" : ((String) arrayRowResult[1]).trim();
				setTypeList.put((BigDecimal) arrayRowResult[0], desc);
			}
		}
		return setTypeList;
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<Object> listAttrForSetType(int setType) {
		return sessionFactory.getCurrentSession().createQuery("from AttributeDesc where AJBUNB=:setType")
				.setParameter("setType", setType).list();
	}

	@Override
	public Object getAttribute(Object attrId) {
		if(attrId instanceof AttributeDescId) {
			AttributeDesc attr = new AttributeDesc();
			attr.setId((AttributeDescId) attrId);
			return ((AttributeDesc) sessionFactory.getCurrentSession().get(attr.getClass(), (Serializable) attr.getId()));
		} 
		if(attrId instanceof AttributeId) {
			Attribute attr = new Attribute();
			attr.setId((AttributeId) attrId);
			attr = ((Attribute) sessionFactory.getCurrentSession().get(attr.getClass(), (Serializable) attr.getId()));
			if(attr == null) {
				List<?> resultList = sessionFactory.getCurrentSession()
						.createQuery("from Attribute where AJBUNB=:setType and AJAJTX = :attrName")
						.setParameter("setType", ((AttributeId) attrId).getSetTypeNumber())
						.setParameter("attrName", ((AttributeId) attrId).getAttributeName())
						.list();
				if(resultList != null && resultList.size() > 0) {
					attr = (Attribute) resultList.get(0);
				}
			}
			return attr;
		} 
		return null;
	}

	@Override
	public Object checkAttribute(String attrName) {
		Attribute attr = null;
		List<?> resultList = sessionFactory.getCurrentSession()
				.createQuery("from Attribute where AJAJTX = :attrName")
				.setParameter("attrName", attrName)
				.list();
		if(resultList != null && resultList.size() > 0) {
			attr = (Attribute) resultList.get(0);
		}
		return attr;
	}
}
