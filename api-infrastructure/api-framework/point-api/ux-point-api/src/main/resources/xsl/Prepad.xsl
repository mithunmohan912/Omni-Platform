<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">

<xsl:template name="Prepad">
	<xsl:param name="padChar"/>
    <xsl:param name="padVar"/>
    <xsl:param name="len"/>
    <xsl:choose>
     <xsl:when test="string-length($padVar)=0">
	     <xsl:call-template name="Prepad">
	          <xsl:with-param name="padChar" select="' '"/>
	          <xsl:with-param name="padVar" select="' '"/>
	          <xsl:with-param name="len" select="$len"/>
	     </xsl:call-template>
	 </xsl:when>

      <xsl:when test="string-length($padVar) &lt; ($len)">
        <xsl:call-template name="Prepad">
          <xsl:with-param name="padChar" select="$padChar"/>
          <xsl:with-param name="padVar" select="concat($padChar,$padVar)"/>
          <xsl:with-param name="len" select="$len"/>
        </xsl:call-template>
      </xsl:when>
      <xsl:otherwise>
		<xsl:value-of select="$padVar"/>

      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

</xsl:stylesheet>


