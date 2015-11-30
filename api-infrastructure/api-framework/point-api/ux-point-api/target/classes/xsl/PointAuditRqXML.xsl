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
   		
   		<xsl:variable name="KEY_EMP_CLASS_CODE">
        	<xsl:value-of select="KEY_EMP_CLASS_CODE"/>
   		</xsl:variable>
   		
   		<xsl:variable name="KEY_EMP_CLASS_V_C_INDICATOR">
        	<xsl:value-of select="KEY_EMP_CLASS_V_C_INDICATOR"/>
   		</xsl:variable>
   		
   		<xsl:variable name="KEY_EMP_CLASS_DESCRIPTION_SEQ">
        	<xsl:value-of select="KEY_EMP_CLASS_DESCRIPTION_SEQ"/>
   		</xsl:variable>
   		
   		<xsl:variable name="KEY_AUDIT_EFFECTIVE_DATE">
        	<xsl:value-of select="KEY_AUDIT_EFFECTIVE_DATE"/>
   		</xsl:variable>
		
		<xsl:variable name="KEY_AUDIT_KIND">
        	<xsl:value-of select="KEY_AUDIT_KIND"/>
   		</xsl:variable>
		
		<xsl:variable name="KEY_STATE_NUMBER">
        	<xsl:value-of select="KEY_STATE_NUMBER"/>
   		</xsl:variable>

		<xsl:variable name="KEY_EMP_COVERAGE_SEQ">
        	<xsl:value-of select="KEY_EMP_COVERAGE_SEQ"/>
   		</xsl:variable>

		<xsl:variable name="AUDIT_REPORT_DATE">
        	<xsl:value-of select="AUDIT_REPORT_DATE"/>
   		</xsl:variable>

		<xsl:variable name="COM_STATUS_DESCRIPTION">
        	<xsl:value-of select="COM_STATUS_DESCRIPTION"/>
   		</xsl:variable>
		
		<xsl:variable name="AUDIT_EXPIRATION_DATE">
        	<xsl:value-of select="AUDIT_EXPIRATION_DATE"/>
   		</xsl:variable>
		
		<xsl:variable name="AUDIT_AUDITOR">
			<xsl:value-of select="AUDIT_AUDITOR"/>
		</xsl:variable>
		
		<xsl:variable name="AUDITCOST">
        	<xsl:value-of select="AUDITCOST"/>
   		</xsl:variable>
   		
   		<xsl:variable name="KEY_MOD_END_EFFECTIVE_DATE">
        	<xsl:value-of select="KEY_MOD_END_EFFECTIVE_DATE"/>
   		</xsl:variable>
   		
   		<xsl:variable name="A_EMP_SITE_NAME">
        	<xsl:value-of select="A_EMP_SITE_NAME"/>
   		</xsl:variable>
   		
   		<xsl:variable name="COM_LOB_DESCRIPTION">
        	<xsl:value-of select="COM_LOB_DESCRIPTION"/>
   		</xsl:variable>
   		
   		<xsl:variable name="COM_STATE_DESCRIPTION">
        	<xsl:value-of select="COM_STATE_DESCRIPTION"/>
   		</xsl:variable>
   		
   		<xsl:variable name="REQUESTCODE">
        	<xsl:value-of select="REQUESTCODE"/>
   		</xsl:variable>
   		
   		<xsl:variable name="PROC_PROGRAM_NAME">
        	<xsl:value-of select="PROC_PROGRAM_NAME"/>
   		</xsl:variable>

		<xsl:variable name="ROW_RQST">
  			<xsl:choose>
				<xsl:when test="count(TMPREQUESTCODE) > 0">
					<xsl:value-of select="TMPREQUESTCODE" />
				</xsl:when>
				<xsl:otherwise>
					<xsl:value-of select="$REQUESTCODE" />
				</xsl:otherwise>
			</xsl:choose>
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

				<RqUID><xsl:value-of select="$REQUESTCODE" /></RqUID>
				<WCVAUDITRq>
				<!-- <xsl:element name="{concat(substring(REQUESTCODE,0,string-length(REQUESTCODE)-4),'Rq')}"> -->

					<PayLoad>
						<WC_AUDIT_CLASS_EXP_RECORDS_ROW>
							<BASIC_CONTRACT_INFO>
								<BC_LINE_OF_BUSINESS />
								<BC_POLICY_COMPANY />
								<BC_STATE />
							</BASIC_CONTRACT_INFO>
							<PROCESSING_INFO>
								<PROC_TRANSACTION_TYPE />
								<PROC_EFFECTIVE_DATE />
								<PROC_PROGRAM_NAME><xsl:value-of select="$PROC_PROGRAM_NAME" /></PROC_PROGRAM_NAME>
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
								
						   		<xsl:variable name="FIRST_ROW_INDIC">
        							<xsl:choose>
										<xsl:when test="count(FIRSTROWINDIC) > 0">
											<xsl:value-of select="FIRSTROWINDIC" />
										</xsl:when>
										<xsl:otherwise>
											<xsl:value-of select="'N'" />
										</xsl:otherwise>
									</xsl:choose>
						   		</xsl:variable>
								
								<KEY_FIELDS_ROW>
									<KEY_LOCATION><xsl:value-of select="$KEY_LOCATION" /></KEY_LOCATION>
									<KEY_MCO><xsl:value-of select="$KEY_MCO" /></KEY_MCO>
									<KEY_POLICY_SYMBOL><xsl:value-of select="$KEY_POLICY_SYMBOL" /></KEY_POLICY_SYMBOL>
									<KEY_POLICY_NUMBER><xsl:value-of select="$KEY_POLICY_NUMBER" /></KEY_POLICY_NUMBER>
									<KEY_POLICY_MODULE><xsl:value-of select="$KEY_POLICY_MODULE" /></KEY_POLICY_MODULE>
									<KEY_SITE_NUMBER><xsl:value-of select="$KEY_SITE_NUMBER" /></KEY_SITE_NUMBER>
									<KEY_EMP_CLASS_CODE><xsl:value-of select="CLASSDDS" /></KEY_EMP_CLASS_CODE>
									<KEY_EMP_CLASS_V_C_INDICATOR><xsl:value-of select="VOLIND" /></KEY_EMP_CLASS_V_C_INDICATOR>
									<KEY_EMP_CLASS_DESCRIPTION_SEQ><xsl:value-of select="DESCRIPTIONSEQ" /></KEY_EMP_CLASS_DESCRIPTION_SEQ>
									<KEY_USE_CODE><xsl:value-of select="ADDLINTERESTCODE" /></KEY_USE_CODE>
									<KEY_SEQUENCE_NUMBER><xsl:value-of select="ADDLINTERESTCDSEQ" /></KEY_SEQUENCE_NUMBER>
									<KEY_EMP_STATUS><xsl:value-of select="NAMED" /></KEY_EMP_STATUS>
									<KEY_AUDIT_EFFECTIVE_DATE><xsl:value-of select="$KEY_AUDIT_EFFECTIVE_DATE" /></KEY_AUDIT_EFFECTIVE_DATE>
									<KEY_AUDIT_KIND><xsl:value-of select="$KEY_AUDIT_KIND" /></KEY_AUDIT_KIND>
									<KEY_POLICY_RATING_WC_STATUS/>
									<KEY_STATE_NUMBER><xsl:value-of select="$KEY_STATE_NUMBER" /></KEY_STATE_NUMBER>
									<KEY_STATE_WC_STATUS/>
									<KEY_MODIFIER_WC_STATUS/>
									<KEY_MODIFIER_TYPE/>
									<KEY_MODIFIER_RATE_OPTION/>
									<KEY_MOD_END_EFFECTIVE_DATE/>
									<KEY_EMP_COVERAGE_SEQ><xsl:value-of select="COVSEQ" /></KEY_EMP_COVERAGE_SEQ>
								</KEY_FIELDS_ROW>
								<WC_AUD_EXPOSURE_ROW>
									<A_EMP_CLASS_WCSTATUS><xsl:value-of select="STATUSDESC" /></A_EMP_CLASS_WCSTATUS> 
									<A_EMP_CLASS_PAYROLL_AMOUNT><xsl:value-of select="RPTPAYROLL" /></A_EMP_CLASS_PAYROLL_AMOUNT>
									<A_EMP_CLASS_RATE><xsl:value-of select="RATE" /></A_EMP_CLASS_RATE>
									<A_EMP_CLASS_RATE_OVR_IND><xsl:value-of select="RATEOV" /></A_EMP_CLASS_RATE_OVR_IND>
									<A_EMP_CLASS_PREMIUM><xsl:value-of select="AUDPREM" /></A_EMP_CLASS_PREMIUM>
									<A_EMP_CLASS_DELETE_IND><xsl:value-of select="DELCOVIND" /></A_EMP_CLASS_DELETE_IND>
									<A_EMP_CLASS_RATE_BASIS><xsl:value-of select="BASIS" /></A_EMP_CLASS_RATE_BASIS>
									<A_EMP_SITE_NAME/>
								</WC_AUD_EXPOSURE_ROW>
								<AUDIT_TYPE_PERIOD_ROW>
									<AUDIT_REPORT_DATE><xsl:call-template name="cvtdateCYYMMDDtoMMDDYY"><xsl:with-param name="datefld" select="$AUDIT_REPORT_DATE" /></xsl:call-template></AUDIT_REPORT_DATE>
									<AUDIT_AUDITOR><xsl:value-of select="$AUDIT_AUDITOR" /></AUDIT_AUDITOR>
									<AUDIT_STATUS><xsl:value-of select="substring($COM_STATUS_DESCRIPTION,1,1)" /></AUDIT_STATUS>
									<AUDIT_COST><xsl:value-of select="$AUDITCOST" /></AUDIT_COST>									
									<AUDIT_EXPIRATION_DATE><xsl:value-of select="$AUDIT_EXPIRATION_DATE" /></AUDIT_EXPIRATION_DATE>
								</AUDIT_TYPE_PERIOD_ROW>
								<WC_COMMON_FIELDS_ROW>
									<COM_STATUS_DESCRIPTION><xsl:value-of select="STATUSDESC" /></COM_STATUS_DESCRIPTION>
									<COM_EMP_CLASS_DESCRIPTION><xsl:value-of select="CLASSDESCRIPTION" /></COM_EMP_CLASS_DESCRIPTION>
									<COM_CLASS_TYPE_COVERAGE_CODE><xsl:value-of select="COVCDE" /></COM_CLASS_TYPE_COVERAGE_CODE>
									<COM_CLASS_TYPE_COVERAGE_DESC><xsl:value-of select="COVCODEDESCRIPTION" /></COM_CLASS_TYPE_COVERAGE_DESC>
									<COM_REQUEST_CODE><xsl:value-of select="$ROW_RQST" /></COM_REQUEST_CODE>
									<COM_LOB_DESCRIPTION/>
									<COM_STATE_DESCRIPTION/>
									<COM_AUD_KIND_DESCRIPTION/>
									<COM_AUD_STATUS_DESCRIPTION/>
									<COM_AUD_PRINT_REQ_DESCRIPTION/>
									<COM_TYPE_OF_BUSINESS_DESC/>
									<COM_ARAP_DISP_INDIC/>
									<COM_EMOD_DISP_INDIC/>
									<COM_ANV_RATED_DISP_INDIC/>
									<COM_AUD_EXPIRATION_DISP_INDIC/>
									<COM_AUD_PREM_ENTRY_INDIC><xsl:value-of select="ESTENTRYTHISCLASSSW" /></COM_AUD_PREM_ENTRY_INDIC>
									<COM_ALLOW_UNDO_INDIC><xsl:value-of select="ALLOWUNDOSW" /></COM_ALLOW_UNDO_INDIC>
									<COM_ALLOW_REC_DISPLAY_INDIC>Y</COM_ALLOW_REC_DISPLAY_INDIC>
									<COM_ADDED_REC_INDIC>N</COM_ADDED_REC_INDIC>
									<COM_FIRST_ROW_INDIC><xsl:value-of select="$FIRST_ROW_INDIC"/></COM_FIRST_ROW_INDIC>
									<COM_ERROR_INDIC>N</COM_ERROR_INDIC>
									<COM_ERROR/>
								</WC_COMMON_FIELDS_ROW>

							</xsl:for-each>
							
							<KEY_FIELDS_ROW>
									<KEY_LOCATION><xsl:value-of select="$KEY_LOCATION" /></KEY_LOCATION>
									<KEY_MCO><xsl:value-of select="$KEY_MCO" /></KEY_MCO>
									<KEY_POLICY_SYMBOL><xsl:value-of select="$KEY_POLICY_SYMBOL" /></KEY_POLICY_SYMBOL>
									<KEY_POLICY_NUMBER><xsl:value-of select="$KEY_POLICY_NUMBER" /></KEY_POLICY_NUMBER>
									<KEY_POLICY_MODULE><xsl:value-of select="$KEY_POLICY_MODULE" /></KEY_POLICY_MODULE>
									<KEY_SITE_NUMBER><xsl:value-of select="$KEY_SITE_NUMBER" /></KEY_SITE_NUMBER>
									<KEY_EMP_CLASS_CODE>DUMMY</KEY_EMP_CLASS_CODE>
									<KEY_EMP_CLASS_V_C_INDICATOR>N</KEY_EMP_CLASS_V_C_INDICATOR>
									<KEY_EMP_CLASS_DESCRIPTION_SEQ>01</KEY_EMP_CLASS_DESCRIPTION_SEQ>
									<KEY_USE_CODE/>
									<KEY_SEQUENCE_NUMBER>00001</KEY_SEQUENCE_NUMBER>
									<KEY_EMP_STATUS/>
									<KEY_AUDIT_EFFECTIVE_DATE><xsl:value-of select="$KEY_AUDIT_EFFECTIVE_DATE" /></KEY_AUDIT_EFFECTIVE_DATE>
									<KEY_AUDIT_KIND><xsl:value-of select="$KEY_AUDIT_KIND" /></KEY_AUDIT_KIND>
									<KEY_POLICY_RATING_WC_STATUS/>
									<KEY_STATE_NUMBER><xsl:value-of select="$KEY_STATE_NUMBER" /></KEY_STATE_NUMBER>
									<KEY_STATE_WC_STATUS/>
									<KEY_MODIFIER_WC_STATUS/>
									<KEY_MODIFIER_TYPE/>
									<KEY_MODIFIER_RATE_OPTION/>
									<KEY_MOD_END_EFFECTIVE_DATE/>
									<KEY_EMP_COVERAGE_SEQ>0001</KEY_EMP_COVERAGE_SEQ>
								</KEY_FIELDS_ROW>
								<WC_AUD_EXPOSURE_ROW>
									<A_EMP_CLASS_WCSTATUS/> 
									<A_EMP_CLASS_PAYROLL_AMOUNT>000000000</A_EMP_CLASS_PAYROLL_AMOUNT>
									<A_EMP_CLASS_RATE>0000000</A_EMP_CLASS_RATE>
									<A_EMP_CLASS_RATE_OVR_IND>N</A_EMP_CLASS_RATE_OVR_IND>
									<A_EMP_CLASS_PREMIUM>000000000</A_EMP_CLASS_PREMIUM>
									<A_EMP_CLASS_DELETE_IND/>
									<A_EMP_CLASS_RATE_BASIS>1</A_EMP_CLASS_RATE_BASIS>
									<A_EMP_SITE_NAME/>
								</WC_AUD_EXPOSURE_ROW>
								<AUDIT_TYPE_PERIOD_ROW>
									<AUDIT_REPORT_DATE><xsl:call-template name="cvtdateCYYMMDDtoMMDDYY"><xsl:with-param name="datefld" select="$AUDIT_REPORT_DATE" /></xsl:call-template></AUDIT_REPORT_DATE>
									<AUDIT_AUDITOR><xsl:value-of select="$AUDIT_AUDITOR" /></AUDIT_AUDITOR>
									<AUDIT_STATUS>E</AUDIT_STATUS>
									<AUDIT_COST>0000</AUDIT_COST>									
									<AUDIT_EXPIRATION_DATE><xsl:value-of select="$AUDIT_EXPIRATION_DATE" /></AUDIT_EXPIRATION_DATE>
								</AUDIT_TYPE_PERIOD_ROW>
								<WC_COMMON_FIELDS_ROW>
									<COM_STATUS_DESCRIPTION/>
									<COM_EMP_CLASS_DESCRIPTION>DUMMY</COM_EMP_CLASS_DESCRIPTION>
									<COM_CLASS_TYPE_COVERAGE_CODE/>
									<COM_CLASS_TYPE_COVERAGE_DESC/>
									<COM_REQUEST_CODE><xsl:value-of select="$ROW_RQST" /></COM_REQUEST_CODE>
									<COM_LOB_DESCRIPTION/>
									<COM_STATE_DESCRIPTION/>
									<COM_AUD_KIND_DESCRIPTION/>
									<COM_AUD_STATUS_DESCRIPTION/>
									<COM_AUD_PRINT_REQ_DESCRIPTION/>
									<COM_TYPE_OF_BUSINESS_DESC/>
									<COM_ARAP_DISP_INDIC/>
									<COM_EMOD_DISP_INDIC/>
									<COM_ANV_RATED_DISP_INDIC/>
									<COM_AUD_EXPIRATION_DISP_INDIC/>
									<COM_AUD_PREM_ENTRY_INDIC>N</COM_AUD_PREM_ENTRY_INDIC>
									<COM_ALLOW_UNDO_INDIC>N</COM_ALLOW_UNDO_INDIC>
									<COM_ALLOW_REC_DISPLAY_INDIC>Y</COM_ALLOW_REC_DISPLAY_INDIC>
									<COM_ADDED_REC_INDIC>N</COM_ADDED_REC_INDIC>
									<COM_FIRST_ROW_INDIC>N</COM_FIRST_ROW_INDIC>
									<COM_ERROR_INDIC>N</COM_ERROR_INDIC>
									<COM_ERROR/>
								</WC_COMMON_FIELDS_ROW>
						</WC_AUDIT_CLASS_EXP_RECORDS_ROW>
					</PayLoad>

				<!-- </xsl:element> -->
				</WCVAUDITRq>

			</InsuranceSvcRq>
		</POINTXML>

	</xsl:template>

<xsl:template name="cvtdateCYYMMDDtoMMDDYY">
	<xsl:param name="datefld"/>
	<xsl:if test="not(contains($datefld, '/')) and not(normalize-space($datefld) = '')">
	<xsl:choose>
	<!-- Taking the case of CYYMMDD -->
	<xsl:when test="string-length($datefld) = 7">
	<xsl:variable name="year" select="substring($datefld,2,2)"/>
	<xsl:variable name="month" select="substring($datefld,4,2)"/>
	<xsl:variable name="day" select="substring($datefld,6,2)"/>
	<xsl:variable name="cent" select="substring($datefld,1,1)"/>
	<xsl:value-of select="concat($month,'/',$day,'/',$year)"/>
	</xsl:when>
	<!-- taking the case of date in format CYYMM -->
	<xsl:when test="string-length($datefld) = 5">
		<xsl:value-of select="concat(substring($datefld,4,2),'/',substring($datefld,2,2))"/>
	</xsl:when>
	<!-- taking the case of CYYMMDD where century indicator is 0 which would cause leading 0 to be ignored -->
	<xsl:when test="string-length($datefld) = 6">
	<xsl:variable name="year1" select="substring($datefld,5,2)"/>
	<xsl:variable name="month1" select="substring($datefld,1,2)"/>
	<xsl:variable name="day1" select="substring($datefld,3,2)"/>
	<xsl:value-of select="concat($month1,'/',$day1,'/',$year1)"/>
	</xsl:when>
	<xsl:otherwise>
	<!-- taking the case of null date values -->
	<xsl:variable name="zerovalue">0</xsl:variable>
	<xsl:value-of select="$zerovalue"/>
	</xsl:otherwise>
	</xsl:choose>
	</xsl:if>
	<xsl:if test="contains($datefld, '/')">
		<xsl:value-of select="$datefld"/>
	</xsl:if>

	<xsl:if test="normalize-space($datefld) = ''">
		<xsl:choose>
			<xsl:when test="string-length($datefld) = 7 or string-length($datefld) = 5">
			<xsl:value-of select="concat($datefld,' ')"/>
			</xsl:when>
			<xsl:when test="string-length($datefld) = 6">
			<xsl:value-of select="concat($datefld,'  ')"/>
			</xsl:when>
			<xsl:otherwise>
			<xsl:value-of select="$datefld"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:if>

</xsl:template>
</xsl:stylesheet>
