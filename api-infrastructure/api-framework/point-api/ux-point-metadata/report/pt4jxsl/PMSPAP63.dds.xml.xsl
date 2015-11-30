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

<!-- Auto Generated XSLT for printer file DDS PMSPAP63-->
<xsl:template match="record[@name = 'REPDETAIL']" xml:space="preserve">
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" >                        <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="void"/></xsl:with-param><xsl:with-param name="len">1</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>       <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="corrected"/></xsl:with-param><xsl:with-param name="len">1</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">     <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="payeradd01"/></xsl:with-param><xsl:with-param name="len">34</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="rents"/></xsl:with-param><xsl:with-param name="len">10</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">     <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="payeradd02"/></xsl:with-param><xsl:with-param name="len">34</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">     <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="payeradd03"/></xsl:with-param><xsl:with-param name="len">34</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">                            <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="payeradd04"/></xsl:with-param><xsl:with-param name="len">10</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>  <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="royalties"/></xsl:with-param><xsl:with-param name="len">10</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">     <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="payerphone"/></xsl:with-param><xsl:with-param name="len">30</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>     <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="prizenawrd"/></xsl:with-param><xsl:with-param name="len">10</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>    <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="fedtxwthhd"/></xsl:with-param><xsl:with-param name="len">10</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">     <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="payerfedid"/></xsl:with-param><xsl:with-param name="len">11</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>      <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="recptfedid"/></xsl:with-param><xsl:with-param name="len">11</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>       <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="fishboatpc"/></xsl:with-param><xsl:with-param name="len">10</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>    <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="mednhlth"/></xsl:with-param><xsl:with-param name="len">10</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">     <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="recptadd01"/></xsl:with-param><xsl:with-param name="len">34</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">     <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="recptadd02"/></xsl:with-param><xsl:with-param name="len">34</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="nonempcomp"/></xsl:with-param><xsl:with-param name="len">10</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>    <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="subpayment"/></xsl:with-param><xsl:with-param name="len">10</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">     <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="recptadd03"/></xsl:with-param><xsl:with-param name="len">34</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>           <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="dsalegt5g"/></xsl:with-param><xsl:with-param name="len">1</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>   <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="cropins"/></xsl:with-param><xsl:with-param name="len">10</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">     <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="recptc"/></xsl:with-param><xsl:with-param name="len">19</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="recpts"/></xsl:with-param><xsl:with-param name="len">2</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="recptz"/></xsl:with-param><xsl:with-param name="len">10</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">     <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="acctnum"/></xsl:with-param><xsl:with-param name="len">30</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>                   <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="gropro"/></xsl:with-param><xsl:with-param name="len">10</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">
</fo:block>
</xsl:template></xsl:stylesheet>