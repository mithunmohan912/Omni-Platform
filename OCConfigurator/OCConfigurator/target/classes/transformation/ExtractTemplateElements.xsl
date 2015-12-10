<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes"/>
	<xsl:strip-space elements="*"/>
	<xsl:template match="/root">
		<xsl:if test="metadata/section/subsection/element">
			<xsl:for-each select="metadata/section/subsection/element">
				<xsl:variable name="type" select="type"/>
				<xsl:variable name="controlgroupExist" select="child::node()[name()='controlgroup'] != ''"/>
				<xsl:choose>
					<xsl:when test="not($controlgroupExist)">
						<xsl:value-of select="normalize-space(name)"/>,</xsl:when>
					<xsl:otherwise>
						<xsl:value-of select="normalize-space(name)"/>,<xsl:for-each select="controlgroup">
							<xsl:value-of select="normalize-space(name)"/>,</xsl:for-each></xsl:otherwise>
				</xsl:choose>
			</xsl:for-each>
		</xsl:if>
	</xsl:template>
</xsl:stylesheet>