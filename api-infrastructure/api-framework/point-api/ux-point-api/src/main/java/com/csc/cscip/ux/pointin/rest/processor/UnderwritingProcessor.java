package com.csc.cscip.ux.pointin.rest.processor;

import java.util.ArrayList;
import java.util.List;

import com.csc.cscip.ux.common.rest.request.RequestPayLoad;
import com.csc.cscip.ux.common.rest.response.ResponsePayLoad;
import com.csc.cscip.ux.pointin.util.SurroundProductConfig;

public class UnderwritingProcessor {
	
	private UnderWritingComponent uwc = null;
	
	public UnderwritingProcessor(){
		uwc = new UnderWritingComponent();
	}

	public boolean isUWReq(RequestPayLoad requestPayLoad) {
		String requestCode = (String)requestPayLoad.get("REQUESTCODE");
		String key = (String)requestPayLoad.get("KEY");
		String underwritingInstalled = SurroundProductConfig.getProperty("UnderWritingInstalled");
		
		if("Yes".equals(underwritingInstalled) && requestCode != null && (requestCode.indexOf("POLCYRA") >-1 || requestCode.indexOf("POLCYIS") >-1)){
			if(key != null && (key.substring(31,33).equals("NB") || key.substring(31,33).equals("RB") || key.substring(31,33).equals("EN"))){
				return true;
			}				
		}
		return false;
	}

	public static boolean isRulesIntegrated() {
		String rulesInstalled = SurroundProductConfig.getProperty("PINRulesInstalled");
		return "Y".equals(rulesInstalled);
	}

	public RequestPayLoad produceFirstEvent(RequestPayLoad requestPayLoad) {
		String key = (String)requestPayLoad.get("KEY");
		String LOBCd = key.substring(5, 8);
		String transCd = key.substring(31, 33);
		String RequestCd = (String)requestPayLoad.get("REQUESTCODE");
		String actionEvent;
		if(RequestCd.contains("ISSRq")){
			actionEvent = "Issue";
		} else{
			actionEvent = "Rate";
		}
		String eventNm = LOBCd + "_" + transCd + "_" + actionEvent;
		String firstEvent = SurroundProductConfig.getProperty("FirstEvent");
		if("issuePolicy".equals((String) requestPayLoad.get("screenId"))){
			firstEvent = SurroundProductConfig.getProperty(eventNm);
		}
		return produceEventPayLoad(key, firstEvent);
	}
	
	public RequestPayLoad produceUwEvent(ResponsePayLoad firstUwResp, RequestPayLoad requestPayLoad, String callType) {
		String key = (String)requestPayLoad.get("KEY");
		String event = (String)firstUwResp.get(callType.concat("Model"));
		return produceEventPayLoad(key, event);
	}
	
	public RequestPayLoad produceEventPayLoad(String key, String event){
		RequestPayLoad uwRqst = new RequestPayLoad();
		uwRqst.put("KEY" , key);
		uwRqst.put("Event" , event);
		return uwRqst;
	}

	public boolean ratingCallReqd(ResponsePayLoad uwResp, String callType) {
		String status = (String)uwResp.get("MsgStatusCd");
		String decision = (String)uwResp.get("com.csc_UnderwritingDecisionCd");
		String model = (String)uwResp.get(callType.concat("Model"));
		
		return ("Success".equals(status) && ("Accept").equals(decision) && model != null);
	}

	public void mergeUWResponse(ResponsePayLoad uwResp, RequestPayLoad requestPayLoad, String callType) {
		requestPayLoad.put("KEY_UNDERWRITER_NAME", uwc.getUnderWriter());
		requestPayLoad.put("UND_UNDERWRITING_STATUS", uwc.getStatus());
		requestPayLoad.put("UND_AUTO_UNDERWRITING_IND", "Y");
		requestPayLoad.put("UND_NAME_JASPER_MODEL", uwc.getModel());
		requestPayLoad.put("UND_EXTENDED_STATUS_1", uwc.getExtendedStatus());
		requestPayLoad.put("UNDRSN_DECISION_REASON_CODE", uwc.getUwRespStr());
		
		if("Post".equals(callType)){
			requestPayLoad.put("KEY",requestPayLoad.get("KEY")+"Y");
		}else{
			requestPayLoad.put("KEY",requestPayLoad.get("KEY")+"N");
		}
	}

	public void publishUwComponent(RequestPayLoad uwRqst, ResponsePayLoad uwResp, String callType) {
		String event = (String) uwRqst.get("Event");
		String firstEvent = SurroundProductConfig.getProperty("FirstEvent");
		
		if(firstEvent.equals(event)){
			uwc.setUnderWriter("");
			uwc.setStatus("UW");
		}else{
			String underwriter = (String)uwResp.get("getunderwriter");
			String status = (String)uwResp.get("com.csc_UnderwritingDecisionCd");
			uwc.setUnderWriter(underwriter);
			if("Accept".equals(status)){
				uwc.setStatus("UA");
			}else if("Refer".equals(status)){
				uwc.setStatus("UR");
			}else if("Decline".equals(status)){
				uwc.setStatus("UD");
			}
			
			if("Decline".equals(status) || "Refer".equals(status)){
				int i = 1;
				while(uwResp.get("com.csc_UnderwritingRuleCd"+i) != null){
					String code = (String)uwResp.get("com.csc_UnderwritingRuleCd"+i);
					String desc = (String)uwResp.get("com.csc_UnderwritingRuleDesc"+i);
					
					uwc.getUwResp().add(code.concat(desc));
					i++;
				}
			}
		}
		uwc.setModel(event);
		if("Post".equals(callType)){
			uwc.setExtendedStatus("PO");
		}else{
			uwc.setExtendedStatus("PR");
		}
	}
	
	public boolean isNotWaived() {
		return !"UW".equals(uwc.getStatus());
	}
	
	
	class UnderWritingComponent{
		String underWriter;
		String status;
		String extendedStatus;
		String model;
		List<String> uwResp;
		
		public String getUnderWriter() {
			return underWriter;
		}
		public void setUnderWriter(String underWriter) {
			if(underWriter == null || "".equals(underWriter)){
				this.underWriter = "FIRSTUWR";
			}else{
				this.underWriter = underWriter;
			}
		}
		public String getStatus() {
			return status;
		}
		public void setStatus(String status) {
			this.status = status;
		}
		public String getExtendedStatus() {
			return extendedStatus;
		}
		public void setExtendedStatus(String extendedStatus) {
			this.extendedStatus = extendedStatus;
		}
		public String getModel() {
			return model;
		}
		public void setModel(String model) {
			this.model = model;
		}
		public List<String> getUwResp() {
			if(uwResp == null){
				uwResp = new ArrayList<String>();
			}
			return uwResp;
		}
		public void setUwResp(List<String> uwResp) {
			this.uwResp = uwResp;
		}
		
		public String getUwRespStr(){
			//this method replaces the multiple messages return logic written inside xsl to java code
			//this is required as we are setting payload in a map and only one key/value pair are allowed.
			String str = "";
			List<String> uwResp = this.getUwResp();
			for(int i=0; i<uwResp.size(); i++){
				if(i == 0){
					str += padBlank(uwResp.get(i),156);
				}else{
					str += "reason    " + padBlank(uwResp.get(i),156);
				}
			}
			return str;
		}
		
		private String padBlank(String str, int length){
			while(str.length() < length){
				str += " ";
			}
			return str;
		}
	}

}
