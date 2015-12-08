<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes" method="xml" indent="no" />
	<xsl:template match="PayLoad">
		<DecisionRequest>
			<RqCode>UnderWritingFilterOnly</RqCode>
			<xsl:for-each select="*">
				<xsl:element name="{local-name()}">
					<xsl:value-of select="." />
				</xsl:element>
			</xsl:for-each>
		</DecisionRequest>
	</xsl:template>
</xsl:stylesheet>