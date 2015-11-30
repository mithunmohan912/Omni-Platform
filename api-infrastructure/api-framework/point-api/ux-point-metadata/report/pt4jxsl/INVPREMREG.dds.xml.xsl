<?xml version="1.0" encoding="ISO-8859-1"?>

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                              xmlns:fo="http://www.w3.org/1999/XSL/Format"
                              xmlns:fn="http://www.w3.org/2005/02/xpath-functions">
	<xsl:include href="ConvertDateCYYMMDDtoMMDDYYYY.xsl"/>
	<xsl:include href="ConvertDateCYYMMDDtoMMDDYY.xsl"/>
	<xsl:include href="ConvertTimeHHMMSS.xsl"/>
	<xsl:include href="Prepad.xsl"/>
	<xsl:include href="Postpad.xsl"/>
	<xsl:include href="Postpadortruncate.xsl"/>
	<xsl:param name="date"/>
	<xsl:param name="time"/>
	<xsl:output encoding="UTF-8"/>
	<xsl:preserve-space elements="*"/>

    <xsl:template match="/">
        <fo:root>
            <fo:layout-master-set>
            	<!--FSIT #175038 Resolution id:62720 Start -->
                <!--fo:simple-page-master master-name="LandscapeReport"
                	page-width="16in"
                    page-height="8.5in"
                    margin-top=".17in"
                    margin-bottom=".17in"
                    margin-left=".25in"
                    margin-right=".25in">
                    <fo:region-body margin-top="0in"/>
                    <fo:region-before extent="0in"/>
                    <fo:region-after  extent="0in"/>
                </fo:simple-page-master-->
                <fo:simple-page-master master-name="LandscapeReport"
                     page-width="21in"
                    page-height="14in"
                    margin-top=".17in"
                    margin-bottom=".17in"
                    margin-left=".25in"
                    margin-right=".25in">
                    <fo:region-body margin-top="0in"/>
                    <fo:region-before extent="0in"/>
                    <fo:region-after  extent="0in"/>
                </fo:simple-page-master>
                <!-- FSIT #175038 Resolution :62720 End -->
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

<!-- Auto Generated XSLT for printer file DDS INVPREMREG-->
<xsl:template match="record[@name = 'ZAPAGHDR']" xml:space="preserve">
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="zacmp"/></xsl:with-param><xsl:with-param name="len">40</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>Invoice Premium Register  Report              <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="zausr"/></xsl:with-param><xsl:with-param name="len">10</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="zapgm"/></xsl:with-param><xsl:with-param name="len">10</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> <xsl:value-of select="$date"/> <xsl:value-of select="$time"/> Page  <fo:page-number/> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">                                              <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="zbkhtx"/></xsl:with-param><xsl:with-param name="len">15</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="zbiktx"/></xsl:with-param><xsl:with-param name="len">30</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> For Invoice Date:  <xsl:call-template name="cvtdateCYYMMDDtoMMDDYY"><xsl:with-param name="datefld"><xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="vbfromdte"/></xsl:with-param><xsl:with-param name="len">6</xsl:with-param><xsl:with-param name="padChar">0</xsl:with-param></xsl:call-template></xsl:with-param></xsl:call-template> To Invoice Date <xsl:call-template name="cvtdateCYYMMDDtoMMDDYY"><xsl:with-param name="datefld"><xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="vbbidt"/></xsl:with-param><xsl:with-param name="len">6</xsl:with-param><xsl:with-param name="padChar">0</xsl:with-param></xsl:call-template></xsl:with-param></xsl:call-template> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="zbiktx1"/></xsl:with-param><xsl:with-param name="len">30</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> For Accounting Period:  <xsl:call-template name="cvtdateCYYMMDDtoMMDDYY"><xsl:with-param name="datefld"><xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="vbfromdte1"/></xsl:with-param><xsl:with-param name="len">6</xsl:with-param><xsl:with-param name="padChar">0</xsl:with-param></xsl:call-template></xsl:with-param></xsl:call-template> To Accounting period <xsl:call-template name="cvtdateCYYMMDDtoMMDDYY"><xsl:with-param name="datefld"><xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="vbbidt1"/></xsl:with-param><xsl:with-param name="len">6</xsl:with-param><xsl:with-param name="padChar">0</xsl:with-param></xsl:call-template></xsl:with-param></xsl:call-template> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">
</fo:block>
</xsl:template>
<xsl:template match="record[@name = 'ZDKEYHDR']" xml:space="preserve">
<!-- FSIT #181368 Resolution :66413 Start -->
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">  Location Company :  <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="zeaacd"/></xsl:with-param><xsl:with-param name="len">2</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="zdhmtx"/></xsl:with-param><xsl:with-param name="len">30</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> </fo:block>
<!-- FSIT #181368 Resolution :66413 End -->
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">  Master Company   :  <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="zdabcd"/></xsl:with-param><xsl:with-param name="len">2</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="zdhmtx"/></xsl:with-param><xsl:with-param name="len">30</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">
</fo:block>
</xsl:template>
<xsl:template match="record[@name = 'ZEKEYHDR']" xml:space="preserve">
<fo:block text-align="left" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"><xsl:call-template name="Postpad"><xsl:with-param name="len">263</xsl:with-param><xsl:with-param name="padChar">-</xsl:with-param></xsl:call-template>  </fo:block>
<fo:block text-align="left" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> <xsl:call-template name="Postpad"><xsl:with-param name="padVar">Symbol</xsl:with-param><xsl:with-param name="len">8</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template><xsl:call-template name="Postpad"><xsl:with-param name="padVar">Policy No</xsl:with-param><xsl:with-param name="len">11</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template><xsl:call-template name="Postpad"><xsl:with-param name="padVar">Module</xsl:with-param><xsl:with-param name="len">8</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template><xsl:call-template name="Postpad"><xsl:with-param name="padVar">Insured Name</xsl:with-param><xsl:with-param name="len">62</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template><xsl:call-template name="Postpad"><xsl:with-param name="padVar">Broker Name</xsl:with-param><xsl:with-param name="len">32</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template><xsl:call-template name="Postpad"><xsl:with-param name="padVar">Transaction</xsl:with-param><xsl:with-param name="len">13</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template><xsl:call-template name="Postpad"><xsl:with-param name="padVar">Invoice</xsl:with-param><xsl:with-param name="len">13</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template><xsl:call-template name="Postpad"><xsl:with-param name="padVar">Invoice</xsl:with-param><xsl:with-param name="len">13</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template><xsl:call-template name="Postpad"><xsl:with-param name="padVar">Transaction</xsl:with-param><xsl:with-param name="len">13</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template><xsl:call-template name="Prepad"><xsl:with-param name="padVar">Gross Premium</xsl:with-param><xsl:with-param name="len">22</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template><xsl:call-template name="Prepad"><xsl:with-param name="padVar">Commision</xsl:with-param><xsl:with-param name="len">22</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template><xsl:call-template name="Prepad"><xsl:with-param name="padVar">Non Premium</xsl:with-param><xsl:with-param name="len">22</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template><xsl:call-template name="Prepad"><xsl:with-param name="padVar">Net Premium</xsl:with-param><xsl:with-param name="len">22</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template></fo:block>
<fo:block text-align="left" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> <xsl:call-template name="Postpad"><xsl:with-param name="len">8</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template><xsl:call-template name="Postpad"><xsl:with-param name="len">11</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template><xsl:call-template name="Postpad"><xsl:with-param name="len">8</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template><xsl:call-template name="Postpad"><xsl:with-param name="len">62</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template><xsl:call-template name="Postpad"><xsl:with-param name="len">32</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template><xsl:call-template name="Postpad"><xsl:with-param name="padVar">Date</xsl:with-param><xsl:with-param name="len">13</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template><xsl:call-template name="Postpad"><xsl:with-param name="padVar">Date</xsl:with-param><xsl:with-param name="len">13</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template><xsl:call-template name="Postpad"><xsl:with-param name="padVar">Method</xsl:with-param><xsl:with-param name="len">13</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template><xsl:call-template name="Postpad"><xsl:with-param name="padVar">Type</xsl:with-param><xsl:with-param name="len">13</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template></fo:block>                                                                                                                                                              
<fo:block text-align="left" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"><xsl:call-template name="Postpad"><xsl:with-param name="len">263</xsl:with-param><xsl:with-param name="padChar">-</xsl:with-param></xsl:call-template>  </fo:block>
<fo:block text-align="left" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">
</fo:block>
</xsl:template>

<xsl:template match="record[@name = 'ZGCOLHDG']" xml:space="preserve">
<fo:block text-align="left" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="left" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">
</fo:block>
</xsl:template>

<xsl:template match="record[@name = 'ZFDTLRCD']" xml:space="preserve">
<fo:block text-align="left" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="inpolsym"/></xsl:with-param><xsl:with-param name="len">8</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template><xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="inpolno"/></xsl:with-param><xsl:with-param name="len">11</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template><xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="inpolmod"/></xsl:with-param><xsl:with-param name="len">8</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template><xsl:call-template name="Postpadortruncate"><xsl:with-param name="padVar"><xsl:value-of select="ininsname"/></xsl:with-param><xsl:with-param name="len">62</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template><xsl:call-template name="Postpadortruncate"><xsl:with-param name="padVar"><xsl:value-of select="inbrname"/></xsl:with-param><xsl:with-param name="len">32</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template><xsl:call-template name="cvtdateCYYMMDDtoMMDDYY"><xsl:with-param name="datefld"><xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="intrdate"/></xsl:with-param><xsl:with-param name="len">13</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template></xsl:with-param></xsl:call-template><xsl:call-template name="cvtdateCYYMMDDtoMMDDYY"><xsl:with-param name="datefld"><xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="inindate"/></xsl:with-param><xsl:with-param name="len">13</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template></xsl:with-param></xsl:call-template><xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="ininmethod"/></xsl:with-param><xsl:with-param name="len">13</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template><xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="intrtype"/></xsl:with-param><xsl:with-param name="len">13</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template><xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="format-number(ingrpremium,'###,###,###,###,###,###.00')"/></xsl:with-param><xsl:with-param name="len">22</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template><xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="format-number(incommision,'###,###,###,###,###,###.00')"/></xsl:with-param><xsl:with-param name="len">22</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template><xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="format-number(innonprem,'###,###,###,###,###,###.00')"/></xsl:with-param><xsl:with-param name="len">22</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template><xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="format-number(innetpremium,'###,###,###,###,###,###.00')"/></xsl:with-param><xsl:with-param name="len">22</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template></fo:block>
<fo:block text-align="left" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">
</fo:block>
</xsl:template>
<!--FSIT #169197 Resolution id:60148  started     -->
<xsl:template match="record[@name = 'ZBKEYTTL']" xml:space="preserve">
<fo:block text-align="left" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"><xsl:call-template name="Postpad"><xsl:with-param name="len">263</xsl:with-param><xsl:with-param name="padChar">-</xsl:with-param></xsl:call-template>  </fo:block>
<!-- FSIT#181368 RESL#66413 - Start -->
<!--fo:block text-align="left" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> SubTotal: <xsl:call-template name="Postpad"><xsl:with-param name="padVar"></xsl:with-param><xsl:with-param name="len">163</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template><xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="format-number(zgmcowrit,'###,###,###,###,###,###.00')"/></xsl:with-param><xsl:with-param name="len">22</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template><xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="format-number(zgmcowrit1,'###,###,###,###,###,###.00')"/></xsl:with-param><xsl:with-param name="len">22</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template><xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="format-number(zgmcowrit3,'###,###,###,###,###,###.00')"/></xsl:with-param><xsl:with-param name="len">22</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template><xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="format-number(zgmcowrit2,'###,###,###,###,###,###.00')"/></xsl:with-param><xsl:with-param name="len">22</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template></fo:block-->
<fo:block text-align="left" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"><xsl:call-template name="Postpadortruncate"><xsl:with-param name="padVar">SubTotal for Broker <xsl:value-of select="brokername"/>: </xsl:with-param><xsl:with-param name="len">174</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template><xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="format-number(zgmcowrit,'###,###,###,###,###,###.00')"/></xsl:with-param><xsl:with-param name="len">22</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template><xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="format-number(zgmcowrit1,'###,###,###,###,###,###.00')"/></xsl:with-param><xsl:with-param name="len">22</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template><xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="format-number(zgmcowrit3,'###,###,###,###,###,###.00')"/></xsl:with-param><xsl:with-param name="len">22</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template><xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="format-number(zgmcowrit2,'###,###,###,###,###,###.00')"/></xsl:with-param><xsl:with-param name="len">22</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template></fo:block>
<!-- FSIT#181368 RESL#66413 - End -->
<fo:block text-align="left" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="left" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="left" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">
</fo:block>
</xsl:template>

<xsl:template match="record[@name = 'ZGKEYTTL']" xml:space="preserve">
<fo:block text-align="left" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"><xsl:call-template name="Postpad"><xsl:with-param name="len">263</xsl:with-param><xsl:with-param name="padChar">-</xsl:with-param></xsl:call-template>  </fo:block>
<fo:block text-align="left" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">Grand Total By Master Company : <xsl:call-template name="Postpad"><xsl:with-param name="padVar"></xsl:with-param><xsl:with-param name="len">141</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="format-number(zgmcowrit,'###,###,###,###,###,###.00')"/></xsl:with-param><xsl:with-param name="len">22</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template><xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="format-number(zgmcowrit1,'###,###,###,###,###,###.00')"/></xsl:with-param><xsl:with-param name="len">22</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template><xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="format-number(zgmcowrit3,'###,###,###,###,###,###.00')"/></xsl:with-param><xsl:with-param name="len">22</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template><xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="format-number(zgmcowrit2,'###,###,###,###,###,###.00')"/></xsl:with-param><xsl:with-param name="len">22</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template></fo:block>
<fo:block text-align="left" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="left" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="left" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">
</fo:block>
</xsl:template>
<!--FSIT #169197 Resolution id:60148  Ends     -->
<xsl:template match="record[@name = 'ZJENDRPT']" xml:space="preserve">
<fo:block text-align="left" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">  ** END OF REPORT ** </fo:block>
<fo:block text-align="left" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="left" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">
</fo:block>
</xsl:template>
</xsl:stylesheet>