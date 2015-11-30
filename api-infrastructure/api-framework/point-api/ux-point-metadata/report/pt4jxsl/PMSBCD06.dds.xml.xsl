<?xml version="1.0" encoding="ISO-8859-1"?>

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                              xmlns:fo="http://www.w3.org/1999/XSL/Format"
                              xmlns:fn="http://www.w3.org/2005/02/xpath-functions">
	<xsl:include href="ConvertDateCYYMMDDtoMMDDYYYY.xsl"/>
	<xsl:include href="ConvertDateCYYMMDDtoMMDDYY.xsl"/>
	<xsl:include href="ConvertTimeHHMMSS.xsl"/>
	<xsl:include href="Prepad.xsl"/>
	<xsl:include href="Postpad.xsl"/>
	<xsl:param name="date"/>
	<xsl:param name="time"/>
	<xsl:output encoding="UTF-8"/>
	<xsl:preserve-space elements="*"/>

    <xsl:template match="/">
        <fo:root>
            <fo:layout-master-set>
                <fo:simple-page-master master-name="LandscapeReport"
                    page-width="11in"
                    page-height="8.5in"
                    margin-top=".17in"
                    margin-bottom=".17in"
                    margin-left=".25in"
                    margin-right=".25in">
                    <fo:region-body margin-top="0in"/>
                    <fo:region-before extent="0in"/>
                    <fo:region-after  extent="0in"/>
                </fo:simple-page-master>
                <fo:simple-page-master master-name="PortraitReport"
                    page-width="8.5in"
                    page-height="11in"
                    margin-top=".25in"
                    margin-bottom=".25in"
                    margin-left=".17in"
                    margin-right=".17in">
                    <fo:region-body margin-top="0in"/>
                    <fo:region-before extent="0in"/>
                    <fo:region-after  extent="0in"/>
                </fo:simple-page-master>
            </fo:layout-master-set>

            <fo:page-sequence master-reference="LandscapeReport">
                <fo:flow flow-name="xsl-region-body">
                <xsl:apply-templates select="/POINTXML/file/record"/>
                </fo:flow>
            </fo:page-sequence>

        </fo:root>
    </xsl:template>

<!-- Auto Generated XSLT for printer file DDS PMSBCD06-->
<xsl:template match="record[@name = 'ZAPAGHDR']" xml:space="preserve">
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" >  <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="zapgm"/></xsl:with-param><xsl:with-param name="len">10</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>               Detail Task Report                    <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="zausr"/></xsl:with-param><xsl:with-param name="len">10</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> <xsl:value-of select="$date"/> <xsl:value-of select="$time"/> Page  <fo:page-number/> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">
</fo:block>
</xsl:template><xsl:template match="record[@name = 'ZC1STPAG']" xml:space="preserve">
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" > </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">
</fo:block>
</xsl:template><xsl:template match="record[@name = 'ZDKEYHDR']" xml:space="preserve">
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" >  Task ID # . . . :   <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="zdalohnbr"/></xsl:with-param><xsl:with-param name="len">5</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>  <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="zdaln1txt"/></xsl:with-param><xsl:with-param name="len">30</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">
</fo:block>
</xsl:template><xsl:template match="record[@name = 'ZECOLHDG']" xml:space="preserve">
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" >     Task     Task                              Task    Record          Record </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">     Seq#     Description                       Dur.    Written User    Written Date </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">
</fo:block>
</xsl:template><xsl:template match="record[@name = 'ZEDTLRCD']" xml:space="preserve">
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" >     <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="zealoinbr"/></xsl:with-param><xsl:with-param name="len">5</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>    <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="zealn1txt"/></xsl:with-param><xsl:with-param name="len">30</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>    <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="zealojnbr"/></xsl:with-param><xsl:with-param name="len">3</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>     <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="zeaavn"/></xsl:with-param><xsl:with-param name="len">10</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>      <xsl:call-template name="cvtdateCYYMMDDtoMMDDYY"><xsl:with-param name="datefld"><xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="veakdt"/></xsl:with-param><xsl:with-param name="len">6</xsl:with-param><xsl:with-param name="padChar">0</xsl:with-param></xsl:call-template></xsl:with-param></xsl:call-template> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">
</fo:block>
</xsl:template><xsl:template match="record[@name = 'ZFKEYTTL']" xml:space="preserve">
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" >   Total Number of tasks  :   <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="zfalomnbr"/></xsl:with-param><xsl:with-param name="len">5</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>        Total Time Allocated  :   <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="zfalonnbr"/></xsl:with-param><xsl:with-param name="len">5</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">
</fo:block>
</xsl:template><xsl:template match="record[@name = 'ZGFINTTL']" xml:space="preserve">
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" >  Final totals </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">
</fo:block>
</xsl:template><xsl:template match="record[@name = 'ZHENDRPT']" xml:space="preserve">
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" >  ** END OF REPORT ** </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">
</fo:block>
</xsl:template></xsl:stylesheet>