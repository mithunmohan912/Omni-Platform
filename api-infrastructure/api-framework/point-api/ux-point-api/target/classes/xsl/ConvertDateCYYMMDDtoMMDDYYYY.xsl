<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
<xsl:template name="cvtdateCYYMMDDtoMMDDYYYY">
	<xsl:param name="datefld"/>
	<xsl:if test="not(contains($datefld, '/')) and not(normalize-space($datefld) = '')">
	<xsl:choose>
	<!-- Taking the case of CYYMMDD -->
	<xsl:when test="string-length($datefld) = 7">
	<xsl:variable name="year" select="substring($datefld,2,2)"/>
	<xsl:variable name="month" select="substring($datefld,4,2)"/>
	<xsl:variable name="day" select="substring($datefld,6,2)"/>
	<xsl:variable name="cent" select="substring($datefld,1,1)"/>
	<xsl:if test="$cent=1">
	<xsl:value-of select="concat($month,'/',$day,'/',20,$year)"/>
	</xsl:if>
	<xsl:if test="$cent=0">
	<xsl:value-of select="concat($month,'/',$day,'/',19,$year)"/>
	</xsl:if>
	</xsl:when>
	<!-- taking the case of date in format CYYMM -->
	<xsl:when test="string-length($datefld) = 5">
	<xsl:value-of select="concat(substring($datefld,4,2),'/',substring($datefld,2,2))"/>
	</xsl:when>
	<!-- taking the case of CYYMMDD where century indicator is 0 which would cause leading 0 to be ignored -->
	<xsl:when test="string-length($datefld) = 6">
	<xsl:variable name="year1" select="substring($datefld,1,2)"/>
	<xsl:variable name="month1" select="substring($datefld,3,2)"/>
	<xsl:variable name="day1" select="substring($datefld,5,2)"/>
	<xsl:variable name="dispcent1" select="19"/>
	<xsl:value-of select="concat($month1,'/',$day1,'/',$dispcent1,$year1)"/>
	</xsl:when>
	<xsl:otherwise>
	<!-- taking the case of null date values -->
	<xsl:variable name="zerovalue">0</xsl:variable>
	<xsl:value-of select="$zerovalue"/>
	</xsl:otherwise>
	</xsl:choose>
	</xsl:if>
	<xsl:if test="contains($datefld, '/') or normalize-space($datefld) = ''">
		<xsl:value-of select="$datefld"/>
	</xsl:if>

	</xsl:template>
</xsl:stylesheet>