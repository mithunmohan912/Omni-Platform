package com.csc.cscip.ux.common.dao.userconfig;



import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Map;

import javax.sql.DataSource;

import com.csc.cscip.ux.common.dao.AbstractDAO;
import com.csc.cscip.ux.common.dao.DataAccessObject.Filter;
import com.csc.cscip.ux.common.dao.DataAccessObject.ResultSetProcessor;
import com.csc.cscip.ux.common.util.ApplicationContextProvider;


public class UserConfigDAO extends AbstractDAO {

	public String getTableName() {
		return "USERINFO";
	}	
	
	public Object getUserInfo(String userId) throws Throwable{
		return selectRow(new Filter("UserID", userId));				
	}
	public Object getUserPassword(String userid,ResultSetProcessor rsp){
		
		String query = "select password from users where username='"+userid+"'";
		return execute(query,rsp);
		
	}	
	public Object getUserList(ResultSetProcessor rsp) throws Throwable{
		return select(new String[] { "UserID", "Email", "Organization", "FirstName", "MiddleName", "LastName" }, null, rsp, null);				
	}
	
	public String selectUserId(String userId) throws Throwable {
		return (String) select("UserID", new Filter("UserID", userId));
	}

	public int insertUser(String UserID, String Email, String Organization, String OrganizationUnit, String FirstName, String MiddleName, String LastName, String Prefix, String Suffix, String CommonName, String DateOfBirth, String Gender, String ContactName, String UserType, String HomePhoneNum, String HomePhoneExt, String BusinessPhoneNum, String BusinessPhoneExt, String HomeAddress, String HomeCity, String HomeState, String HomeZip, String HomeCountry, String BusinessAddress, String BusinessCity, String BusinessState, String BusinessZip, String BusinessCountry,String Status, String EnterpriseCd, String LockedInd, String InformationOrderingSuffixCd, String UserReferenceNbr, String UserReferenceTypeCd, String UserSecQuestionCd1, String UserSecQuestionCd2, String UserSecQuestionCd3, String UserSecAnswerTxt1, String UserSecAnswerTxt2, String UserSecAnswerTxt3, String UserPasswordExpiredInd, String AssignAllAgents) throws Throwable {		
		return update("insert into USERINFO(UserID,Email,Organization,OrganizationUnit,FirstName,MiddleName,LastName,Prefix,Suffix,CommonName,DateOfBirth,Gender,ContactName,UserType,HomePhoneNum,HomePhoneExt,BusinessPhoneNum,BusinessPhoneExt,HomeAddress,HomeCity,HomeState,HomeZip,HomeCountry,BusinessAddress,BusinessCity,BusinessState,BusinessZip,BusinessCountry,Status,EnterpriseCd,LockedInd,InformationOrderingSuffixCd,UserReferenceNbr,UserReferenceTypeCd,UserSecQuestionCd1,UserSecQuestionCd2,UserSecQuestionCd3,UserSecAnswerTxt1,UserSecAnswerTxt2,UserSecAnswerTxt3,UserPasswordExpiredInd,AssignAllAgents) values ('" + UserID + "','" + Email + "','" + Organization + "','" + OrganizationUnit + "','" + FirstName + "','" + MiddleName + "','" + LastName + "','" + Prefix + "','" + Suffix + "','" + CommonName + "','" + DateOfBirth + "','" + Gender + "','" + ContactName + "','" + UserType + "','" + HomePhoneNum + "','" + HomePhoneExt + "','" + BusinessPhoneNum + "','" + BusinessPhoneExt + "','" + HomeAddress + "','" + HomeCity + "','" + HomeState + "','" + HomeZip + "','" + HomeCountry + "','" + BusinessAddress + "','" + BusinessCity + "','" + BusinessState + "','" + BusinessZip + "','" + BusinessCountry + "','" + Status + "','" + EnterpriseCd + "','" + LockedInd + "','" + InformationOrderingSuffixCd + "','" + UserReferenceNbr + "','" + UserReferenceTypeCd + "','" + UserSecQuestionCd1 + "','" + UserSecQuestionCd2 + "','" + UserSecQuestionCd3 + "','" + UserSecAnswerTxt1 + "','" + UserSecAnswerTxt2 + "','" + UserSecAnswerTxt3 + "','" + UserPasswordExpiredInd + "','" + AssignAllAgents + "')");
	}

	public int deleteEntry(String userId) {
		return update("delete from USERINFO where UserID='" + userId + "'");
	}	
	public Object listAllFunctions(ResultSetProcessor rsp) throws Throwable{
		String strSql = "select distinct Case when e.mask = 2 then 'Remove item from Application' End as Mask, o.object_id_identity as RestrictionName, c.class as Category from acl_entry e inner join acl_object_identity o on e.acl_object_id = o.id inner join acl_sid s on s.id = e.sid_id inner join acl_class c on c.id = o.object_id_class";
		return execute(strSql, rsp);
	}
	
	private static Connection getDatabaseConnection() throws SQLException {
		DataSource dataSource = (DataSource) ApplicationContextProvider.getApplicationContext().getBean("dataSourceUX");
		return dataSource.getConnection();
	}
	
	public Object listAllRoleFunctions(String role, ResultSetProcessor rsp) throws Throwable{
		String strSql = "select e.sid_id, o.object_id_identity, c.class from acl_object_identity o join acl_entry e on e.acl_object_id = o.id join acl_class c on o.object_id_class = c.id where e.sid_id = '" + role + "'";
		return execute(strSql, rsp);
	}
	public void deleteFunction(Long aclObjectId, Long aclObjectClassId) throws Throwable
	
	{
	
		update("delete from acl_entry  where acl_object_id="+aclObjectId);
		update("delete from acl_object_identity  where id="+aclObjectId);
			
	}
	public void insertEncryptedPassword(String userid,String password){
		
		update("insert into users(username,password,enabled) values ('"+userid+"','"+password+"',1)");
	}
	public void deleteEncryptedPassword(String userid){
		
		update("delete from users where username='"+userid+"'");
	}
	private Object execute(String sql, ResultSetProcessor rsp) {

		Connection conn = null;
		Statement stmt = null;
		ResultSet rs = null;

		try {
			conn = getDatabaseConnection();
			stmt = conn.createStatement();

			if (rsp != null) {
				rs = stmt.executeQuery(sql);
				return rsp.processResultSet(rs);
			} else {
				return stmt.executeUpdate(sql);
			}

		} catch (SQLException e) {
			throw new RuntimeException(e);
		} finally {
			try {
				if (rs != null) {
					rs.close();
				}
				if (stmt != null) {
					stmt.close();
					conn.close();
				}
			} catch (SQLException e) {
				throw new RuntimeException(e);
			}
		}

	}

	

	

}
