<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes" method="xml" indent="no" />

	<xsl:template match="PayLoad">
		<POINTXML>
			<SignonRq>
				<ClientApp>
					<Name>PT4J</Name>
				</ClientApp>
				<SignonPswd>
					<CustId>
						<CustLoginId>
							<xsl:value-of select="USER" />
						</CustLoginId>
					</CustId>
				</SignonPswd>
			</SignonRq>
			<InsuranceSvcRq>
				<RqUID>WCLOCIMPORTRq</RqUID>
				<WCLOCIMPRq/>
			</InsuranceSvcRq>
			<xsl:for-each select="list/PayLoad">
			<InsuranceSvcRq>
				<RqUID>WCVLOCADDRq</RqUID>
				<WCVLOCADRq>
					<PayLoad>
						<xsl:for-each select="*">
							<xsl:element name="{local-name()}">
								<xsl:value-of select="." />
							</xsl:element>
						</xsl:for-each>
					</PayLoad>
				</WCVLOCADRq>				
			</InsuranceSvcRq>
			</xsl:for-each>
		</POINTXML>
	</xsl:template>
</xsl:stylesheet>