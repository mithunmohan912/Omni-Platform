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

<!-- Auto Generated XSLT for printer file DDS PMSPAP51-->
<xsl:template match="record[@name = 'HEADER']" xml:space="preserve">
<!--FSIT - 160690, RESOLUTION - 59815 , START-->
<!--<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" >  PMSBAP51                                       H E L D   I T E M S   R E P O R TV O I D E D   C H E C K S   R E P O R T M A N U A L   C H E C K S   R E P O R T P R E  -  E S C H E A T M E N T   R E P O R T P O S T  -  E S C H E A T M E N T   R E P O R T PAGE: <fo:page-number/> </fo:block>-->
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" >  PMSBAP51  <xsl:call-template name="Header1"><xsl:with-param name="in_11"><xsl:value-of select="in_11"/></xsl:with-param><xsl:with-param name="in_12"><xsl:value-of select="in_12"/></xsl:with-param><xsl:with-param name="in_13"><xsl:value-of select="in_13"/></xsl:with-param><xsl:with-param name="in_14"><xsl:value-of select="in_14"/></xsl:with-param><xsl:with-param name="in_15"><xsl:value-of select="in_15"/></xsl:with-param> </xsl:call-template>   PAGE: <fo:page-number/> </fo:block>
<!--FSIT - 160690, RESOLUTION - 59815 , END-->
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">  BANK: <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="banknumber"/></xsl:with-param><xsl:with-param name="len">4</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>  <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="bankname"/></xsl:with-param><xsl:with-param name="len">25</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>                                                                            DATE: <xsl:value-of select="$date"/> </fo:block>
<!--FSIT - 160690, RESOLUTION - 59815 , START-->
<!--<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">  TYPE: RETURN PREMIUMS CLAIMS PAYMENTS AGENTS COMMISSIONS FROM:<xsl:call-template name="cvtdateCYYMMDDtoMMDDYY"><xsl:with-param name="datefld"><xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="fromdate"/></xsl:with-param><xsl:with-param name="len">6</xsl:with-param><xsl:with-param name="padChar">0</xsl:with-param></xsl:call-template></xsl:with-param></xsl:call-template> TO: <xsl:call-template name="cvtdateCYYMMDDtoMMDDYY"><xsl:with-param name="datefld"><xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="todate"/></xsl:with-param><xsl:with-param name="len">6</xsl:with-param><xsl:with-param name="padChar">0</xsl:with-param></xsl:call-template></xsl:with-param></xsl:call-template>                              TIME: <xsl:value-of select="$time"/> </fo:block>-->
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">  TYPE: <xsl:call-template name="Header2"><xsl:with-param name="in_01"><xsl:value-of select="in_01"/></xsl:with-param><xsl:with-param name="in_02"><xsl:value-of select="in_02"/></xsl:with-param><xsl:with-param name="in_03"><xsl:value-of select="in_03"/></xsl:with-param></xsl:call-template> FROM:<xsl:call-template name="cvtdateCYYMMDDtoMMDDYY"><xsl:with-param name="datefld"><xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="fromdate"/></xsl:with-param><xsl:with-param name="len">6</xsl:with-param><xsl:with-param name="padChar">0</xsl:with-param></xsl:call-template></xsl:with-param></xsl:call-template> TO: <xsl:call-template name="cvtdateCYYMMDDtoMMDDYY"><xsl:with-param name="datefld"><xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="todate"/></xsl:with-param><xsl:with-param name="len">6</xsl:with-param><xsl:with-param name="padChar">0</xsl:with-param></xsl:call-template></xsl:with-param></xsl:call-template>                              TIME: <xsl:value-of select="$time"/> </fo:block>
<!--FSIT - 160690, RESOLUTION - 59815 , END-->
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> ----------------------------------------------------------------------------------------------------------------------------------- </fo:block>
<!--FSIT - 160690, RESOLUTION - 59815 , START-->
<!--<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">   CHECKAGENT      CHECK  POLICY                            PAYABLE    CREATION     CHECK      VOIDCLAIM    CLAIMANT      </fo:block>-->
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">   <xsl:call-template name="Header3"><xsl:with-param name="in_01"><xsl:value-of select="in_01"/></xsl:with-param><xsl:with-param name="in_02"><xsl:value-of select="in_02"/></xsl:with-param><xsl:with-param name="in_04"><xsl:value-of select="in_04"/></xsl:with-param></xsl:call-template>                                        PAYABLE    CREATION  <xsl:call-template name="Header4">     <xsl:with-param name="in_02"><xsl:value-of select="in_02"/></xsl:with-param><xsl:with-param name="in_11"><xsl:value-of select="in_11"/></xsl:with-param><xsl:with-param name="in_12"><xsl:value-of select="in_12"/></xsl:with-param><xsl:with-param name="in_13"><xsl:value-of select="in_13"/></xsl:with-param></xsl:call-template></fo:block>
<!--<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">   NUMBERNUMBERSYM NUMBER MOD LOC NUMBER PAYEE                           AMOUNT      DATE        DATE       DATE DATE NUMBERNUMBER     </fo:block>-->
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">   <xsl:call-template name="Header5"><xsl:with-param name="in_01"><xsl:value-of select="in_01"/></xsl:with-param><xsl:with-param name="in_02"><xsl:value-of select="in_02"/></xsl:with-param><xsl:with-param name="in_04"><xsl:value-of select="in_04"/></xsl:with-param></xsl:call-template><!--SYM NUMBER MOD LOC-->         PAYEE                              AMOUNT      DATE       DATE      <xsl:call-template name="Header6"><xsl:with-param name="in_02"><xsl:value-of select="in_02"/></xsl:with-param><xsl:with-param name="in_12"><xsl:value-of select="in_12"/></xsl:with-param><xsl:with-param name="in_11"><xsl:value-of select="in_11"/></xsl:with-param><xsl:with-param name="in_13"><xsl:value-of select="in_13"/></xsl:with-param></xsl:call-template> </fo:block>
<!--FSIT - 160690, RESOLUTION - 59815 , END-->
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> ----------------------------------------------------------------------------------------------------------------------------------- </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">
</fo:block>
</xsl:template>
<xsl:template match="record[@name = 'DETAIL']" xml:space="preserve">
<!--FSIT - 160690, RESOLUTION - 59815 , START-->
<!--<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" > <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="checkno"/></xsl:with-param><xsl:with-param name="len">7</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="checknbr"/></xsl:with-param><xsl:with-param name="len">7</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="symbol"/></xsl:with-param><xsl:with-param name="len">3</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="polnumber"/></xsl:with-param><xsl:with-param name="len">7</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="module"/></xsl:with-param><xsl:with-param name="len">2</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="location"/></xsl:with-param><xsl:with-param name="len">2</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="agency"/></xsl:with-param><xsl:with-param name="len">7</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>  <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="payeename"/></xsl:with-param><xsl:with-param name="len">30</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="checkamt"/></xsl:with-param><xsl:with-param name="len">11</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> <xsl:call-template name="cvtdateCYYMMDDtoMMDDYY"><xsl:with-param name="datefld"> <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="crtdate"/></xsl:with-param><xsl:with-param name="len">6</xsl:with-param><xsl:with-param name="padChar">0</xsl:with-param></xsl:call-template></xsl:with-param></xsl:call-template> <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="update1"/></xsl:with-param><xsl:with-param name="len">6</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="update2"/></xsl:with-param><xsl:with-param name="len">6</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="clno"/></xsl:with-param><xsl:with-param name="len">12</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="clmntno"/></xsl:with-param><xsl:with-param name="len">4</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>   </fo:block>-->
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" > <xsl:call-template name="Header10"><xsl:with-param name="in_04"><xsl:value-of select="in_04"/></xsl:with-param></xsl:call-template>  <!--<xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="checkno"/></xsl:with-param><xsl:with-param name="len">7</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template><xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="checknbr"/></xsl:with-param><xsl:with-param name="len">7</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>--> <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="symbol"/></xsl:with-param><xsl:with-param name="len">3</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="polnumber"/></xsl:with-param><xsl:with-param name="len">7</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="module"/></xsl:with-param><xsl:with-param name="len">2</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="location"/></xsl:with-param><xsl:with-param name="len">2</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> <xsl:call-template name="Header11"><xsl:with-param name="in_04"><xsl:value-of select="in_04"/></xsl:with-param></xsl:call-template> <!--<xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="agency"/></xsl:with-param><xsl:with-param name="len">7</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>-->  <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="payeename"/></xsl:with-param><xsl:with-param name="len">30</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="checkamt"/></xsl:with-param><xsl:with-param name="len">11</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>    <xsl:call-template name="cvtdateCYYMMDDtoMMDDYY"><xsl:with-param name="datefld"><xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="crtdate"/></xsl:with-param><xsl:with-param name="len">6</xsl:with-param><xsl:with-param name="padChar">0</xsl:with-param></xsl:call-template></xsl:with-param></xsl:call-template>  <xsl:call-template name="cvtdateCYYMMDDtoMMDDYY"><xsl:with-param name="datefld"><xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="update1"/></xsl:with-param><xsl:with-param name="len">6</xsl:with-param><xsl:with-param name="padChar">0</xsl:with-param></xsl:call-template></xsl:with-param></xsl:call-template>  <xsl:call-template name="Header9"><xsl:with-param name="in_12"><xsl:value-of select="in_12"/></xsl:with-param></xsl:call-template> <xsl:call-template name="Header12"><xsl:with-param name="in_02"><xsl:value-of select="in_02"/></xsl:with-param></xsl:call-template> <!--<xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="clno"/></xsl:with-param><xsl:with-param name="len">12</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="clmntno"/></xsl:with-param><xsl:with-param name="len">4</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>-->   </fo:block>
<!--FSIT - 160690, RESOLUTION - 59815 , END-->
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">
</fo:block>
</xsl:template>
<xsl:template match="record[@name = 'SUBTOTAL']" xml:space="preserve">
<!--FSIT - 160690, RESOLUTION - 59815 , START-->
<!--<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" >         RETURN PREMIUMS CLAIMS PAYMENT AGENTS COMMISSIONS ITEMS HELD: VOIDED CHECKS: MANUAL CHECKS: PRE-ESCHEATMENTS:  POST-ESCHEATMENTS:  <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="subtotnbr"/></xsl:with-param><xsl:with-param name="len">7</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>     AMOUNT: <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="subtotamt"/></xsl:with-param><xsl:with-param name="len">11</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> </fo:block>-->
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" >          <xsl:call-template name="Header7"><xsl:with-param name="in_01"><xsl:value-of select="in_01"/></xsl:with-param><xsl:with-param name="in_02"><xsl:value-of select="in_02"/></xsl:with-param><xsl:with-param name="in_03"><xsl:value-of select="in_03"/></xsl:with-param><xsl:with-param name="in_11"><xsl:value-of select="in_11"/></xsl:with-param><xsl:with-param name="in_12"><xsl:value-of select="in_12"/></xsl:with-param><xsl:with-param name="in_13"><xsl:value-of select="in_13"/></xsl:with-param><xsl:with-param name="in_14"><xsl:value-of select="in_14"/></xsl:with-param><xsl:with-param name="in_15"><xsl:value-of select="in_15"/></xsl:with-param></xsl:call-template>   <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="subtotnbr"/></xsl:with-param><xsl:with-param name="len">7</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>     AMOUNT: <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="subtotamt"/></xsl:with-param><xsl:with-param name="len">11</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> </fo:block>
<!--FSIT - 160690, RESOLUTION - 59815 , END-->
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">
</fo:block>
</xsl:template><xsl:template match="record[@name = 'TOTAL']" xml:space="preserve">
<!--FSIT - 160690, RESOLUTION - 59815 , START-->
<!--<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" >          BANK  <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="banknumber"/></xsl:with-param><xsl:with-param name="len">4</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>         ITEMS HELD:    VOIDED CHECKS: MANUAL CHECKS: PRE-ESCHEATMENTS:  POST-ESCHEATMENTS:  <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="totnbr"/></xsl:with-param><xsl:with-param name="len">7</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> AMOUNT: <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="totamt"/></xsl:with-param><xsl:with-param name="len">11</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>-->
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" >          BANK  <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="banknumber"/></xsl:with-param><xsl:with-param name="len">4</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> <xsl:call-template name="Header8">     <xsl:with-param name="in_11"><xsl:value-of select="in_11"/></xsl:with-param><xsl:with-param name="in_12"><xsl:value-of select="in_12"/></xsl:with-param><xsl:with-param name="in_13"><xsl:value-of select="in_13"/></xsl:with-param><xsl:with-param name="in_14"><xsl:value-of select="in_14"/></xsl:with-param><xsl:with-param name="in_15"><xsl:value-of select="in_15"/></xsl:with-param></xsl:call-template>     <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="totnbr"/></xsl:with-param><xsl:with-param name="len">7</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>     AMOUNT: <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="totamt"/></xsl:with-param><xsl:with-param name="len">11</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>
<!--FSIT - 160690, RESOLUTION - 59815 , END-->
</fo:block>
</xsl:template><xsl:template match="record[@name = 'NODATA']" xml:space="preserve">
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" >                                 NO RECORDS FOR THIS REPORT </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">
</fo:block>
</xsl:template>
<!--FSIT - 160690, RESOLUTION - 59815 , START-->
<xsl:template name="Header1">	
	<xsl:param name="in_13"/>
	<xsl:param name="in_11"/>
	<xsl:param name="in_12"/>
	<xsl:param name="in_14"/>
	<xsl:param name="in_15"/>
	
		<xsl:if test="($in_13 ='true')">
			<xsl:value-of select="'								                   						      M A N U A L     C H E C K S     R E P O R T 													    '"/>
		</xsl:if>
		<xsl:if test="($in_12 ='true')">
			<xsl:value-of select="'                                    V O I D E D     C H E C K S     R E P O R T                     '"/>
		</xsl:if>
		<xsl:if test="($in_11 ='true')">
			<xsl:value-of select="'                                         H E L D     I T E M S     R E P O R T                      '"/>
		</xsl:if>
		<xsl:if test="($in_14 ='true')">
			<xsl:value-of select="'                                                                           P R E  -  E S C H E A T M E N T   R E P O R T                                                     '"/>
		</xsl:if>
		<xsl:if test="($in_15 ='true')">
			<xsl:value-of select="'                                                                           P O S T  -  E S C H E A T M E N T   R E P O R T                                                   '"/>
		</xsl:if>
	
</xsl:template>
<xsl:template name="Header2">	
	<xsl:param name="in_01"/>
	<xsl:param name="in_02"/>
	<xsl:param name="in_03"/>
	<xsl:param name="in_04"/>
		<xsl:if test="($in_01 ='true')">
			<xsl:value-of select="'RETURN PREMIUMS                                   '"/>
		</xsl:if>	 
		<xsl:if test="($in_02 ='true')">
			<xsl:value-of select="'CLAIMS PAYMENTS                                   '"/>
		</xsl:if>
		<xsl:if test="($in_03 ='true')">
			<xsl:value-of select="'AGENTS COMMISSIONS                                '"/>
		</xsl:if>
</xsl:template>

<xsl:template name="Header3">	
	<xsl:param name="in_02"/>
	<xsl:param name="in_01"/>
	<xsl:param name="in_04"/>
		<xsl:if test="($in_01 ='true')">
			<xsl:value-of select="'CHECK   '"/>
		</xsl:if>
		<xsl:if test="($in_02 ='true') and ($in_04 ='false')">
			<xsl:value-of select="'CHECK   '"/>
		</xsl:if>
		<xsl:if test="($in_04 ='true')">
			<xsl:value-of select="'AGENT       CHECK                  '"/>
		</xsl:if>
		<xsl:if test="($in_04 ='false')">
			<xsl:value-of select="'      ------POLICY------   '"/>
		</xsl:if>
</xsl:template>
		
<xsl:template name="Header4">	
	<xsl:param name="in_02"/>
	<xsl:param name="in_12"/>
	<xsl:param name="in_13"/>
	<xsl:param name="in_11"/>
		<xsl:if test="($in_13 ='true')">
			<xsl:value-of select="'  CHECK   '"/>
		</xsl:if>
		<xsl:if test="($in_12 ='true')">
	    	<xsl:value-of select="'  CHECK   '"/>
			<xsl:value-of select="'  VOID  '"/>
		</xsl:if>
		<xsl:if test="($in_11 ='true') and ($in_02 ='true')">
			<xsl:value-of select="'              CLAIM     CLAIMANT   '"/>
		</xsl:if>
		<xsl:if test="($in_13 ='true') and ($in_02 ='true')">
			<xsl:value-of select="'    CLAIM     CLAIMANT   '"/>
		</xsl:if>
</xsl:template>

<xsl:template name="Header5">	
	<xsl:param name="in_02"/>
	<xsl:param name="in_01"/>
	<xsl:param name="in_04"/>
		<xsl:if test="($in_02 ='true')">
			<xsl:value-of select="'NUMBER   '"/>
		</xsl:if>
		<xsl:if test="($in_01 ='true')">
			<xsl:value-of select="'NUMBER   '"/>
		</xsl:if>
		<xsl:if test="($in_04 ='true')">
			<xsl:value-of select="'NUMBER     NUMBER              '"/>
		</xsl:if>
		<xsl:if test="($in_04 ='false')">
			<xsl:value-of select="'     SYM NUMBER MOD LOC'"/>
		</xsl:if>
</xsl:template>
	
<xsl:template name="Header6">	
	<xsl:param name="in_02"/>
	<xsl:param name="in_12"/>
	<xsl:param name="in_13"/>
	<xsl:param name="in_11"/>
	<xsl:if test="($in_12 ='true')">
		<xsl:value-of select="'DATE '"/>
	</xsl:if>
	<xsl:if test="($in_11 ='true') and ($in_02 ='true')">
		<xsl:value-of select="'  NUMBER  '"/>
		<xsl:value-of select="'  NUMBER   '"/>
	</xsl:if>
	<xsl:if test="($in_13 ='true') and ($in_02 ='true')">
		<xsl:value-of select="'  NUMBER  '"/>
		<xsl:value-of select="'  NUMBER   '"/>
	</xsl:if>
</xsl:template>
		
<xsl:template name="Header7">	
	<xsl:param name="in_03"/>
	<xsl:param name="in_01"/>
	<xsl:param name="in_02"/>
	<xsl:param name="in_13"/>
	<xsl:param name="in_11"/>
	<xsl:param name="in_12"/>
	<xsl:param name="in_14"/>
	<xsl:param name="in_15"/>
	
	<xsl:if test="($in_01 ='true')">
		<xsl:value-of select="'RETURN PREMIUMS   '"/>
	</xsl:if>
	
	<xsl:if test="($in_02 ='true')">
		<xsl:value-of select="'CLAIMS PAYMENT    '"/>
	</xsl:if>
	
	<xsl:if test="($in_03 ='true')">
		<xsl:value-of select="'AGENTS COMMISSIONS'"/>
	</xsl:if>
	
	<xsl:if test="($in_11 ='true')">
		<xsl:value-of select="'        ITEMS HELD:     '"/>
	</xsl:if>
	
	<xsl:if test="($in_12 ='true')">
		<xsl:value-of select="'        VOIDED CHECKS:  '"/>
	</xsl:if>
	
	<xsl:if test="($in_13 ='true')">
		<xsl:value-of select="'        MANUAL CHECKS:  '"/>
	</xsl:if>
	
	<xsl:if test="($in_14 ='true')">
		<xsl:value-of select="'PRE-ESCHEATMENTS:  '"/>
	</xsl:if>
	
	<xsl:if test="($in_15 ='true')">
		<xsl:value-of select="' POST-ESCHEATMENTS:  '"/>
	</xsl:if>
</xsl:template>

<xsl:template name="Header8">
    <xsl:param name="in_13"/>
	<xsl:param name="in_11"/>
	<xsl:param name="in_12"/>
	<xsl:param name="in_14"/>
	<xsl:param name="in_15"/>
   
	<xsl:if test="($in_11 ='true')">
		<xsl:value-of select="'               ITEMS HELD:   '"/>
	</xsl:if>
	
	<xsl:if test="($in_12 ='true')">
		<xsl:value-of select="'               VOIDED CHECKS:'"/>
	</xsl:if>
	
	<xsl:if test="($in_13 ='true')">
		<xsl:value-of select="'               MANUAL CHECKS:'"/>
	</xsl:if>
	
	<xsl:if test="($in_14 ='true')">
		<xsl:value-of select="'PRE-ESCHEATMENTS:  '"/>
	</xsl:if>
	
	<xsl:if test="($in_15 ='true')">
		<xsl:value-of select="' POST-ESCHEATMENTS:  '"/>
	</xsl:if>
</xsl:template>

<xsl:template name="Header9">
    <xsl:param name="in_12"/>
    
    	<xsl:if test="($in_12 ='true')">
		<xsl:call-template name="cvtdateCYYMMDDtoMMDDYY"><xsl:with-param name="datefld"><xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="update1"/></xsl:with-param><xsl:with-param name="len">6</xsl:with-param><xsl:with-param name="padChar">0</xsl:with-param></xsl:call-template></xsl:with-param></xsl:call-template>
	</xsl:if>
	
</xsl:template>

<xsl:template name="Header10">
    <xsl:param name="in_04"/>
    <!--<xsl:param name="in_02"/>-->
    
    	<xsl:if test="($in_04 ='true')">
		<xsl:value-of select="' '"/><xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="agency"/></xsl:with-param><xsl:with-param name="len">7</xsl:with-param><xsl:with-param name="padChar">0</xsl:with-param></xsl:call-template> <xsl:value-of select="'    '"/>   <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="checknbr"/></xsl:with-param><xsl:with-param name="len">7</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>
	</xsl:if>
	<xsl:if test="($in_04 ='false')">
	<xsl:value-of select="' '"/><xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="checkno"/></xsl:with-param><xsl:with-param name="len">7</xsl:with-param><xsl:with-param name="padChar"><xsl:value-of select="' '"/></xsl:with-param></xsl:call-template> <xsl:value-of select="'     '"/>
	</xsl:if>
</xsl:template>

<xsl:template name="Header11">
    <xsl:param name="in_04"/>
    
    	<xsl:if test="($in_04 ='false')">
		<xsl:value-of select="'      '"/>
	</xsl:if>
	
</xsl:template>

<xsl:template name="Header12">
    <xsl:param name="in_02"/>
   
    
    	<xsl:if test="($in_02 ='true')">
		<xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="clno"/></xsl:with-param><xsl:with-param name="len">12</xsl:with-param><xsl:with-param name="padChar"><xsl:value-of select="' '"/></xsl:with-param></xsl:call-template><xsl:value-of select="' '"/> <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="clmntno"/></xsl:with-param><xsl:with-param name="len">4</xsl:with-param><xsl:with-param name="padChar"><xsl:value-of select="' '"/></xsl:with-param></xsl:call-template>
	</xsl:if>
	
</xsl:template>


<!--FSIT - 160690, RESOLUTION - 59815 , END-->
</xsl:stylesheet>