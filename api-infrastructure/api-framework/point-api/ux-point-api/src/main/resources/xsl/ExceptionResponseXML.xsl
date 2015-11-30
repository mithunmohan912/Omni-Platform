<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes" method="xml" indent="yes" />

	<xsl:template match="MsgStatus">
		<exception>
			<message>
				<xsl:value-of select="MsgStatusDesc" />
			</message>
			<stackTrace>
				<xsl:value-of select="ExtendedStatus/ExtendedStatusDesc" />
			</stackTrace>
		</exception>
	</xsl:template>

	<xsl:template match="text()" />

</xsl:stylesheet>