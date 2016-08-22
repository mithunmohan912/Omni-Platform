<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes" method="xml" indent="no" />

	<xsl:template match="PayLoad">
	
		<xsl:variable name="LOCATION">
			<xsl:value-of select="BC_KEY_LOCATION"/>
		</xsl:variable>
		<xsl:variable name="MASTER_COMPANY">
			<xsl:value-of select="BC_KEY_MASTER_COMPANY"/>
		</xsl:variable>
		<xsl:variable name="SYMBOL">
			<xsl:value-of select="BC_KEY_SYMBOL"/>
		</xsl:variable>
		<xsl:variable name="POLICY_NUMBER">
			<xsl:value-of select="BC_KEY_POLICY_NUMBER"/>
		</xsl:variable>
		<xsl:variable name="MODULE">
			<xsl:value-of select="BC_KEY_MODULE"/>
		</xsl:variable>
		<xsl:variable name="LOB">
			<xsl:value-of select="BC_LINE_OF_BUSINESS"/>
		</xsl:variable>
		<xsl:variable name="PCO">
			<xsl:value-of select="BC_POLICY_COMPANY"/>
		</xsl:variable>
		<xsl:variable name="STATE">
			<xsl:value-of select="BC_STATE"/>
		</xsl:variable>
		<xsl:variable name="EFFECTIVE_DATE">
			<xsl:value-of select="BC_EFFECTIVE_DATE"/>
		</xsl:variable>
		<xsl:variable name="KEY">
			<xsl:value-of select="fullkey"/>
		</xsl:variable>
		
		
		
		<POINTXML>
			<SignonRq>
				<ClientApp>
					<Name>PT</Name>
				</ClientApp>
				<SignonPswd>
					<CustId>
						<CustLoginId>
							<xsl:value-of select="user" />
						</CustLoginId>
					</CustId>
				</SignonPswd>
			</SignonRq>
			<InsuranceSvcRq>
				<RqUID>CPPUNITSSTRRq</RqUID>
				<CPPUNITSRq>
					<PayLoad>
						<!-- <xsl:element name="{concat(substring(REQUESTCODE,0,string-length(REQUESTCODE)-4),'Rq')}"> -->

						<ALR_IMPLEMENTED_RECORD_ROW>
							<BASIC_CONTRACT_INFO>
								<BC_LINE_OF_BUSINESS><xsl:value-of select="substring($KEY,17,3)" /></BC_LINE_OF_BUSINESS>
								<BC_POLICY_COMPANY ><xsl:value-of select="substring($KEY,20,2)" /></BC_POLICY_COMPANY>
								<BC_AGENT_NUMBER/>
								<BC_STATE><xsl:value-of select="$STATE" /></BC_STATE>
							</BASIC_CONTRACT_INFO>
							<PROCESSING_INFO>
								<PROC_TRANSACTION_TYPE />
								<PROC_PROGRAM_NAME></PROC_PROGRAM_NAME>
								<PROC_EFFECTIVE_DATE ><xsl:value-of select="$EFFECTIVE_DATE" /></PROC_EFFECTIVE_DATE>
								<PROC_LDA_SELECT />
								<PROC_PANEL_MODE />
								<PROC_LDA_SYSTEM_DATE_OVERRIDE></PROC_LDA_SYSTEM_DATE_OVERRIDE>
								<PROC_LDA_SECURITY />
								<PROC_LDA_ACCTG_DATE></PROC_LDA_ACCTG_DATE>
								<PROC_LDA_TRANSSEQ></PROC_LDA_TRANSSEQ>
								<PROC_LDA_ISSUE_CODE />
								<PROC_LDA_RENEWAL_MODULE />
								<PROC_LDA_TYPE_ACTIVITY />
								<PROC_LDA_CUR_REC_SET_STATUS />
								<PROC_LDA_RECORD_IND />
								<PROC_LDA_SET_TYPE_NUMBER></PROC_LDA_SET_TYPE_NUMBER>
								<PROC_SUCCESS_INDIC />
								<target>PolCppUnitListGrid.jsp</target>
								<TOTAL_PREMIUM/>
								<TOTAL_ROWS/>
								<SORT_INDIC/>
							</PROCESSING_INFO>
							<xsl:for-each select="list/PayLoad">
								<ALR_KEY>
									<KEY_LOCATION_COMPANY><xsl:value-of select="substring($KEY,1,2)" /></KEY_LOCATION_COMPANY>
									<KEY_MASTER_COMPANY><xsl:value-of select="substring($KEY,3,2)" /></KEY_MASTER_COMPANY>
									<KEY_SYMBOL><xsl:value-of select="substring($KEY,5,3)" /></KEY_SYMBOL>
									<KEY_POLICY_NUMBER><xsl:value-of select="substring($KEY,8,7)" /></KEY_POLICY_NUMBER>
									<KEY_MODULE><xsl:value-of select="substring($KEY,15,2)" /></KEY_MODULE>
									
									<KEY_INSURANCE_LINE><xsl:value-of select="UNPRODUCT" /></KEY_INSURANCE_LINE>
									
									<KEY_RATE_STATE><xsl:value-of select="UNRATESTATE" /></KEY_RATE_STATE>
									<KEY_PRODUCT><xsl:value-of select="UNPRODUCT" /></KEY_PRODUCT>
									<KEY_RISK_LOCATION_NUMBER><xsl:value-of select="UNRISKLOCATION" /></KEY_RISK_LOCATION_NUMBER>
									<KEY_RISK_SUBLOCATION_NUMBER><xsl:value-of select="UNSUBLOCATION" /></KEY_RISK_SUBLOCATION_NUMBER>
									<KEY_UNIT_NUMBER><xsl:value-of select="UNUNITNUMBER" /></KEY_UNIT_NUMBER>
									<KEY_COVERAGE/>
									<KEY_COVERAGE_SEQUENCE/>
									<KEY_ITEM/>
									<KEY_ITEM_SEQUENCE/>
									<KEY_RECORD_STATUS><xsl:value-of select="substring(UNRECSTATUSDESC,1,1)" /></KEY_RECORD_STATUS>
								</ALR_KEY>
								<ALR_COMMON_FIELDS>
									<DROP_RECORD_INDICATOR/>
									<DROP_RECORD_DATE/>
									<AMENDMENT_NUMBER/>
									<LAST_CHANGE_DATE/>
									<CHANGE_EFFECTIVE_DATE/>
									<TYPE_ACTIVITY>N</TYPE_ACTIVITY>
									<REASON_AMENDED/>
									<RATEBOOK_RATEFILE/>
									<RATE_PREMIUM><xsl:value-of select="UNRATEPREMIUM" /></RATE_PREMIUM>
									<RATE_PREMIUM2/>
									<RATE_PREMIUM3/>
									<RATE_PREMIUM4/>
									<AGENT_COMMISSION_OVERRIDE/>
									<UNIT_YEAR><xsl:value-of select="UNUNITYEAR" /></UNIT_YEAR>
									<UNIT_DESCRIPTION_1/>
									<UNIT_DESCRIPTION_2><xsl:value-of select="UNUNITVIN" /></UNIT_DESCRIPTION_2>
									<ITEM_DESCRIPTION_1/>
									<ITEM_DESCRIPTION_2/>
									<ITEM_DESCRIPTION_3/>
									<ITEM_DESCRIPTION_4/>
									<ITEM_DESCRIPTION_5/>
									<COM_REQUEST_CODE>CPPUNITSVCHRq</COM_REQUEST_CODE>
									<COM_ERROR_MSG/>
									<COM_ERROR_INDIC/>
									<COM_STATUS><xsl:value-of select="UNRECSTATUSDESC" /></COM_STATUS>
									<DROP_DOWN_FLAG>V</DROP_DOWN_FLAG>
								</ALR_COMMON_FIELDS>
							</xsl:for-each>
						</ALR_IMPLEMENTED_RECORD_ROW>
					</PayLoad>
				</CPPUNITSRq>				
			</InsuranceSvcRq>
		</POINTXML>
	</xsl:template>
</xsl:stylesheet>