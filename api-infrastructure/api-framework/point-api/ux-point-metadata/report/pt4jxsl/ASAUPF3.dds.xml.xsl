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

<!-- Auto Generated XSLT for printer file DDS ASAUPF3-->
<xsl:template match="record[@name = 'ZAPAGHDR']" xml:space="preserve">
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" >  <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="zapgm"/></xsl:with-param><xsl:with-param name="len">10</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>                    RAT04 Rate Keys                       <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="zausr"/></xsl:with-param><xsl:with-param name="len">10</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> <xsl:value-of select="$date"/> <xsl:value-of select="$time"/> Page  <fo:page-number/> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">
</fo:block>
</xsl:template><xsl:template match="record[@name = 'ZC1STPAG']" xml:space="preserve">
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" > </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">
</fo:block>
</xsl:template><xsl:template match="record[@name = 'ZDKEYHDR']" xml:space="preserve">
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" >   LOC: <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="zdaacd"/></xsl:with-param><xsl:with-param name="len">2</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>  MCO: <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="zdabcd"/></xsl:with-param><xsl:with-param name="len">2</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>  PCO: <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="zdaccd"/></xsl:with-param><xsl:with-param name="len">2</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>  State: <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="zdadcd"/></xsl:with-param><xsl:with-param name="len">2</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>  LOB: <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="zdadtx"/></xsl:with-param><xsl:with-param name="len">3</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>  INS Line: <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="zdagtx"/></xsl:with-param><xsl:with-param name="len">3</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>  Product: <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="zdantx"/></xsl:with-param><xsl:with-param name="len">6</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>  Coverage: <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="zdaotx"/></xsl:with-param><xsl:with-param name="len">6</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>  Ratebook: <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="zddtst"/></xsl:with-param><xsl:with-param name="len">1</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">
</fo:block>
</xsl:template><xsl:template match="record[@name = 'ZECOLHDG']" xml:space="preserve">
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" >
</fo:block>
</xsl:template><xsl:template match="record[@name = 'ZEDTLRCD']" xml:space="preserve">
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" >    Rate Element: <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="zecitx"/></xsl:with-param><xsl:with-param name="len">20</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>  Factor/Premium Indicator: <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="zebttx"/></xsl:with-param><xsl:with-param name="len">1</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>  Read Error Code: <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="zeaucd"/></xsl:with-param><xsl:with-param name="len">4</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>  Type Read Indicator: <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="zednst"/></xsl:with-param><xsl:with-param name="len">1</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">      Element Re-defines: <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="zemutx"/></xsl:with-param><xsl:with-param name="len">20</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>  Date: <xsl:call-template name="cvtdateCYYMMDDtoMMDDYY"><xsl:with-param name="datefld"><xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="veakdt"/></xsl:with-param><xsl:with-param name="len">6</xsl:with-param><xsl:with-param name="padChar">0</xsl:with-param></xsl:call-template></xsl:with-param></xsl:call-template> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">      1st Rating Indicator/Set Type/Attribute: <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="vedcst"/></xsl:with-param><xsl:with-param name="len">1</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="zebznb"/></xsl:with-param><xsl:with-param name="len">5</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="zebutx"/></xsl:with-param><xsl:with-param name="len">20</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>   2nd Rating Indicator/Set Type/Attribute: <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="veddst"/></xsl:with-param><xsl:with-param name="len">1</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="zeb0nb"/></xsl:with-param><xsl:with-param name="len">5</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="zebvtx"/></xsl:with-param><xsl:with-param name="len">20</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">      3rd Rating Indicator/Set Type/Attribute: <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="vedest"/></xsl:with-param><xsl:with-param name="len">1</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="zeb1nb"/></xsl:with-param><xsl:with-param name="len">5</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="zebwtx"/></xsl:with-param><xsl:with-param name="len">20</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>   4th Rating Indicator/Set Type/Attribute: <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="vedfst"/></xsl:with-param><xsl:with-param name="len">1</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="zeb2nb"/></xsl:with-param><xsl:with-param name="len">5</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="zebxtx"/></xsl:with-param><xsl:with-param name="len">20</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">      5th Rating Indicator/Set Type/Attribute: <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="vedgst"/></xsl:with-param><xsl:with-param name="len">1</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="zeb3nb"/></xsl:with-param><xsl:with-param name="len">5</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="zebytx"/></xsl:with-param><xsl:with-param name="len">20</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>   6th Rating Indicator/Set Type/Attribute: <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="vedhst"/></xsl:with-param><xsl:with-param name="len">1</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="zeb4nb"/></xsl:with-param><xsl:with-param name="len">5</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="zebztx"/></xsl:with-param><xsl:with-param name="len">20</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">      7th Rating Indicator/Set Type/Attribute: <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="vedist"/></xsl:with-param><xsl:with-param name="len">1</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="zeb5nb"/></xsl:with-param><xsl:with-param name="len">5</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="zeb0tx"/></xsl:with-param><xsl:with-param name="len">20</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>   8th Rating Indicator/Set Type/Attribute: <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="vedjst"/></xsl:with-param><xsl:with-param name="len">1</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="zeb6nb"/></xsl:with-param><xsl:with-param name="len">5</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="zeb1tx"/></xsl:with-param><xsl:with-param name="len">20</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">
</fo:block>
</xsl:template><xsl:template match="record[@name = 'ZFENDRPT']" xml:space="preserve">
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" >  ** END OF REPORT ** </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">
</fo:block>
</xsl:template></xsl:stylesheet>