<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes" method="xml" indent="no" />

	<xsl:template match="PayLoad">

		<xsl:variable name="User">
			<xsl:value-of select="User"/>
		</xsl:variable>
		
		<xsl:variable name="UNDERWRITER">
			<xsl:value-of select="REASSIGNUNDERWRITER"/>
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
				<RqUID>UNDRASGNCHGRq</RqUID>
				<UNDRASGNRq>
					<PayLoad>
						<UND_INFORMATION_RECORDS_ROW>
							<PROCESSING_INFO/>
							<xsl:for-each select="list/PayLoad">
								<UNDERWRITING_KEY>
									<KEY_LOCATION_COMPANY><xsl:value-of select="LOCATION" /></KEY_LOCATION_COMPANY>
									<KEY_MASTER_COMPANY><xsl:value-of select="MASTERCO" /></KEY_MASTER_COMPANY>
									<KEY_SYMBOL><xsl:value-of select="SYMBOL" /></KEY_SYMBOL>
									<KEY_POLICY_NUMBER><xsl:value-of select="POLICYNO" /></KEY_POLICY_NUMBER>
									<KEY_MODULE><xsl:value-of select="MODULE" /></KEY_MODULE>
									<KEY_UNDERWRITER_NAME><xsl:value-of select="$UNDERWRITER" /></KEY_UNDERWRITER_NAME>
								</UNDERWRITING_KEY>							
							</xsl:for-each>	
						</UND_INFORMATION_RECORDS_ROW>				
					</PayLoad>
				</UNDRASGNRq>
			</InsuranceSvcRq>
		</POINTXML>
	</xsl:template>
</xsl:stylesheet>