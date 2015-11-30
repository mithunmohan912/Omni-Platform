<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes" method="xml" indent="yes" />

	<xsl:template match="POINTXML/InsuranceSvcRs/*/PayLoad">
		<POINTXML>
			<xsl:for-each select="*">
				<xsl:choose>
				<xsl:when test="local-name() != 'method'">
				<xsl:element name="{local-name()}">
					<xsl:value-of select="." />
				</xsl:element>
				</xsl:when>
				</xsl:choose>
			</xsl:for-each>
		</POINTXML>
	</xsl:template>
	
	<xsl:template match="text()" />

</xsl:stylesheet>