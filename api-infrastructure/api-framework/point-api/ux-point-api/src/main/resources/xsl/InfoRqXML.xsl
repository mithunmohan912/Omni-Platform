<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes" method="xml" indent="no" />

	<xsl:template match="PayLoad">
		<INFOXML>
			<SignonRq>
				<ClientApp>
					<Name>IO</Name>
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
				<PAPUNITSVINRq>
					<PayLoad>
						<xsl:for-each select="*">
							<xsl:element name="{local-name()}">
								<xsl:value-of select="." />
							</xsl:element>
						</xsl:for-each>
					</PayLoad>
				</PAPUNITSVINRq>
			</InsuranceSvcRq>
		</INFOXML>
	</xsl:template>
	<xsl:template name="cvtToUpper">
		<xsl:param name="user" />
		<xsl:value-of
			select="translate($user, 'abcdefghijklmnopqrstuvwxyz', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ')" />
	</xsl:template>
</xsl:stylesheet>
