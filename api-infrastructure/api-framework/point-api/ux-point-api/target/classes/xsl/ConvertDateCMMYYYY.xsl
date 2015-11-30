<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
<xsl:template name="cvtdateCMMYYYY">
	<xsl:param name="datefld"/>
	<xsl:choose>
	<!-- Taking the case of CMMYYYY -->


		<xsl:when test="string-length($datefld) = 6">
		<xsl:variable name="year" select="substring($datefld,3,4)"/>
		<xsl:variable name="month" select="substring($datefld,1,2)"/>
		<xsl:value-of select="concat($month,'/',$year)"/>
		</xsl:when>
<!-- Taking the case of CMYYYY -->
                                
               <xsl:when test="string-length($datefld) = 5">
		<xsl:variable name="year" select="substring($datefld,2,4)"/>
		<xsl:variable name="month" select="substring($datefld,1,1)"/>
		<xsl:value-of select="concat($month,'/',$year)"/>
		</xsl:when>
		
</xsl:choose>
</xsl:template>
</xsl:stylesheet>