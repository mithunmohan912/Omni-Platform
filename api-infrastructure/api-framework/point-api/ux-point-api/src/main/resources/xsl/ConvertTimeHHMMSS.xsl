<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
	<xsl:template name="ConvertTime">
		<xsl:param name="Time"/>
		<xsl:choose>
			<xsl:when test="string-length($Time) = 6">
				<xsl:value-of select="substring($Time,1,2)"/>
				<xsl:text disable-output-escaping="yes">:</xsl:text>
				<xsl:value-of select="substring($Time,3,2)"/>
				<xsl:text disable-output-escaping="yes">:</xsl:text>
				<xsl:value-of select="substring($Time,5,2)"/>
			</xsl:when>
			<xsl:when test="string-length($Time) = 5">
				<xsl:text disable-output-escaping="yes">0</xsl:text>
				<xsl:value-of select="substring($Time,1,1)"/>
				<xsl:text disable-output-escaping="yes">:</xsl:text>
				<xsl:value-of select="substring($Time,2,2)"/>
				<xsl:text disable-output-escaping="yes">:</xsl:text>
				<xsl:value-of select="substring($Time,4,2)"/>
			</xsl:when>
			<!-- taking the case of time at 00:XX:XX Seconds -->
			<xsl:when test="string-length($Time) = 4">
				<xsl:text disable-output-escaping="yes">00</xsl:text>
				<xsl:text disable-output-escaping="yes">:</xsl:text>
				<xsl:value-of select="substring($Time,1,2)"/>
				<xsl:text disable-output-escaping="yes">:</xsl:text>
				<xsl:value-of select="substring($Time,3,2)"/>
			</xsl:when>
			<xsl:when test="string-length($Time) = 3">
				<xsl:text disable-output-escaping="yes">00</xsl:text>
				<xsl:text disable-output-escaping="yes">:</xsl:text>
				<xsl:text disable-output-escaping="yes">0</xsl:text>
				<xsl:value-of select="substring($Time,1,1)"/>
				<xsl:text disable-output-escaping="yes">:</xsl:text>
				<xsl:value-of select="substring($Time,2,2)"/>
			</xsl:when>
			<!-- taking the case of time at 00:00:XX Seconds -->
			<xsl:when test="string-length($Time) = 2">
				<xsl:text disable-output-escaping="yes">00</xsl:text>
				<xsl:text disable-output-escaping="yes">:</xsl:text>
				<xsl:text disable-output-escaping="yes">00</xsl:text>
				<xsl:text disable-output-escaping="yes">:</xsl:text>
				<xsl:value-of select="substring($Time,1,2)"/>
			</xsl:when>
			<xsl:when test="string-length($Time) = 1">
				<xsl:text disable-output-escaping="yes">00</xsl:text>
				<xsl:text disable-output-escaping="yes">:</xsl:text>
				<xsl:text disable-output-escaping="yes">00</xsl:text>
				<xsl:text disable-output-escaping="yes">:</xsl:text>
				<xsl:text disable-output-escaping="yes">0</xsl:text>
				<xsl:value-of select="substring($Time,1,1)"/>
			</xsl:when>
			<xsl:otherwise>
				<!-- taking the case of null time values -->
				<xsl:text disable-output-escaping="yes">00</xsl:text>
				<xsl:text disable-output-escaping="yes">:</xsl:text>
				<xsl:text disable-output-escaping="yes">00</xsl:text>
				<xsl:text disable-output-escaping="yes">:</xsl:text>
				<xsl:text disable-output-escaping="yes">00</xsl:text>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
</xsl:stylesheet>