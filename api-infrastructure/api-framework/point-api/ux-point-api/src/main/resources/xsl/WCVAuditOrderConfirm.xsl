<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes" method="xml" indent="no" />

	<xsl:template match="PayLoad">

		<xsl:variable name="LOC">
        	<xsl:value-of select="LOC"/>
   		</xsl:variable>
   		
   		<xsl:variable name="MCO">
        	<xsl:value-of select="MCO"/>
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

				<RqUID><xsl:value-of select="$REQUEST_CODE" /></RqUID>
				<WCVAUDORRq>
					<PayLoad>
						<WC_AUDTRK_FIELDS_RECORDS_ROW>
							<PROCESSING_INFO>
								<target>WcpAuditOrdconfSearchForm.jsp</target>
								<PROC_SUCCESS_INDIC/>
							</PROCESSING_INFO>
							
							<xsl:for-each select="list/PayLoad[OUTPUTAUDITFLAG != '']">
								<KEY_FIELDS_ROW>
									<KEY_POLICY_NUMBER><xsl:value-of select="OUTPUTPOLICYNO" /></KEY_POLICY_NUMBER>
									<KEY_LOCATION><xsl:value-of select="$LOC" /></KEY_LOCATION>
									<KEY_MCO><xsl:value-of select="$MCO" /></KEY_MCO>
									<KEY_POLICY_SYMBOL><xsl:value-of select="OUTPUTSYMBOL" /></KEY_POLICY_SYMBOL>
									<KEY_POLICY_MODULE><xsl:value-of select="OUTPUTMODULE" /></KEY_POLICY_MODULE>
									<KEY_SITE_NUMBER><xsl:value-of select="OUTPUTSITE" /></KEY_SITE_NUMBER>
									<AUDTRK_GENERATED_DATE><xsl:value-of select="OUTPUTGENDTE" /></AUDTRK_GENERATED_DATE>
									<KEY_AUDIT_KIND><xsl:value-of select="OUTPUTAUDKIND" /></KEY_AUDIT_KIND>
									<xsl:choose>
										<xsl:when test="OUTPUTAUDITFLAG != 'M'">
											<AUDTRK_ORDER_APP_FLAG><xsl:value-of select="OUTPUTAUDITFLAG" /></AUDTRK_ORDER_APP_FLAG>
											<AUDTRK_ORDERED_FLAG/>	
										</xsl:when>
										<xsl:otherwise>
											<AUDTRK_ORDER_APP_FLAG></AUDTRK_ORDER_APP_FLAG>
											<AUDTRK_ORDERED_FLAG><xsl:value-of select="OUTPUTAUDITFLAG" /></AUDTRK_ORDERED_FLAG>
										</xsl:otherwise>
									</xsl:choose>
									<KEY_AUDIT_EFFECTIVE_DATE><xsl:value-of select="OUTPUTAUDEFFDTE" /></KEY_AUDIT_EFFECTIVE_DATE>
									<AUDTRK_KIND_DESCRIPTION><xsl:value-of select="OUTPUTAUDKIND" /></AUDTRK_KIND_DESCRIPTION>
									<AUDTRK_EXPIRATION_DATE><xsl:value-of select="OUTPUTAUDEXPDTE" /></AUDTRK_EXPIRATION_DATE>
									<AUDTRK_VENDOR_ID><xsl:value-of select="OUTPUTVENDORID" /></AUDTRK_VENDOR_ID>
									<AUDTRK_VENDOR_NAME><xsl:value-of select="OUTPUTVENDORNAME" /></AUDTRK_VENDOR_NAME>
									
									<AUDTRK_VENDOR_ADDRESS><xsl:value-of select="OUTPUTNAME" /></AUDTRK_VENDOR_ADDRESS>
									<KEY_EMP_CLASS_V_C_INDICATOR>Y</KEY_EMP_CLASS_V_C_INDICATOR>
									<ERROR_MESSAGE>null</ERROR_MESSAGE>
								</KEY_FIELDS_ROW>	
							</xsl:for-each>
						</WC_AUDTRK_FIELDS_RECORDS_ROW>
					</PayLoad>
				</WCVAUDORRq>
			</InsuranceSvcRq>
		</POINTXML>
	</xsl:template>
</xsl:stylesheet>