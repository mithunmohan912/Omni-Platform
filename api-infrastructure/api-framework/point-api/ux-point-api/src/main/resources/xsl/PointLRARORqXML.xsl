<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes" method="xml" indent="no" />

	<xsl:template match="PayLoad">

		<xsl:variable name="SYMBOL">
			<xsl:value-of select="SYMBOL"/>
		</xsl:variable>

		<xsl:variable name="POLNUM">
			<xsl:value-of select="POLNUM"/>
		</xsl:variable>

		<xsl:variable name="MODULE">
			<xsl:value-of select="MODULE"/>
		</xsl:variable>
		
		<xsl:variable name="MASTERLOC">
        	<xsl:value-of select="MASTERLOC"/>
   		</xsl:variable>
   		
   		<xsl:variable name="LOC">
        	<xsl:value-of select="LOC"/>
   		</xsl:variable>
   		
   		<xsl:variable name="TRANSMODE">
        	<xsl:value-of select="TRANSMODE"/>
   		</xsl:variable>
   		
   		<xsl:variable name="POLENDTE">
        	<xsl:value-of select="POLENDTE"/>
   		</xsl:variable>
   		
   		<xsl:variable name="POLEFFDTE">
        	<xsl:value-of select="POLEFFDTE"/>
   		</xsl:variable>
   		
   		<xsl:variable name="STATENUMBER">
        	<xsl:value-of select="STATENUMBER"/>
   		</xsl:variable>
   		
   		<xsl:variable name="STATUS">
        	<xsl:value-of select="STATUS"/>
   		</xsl:variable>
   		
   		<xsl:variable name="STATEMODTYPE">
        	<xsl:value-of select="STATEMODTYPE"/>
   		</xsl:variable>
   		
   		<xsl:variable name="OPSEQ">
        	<xsl:value-of select="OPSEQ"/>
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

				<RqUID>BASLRAROADDRq</RqUID>

				<xsl:element
					name="{concat(substring(REQUESTCODE,0,string-length(REQUESTCODE)-4),'Rq')}">

					<PayLoad>
						<WCV_LRARO_RECORDS_ROW>
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


									<KEY_POLICY_STATUS>
										<xsl:value-of select="$STATUS" />
									</KEY_POLICY_STATUS>
									<KEY_POLICY_SYMBOL>
										<xsl:value-of select="$SYMBOL" />
									</KEY_POLICY_SYMBOL>
									<KEY_POLICY_NUMBER>
										<xsl:value-of select="$POLNUM" />
									</KEY_POLICY_NUMBER>
									<KEY_POLICY_MODULE>
										<xsl:value-of select="$MODULE" />
									</KEY_POLICY_MODULE>
									<KEY_MCO>
										<xsl:value-of select="$MASTERLOC" />
									</KEY_MCO>
									<KEY_LOCATION>
										<xsl:value-of select="$LOC" />
									</KEY_LOCATION>
									<KEY_STATE_NUMBER>
										<xsl:value-of select="STATECODE" />
									</KEY_STATE_NUMBER>
									<KEY_MODTYPE><xsl:value-of select="$STATEMODTYPE" /></KEY_MODTYPE>
									<KEY_WCV_CLASS_ADJUST_FACTOR><xsl:value-of select="KEYWCVCLASSADJUSTFACTOR" /></KEY_WCV_CLASS_ADJUST_FACTOR>
									<KEY_WCV_FORTERR_FILE_RATE><xsl:value-of select="TFRATE" /></KEY_WCV_FORTERR_FILE_RATE> 
									<KEY_WCV_DOMTERR_FILE_RATE><xsl:value-of select="CATTFRATE" /></KEY_WCV_DOMTERR_FILE_RATE> 
									<KEY_WCV_FORTERR_RATE_OVERR><xsl:value-of select="KEYWCVFORTERRRATEOVERR" /></KEY_WCV_FORTERR_RATE_OVERR> 
									<KEY_WCV_DOMTERR_RATE_OVERR><xsl:value-of select="KEYWCVDOMTERRRATEOVERR" /></KEY_WCV_DOMTERR_RATE_OVERR> 
									<KEY_RATE2>0.000000</KEY_RATE2>
									<KEY_FLATAMT>0</KEY_FLATAMT>
									<KEY_DELPND>0</KEY_DELPND>
									<KEY_ENDEFFDATE><xsl:value-of select="$POLEFFDTE" /></KEY_ENDEFFDATE>
									<KEY_POLICY_TYPE><xsl:value-of select="$TRANSMODE" /></KEY_POLICY_TYPE>
									<KEY_POLICY_ENDORESEMENT_DATE><xsl:value-of select="$POLENDTE" /></KEY_POLICY_ENDORESEMENT_DATE>
									<KEY_OPRATESEQ><xsl:value-of select="$OPSEQ" /></KEY_OPRATESEQ>

								</KEY_FIELDS_ROW>

							</xsl:for-each>

						</WCV_LRARO_RECORDS_ROW>
					</PayLoad>

				</xsl:element>

			</InsuranceSvcRq>
		</POINTXML>

	</xsl:template>
</xsl:stylesheet>