<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes" method="xml" indent="no" />

	<xsl:template match="PayLoad">
		<xsl:variable name="KEY_LOCATION_COMPANY">
			<xsl:value-of select="FORMS_KEY_LOCATION_COMPANY"/>
		</xsl:variable>
		<xsl:variable name="KEY_MASTER_COMPANY">
			<xsl:value-of select="FORMS_KEY_MASTER_COMPANY"/>
		</xsl:variable>
		<xsl:variable name="KEY_SYMBOL">
			<xsl:value-of select="FORMS_KEY_SYMBOL"/>
		</xsl:variable>
		<xsl:variable name="KEY_POLICY_NUMBER">
			<xsl:value-of select="FORMS_KEY_POLICY_NUMBER"/>
		</xsl:variable>
		<xsl:variable name="KEY_MODULE">
			<xsl:value-of select="FORMS_KEY_MODULE"/>
		</xsl:variable>
		<xsl:variable name="KEY_INSURANCE_LINE">
			<xsl:value-of select="FORMS_KEY_INSURANCE_LINE"/>
		</xsl:variable>
		<xsl:variable name="KEY_FORM_SEQUENCE_NUMBER">
			<xsl:value-of select="FORMS_KEY_FORM_SEQUENCE_NUMBER"/>
		</xsl:variable>
		<xsl:variable name="KEY_RECORD_STATUS">
			<xsl:value-of select="FORMS_KEY_RECORD_STATUS"/>
		</xsl:variable>
		<xsl:variable name="UNIT_NUMBER">
			<xsl:value-of select="A_FORM_UNIT_NUMBER"/>
		</xsl:variable>
		<xsl:variable name="RISK_LOCATION_NUMBER">
			<xsl:value-of select="A_FORM_RISK_LOCATION_NUMBER"/>
		</xsl:variable>
		<xsl:variable name="RISK_SUB_LOCATION_NUMBER">
			<xsl:value-of select="A_FORM_RISK_SUB_LOCATION_NUMBER"/>
		</xsl:variable>
		
		<!-- TODO: Auto-generated template -->
		<POINTXML>

			<SignonRq>
				<ClientApp>
					<Name>PT</Name>
				</ClientApp>
				<SignonPswd>
					<CustId>
						<CustLoginId>
							<xsl:call-template name="cvtToUpper"><xsl:with-param name="user" select="User" /></xsl:call-template>
						</CustLoginId>
					</CustId>
				</SignonPswd>
			</SignonRq>

			<InsuranceSvcRq>
				<RqUID><xsl:value-of select="REQUESTCODE" /></RqUID>
				<xsl:element name="{concat(substring(REQUESTCODE,0,9),'Rq')}">
					<PayLoad>
						<ALR_FORM_RECORDS_ROW>
							<BASIC_CONTRACT_INFO>
								<BC_LINE_OF_BUSINESS><xsl:value-of select="BC_LINE_OF_BUSINESS"/></BC_LINE_OF_BUSINESS>
								<BC_POLICY_COMPANY><xsl:value-of select="BC_POLICY_COMPANY"/></BC_POLICY_COMPANY>
								<BC_AGENT_NUMBER><xsl:value-of select="BC_AGENT_NUMBER"/></BC_AGENT_NUMBER>
								<BC_STATE><xsl:value-of select="BC_STATE"/></BC_STATE>
								
							</BASIC_CONTRACT_INFO>
							<PROCESSING_INFO>
								<PROC_TRANSACTION_TYPE><xsl:value-of select="PROC_TRANSACTION_TYPE"/></PROC_TRANSACTION_TYPE>
								<PROC_PROGRAM_NAME><xsl:value-of select="PROC_PROGRAM_NAME"/></PROC_PROGRAM_NAME>
								<PROC_EFFECTIVE_DATE><xsl:value-of select="PROC_EFFECTIVE_DATE"/></PROC_EFFECTIVE_DATE>
								<PROC_LDA_SELECT><xsl:value-of select="PROC_LDA_SELECT"/></PROC_LDA_SELECT>
								<PROC_PANEL_MODE><xsl:value-of select="PROC_PANEL_MODE"/></PROC_PANEL_MODE>
								<PROC_LDA_SYSTEM_DATE_OVERRIDE><xsl:value-of select="PROC_LDA_SYSTEM_DATE_OVERRIDE"/></PROC_LDA_SYSTEM_DATE_OVERRIDE>
								<PROC_LDA_SECURITY><xsl:value-of select="PROC_LDA_SECURITY"/></PROC_LDA_SECURITY>
								<PROC_LDA_ACCTG_DATE><xsl:value-of select="PROC_LDA_ACCTG_DATE"/></PROC_LDA_ACCTG_DATE>
								<PROC_LDA_TRANSSEQ><xsl:value-of select="PROC_LDA_TRANSSEQ"/></PROC_LDA_TRANSSEQ>
								<PROC_LDA_ISSUE_CODE><xsl:value-of select="PROC_LDA_ISSUE_CODE"/></PROC_LDA_ISSUE_CODE>
								<PROC_LDA_RENEWAL_MODULE><xsl:value-of select="PROC_LDA_RENEWAL_MODULE"/></PROC_LDA_RENEWAL_MODULE>
								<PROC_LDA_TYPE_ACTIVITY><xsl:value-of select="PROC_LDA_TYPE_ACTIVITY"/></PROC_LDA_TYPE_ACTIVITY>
								<PROC_LDA_CUR_REC_SET_STATUS><xsl:value-of select="PROC_LDA_CUR_REC_SET_STATUS"/></PROC_LDA_CUR_REC_SET_STATUS>
								<PROC_LDA_RECORD_IND><xsl:value-of select="PROC_LDA_RECORD_IND"/></PROC_LDA_RECORD_IND>
								<PROC_LDA_SET_TYPE_NUMBER><xsl:value-of select="PROC_LDA_SET_TYPE_NUMBER"/></PROC_LDA_SET_TYPE_NUMBER>
								<PROC_SUCCESS_INDIC><xsl:value-of select="PROC_SUCCESS_INDIC"/></PROC_SUCCESS_INDIC>
								<target><xsl:value-of select="target"/></target>
								
							</PROCESSING_INFO>
							<xsl:for-each select="list/PayLoad">
							<ALR_KEY>
								<KEY_LOCATION_COMPANY><xsl:value-of select="$KEY_LOCATION_COMPANY"/></KEY_LOCATION_COMPANY>
								<KEY_MASTER_COMPANY><xsl:value-of select="$KEY_MASTER_COMPANY"/></KEY_MASTER_COMPANY>
								<KEY_SYMBOL><xsl:value-of select="$KEY_SYMBOL"/></KEY_SYMBOL>
								<KEY_POLICY_NUMBER><xsl:value-of select="$KEY_POLICY_NUMBER"/></KEY_POLICY_NUMBER>
								<KEY_MODULE><xsl:value-of select="$KEY_MODULE"/></KEY_MODULE>
								<KEY_INSURANCE_LINE><xsl:value-of select="$KEY_INSURANCE_LINE"/></KEY_INSURANCE_LINE>
								<KEY_FORM_SEQUENCE_NUMBER><xsl:value-of select="$KEY_FORM_SEQUENCE_NUMBER"/></KEY_FORM_SEQUENCE_NUMBER>
								<KEY_RECORD_STATUS><xsl:value-of select="$KEY_RECORD_STATUS"/></KEY_RECORD_STATUS>
							</ALR_KEY>
							<ALR_COMMON_FIELDS>
								<DROP_RECORD_INDICATOR/>
								<DROP_RECORD_DATE/>
								<FORM_NUMBER><xsl:value-of select="ATTRVALUEFORMS"/></FORM_NUMBER>
								<EDITION_DATE><xsl:value-of select="EDITION_DATE"/></EDITION_DATE>
								<UNIT_NUMBER><xsl:value-of select="$UNIT_NUMBER"/></UNIT_NUMBER>
								<ACTION_CODE/>
								<RISK_LOCATION_NUMBER><xsl:value-of select="$RISK_LOCATION_NUMBER"/></RISK_LOCATION_NUMBER>
								<RISK_SUB_LOCATION_NUMBER><xsl:value-of select="$RISK_SUB_LOCATION_NUMBER"/></RISK_SUB_LOCATION_NUMBER>
								<RATEBOOK_KEY_DEFINITION/>
								<COM_REQUEST_CODE>CPPFORMSADDRq</COM_REQUEST_CODE>
							</ALR_COMMON_FIELDS>
							</xsl:for-each>
						</ALR_FORM_RECORDS_ROW>
					</PayLoad>
				</xsl:element>
			</InsuranceSvcRq>
		</POINTXML>
	</xsl:template>
	<xsl:template name="cvtToUpper">
		<xsl:param name="user"/>
		<xsl:value-of select="translate($user, 'abcdefghijklmnopqrstuvwxyz', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ')" />
	</xsl:template>
	
</xsl:stylesheet>