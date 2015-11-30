<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes" method="xml" indent="no" />

	<xsl:template match="PayLoad">
		<xsl:variable name="PA_KEY_LOCATION_COMPANY">
			<xsl:value-of select="PA_KEY_LOCATION_COMPANY" />
		</xsl:variable>
		<xsl:variable name="PA_KEY_MASTER_COMPANY">
			<xsl:value-of select="PA_KEY_MASTER_COMPANY" />
		</xsl:variable>
		<xsl:variable name="PA_KEY_SYMBOL">
			<xsl:value-of select="PA_KEY_SYMBOL" />
		</xsl:variable>
		<xsl:variable name="PA_KEY_POLICY_NUMBER">
			<xsl:value-of select="PA_KEY_POLICY_NUMBER" />
		</xsl:variable>
		<xsl:variable name="PA_KEY_MODULE">
			<xsl:value-of select="PA_KEY_MODULE" />
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
							<xsl:call-template name="cvtToUpper">
								<xsl:with-param name="user" select="User" />
							</xsl:call-template>
						</CustLoginId>
					</CustId>
				</SignonPswd>
			</SignonRq>
			<InsuranceSvcRq>
				<RqUID>
					<xsl:value-of select="REQUESTCODE" />
				</RqUID>
				<xsl:element name="{concat(substring(REQUESTCODE,0,9),'Rq')}">
				<PayLoad>
					<ALR_VEHICLE_COVERAGE_ROW>
						<BASIC_CONTRACT_INFO>
							<BC_LINE_OF_BUSINESS>
								<xsl:value-of select="BC_LINE_OF_BUSINESS" />
							</BC_LINE_OF_BUSINESS>
							<BC_POLICY_COMPANY>
								<xsl:value-of select="BC_POLICY_COMPANY" />
							</BC_POLICY_COMPANY>
							<BC_AGENCY_NUMBER />
							<BC_AGENT_NAME />
							<BC_STATE>
								<xsl:value-of select="BC_STATE" />
							</BC_STATE>
							<BC_EFFECTIVE_DATE />
							<BC_EXPIRATION_DATE />
							<BC_INSURED_ADDRESS_LINE_01 />
						</BASIC_CONTRACT_INFO>
						<PROCESSING_INFO>
							<PROC_TRANSACTION_TYPE>
								<xsl:value-of select="PROC_TRANSACTION_TYPE" />
							</PROC_TRANSACTION_TYPE>
							<PROC_EFFECTIVE_DATE>
								<xsl:value-of select="PROC_EFFECTIVE_DATE" />
							</PROC_EFFECTIVE_DATE>
							<PROC_LDA_SELECT>
							</PROC_LDA_SELECT>
							<PROC_LDA_SYSTEM_DATE_OVERRIDE />
							<PROC_LDA_ACCTG_DATE />
							<PROC_LDA_TYPE_ACTIVITY />
							<PROC_SUCCESS_INDIC />
							<PROC_SPEC_USE1 />
							<PROC_SPEC_USE2 />
							<PROC_SPEC_USE3 />
							<PROC_SPEC_USE4 />
							<PROC_SPEC_USE5 />
							<KEY />
						</PROCESSING_INFO>

						<xsl:for-each select="list/PayLoad">
							<ALR_KEY>
								<KEY_LOCATION_COMPANY>
									<xsl:value-of select="$PA_KEY_LOCATION_COMPANY" />
								</KEY_LOCATION_COMPANY>
								<KEY_MASTER_COMPANY>
									<xsl:value-of select="$PA_KEY_MASTER_COMPANY" />
								</KEY_MASTER_COMPANY>
								<KEY_SYMBOL>
									<xsl:value-of select="$PA_KEY_SYMBOL" />
								</KEY_SYMBOL>
								<KEY_POLICY_NUMBER>
									<xsl:value-of select="$PA_KEY_POLICY_NUMBER" />
								</KEY_POLICY_NUMBER>
								<KEY_MODULE>
									<xsl:value-of select="$PA_KEY_MODULE" />
								</KEY_MODULE>
								<KEY_INSURANCE_LINE>
									<xsl:value-of select="BCINSLINE" />
								</KEY_INSURANCE_LINE>
								<KEY_PRODUCT>
									<xsl:value-of select="BCPRODUCT" />
								</KEY_PRODUCT>
								<KEY_RISK_LOCATION_NUMBER>
									<xsl:value-of select="BCRISKLOC" />
								</KEY_RISK_LOCATION_NUMBER>
								<KEY_RISK_SUBLOCATION_NUMBER>
									<xsl:value-of select="BCRISKSUBLOC" />
								</KEY_RISK_SUBLOCATION_NUMBER>
								<KEY_UNIT_NUMBER>
									<xsl:value-of select="BCUNIT" />
								</KEY_UNIT_NUMBER>
								<KEY_COVERAGE>
									<xsl:value-of select="BCCOVERAGE" />
								</KEY_COVERAGE>
								<KEY_COVERAGE_SEQUENCE>
									<xsl:value-of select="BCCOVERAGESEQUENCE" />
								</KEY_COVERAGE_SEQUENCE>
								<KEY_RECORD_STATUS>
									<xsl:value-of select="BCRECORDSTATUS" />
								</KEY_RECORD_STATUS>
								<KEY_DRIVER_ID />
								<KEY_DRIVER_CODE />
								<KEY_DRIVER_CODE_SEQUENCE />
							</ALR_KEY>
							<ALR_COMMON_FIELDS>
								<COM_DROP_RECORD_INDICATOR />
								<COM_DROP_RECORD_DATE>
									<xsl:value-of select="BCDROPRECORDDATE" />
								</COM_DROP_RECORD_DATE>
								<COM_AMENDMENT_NUMBER>
									<xsl:value-of select="BCAMENDMENTNUMBER" />
								</COM_AMENDMENT_NUMBER>
								<COM_LAST_CHANGE_DATE>
									<xsl:value-of select="BCLASTCHANGEDATE" />
								</COM_LAST_CHANGE_DATE>
								<COM_CHANGE_EFFECTIVE_DATE>
									<xsl:value-of select="BCCHANGEEFFECTIVEDATE" />
								</COM_CHANGE_EFFECTIVE_DATE>
								<COM_TYPE_ACTIVITY>
									<xsl:value-of select="BCTYPEACTIVITY" />
								</COM_TYPE_ACTIVITY>
								<COM_RATEBOOK_RATEFILE>
								</COM_RATEBOOK_RATEFILE>
								<COM_RATE_PREMIUM>
									<xsl:value-of select="BCRATEPREMIUM" />
								</COM_RATE_PREMIUM>
								<COM_RATE_PREMIUM2>
									<xsl:value-of select="BCRATEPREMIUM2" />
								</COM_RATE_PREMIUM2>
								<COM_RATE_PREMIUM3>
									<xsl:value-of select="BCRATEPREMIUM3" />
								</COM_RATE_PREMIUM3>
								<COM_RATE_PREMIUM4>
									<xsl:value-of select="BCRATEPREMIUM4" />
								</COM_RATE_PREMIUM4>
								<COM_AGENT_COMMISSION_OVERRIDE>
									<xsl:value-of select="BCAGENTCOMMISSIONOVER" />
								</COM_AGENT_COMMISSION_OVERRIDE>
								<COM_REQUEST_CODE>
									<xsl:value-of select="REQUESTCODE" />
								</COM_REQUEST_CODE>
							</ALR_COMMON_FIELDS>
							<ALR_PP_COVERAGE_FIELDS>
								<COV_REASON_AMENDED />
								<COV_STAT_COVERAGE_SEQUENCE>
									<xsl:value-of select="BCSTATCOVERAGESEQ" />
								</COV_STAT_COVERAGE_SEQUENCE>
								<COV_COVERAGE_LIMIT>
									<xsl:value-of select="BCCOVERAGELIMIT" />
								</COV_COVERAGE_LIMIT>
								<COV_COVERAGE_DEDUCTIBLE>
									<xsl:value-of select="BCCOVERAGEDEDUCT" />
								</COV_COVERAGE_DEDUCTIBLE>
								<COV_REINSURANCE_INDICATOR>
								</COV_REINSURANCE_INDICATOR>
								<COV_RATE_MOD_FACTOR_LIAB>
									<xsl:value-of select="BCRATEMODFACTORLIAB" />
								</COV_RATE_MOD_FACTOR_LIAB>
								<COV_RATE_MOD_FACTOR_OTC>
									<xsl:value-of select="BCRATEMODFACTOROTC" />
								</COV_RATE_MOD_FACTOR_OTC>
								<COV_RATE_MOD_FACTOR_COL>
									<xsl:value-of select="BCRATEMODFACTORCOL" />
								</COV_RATE_MOD_FACTOR_COL>
								<COV_USER_INDICATOR_1>
								</COV_USER_INDICATOR_1>
								<COV_USER_INDICATOR_2>
								</COV_USER_INDICATOR_2>
								<COV_USER_INDICATOR_3>
								</COV_USER_INDICATOR_3>
								<COV_USER_INDICATOR_4>
								</COV_USER_INDICATOR_4>
								<COV_USER_INDICATOR_5>
								</COV_USER_INDICATOR_5>
								<COV_USER_INDICATOR_6>
								</COV_USER_INDICATOR_6>
								<COV_USER_INDICATOR_7>
								</COV_USER_INDICATOR_7>
								<COV_USER_INDICATOR_8>
								</COV_USER_INDICATOR_8>
								<COV_USER_INDICATOR_9>
								</COV_USER_INDICATOR_9>
								<COV_USER_INDICATOR_10>
								</COV_USER_INDICATOR_10>
								<COV_USER_INDICATOR_11>
								</COV_USER_INDICATOR_11>
								<COV_USER_INDICATOR_12>
								</COV_USER_INDICATOR_12>
								<COV_USER_CODE_1 />
								<COV_USER_CODE_2 />
								<COV_USER_CODE_3 />
								<COV_USER_CODE_4 />
								<COV_USER_FACTOR_1>
									<xsl:value-of select="BCUSERFACTOR1" />
								</COV_USER_FACTOR_1>
								<COV_USER_FACTOR_2>
									<xsl:value-of select="BCUSERFACTOR2" />
								</COV_USER_FACTOR_2>
								<COV_USER_NUMBER_1>
									<xsl:value-of select="BCUSERNUMBER1" />
								</COV_USER_NUMBER_1>
								<COV_USER_NUMBER_2>
									<xsl:value-of select="BCUSERNUMBER2" />
								</COV_USER_NUMBER_2>
								<COV_USER_DOLLAR_1>
									<xsl:value-of select="BCUSERDOLLAR1" />
								</COV_USER_DOLLAR_1>
								<COV_USER_DOLLAR_2>
									<xsl:value-of select="BCUSERDOLLAR2" />
								</COV_USER_DOLLAR_2>
								<COV_EXPOSURE>
									<xsl:value-of select="BCEXPOSURE" />
								</COV_EXPOSURE>
								<COV_SUBLINE_OF_BUSINESS />
								<COV_DISPLAY_SEQUENCE>
									<xsl:value-of select="BCDISPLAYSEQUENCE" />
								</COV_DISPLAY_SEQUENCE>
								<COV_ERROR_MSG />
								<COV_ERROR_INDIC />
							</ALR_PP_COVERAGE_FIELDS>
						</xsl:for-each>
					</ALR_VEHICLE_COVERAGE_ROW>
				</PayLoad>
				</xsl:element>
			</InsuranceSvcRq>
		</POINTXML>

	</xsl:template>
	<xsl:template name="cvtToUpper">
		<xsl:param name="user" />
		<xsl:value-of
			select="translate($user, 'abcdefghijklmnopqrstuvwxyz', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ')" />
	</xsl:template>

</xsl:stylesheet>