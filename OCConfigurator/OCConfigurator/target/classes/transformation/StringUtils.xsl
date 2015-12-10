<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:template name="ToUpper">
		<xsl:param name="val"/>
		<xsl:variable name="smallcase" select="'abcdefghijklmnopqrstuvwxyz'"/>
		<xsl:variable name="uppercase" select="'ABCDEFGHIJKLMNOPQRSTUVWXYZ'"/>
		<xsl:value-of select="translate($val, $smallcase, $uppercase)"/>
	</xsl:template>
	<xsl:template name="TruncateString">
		<xsl:param name="targetVar"/>
		<xsl:param name="allowablelength"/>
		<xsl:choose>
			<xsl:when test="string-length($targetVar) &gt; $allowablelength">
				<xsl:value-of select="substring($targetVar, 1, $allowablelength)"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="$targetVar"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
</xsl:stylesheet>