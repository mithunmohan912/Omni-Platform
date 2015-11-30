package com.csc.cscip.ux.pointin.rest;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;
import java.io.File;
import java.io.IOException;
import java.util.Date;
import java.util.Properties;

import javax.activation.DataHandler;
import javax.activation.DataSource;
import javax.activation.FileDataSource;
import javax.mail.BodyPart;
import javax.mail.Message;
import javax.mail.Multipart;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;

import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.FileOutputStream;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.csc.cscip.ux.common.rest.AbstractRestController;
import com.csc.cscip.ux.common.rest.processor.jdbc.JDBCInfo.Type;
import com.csc.cscip.ux.common.rest.processor.jdbc.JDBCResponsePayLoad;
import com.csc.cscip.ux.common.rest.request.RequestPayLoad;
import com.csc.cscip.ux.common.rest.response.ResponsePayLoad;
import com.csc.cscip.ux.common.security.securityengine.ACLJSONManipulator;
import com.csc.cscip.ux.common.util.UXAppConfig;
import com.csc.cscip.ux.common.util.UXJacksonUtils;
import com.csc.cscip.ux.common.util.UXUtils;
import com.csc.cscip.ux.common.util.UXRepositoryUtil;
import com.csc.cscip.ux.pointin.util.SurroundProductConfig;

@Controller
@SuppressWarnings("unchecked")
public class PTDataController extends AbstractRestController {

	@RequestMapping(value = "/data/editableGridData", method = RequestMethod.POST)
	public @ResponseBody
	String getEditableGridData(HttpServletRequest request, HttpServletResponse response) throws Throwable {

		Map<String, Object> RestRequest = parseRequest(request, Map.class);

		Object uxRestResponseObj;

		String screenId = (String) RestRequest.get("screenId");

		if (RestRequest.get("method") == null || RestRequest.get("method").equals("POST")) {

			ACLJSONManipulator.secureData(RestRequest, screenId, true);
			String reqType = "";
			String sourceType = "";
			if (screenId.equals("WcpAuditOrdconfSearchFrame")) {
				reqType = "AUDIT";
				sourceType = "WCVAuditOrderConfirmInfo";
			}else if (screenId.equals("WcpAuditCovgGrid")) {
				reqType = "AUDIT";
				sourceType = "AuditGridData";
			}else if(screenId.equals("WcpAuditCovgPolicyLevel")){
				reqType = "AUDIT";
				sourceType = "PolicyLevelAuditGridData";
			}else if(screenId.equals("WcpAuditGrid")) {
				reqType = "AUDIT";
				sourceType = "InterimAuditDeleteData";
			}else if (screenId.equals("WcpAuditPeriods")) {
				reqType = "AUDIT";
				sourceType = "InterimAuditGridData";
			}else if (screenId.equals("LRAROWorkSheet")) {
				reqType = "LRARO";
				sourceType = "Griddata";
			}else if (screenId.equals("SelectivePICSProcessing")) {
				reqType = "PICS";
				sourceType = "PICSGriddata";
			}else if (screenId.equals("CltSelectChgHeader")) {
				reqType = "PICS";
				sourceType = "CLTGriddata";
			}else if(screenId.equals("RcvDBBulkPaymentAdd") || screenId.equals("RcvDBBulkPaymentUpd")) {
				reqType = "RCV";
				sourceType = "RcvDBBulkPaymentInfo";
			}else if(screenId.equals("RcvABBulkPaymentAdd") || screenId.equals("RcvABBulkPaymentUpd") || screenId.equals("RcvBBBulkPaymentAdd") || screenId.equals("RcvBBBulkPaymentUpd")) {
				reqType = "RCV";
				sourceType = "RcvABBulkPaymentInfo";
			}else if(screenId.equals("RcvDBTransferPmt")) {
				reqType = "RCV";
				sourceType = "RcvDBTransferPmt";
			}else if(screenId.equals("RcvDBNSFPmtProcPol") || screenId.equals("RcvDBNSFPmtProcCust")) {
				reqType = "RCV";
				sourceType = "RcvDBNSFPmtProc";
			}else if(screenId.equals("RcvDBAdjNxtActDtGrid")) {
				reqType = "RCV";
				sourceType = "RcvDBAdjNxtActDtGridInfo";
			}else if(screenId.equals("RcvDBWaiveInstFrame")) {
				reqType = "RCV";
				sourceType = "RcvDBWaiveInstGridInfo";
			}else if(screenId.equals("RcvDBRevWaiveAmtFrame")) {
				reqType = "RCV";
				sourceType = "RcvDBRevWaiveAmtGridInfo";
			}else if(screenId.equals("RcvDBCommPaymentAdd")|| screenId.equals("RcvDBCommPaymentUpd")) {
				reqType = "RCV";
				sourceType = "RcvDBACPaymentInfo";
			}else if(screenId.equals("WCVFormsList")) {
				reqType = "RCV";
				sourceType = "WCVFormsListInfo";
			}else if(screenId.equals("AchECheckCustEntry")) {
				reqType = "RCV";
				sourceType = "RcvECheckCustAddInfo";
			}else if(screenId.equals("RcvABTransferAgencyPayment")) {
				reqType = "RCV";
				sourceType = "RcvABTransferAgPyInfo";
			}else if(screenId.equals("RcvBBTransferBrokerPayment")) {
				reqType = "RCV";
				sourceType = "RcvBBTransferBrPyInfo";
			}else if(screenId.equals("ALR_FORMS")) {
				reqType = "MNFORMS";
				sourceType = "AddManualForms";
			}else if(screenId.equals("CPPFormsList")) {
				reqType = "MNFORMS";
				sourceType = "DeleteManualForms";
			}else if(screenId.equals("PolAddChargeHeader")) {
				reqType = "ADDCHG";
				sourceType = "AdditionalCharges";
			}else if(screenId.equals("RcvABStmtPostAddSS") || screenId.equals("RcvBBStmtPostAddSS") || screenId.equals("RcvBBStmtPostChgSS")) {
				reqType = "DOJO";
				sourceType = "RcvABStmtPostAddSSInfo";
			}else if(screenId.equals("CPPFormsListExt")) {
				reqType = "FORMS";
				sourceType = "CPPFormsListExt";
			}else if(screenId.equals("VehicleCoverage")) {
				reqType = "VEHCOVG";
				sourceType = "VehicleCoverages";
			}else if(screenId.equals("PolRetroTaxSurchargeFeeAdjustment")) {
				reqType = "RETRO";
				sourceType = "PolRetroTaxSurchargeFeeAdjustment";
			}else if(screenId.equals("RcvDBAdjustInstallmentFrame")) {
				reqType = "RCV";
				sourceType = "AdjustInstallmentRq";
			}else if(screenId.equals("PA_Vehicle_Entry")) {
				reqType = "RCV";
				sourceType = "VinCheckRq";
			}
			else if (screenId.equals("SubjectivitiesList_Wcv") || screenId.equals("SubjectivitiesList") ) {
				reqType = "SUBJ";
				sourceType = "SUBJGriddata";
				Map<String,String> isDueDateValid = dueDateTest(RestRequest);
				if(isDueDateValid.get("ERROR1")!=null){
					return UXJacksonUtils.convertToJSON(isDueDateValid);
				}
			}else if(screenId.equals("RcvCBBulkPaymentAdd") || screenId.equals("RcvCBBulkPaymentUpd")) {
				reqType = "RCV";
				sourceType = "RcvCBBulkPaymentInfo";
			}else if(screenId.equals("RcvCBPaymentAlloc")) {
				reqType = "RCV";
				sourceType = "RcvCBPaymentAlloc";
			}else if(screenId.equals("RcvDBPmtAdjustmentSearchFrame")){
				reqType = "RCV";
				sourceType = "RcvDBCorrectPayment";
			}
			else if(screenId.equals("AddAccountPeriodDetails") || screenId.equals("AccountPeriodDetails")) {
				reqType = "RCV";
				sourceType = "AccountingPeriodInfo";
			}else if(screenId.equals("RcvStopCollectionSearchFrame")) {
				reqType = "RCV";
				sourceType = "StopCollectionInfo";
			}else if(screenId.equals("PolCppUnitListGrid")) {
				reqType = "AUDIT";
				sourceType = "unitList";
			}else if(screenId.equals("UndReassignGrid")) {
				reqType = "Underwriter";
				sourceType = "UndReassign";
			}else if(screenId.equals("DetLossAddForm")) {
				reqType = "RCV";
				sourceType = "DetailLossInfo";
			}
			else if(screenId.equals("AgnLicAddDetail")) {
				reqType = "PICS";
				sourceType = "AgnLicInfo";
			}
			else if (screenId.equals("StatementQuestions")) {  //For Statement page
				reqType = "STMT";
				sourceType = "StatementData";
			} //If ends for Statement page
			uxRestResponseObj = processRequest(RestRequest, reqType, sourceType, response, new ResponsePayLoad());

			if (uxRestResponseObj instanceof String) {
				return (String) uxRestResponseObj;
			}

		} else {

			uxRestResponseObj = getLRARAOWorksheet(RestRequest);
			ACLJSONManipulator.secureData((Map<String, Object>) uxRestResponseObj, screenId, false);

		}

		return UXJacksonUtils.convertToJSON(uxRestResponseObj);

	}

	public Map<String, Object> getLRARAOWorksheet(Map<String, Object> RestRequest) throws Throwable {

		String manualClasses = "";
		String forManualClass = "";
		String domManualClass = "";
		String forOverrClass = "";
		String domOverrClass = "";
		String statePrev = "";
		String statePrevCode = "";
		String manualClassVal = "";
		String manualForterrVal = "";
		String manualDomterrVal = "";
		String lraroAdjustClasVal = "";
		String lraroAdjustForterrVal = "";
		String lraroAdjustDomterrVal = "";
		String manualClassValDisplay = "";
		String manualForterrValDisplay = "";
		String manualDomterrValDisplay = "";

		String usr = (String) RestRequest.get("User");

		ArrayList<String> allStates = new ArrayList<String>();
		String query;
		String policyEffectiveDate = "";
		String PolicyEffectiveDatequery;
		String policyDateTableName;
		String policyDateWhereField;
		int countOfStates = 0;
		String commaSepStrFrEachStateInf = "";

		String policyNo = "";
		String symbol = "";
		String moduleNo = "";
		String masterLocation = "";
		String location = "";
		String policyLocation = "";
		String lob = "";
		String wc25_endEffDate = "";
		String policyTransactionMode = "";
		String policyEndorsementDate = "";
		String lraromodType = "";
		String forOvmodType = "";
		String domOvmodType = "";

		String lraroRateOp = "";
		String forOvRateOp = "";
		String domOvRateOp = "";
		String stateNumber = "";
		String polStatus = "";
		String modType = "";
		String opSeq = "";

		String fullKey = RestRequest.get("KEY").toString();

		if (fullKey.substring(0, 1).equals("\"")) {
			fullKey = fullKey.substring(1, fullKey.length() - 2);
		}

		String key = fullKey;

		if (key != null && key.length() > 0) {
			location = key.substring(0, 2);
			masterLocation = key.substring(2, 4);
			symbol = key.substring(4, 7);
			policyNo = key.substring(7, 14);
			moduleNo = key.substring(14, 16);
			lob = key.substring(16, 19);
			policyLocation = key.substring(19, 21);
			policyTransactionMode = key.substring(30, 32);
		}

		PolicyEffectiveDatequery = "";
		policyDateTableName = "PMSP0200";
		policyDateWhereField = " WHERE ID02='" + "02" + "' and LOCATION='" + location + "' and POLICY0NUM='" + policyNo + "' and SYMBOL='" + symbol + "' and MASTER0CO='" + masterLocation + "' and MODULE='" + moduleNo + "' and TYPE0ACT='" + policyTransactionMode + "' and TRANS0STAT IN ('" + "V" + "'" + ",'" + "P'" + ") ORDER BY TRANS0STAT";
		PolicyEffectiveDatequery = "SELECT EFF0YR +EFF0MO+ EFF0DA AS POLEFFDTE,ENTER0DATE FROM " + policyDateTableName + policyDateWhereField;

		List<Map<String, String>> EffectRs = getResultSetRows(executeStmt(Type.SQL, PolicyEffectiveDatequery));

		for (Iterator<Map<String, String>> rowIter = EffectRs.iterator(); rowIter.hasNext();) {

			Map<String, String> row = rowIter.next();
			policyEffectiveDate = row.get("POLEFFDTE");

			policyEndorsementDate = row.get("ENTER0DATE");
		}

		query = "";
		String callparm = policyNo + symbol + moduleNo + masterLocation + location + policyLocation + lob + policyEffectiveDate;
		query = "BASWC26I02('" + callparm + "')";

		List<Map<String, String>> ClassRs = getResultSetRows(executeStmt(Type.SP, query));

		if (ClassRs != null) {

			String stateName = "";

			String classCode = "";

			boolean oneState = false;
			for (Iterator<Map<String, String>> rowIter = ClassRs.iterator(); rowIter.hasNext();) {

				Map<String, String> row = rowIter.next();
				stateNumber = row.get("STATECODE");
				polStatus = row.get("STATUS");
				stateName = row.get("STATENAME");
				if (statePrev.equalsIgnoreCase("")) {
					statePrev = stateName;
					statePrevCode = row.get("STATECODE");
				}
				if (!statePrev.equalsIgnoreCase(stateName)) {

					/*
					 * This is a comma separated String which contains state name, its mod type, and rate Option to be
					 * passed to delete program
					 */
					if (!lraromodType.equalsIgnoreCase("")) {
						commaSepStrFrEachStateInf = statePrevCode + "," + lraromodType + "," + lraroRateOp;
						allStates.add(countOfStates, commaSepStrFrEachStateInf);
						countOfStates++;
					}

					if (!forOvmodType.equalsIgnoreCase("")) {
						commaSepStrFrEachStateInf = statePrevCode + "," + forOvmodType + "," + forOvRateOp;
						allStates.add(countOfStates, commaSepStrFrEachStateInf);
						countOfStates++;
					}
					if (!domOvmodType.equalsIgnoreCase("")) {
						commaSepStrFrEachStateInf = statePrevCode + "," + domOvmodType + "," + domOvRateOp;
						allStates.add(countOfStates, commaSepStrFrEachStateInf);
						countOfStates++;
					}

					// These variables are to be reset as they have populated info and rates of one state into xml.
					// Now same variables will be reused for next state in loop.
					statePrev = stateName;
					// statePrevCode = ClassRs.getString(3);
					statePrevCode = row.get("STATECODE");
					modType = "";
					classCode = "";
					oneState = false;
					lraromodType = "";
					forOvmodType = "";
					domOvmodType = "";
					lraroRateOp = "";
					forOvRateOp = "";
					domOvRateOp = "";
				} else {
					oneState = true;
				}

				modType = row.get("STATEMODTYPE");
				opSeq = row.get("OPSEQ");
				wc25_endEffDate = row.get("ENDEFFDATE");
				classCode = row.get("CLASSCODE");

				if (row.get("FUNCNAME").equalsIgnoreCase("LRARO CLASS PREMIUM ADJUSTMENT - NEGATIVE - MOD TYPE CODE") || row.get("FUNCNAME").equalsIgnoreCase("LRARO CLASS PREMIUM ADJUSTMENT - POSITIVE - MOD TYPE CODE")) {

					lraromodType = row.get("STATEMODTYPE");
					lraroRateOp = row.get("RATEOP");

					manualClasses = manualClasses + ",'" + classCode + "'";
				}
				if (row.get("FUNCNAME").equalsIgnoreCase("TERRORISM")) {

					forManualClass = forManualClass + ",'" + classCode + "'";

				}
				if (row.get("FUNCNAME").equalsIgnoreCase(

				"CATASTROPHE")) {

					domManualClass = domManualClass + ",'" + classCode + "'";
				}
				if (row.get("FUNCNAME").equalsIgnoreCase("LRARO FOREIGN TERROR ADJUSTMENT - NEGATIVE  - MOD TYPE CODE") || row.get("FUNCNAME").equalsIgnoreCase("LRARO FOREIGN TERROR ADJUSTMENT - POSITIVE  - MOD TYPE CODE")) {

					forOvmodType = row.get("STATEMODTYPE");
					forOvRateOp = row.get("RATEOP");

					forOverrClass = forOverrClass + ",'" + classCode + "'";
				}
				if (row.get("FUNCNAME").equalsIgnoreCase("LRARO DOMESTIC TERROR ADJUSTMENT - NEGATIVE  - MOD TYPE CODE") || row.get("FUNCNAME").equalsIgnoreCase("LRARO DOMESTIC TERROR ADJUSTMENT - POSITIVE - MOD TYPE CODE")) {

					domOvmodType = row.get("STATEMODTYPE");
					domOvRateOp = row.get("RATEOP");

					domOverrClass = domOverrClass + ",'" + classCode + "'";
				}

			}// classRs iteration ends here

			if (oneState == false) {// to fill last result set state element node
				/*
				 * This is a comma separated String which contains state name, its mod type, and rate Option to be
				 * passed to delete program
				 */
				if (!lraromodType.equalsIgnoreCase("")) {
					commaSepStrFrEachStateInf = statePrevCode + "," + lraromodType + "," + lraroRateOp;
					allStates.add(countOfStates, commaSepStrFrEachStateInf);
					countOfStates++;
				}

				if (!forOvmodType.equalsIgnoreCase("")) {
					commaSepStrFrEachStateInf = statePrevCode + "," + forOvmodType + "," + forOvRateOp;
					allStates.add(countOfStates, commaSepStrFrEachStateInf);
					countOfStates++;
				}
				if (!domOvmodType.equalsIgnoreCase("")) {
					commaSepStrFrEachStateInf = statePrevCode + "," + domOvmodType + "," + domOvRateOp;
					allStates.add(countOfStates, commaSepStrFrEachStateInf);
					countOfStates++;
				}

			}
			if (oneState == true) {// This runs when only one state is there for LRARO

				/*
				 * This is a comma separated String which contains state name, its mod type, and rate Option to be
				 * passed to delete program
				 */
				if (!lraromodType.equalsIgnoreCase("")) {
					commaSepStrFrEachStateInf = statePrevCode + "," + lraromodType + "," + lraroRateOp;
					allStates.add(countOfStates, commaSepStrFrEachStateInf);
					countOfStates++;
				}

				if (!forOvmodType.equalsIgnoreCase("")) {
					commaSepStrFrEachStateInf = statePrevCode + "," + forOvmodType + "," + forOvRateOp;
					allStates.add(countOfStates, commaSepStrFrEachStateInf);
					countOfStates++;
				}
				if (!domOvmodType.equalsIgnoreCase("")) {
					commaSepStrFrEachStateInf = statePrevCode + "," + domOvmodType + "," + domOvRateOp;
					allStates.add(countOfStates, commaSepStrFrEachStateInf);
					countOfStates++;
				}

			}

		}

		/* Below query to display policy premium totals */
		String PolPremTotquery = "";
		String addManualClause = "";
		String addforManualClause = "";
		String adddomManualClause = "";
		String addforOverClause = "";
		String adddomOverClause = "";
		String addManualClause2 = "";
		int[] caseIdrawarray;
		caseIdrawarray = new int[6];

		if (ClassRs != null) { // in case we dont have any data in grid for state and ratings then we dont require to
								// execute the policy premium totals logic

			String SQLEXPOSSTR = "select SUM(SAREXPOSUR) AS EXPOSUR from PMSPSA15  where LOCATION = " + "'" + location + "'" + "  and POLICY0NUM='" + policyNo + "' and SYMBOL='" + symbol + "' and MASTER0CO = '" + masterLocation + "'  and MODULE='" + moduleNo + "'";

			String SQLPREMSTR = "select SUM(SARPREM) AS EXPOSUR from PMSPSA15  where LOCATION = " + "'" + location + "'" + "  and POLICY0NUM='" + policyNo + "' and SYMBOL='" + symbol + "' and MASTER0CO = '" + masterLocation + "' and MODULE='" + moduleNo + "'";
			String unionCLause = " Union All ";
			String classClause = "and SARCLASS IN";

			if (!manualClasses.equalsIgnoreCase("")) {
				addManualClause = SQLEXPOSSTR + classClause + "(" + manualClasses.replaceFirst(",", "") + ")" + unionCLause;
				addManualClause2 = SQLPREMSTR + classClause + "(" + manualClasses.replaceFirst(",", "") + ")" + unionCLause;
				caseIdrawarray[0] = 1;
				caseIdrawarray[3] = 4;
			}
			if (!forManualClass.equalsIgnoreCase("")) {
				addforManualClause = SQLPREMSTR + classClause + "(" + forManualClass.replaceFirst(",", "") + ")" + unionCLause;
				caseIdrawarray[1] = 2;
			}
			if (!domManualClass.equalsIgnoreCase("")) {
				adddomManualClause = SQLPREMSTR + classClause + "(" + domManualClass.replaceFirst(",", "") + ")" + unionCLause;
				caseIdrawarray[2] = 3;
			}
			if (!forOverrClass.equalsIgnoreCase("")) {
				addforOverClause = SQLPREMSTR + classClause + "(" + forOverrClass.replaceFirst(",", "") + ")" + unionCLause;
				caseIdrawarray[4] = 5;
			}
			if (!domOverrClass.equalsIgnoreCase("")) {

				adddomOverClause = SQLPREMSTR + classClause + "(" + domOverrClass.replaceFirst(",", "") + ")";
				caseIdrawarray[5] = 6;
			}

			PolPremTotquery = addManualClause + addforManualClause + adddomManualClause + addManualClause2 + addforOverClause + adddomOverClause;

			int caseVar = 0;
			int i = 1;
			int tempVar = 0;

			for (int z = 0; z < caseIdrawarray.length; z++) {// to extract active class codes whose premium is to be
																// displayed after rating is done for this policy.
				if (caseIdrawarray[z] != 0) {
					tempVar = caseIdrawarray[z] * i;
					i = i * 10;
					caseVar = caseVar + tempVar;// integer variable like 246 will be formed where 2 is case 2, 4 is case
												// 4 etc..
				}
			}

			if (PolPremTotquery.lastIndexOf("Union All") != -1) {

				String str = PolPremTotquery.substring(PolPremTotquery.length() - 10, PolPremTotquery.length());
				str = str.trim();
				if (str != null && str.equalsIgnoreCase("Union All")) {// if Union All comes at last of String it needs
																		// to be chopped
					PolPremTotquery = PolPremTotquery.substring(0, PolPremTotquery.lastIndexOf("Union All"));
				}
			}
			List<Map<String, String>> WCVPolPremTotRs = new ArrayList<Map<String, String>>();
			if (!PolPremTotquery.equalsIgnoreCase("")) {

				WCVPolPremTotRs = getResultSetRows(executeStmt(Type.SQL, PolPremTotquery));

			}
			/*
			 * boolean flag = false; if((caseVar%10) == 1){ WCVPolPremTotRs.next();
			 * if(WCVPolPremTotRs.getString(1).equalsIgnoreCase("")){ flag = true; } WCVPolPremTotRs.previous(); }
			 */

			boolean flag = false;
			for (Iterator<Map<String, String>> rowIter = WCVPolPremTotRs.iterator(); rowIter.hasNext();) {

				Map<String, String> row = rowIter.next();
				if (row.get("EXPOSUR") != null) {
					if (row.get("EXPOSUR").equalsIgnoreCase("")) {
						flag = true;
					}
				}
			}

			if (manualClasses.equalsIgnoreCase("") || flag == true) {
				// Check if LRC2/LRC1 entry is present in PMSPWC25

				String checkClassAdjustmentQuery = "Select count(1) AS COUNT from PMSPWC25 where WC25_LOCATION = " + "'" + location + "'" + "  and WC25_POLICY_NO='" + policyNo + "' and WC25_SYMBOL='" + symbol + "' and WC25_MASTER_CO = '" + masterLocation + "' and WC25_MODULE='" + moduleNo + "' and WC25_MODTYPE IN ('LRC1', 'LRC2')";
				List<Map<String, String>> checkClassAdjustmentRs = getResultSetRows(executeStmt(Type.SQL, checkClassAdjustmentQuery));

				if (checkClassAdjustmentRs != null)
					for (Iterator<Map<String, String>> rowIter = checkClassAdjustmentRs.iterator(); rowIter.hasNext();) {

						Map<String, String> row = rowIter.next();

						// if no entry found in WC25 then fetch Class Premium from SA15
						// or if LRC1/LRC2 present in WC25 but have not been included in rating, then fetch
						// the SA15 manual premium
						if (new Integer(row.get("COUNT")) == 0 || flag == true) {
							String classPremiumQuery = "select SUM(TOTALORIG) AS TOTALORIG from PMSPSA15  where LOCATION = " + "'" + location + "'" + "  and POLICY0NUM='" + policyNo + "' and SYMBOL='" + symbol + "' and MASTER0CO = '" + masterLocation + "'  and MODULE='" + moduleNo + "' and SARMAJPERL = '032'";
							// FETCH SUM OF ORIG PREMIUM FOR USER ENTERED CLASSES ONLY THAT IS FOR
							// WHICH MAJ PERIL = 032

							List<Map<String, String>> classPremiumQueryRs = getResultSetRows(executeStmt(Type.SQL, classPremiumQuery));

							if (classPremiumQueryRs != null)
								for (Iterator<Map<String, String>> rowIter1 = classPremiumQueryRs.iterator(); rowIter1.hasNext();) {

									Map<String, String> row1 = rowIter1.next();
									if (row1.get("TOTALORIG") != null) {
										if (!row1.get("TOTALORIG").equalsIgnoreCase("")) {
											manualClassValDisplay = row1.get("TOTALORIG");
										}
									}
								}
						}
					}
			}
			int caseID = 0;
			if (WCVPolPremTotRs != null) {
				for (Iterator<Map<String, String>> rowIter = WCVPolPremTotRs.iterator(); rowIter.hasNext();) {

					Map<String, String> row = rowIter.next();

					if (row.get("EXPOSUR") != null) {
						caseID = caseVar % 10;
						caseVar = caseVar / 10;

						switch (caseID) {

						case 1:
							manualClassVal = row.get("EXPOSUR");
							if (!manualClassVal.equalsIgnoreCase("")) {
								manualClassValDisplay = row.get("EXPOSUR");

							}
							break;
						case 2:
							manualForterrVal = row.get("EXPOSUR");
							if (!manualForterrVal.equalsIgnoreCase("")) {
								manualForterrValDisplay = row.get("EXPOSUR");
							}
							break;
						case 3:
							manualDomterrVal = row.get("EXPOSUR");
							if (!manualDomterrVal.equalsIgnoreCase("")) {
								manualDomterrValDisplay = row.get("EXPOSUR");
							}
							break;
						case 4:
							lraroAdjustClasVal = row.get("EXPOSUR");

							if (!lraroAdjustClasVal.equalsIgnoreCase("")) {
								if (Double.parseDouble(lraroAdjustClasVal) >= 0.00) {
								} else {
									lraroAdjustClasVal = "-" + lraroAdjustClasVal.substring(1, lraroAdjustClasVal.length() - 1);
								}
							}
							break;
						case 5:
							lraroAdjustForterrVal = row.get("EXPOSUR");

							if (!lraroAdjustForterrVal.equalsIgnoreCase("")) {
								if (Double.parseDouble(lraroAdjustForterrVal) >= 0.00) {
								} else {
									lraroAdjustForterrVal = "-" + lraroAdjustForterrVal.substring(1, lraroAdjustForterrVal.length() - 1);
								}
							}

							break;

						case 6:
							lraroAdjustDomterrVal = row.get("EXPOSUR");

							if (!lraroAdjustDomterrVal.equalsIgnoreCase("")) {
								if (Double.parseDouble(lraroAdjustDomterrVal) >= 0.00) {
								} else {
									lraroAdjustDomterrVal = "-" + lraroAdjustDomterrVal.substring(1, lraroAdjustDomterrVal.length() - 1);

								}
							}

							break;
						}
						caseID++;
					}
				}// end of for loop
			}
		}

		Map<String, Object> responseObj = new HashMap<String, Object>();

		responseObj.put("Class", manualClassValDisplay);
		responseObj.put("Terrorism", manualForterrValDisplay);
		responseObj.put("CATTerr", manualDomterrValDisplay);
		responseObj.put("LClass", lraroAdjustClasVal);
		responseObj.put("LTerrorism", lraroAdjustForterrVal);
		responseObj.put("LCATTerr", lraroAdjustDomterrVal);
		// other required data
		responseObj.put("TRANSMODE", policyTransactionMode);
		responseObj.put("POLEFFDTE", policyEffectiveDate);
		responseObj.put("POLENDTE", policyEndorsementDate);

		responseObj.put("LOC", location);
		responseObj.put("MASTERLOC", masterLocation);
		responseObj.put("SYMBOL", symbol);
		responseObj.put("POLNUM", policyNo);
		responseObj.put("MODULE", moduleNo);
		responseObj.put("STATENUMBER", stateNumber);
		responseObj.put("STATUS", polStatus);
		responseObj.put("STATEMODTYPE", modType);
		responseObj.put("OPSEQ", opSeq);
		responseObj.put("USER", usr);
		responseObj.put("ENDEFFDATE", wc25_endEffDate);
		responseObj.put("STATECOUNT", countOfStates);
		responseObj.put("ALLSTATES", allStates);

		return responseObj;

	}

	public static List<Map<String, String>> getResultSetRows(List<Map<String, String>> rows) {

		List<Map<String, String>> allRows = new ArrayList<Map<String, String>>();

		for (Iterator<Map<String, String>> rowIter = rows.iterator(); rowIter.hasNext();) {

			Map<String, String> row = rowIter.next();
			Map<String, String> newRow = new HashMap<String, String>();

			for (Iterator<Entry<String, String>> columnIter = row.entrySet().iterator(); columnIter.hasNext();) {

				Entry<String, String> column = columnIter.next();

				if (column.getKey().contains("-")) {
					String newColumnName = column.getKey().replaceAll("-", "");
					columnIter.remove();
					newRow.put(newColumnName, column.getValue());
				}
			}

			row.putAll(newRow);

			allRows.add(row);
		}
		return allRows;
	}

	public static Object modifyLRAROGridData(Object gridData) {

		List<Map<String, String>> existingList = ((JDBCResponsePayLoad) gridData).getRows();
		List<Map<String, String>> newList = new ArrayList<Map<String, String>>();
		Map<String, Object> newGridData = new HashMap<String, Object>();

		Set<String> stateSet = new HashSet<String>();
		for (Iterator<Map<String, String>> rowIter = existingList.iterator(); rowIter.hasNext();) {
			Map<String, String> row = rowIter.next();

			stateSet.add(row.get("STATENAME"));
		}

		for (Iterator<String> setIter = stateSet.iterator(); setIter.hasNext();) {
			String state = setIter.next();
			Map<String, String> newRow = new HashMap<String, String>();
			newRow.put("STATENAME", state);
			for (Iterator<Map<String, String>> rowIter = existingList.iterator(); rowIter.hasNext();) {
				Map<String, String> row = rowIter.next();

				if (row.get("STATENAME").equals(state)) {

					if (row.get("STATEMODTYPE").equals("LRC1") || row.get("STATEMODTYPE").equals("LRC2")) {
						newRow.put("KEYWCVCLASSADJUSTFACTOR", row.get("RATE"));

					}
					if (row.get("STATEMODTYPE").equals("TERR")) {
						newRow.put("TFRATE", row.get("RATE"));

					}
					if (row.get("STATEMODTYPE").equals("LRF1") || row.get("STATEMODTYPE").equals("LRF2")) {
						newRow.put("KEYWCVFORTERRRATEOVERR", row.get("RATE"));

					}
					if (row.get("STATEMODTYPE").equals("DTER")) {
						newRow.put("CATTFRATE", row.get("RATE"));

					}
					if (row.get("STATEMODTYPE").equals("LRD1") || row.get("STATEMODTYPE").equals("LRD2")) {
						newRow.put("KEYWCVDOMTERRRATEOVERR", row.get("RATE"));
					}

					newRow.put("STATECODE", row.get("STATECODE"));

				}

			}

			newList.add(newRow);

		}
		newGridData.put("rows", newList);
		return newGridData;
	}
	
	public static Object modifyWaiveInstGridData(Object gridData,String gridId){
		List<Map<String, String>> existingList = ((JDBCResponsePayLoad) gridData).getRows();
		List<Map<String, String>> newList = new ArrayList<Map<String, String>>();
		Map<String, Object> newGridData = new HashMap<String, Object>();
           for (Iterator<Map<String, String>> rowIter = existingList.iterator(); rowIter.hasNext();) {
            Map<String, String> newRow = new HashMap<String, String>();
       		Map<String, String> newRow1 = new HashMap<String, String>();
       		Map<String, String> newRow2 = new HashMap<String, String>();
       		Map<String, String> newRow3 = new HashMap<String, String>();
       		Map<String, String> newRow4 = new HashMap<String, String>();

			Map<String, String> row = rowIter.next();
			if (row.get("WS-PREM-TRANSACTION").equals("Premium")){
				if(gridId.equals("RcvDBWaiveInstGrid")){
				    newRow.put("INST", row.get("WS-PREM-INST"));
				}else if(gridId.equals("RcvDBRevWaiveAmtGrid")){
					newRow.put("INST", row.get("WS-INST"));
				}
				newRow.put("TRANSACTION", row.get("WS-PREM-TRANSACTION"));
				newRow.put("COLLECTABLE", row.get("WS-PREM-COLLECTABLE"));
				newRow.put("PAID", row.get("WS-PREM-PAID"));
				if(gridId.equals("RcvDBWaiveInstGrid")){
				    newRow.put("BALANCE", row.get("WS-PREM-BALANCE"));
				}else if(gridId.equals("RcvDBRevWaiveAmtGrid")){
					newRow.put("WAIVED", row.get("WS-PREM-WAIVED"));
				}
				newRow.put("AMOUNT", row.get("WS-PREM-AMOUNT"));
				newRow.put("WSPREMWAIVETYPE", row.get("WS-PREM-WAIVETYPE"));
				if(gridId.equals("RcvDBWaiveInstGrid")){
					newRow.put("WSPREMWAIVERET","");
				}else if(gridId.equals("RcvDBRevWaiveAmtGrid")){
					newRow.put("WSPREMWAIVERET","WS-PREM-WAIVERET");
				}
				newList.add(newRow);
			}
			if (row.get("WS-SC-TRANSACTION").equals("Service Charge")){
				newRow1.put("INST","");
				newRow1.put("TRANSACTION", row.get("WS-SC-TRANSACTION"));
				newRow1.put("COLLECTABLE", row.get("WS-SC-COLLECTABLE"));
				newRow1.put("PAID", row.get("WS-SC-PAID"));
				if(gridId.equals("RcvDBWaiveInstGrid")){
				    newRow1.put("BALANCE", row.get("WS-SC-BALANCE"));
				}else if(gridId.equals("RcvDBRevWaiveAmtGrid")){
					newRow1.put("WAIVED", row.get("WS-SC-WAIVED"));
				}				
				newRow1.put("AMOUNT", row.get("WS-SC-AMOUNT"));
				newRow1.put("WSPREMWAIVETYPE", row.get("WS-PREM-WAIVETYPE"));
				newRow1.put("WSPREMWAIVERET","");			
				newList.add(newRow1);
			}
			if (row.get("WS-NSF-TRANSACTION").equals("NSF Charge")){
				newRow2.put("INST","");
				newRow2.put("TRANSACTION", row.get("WS-NSF-TRANSACTION"));
				newRow2.put("COLLECTABLE", row.get("WS-NSF-COLLECTABLE"));
				newRow2.put("PAID", row.get("WS-NSF-PAID"));
				if(gridId.equals("RcvDBWaiveInstGrid")){
				    newRow2.put("BALANCE", row.get("WS-NSF-BALANCE"));
				}else if(gridId.equals("RcvDBRevWaiveAmtGrid")){
					newRow2.put("WAIVED", row.get("WS-NSF-WAIVED"));
				}				
				newRow2.put("AMOUNT", row.get("WS-NSF-AMOUNT"));
				newRow2.put("WSPREMWAIVETYPE", row.get("WS-PREM-WAIVETYPE"));
				newRow2.put("WSPREMWAIVERET","");				
				newList.add(newRow2);
			}
			if (row.get("WS-NONPREM-TRANSACTION").equals("Non Premium")){
				newRow3.put("INST","");
				newRow3.put("TRANSACTION", row.get("WS-NONPREM-TRANSACTION"));
				newRow3.put("COLLECTABLE", row.get("WS-NONPREM-COLLECTABLE"));
				newRow3.put("PAID", row.get("WS-NONPREM-PAID"));
				if(gridId.equals("RcvDBWaiveInstGrid")){
				    newRow3.put("BALANCE", row.get("WS-NONPREM-BALANCE"));
				}else if(gridId.equals("RcvDBRevWaiveAmtGrid")){
					newRow3.put("WAIVED", row.get("WS-NONPREM-WAIVED"));
				}				
				newRow3.put("AMOUNT", row.get("WS-NONPREM-AMOUNT"));
				newRow3.put("WSPREMWAIVETYPE", row.get("WS-PREM-WAIVETYPE"));
				newRow3.put("WSPREMWAIVERET","");				
				newList.add(newRow3);
			}
			if (row.get("WS-BALFWD-TRANSACTION").equals("Balance Forward") || row.get("WS-BALFWD-TRANSACTION").equals("Balance Fwd")){
				newRow4.put("INST","");
				newRow4.put("TRANSACTION", row.get("WS-BALFWD-TRANSACTION"));
				newRow4.put("COLLECTABLE", row.get("WS-BALFWD-COLLECTABLE"));
				newRow4.put("PAID", row.get("WS-BALFWD-PAID"));
				if(gridId.equals("RcvDBWaiveInstGrid")){
				    newRow4.put("BALANCE", row.get("WS-BALFWD-BALANCE"));
				}else if(gridId.equals("RcvDBRevWaiveAmtGrid")){
					newRow4.put("WAIVED", row.get("WS-BALFWD-WAIVED"));
				}
				newRow4.put("AMOUNT", row.get("WS-BALFWD-AMOUNT"));
				newRow4.put("WSPREMWAIVETYPE", row.get("WS-PREM-WAIVETYPE"));
				newRow4.put("WSPREMWAIVERET","");
				newList.add(newRow4);
			}
			
		}
        newGridData.put("rows", newList);
		return newGridData;

	}
	
	public static Object modifySubjectivitiesGridData(Object gridData) {

		List<Map<String, String>> rows = ((JDBCResponsePayLoad) gridData).getRows();
			for (Iterator<Map<String, String>> rowIter = rows.iterator(); rowIter.hasNext();) {

				Map<String, String> row = rowIter.next();
				
				/*if((row.get("DEFIND1").equals("N")) ){
					rowIter.remove();
				} */
			}
		return gridData;
	}
	
	public void activityAfterResponse(RequestPayLoad requestPayLoad, ResponsePayLoad responsePayLoad)  throws Throwable {
		
		String screenId = (String) requestPayLoad.get("screenId");
		if(screenId != null && screenId.equals("WcpAddTrackingComments")){
			String requestCode = (String) requestPayLoad.get("REQUESTCODE");
			String commentId = (String) responsePayLoad.get("KEY_COMMENT_ID");
			String noteText =  (String) requestPayLoad.get("NOTETEXT");
			String userId = (String) requestPayLoad.get("AUDTRK_USERID");
			String entryDate =  (String) responsePayLoad.get("AUDTRK_DATE_OF_ENTRY");
			String sql = "" ;
			
			if(requestCode.equals("WCVATCMTADDRq")){
				sql = "INSERT INTO BASNOT0100(NOTEKEY, NOTETEXT, USERPRF, RECDATE) VALUES("+ commentId + ",'"+ noteText +"','"+ userId +"','"+ UXUtils.formatDate(entryDate.toString(), "yyyy-mm-dd") +"')";
				executeStmt(Type.SQL, sql);
			}else if(requestCode.equals("WCVATCMTCHGRq")){
				sql = "UPDATE BASNOT0100 SET NOTETEXT = '" + noteText + "' WHERE NOTEKEY = "+ commentId;
			}else if(requestCode.equals("WCVATCMTDLTRq")){
				sql = "DELETE FROM BASNOT0100 WHERE NOTEKEY = "+ commentId;
			}
			executeStmt(Type.SQL, sql);
		}
	}

	public Map<String, String> dueDateTest(Map<String, Object> reqObj) throws Throwable {

		String sql = "SELECT TRANS0STAT, ISSUE0CODE, TOT0AG0PRM, EFF0YR, EFF0MO, EFF0DA, TYPE0ACT  FROM PMSP0200 WHERE SYMBOL = '" + reqObj.get("SYMBOL") + "' AND  POLICY0NUM = '" + reqObj.get("POL_NO") + "'AND MODULE   =  '" + reqObj.get("POL_MODULE") + "'AND MASTER0CO  = '" + reqObj.get("MASTER_CO") + "' AND LOCATION   = '" + reqObj.get("LOCATION") + "'";

		List<Map<String, String>> rows = executeStmt(Type.SQL, sql);
		String issueCode = null;
		String binderEffectiveDate = null;
		String dueDateLimit = (String) reqObj.get("dueDateLimit");
		String message = null;
		Map<String, String> responseMessage = new HashMap<String, String>();

		for (Iterator<Map<String, String>> rowIter = rows.iterator(); rowIter.hasNext();) {
			Map<String, String> res = rowIter.next();
			if (res != null) {
				issueCode = res.get("ISSUE0CODE");
				int yr = 0;
				String year = res.get("EFF0YR");
				if (year != null && year.length() > 2) {
					yr = 2000 + (Integer.parseInt(year.substring(0, year.length() - 2)) - 1) * 100 + Integer.parseInt(year.substring(year.length() - 2, 3));

				}
				binderEffectiveDate = res.get("EFF0MO") + "/" + res.get("EFF0DA") + "/" + yr;
			}
		}

		int binderMonth = Integer.parseInt(binderEffectiveDate.substring(0, 2), 10) - 1;
		int binderDay = Integer.parseInt(binderEffectiveDate.substring(3, 5), 10);
		int binderYear = Integer.parseInt(binderEffectiveDate.substring(6, 10), 10);
		Calendar binderDate = Calendar.getInstance();
		binderDate.set(binderYear, binderMonth, binderDay);
		long binderDatemilis = binderDate.getTimeInMillis();

		List<Map<String, String>> subjGridList = (List<Map<String, String>>) reqObj.get("selectedData");
		if (subjGridList != null) {
			for (Map<String, String> map : subjGridList) {
				String dateCompleted = UXUtils.formatDate(map.get("BINDEREFFEDATE") , "mm/dd/yyyy");
				if (dateCompleted != null) {
					int dateCompletedMonth = Integer.parseInt(dateCompleted.substring(0, 2), 10) - 1;
					int dateCompletedDay = Integer.parseInt(dateCompleted.substring(3, 5), 10);
					int dateCompletedYear = Integer.parseInt(dateCompleted.substring(6, 10), 10);

					Calendar completedDate = Calendar.getInstance();
					completedDate.set(dateCompletedYear, dateCompletedMonth, dateCompletedDay);
					long dateCompletedmilis = completedDate.getTimeInMillis();

					long diff = dateCompletedmilis - binderDatemilis;

					long diffDays = diff / (24 * 60 * 60 * 1000);
					if (diffDays > Integer.parseInt(dueDateLimit)) {
						if (issueCode.equals("R")) {
							message = "Date can not be more than " + dueDateLimit + " days from Policy effective date";
						} else {

							message = "Date can not be more than " + dueDateLimit + " days from Binder effective date";
						}
					}
				}

			}
		}
		responseMessage.put("ERROR1", message);
		responseMessage.put("ERRORSEV1", "30");
		return responseMessage;
	}
	
	@RequestMapping(value = "/data/navigation/{name}", method = RequestMethod.POST)
	public @ResponseBody
	Object getNavigationData(@PathVariable String name, HttpServletRequest request, HttpServletResponse response) throws Throwable {
		
		String metaModel = "";
		
		if(name.equals("AgencyFile")){
			RequestPayLoad requestPayLoad = parseRequest(request, RequestPayLoad.class);
			
			String navigationId = (String) requestPayLoad.get("navigationId");
			
			metaModel = UXRepositoryUtil.receiveFile(UXAppConfig.getProperty(UXAppConfig.META_MODEL_REPOSITORY_TYPE),
					UXAppConfig.getProperty(UXAppConfig.META_MODEL_REPOSITORY_END_POINT_URI), navigationId + ".json", "");

		}
		
		return metaModel;
	}
	public void doSendMail(String host, String from, String to,String cc, String bcc,String subject,String content,String replyto, String polNumber, MultipartFile file)throws Throwable {
		String strsubject,strSuffix;
		 Properties props = new Properties();
		 props.put("mail.smtp.host", host);
         InternetAddress[] addressrecip;
         addressrecip = InternetAddress.parse(to);
		
		Session mailsession = Session.getInstance(props, null);
		Message msg = new MimeMessage(mailsession);
			msg.setRecipients(Message.RecipientType.TO, addressrecip);
			msg.setFrom(new InternetAddress(from));
		if (replyto != null) {
				InternetAddress[] address = InternetAddress.parse(replyto);
				msg.setReplyTo(address);
		}
		if (cc != null) {
				cc = cc.trim();
				addressrecip = InternetAddress.parse(cc);
				msg.setRecipients(Message.RecipientType.CC, addressrecip);
		}
		if (bcc != null) {
				addressrecip = InternetAddress.parse(bcc);
				msg.setRecipients(Message.RecipientType.BCC, addressrecip);
		}
		Date sentDate = new Date();
		strsubject = subject + "  Date: " + sentDate;
		msg.setSubject(strsubject);
		msg.setSentDate(sentDate);
        if(file != null){
        	BodyPart messageBodyPart = new MimeBodyPart();
            messageBodyPart.setText(content);
            String filename = file.getOriginalFilename();
            int lposOfSuffix = filename.lastIndexOf(".");
		      String sendFileName = "";
		      if (lposOfSuffix > 0){
			    String strTemp = filename.substring(lposOfSuffix, filename.length());
			    strTemp = strTemp.trim();
			    strSuffix = strTemp.substring(0, strTemp.length());
			    sendFileName = ("POL" + "_" + polNumber + strSuffix);
	           }
			 else{
			    strSuffix = ".txt";
			    sendFileName = ("POL" + "_" + polNumber + strSuffix);
			   }
	        File tmpFile = new File(System.getProperty("java.io.tmpdir") + System.getProperty("file.separator") + 
	        		sendFileName);
	        file.transferTo(tmpFile);
	        Multipart multipart = new MimeMultipart();
	        multipart.addBodyPart(messageBodyPart);
	        MimeBodyPart attachPart = new MimeBodyPart();
	        attachPart.attachFile(tmpFile);
	        multipart.addBodyPart(attachPart);
	        msg.setContent(multipart);
        }
      else
    	  	msg.setText(content);
      Transport.send(msg);
	}
	
	public File createTempFile(List<Map<String, String>> gridRows, List<Map<String, String>> gridMetaDataRows, String fullFileName) throws Throwable{
		XSSFWorkbook workbook = new XSSFWorkbook();
        XSSFSheet sheet = workbook.createSheet("sheet");
        XSSFCellStyle style = workbook.createCellStyle();
        style.setFillBackgroundColor(IndexedColors.RED.getIndex());
        style.setFillPattern(CellStyle.ALIGN_FILL);
        Font font = workbook.createFont();
        font.setBoldweight(XSSFFont.BOLDWEIGHT_BOLD);
        font.setColor(IndexedColors.WHITE.getIndex());
        style.setFont(font);
        
        int rowCount = 0;
        if(rowCount==0){
        	int columnCount = 0;
        	Row sheetrow = sheet.createRow(rowCount++);
        	for (Map<String, String> featureService : gridMetaDataRows) {
		    	if("true".equals(featureService.get("visible"))){
					Cell cell = sheetrow.createCell(columnCount++);
					cell.setCellValue(featureService.get("displayName"));
					sheet.autoSizeColumn(columnCount-1);
			        cell.setCellStyle(style);
			    }
        	}
        }
        	
        for (Map<String, String> gridRow : gridRows) {
        	Row sheetrow = sheet.createRow(rowCount++);
			int columnCount = 0;
	    	for (Map<String, String> gridMetaDataRow : gridMetaDataRows) {
		    	if("true".equals(gridMetaDataRow.get("visible"))){
					Cell cell = sheetrow.createCell(columnCount++);
					cell.setCellValue(gridRow.get(gridMetaDataRow.get("field")));
					sheet.autoSizeColumn(columnCount-1);
			    }
	    	}
        }
        File tmpFile = new File(System.getProperty("java.io.tmpdir") + System.getProperty("file.separator") +fullFileName);
		FileOutputStream outputStream = new FileOutputStream(tmpFile);
        workbook.write(outputStream);
		return tmpFile;
	}

	public String doSendEmailReport(String host, String from, String to, String subject, File file) throws Throwable{
		Properties props = new Properties();
		props.put("mail.smtp.host", host);
		props.put("mail.auth", "true");
	    Session mailsession = Session.getInstance(props, null);
		Message msg = new MimeMessage(mailsession);
		InternetAddress[] addressrecip;
		try{
			addressrecip = InternetAddress.parse(to);
			msg.setRecipients(Message.RecipientType.TO, addressrecip);
			msg.setFrom(new InternetAddress(from));
			msg.setSubject(subject);
		    Multipart multipart = new MimeMultipart();
		    if(file != null){
			    BodyPart messageBodyPart = new MimeBodyPart();
			    DataSource source = new FileDataSource(file.getAbsolutePath());
		        messageBodyPart.setDataHandler(new DataHandler(source));
		        messageBodyPart.setFileName(file.getName());
		        if("XLS".equals(SurroundProductConfig.getProperty("fileType").toUpperCase()))
		        	messageBodyPart.setHeader("Content-Type","APPLICATION/VND.MS-EXCEL");
		        multipart.addBodyPart(messageBodyPart);
			    msg.setContent(multipart);
		    }
		    Transport.send(msg);
			return "success";
		}catch (Exception e) {
			return "error";
		}
	    finally{
	    	if(file.exists())
	    		file.delete();
	    }
	}
}