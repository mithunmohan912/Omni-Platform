<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes" method="xml" indent="yes" />

	<xsl:template match="INFOXML">
		<POINTXML>
			<xsl:for-each select="*">
				<xsl:element name="{local-name()}">
					<xsl:value-of select="." />
				</xsl:element>
			</xsl:for-each>
		</POINTXML>
	</xsl:template>
	<!-- Allow multi-request responses to retain their structure -->
	<xsl:template match="MULTIRECCALLRs">
		<xsl:copy-of select="/" />
	</xsl:template>

	<xsl:template match="text()" />

</xsl:stylesheet>