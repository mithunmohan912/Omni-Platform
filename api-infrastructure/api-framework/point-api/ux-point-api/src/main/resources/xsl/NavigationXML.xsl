<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes" method="html" indent="yes" />
	<xsl:strip-space elements="*" />
	<xsl:template match="PayLoad">
		<POINTTREE>
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
			</SignonRq>
			<InsuranceSvcRq>
				<RqUID>PTTREEBLD</RqUID>
				<PTTREEBLDRq>
					<xsl:for-each select="*">
						<xsl:choose>
							<xsl:when test="local-name()='EffectiveDate'">
							<EffectiveDate>0000000</EffectiveDate>
							</xsl:when>
							<xsl:otherwise>
								<xsl:element name="{local-name()}">
									<xsl:value-of select="." />
								</xsl:element>
							</xsl:otherwise>
						</xsl:choose>
					</xsl:for-each>
					<Flags>
						<History></History>
						<Stats></Stats>
						<Reins></Reins>
					</Flags>
				</PTTREEBLDRq>
			</InsuranceSvcRq>
		</POINTTREE>
	</xsl:template>
</xsl:stylesheet>