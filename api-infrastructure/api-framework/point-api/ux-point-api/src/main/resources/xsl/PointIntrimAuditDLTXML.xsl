<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes" method="xml" indent="no" />

	<xsl:template match="PayLoad">

		<xsl:variable name="KEY_LOCATION">
			<xsl:value-of select="KEY_LOCATION"/>
		</xsl:variable>

		<xsl:variable name="KEY_MCO">
			<xsl:value-of select="KEY_MCO"/>
		</xsl:variable>

		<xsl:variable name="KEY_POLICY_SYMBOL">
			<xsl:value-of select="KEY_POLICY_SYMBOL"/>
		</xsl:variable>
		
		<xsl:variable name="KEY_POLICY_NUMBER">
        	<xsl:value-of select="KEY_POLICY_NUMBER"/>
   		</xsl:variable>
   		
   		<xsl:variable name="KEY_POLICY_MODULE">
        	<xsl:value-of select="KEY_POLICY_MODULE"/>
   		</xsl:variable>
   		
   		<xsl:variable name="KEY_SITE_NUMBER">
        	<xsl:value-of select="KEY_SITE_NUMBER"/>
   		</xsl:variable>
   		
   		<xsl:variable name="KEY_STATE_NUMBER">
        	<xsl:value-of select="KEY_STATE_NUMBER"/>
   		</xsl:variable>
   		
   		<xsl:variable name="REQUEST_CODE">
        	<xsl:value-of select="REQUESTCODE"/>
   		</xsl:variable>

		
		<POINTXML>

			<SignonRq>
				<ClientApp>
					<Name>PT</Name>
				</ClientApp>
				<SignonPswd>
					<CustId>
						<CustLoginId>
							<xsl:value-of select="User" />
						</CustLoginId>
					</CustId>
				</SignonPswd>
				<rulesIntegrated>Y</rulesIntegrated>
				<com.csc_SessKey>
					<xsl:value-of select="sessionKey" />
				</com.csc_SessKey>
			</SignonRq>

			<InsuranceSvcRq>

				<RqUID>WCVAUDPDDFTRq</RqUID>
				<WCVAUDPDRq>
				<!-- <xsl:element name="{concat(substring(REQUESTCODE,0,string-length(REQUESTCODE)-4),'Rq')}"> -->

					<PayLoad>
						<WC_AUDIT_FIELDS_RECORDS_ROW>
							<BASIC_CONTRACT_INFO>
								<BC_LINE_OF_BUSINESS />
								<BC_POLICY_COMPANY />
								<BC_STATE />
							</BASIC_CONTRACT_INFO>
							<PROCESSING_INFO>
								<PROC_TRANSACTION_TYPE />
								<PROC_EFFECTIVE_DATE />
								<PROC_PROGRAM_NAME />
								<PROC_LDA_SELECT />
								<PROC_PANEL_MODE />
								<PROC_LDA_SYSTEM_DATE_OVERRIDE />
								<PROC_LDA_SECURITY />
								<PROC_LDA_ACCTG_DATE />
								<PROC_LDA_TRANSSEQ />
								<PROC_LDA_ISSUE_CODE />
								<PROC_LDA_RENEWAL_MODULE />
								<PROC_LDA_TYPE_ACTIVITY />
								<PROC_LDA_CUR_REC_SET_STATUS />
								<PROC_LDA_RECORD_IND />
								<PROC_LDA_SET_TYPE_NUMBER />
								<PROC_SUCCESS_INDIC />

							</PROCESSING_INFO>

							<xsl:for-each select="list/PayLoad">
																
								<KEY_FIELDS_ROW>
									<KEY_LOCATION><xsl:value-of select="$KEY_LOCATION" /></KEY_LOCATION>
									<KEY_MCO><xsl:value-of select="$KEY_MCO" /></KEY_MCO>
									<KEY_POLICY_SYMBOL><xsl:value-of select="$KEY_POLICY_SYMBOL" /></KEY_POLICY_SYMBOL>
									<KEY_POLICY_NUMBER><xsl:value-of select="$KEY_POLICY_NUMBER" /></KEY_POLICY_NUMBER>
									<KEY_POLICY_MODULE><xsl:value-of select="$KEY_POLICY_MODULE" /></KEY_POLICY_MODULE>
									<KEY_SITE_NUMBER><xsl:value-of select="$KEY_SITE_NUMBER" /></KEY_SITE_NUMBER>
									<AUDIT_EXPIRATION_DATE><xsl:value-of select="AUDEXPDTE" /></AUDIT_EXPIRATION_DATE>
									<KEY_AUDIT_EFFECTIVE_DATE><xsl:value-of select="AUDEFFDTE" /></KEY_AUDIT_EFFECTIVE_DATE>
									<KEY_AUDIT_KIND><xsl:value-of select="AUDKIND" /></KEY_AUDIT_KIND>
									
									<KEY_AUDIT_KIND_DESC><xsl:value-of select="COMAUDKINDDESCRIPTION" /></KEY_AUDIT_KIND_DESC>
									
									<KEY_STATE_NUMBER><xsl:value-of select="$KEY_STATE_NUMBER" /></KEY_STATE_NUMBER>
									<AUDIT_STATUS><xsl:value-of select="COMAUDSTATUSDESCRIPTION" /></AUDIT_STATUS>
									
									
									<KEY_POLICY_RATING_WC_STATUS/>
									<KEY_STATE_WC_STATUS/>
									<KEY_MODIFIER_WC_STATUS/>
									<KEY_MODIFIER_TYPE/>
									<KEY_MODIFIER_RATE_OPTION/>
									<KEY_MOD_END_EFFECTIVE_DATE/>
									<KEY_EMP_COVERAGE_SEQ/>
									<KEY_EMP_CLASS_CODE/>
									<KEY_EMP_CLASS_V_C_INDICATOR/>
									<KEY_EMP_CLASS_DESCRIPTION_SEQ/>
									
								</KEY_FIELDS_ROW>
								<WC_COMMON_FIELDS_ROW>
									<COM_STATUS_DESCRIPTION></COM_STATUS_DESCRIPTION>
									<COM_REQUEST_CODE><xsl:value-of select="$REQUEST_CODE" /></COM_REQUEST_CODE>
									<COM_LOB_DESCRIPTION/>
									<COM_STATE_DESCRIPTION/>
									<COM_EMP_CLASS_DESCRIPTION/>
									<COM_AUD_KIND_DESCRIPTION/>
									<COM_AUD_STATUS_DESCRIPTION/>
									<COM_AUD_PRINT_REQ_DESCRIPTION/>
									<COM_CLASS_TYPE_COVERAGE_CODE/>
									<COM_TYPE_OF_BUSINESS_DESC/>
									<COM_ARAP_DISP_INDIC/>
									<COM_EMOD_DISP_INDIC/>
									<COM_ANV_RATED_DISP_INDIC/>
									<COM_AUD_EXPIRATION_DISP_INDIC/>
									<COM_AUD_PREM_ENTRY_INDIC/>
									<COM_ERROR_IND/>
									<COM_ERROR/>
								</WC_COMMON_FIELDS_ROW>
								
								<AUDIT_TYPE_PERIOD_ROW>
									<AUDIT_AUDITOR/>
									<AUDIT_COST>0</AUDIT_COST>
									<ALLOW_DELETE_INDIC><xsl:value-of select="ALLOWDELETESW" /></ALLOW_DELETE_INDIC>
									<ALLOW_REPRINT_INDIC><xsl:value-of select="ALLOWREPRINTSW" /></ALLOW_REPRINT_INDIC>
									<ALLOW_CHANGE_INDIC><xsl:value-of select="ALLOWCHANGESW" /></ALLOW_CHANGE_INDIC>
								</AUDIT_TYPE_PERIOD_ROW>
								<WC_AUD_EXPOSURE_ROW>
									<A_EMP_SITE_NAME/>
								</WC_AUD_EXPOSURE_ROW>

							</xsl:for-each>
							
						</WC_AUDIT_FIELDS_RECORDS_ROW>
					</PayLoad>

				<!-- </xsl:element> -->
				</WCVAUDPDRq>

			</InsuranceSvcRq>
		</POINTXML>

	</xsl:template>
</xsl:stylesheet>