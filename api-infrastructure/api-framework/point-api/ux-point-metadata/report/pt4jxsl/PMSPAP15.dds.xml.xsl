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

<!-- Auto Generated XSLT for printer file DDS PMSPAP15-->
<xsl:template match="record[@name = 'HEADER']" xml:space="preserve">
<!--FSIT - 160689 Resoltuion - 58293 Start-->
<xsl:call-template name="Header1"><xsl:with-param name="in_01"><xsl:value-of select="in_01"/></xsl:with-param><xsl:with-param name="in_02"><xsl:value-of select="in_02"/></xsl:with-param></xsl:call-template>
<!--FSIT - 160689 Resoltuion - 58293 End-->
<!--FSIT - 160689 Resoltuion - 58293 Start-->
<!--<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" > PMSBAP15                                               PRE-CHECK REGISTER                                           PAGE :     <fo:page-number/> </fo:block>-->
<!--FSIT - 160689 Resoltuion - 58293 Start-->
<xsl:call-template name="Header2"><xsl:with-param name="in_01"><xsl:value-of select="in_01"/></xsl:with-param><xsl:with-param name="in_02"><xsl:value-of select="in_02"/></xsl:with-param><xsl:with-param name="in_04"><xsl:value-of select="in_04"/></xsl:with-param></xsl:call-template>
<!--FSIT - 160689 Resoltuion - 58293 End-->
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" > PMSBAP15                                               PRE-CHECK REGISTER                                           PAGE :       <xsl:choose><xsl:when test="(in_07 = 'true')">0 </xsl:when><xsl:otherwise><fo:page-number/> </xsl:otherwise></xsl:choose><!--<xsl:if test="(in_07 = 'true')">0 </xsl:if><xsl:if test="(in_07 = 'false')"><fo:page-number/> </xsl:if>--></fo:block>
<!--FSIT - 160689 Resoltuion - 58293 End--> 
<!--FSIT - 160689 Resoltuion - 58293 Start-->
<!--<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> BANK: <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="bankid"/></xsl:with-param><xsl:with-param name="len">4</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>                                        <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="bankname"/></xsl:with-param><xsl:with-param name="len">30</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> GRAND TOTALS                       DATE :  <xsl:value-of select="$date"/> </fo:block>-->
<!--<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">                                                           RETURN ITEMSCLAIM PAYMENTS AGENT COMMISSIONS AGENCY REFUND PAYMENTS TIME :  <xsl:value-of select="$time"/> </fo:block>-->
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"><xsl:choose><xsl:when test="(in_01 = 'true' and in_02 = 'false')"> BANK: <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="bankid"/></xsl:with-param><xsl:with-param name="len">4</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>                                         <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="bankname"/></xsl:with-param><xsl:with-param name="len">30</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template></xsl:when><xsl:when test="(in_01 = 'true' and in_02 = 'true' )">                                                           GRAND TOTALS           </xsl:when><xsl:otherwise>                                                                                  </xsl:otherwise></xsl:choose>                                   DATE :  <xsl:value-of select="$date"/> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"><xsl:choose><xsl:when test="(in_01 = 'true' and in_02 = 'false')"><xsl:if test="(in_06 = 'false' and in_05 = 'false' and in_08 = 'false')">                                                           RETURN ITEMS </xsl:if><xsl:if test="(in_06 = 'true' and in_05 = 'false' and in_08 = 'false')">                                                          CLAIM PAYMENTS</xsl:if><xsl:if test="(in_06 = 'false' and in_05 = 'true'and in_08 = 'false')">                                                       AGENT COMMISSIONS</xsl:if><xsl:if test="(in_01 = 'true' and in_02 = 'true')">AGENCY REFUND PAYMENTS </xsl:if></xsl:when><xsl:otherwise>                                                                        </xsl:otherwise></xsl:choose>                                             TIME :  <xsl:value-of select="$time"/> </fo:block>
<!--FSIT - 160689 Resoltuion - 58293 End-->
<!--FSIT - 160689 Resoltuion - 58293 Start-->
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<!-- <fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">                                                                                                                                0 </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> BANK: <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="bankid"/></xsl:with-param><xsl:with-param name="len">4</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>                                        <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="bankname"/></xsl:with-param><xsl:with-param name="len">30</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> GRAND TOTALS                       DATE :  <xsl:value-of select="$date"/> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">                                                           RETURN ITEMSCLAIM PAYMENTS AGENT COMMISSIONS AGENCY REFUND PAYMENTS TIME :  <xsl:value-of select="$time"/> </fo:block>-->
<!--FSIT - 160689 Resoltuion - 58293 End-->
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<!--FSIT - 160689 Resoltuion - 58293 Start-->
<xsl:if test="(in_01 = 'true' and in_02 = 'false')">
<!--FSIT - 160689 Resoltuion - 58293 End-->
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">                                                              GENERATION </fo:block>
<!--FSIT - 160689 Resoltuion - 58293 Start-->
<!--<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">  ITEM#    SYM POLICY  MOD ITEM#        AGENT NO    PAYEE     DATE   TIME          AGENT COMM AMT </fo:block>-->
<!--FSIT - 160689 Resoltuion - 58293 End-->
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<!--FSIT - 160689 Resoltuion - 58293 Start-->
</xsl:if>
<!--FSIT - 160689 Resoltuion - 58293 End-->
<!--FSIT - 160689 Resoltuion - 58293 Start-->
<!--<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">  ITEM#    SYM POLICY  MOD ITEM#        AGENT NO    PAYEE     DATE   TIME          AGENT COMM AMT </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">                                                                                        CLAIM AMT         CLAIM NO       CLAIMANT NO </fo:block>-->
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"><xsl:if test="(in_11 = 'true')">     ITEM# SYM POLICY  MOD</xsl:if><xsl:if test="(in_10 = 'true')">    ITEM#    AGENT NO    </xsl:if><xsl:if test="(in_01 = 'true' and in_02 = 'false')">      PAYEE                     DATE     TIME<xsl:if test="(in_01 = 'true' and in_02 = 'false')"><xsl:if test="(in_05 = 'true' and in_06 = 'false' and in_08 = 'false')">         AGENT COMM AMT</xsl:if><xsl:if test="(in_05 = 'false' and in_06 = 'false' and in_08 = 'false')">          RETURN AMT</xsl:if><xsl:if test="(in_05 = 'false' and in_06 = 'false' and in_08 = 'true')">                                                                                        REFUND AMT</xsl:if><!--<xsl:if test="(in_05 = 'false' and in_06 = 'true'and in_08 = 'false')">                                            CLAIMANT NO</xsl:if>--></xsl:if><xsl:if test="(in_05 = 'false' and in_06 = 'true'and in_08 = 'false')">          CLAIM AMT        CLAIM NO</xsl:if><xsl:if test="(in_05 = 'false' and in_06 = 'true'and in_08 = 'false')">      CLAIMANT NO</xsl:if></xsl:if> </fo:block>
<!--FSIT - 160689 Resoltuion - 58293 End-->
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<!--FSIT - 160689 Resoltuion - 58293 Start-->
<!--FSIT - 160689 Resoltuion - 58293 Start-->
<!-- <fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">                                                                                       RETURN AMT </fo:block>-->
<!--FSIT - 160689 Resoltuion - 58293 End-->
<!--<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">                                                                                       RETURN AMT </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">                                                                                       REFUND AMT </fo:block>-->
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"><!--<xsl:if test="(in_01 = 'true' and in_02 = 'false')"><xsl:if test="(in_05 = 'true' and in_06 = 'false' and in_08 = 'false')">                                                                                     AGENT COMM AMT</xsl:if><xsl:if test="(in_05 = 'false' and in_06 = 'false' and in_08 = 'false')">                                                                                         RETURN AMT</xsl:if><xsl:if test="(in_05 = 'false' and in_06 = 'false' and in_08 = 'true')">                                                                                        REFUND AMT</xsl:if>--><!--<xsl:if test="(in_05 = 'false' and in_06 = 'true'and in_08 = 'false')">                                            CLAIMANT NO</xsl:if></xsl:if>--> </fo:block>
<!--FSIT - 160689 Resoltuion - 58293 End-->
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<!--FSIT - 160689 Resoltuion - 58293 Start-->
<xsl:if test="(in_01 = 'true' and in_02 = 'true')">
<!--FSIT - 160689 Resoltuion - 58293 End-->
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">          RETURN PREMIUMS          CLAIM PAYMENTS             AGENT COMMISSIONS       AGENCY REFUND </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> BANK  ----------------------   ----------------------    ----------------------   ---------------------- </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">  ID   NUMBER          AMOUNT   NUMBER          AMOUNT    NUMBER          AMOUNT   NUMBER          AMOUNT   TOTAL AMOUNT </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> ----  ------          ------   ------          ------    ------          ------   ------          ------   ------------ </fo:block>
<!--FSIT - 160689 Resoltuion - 58293 Start-->
</xsl:if>
<xsl:if test="(in_01 = 'false' and in_02 = 'true')">
<!--FSIT - 160689 Resoltuion - 58293 End-->
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">                              * * * * * * * * * * * *  NO DATA FOUND FOR REPORT  * * * * * * * * * * * * *********************** </fo:block>
<!--FSIT - 160689 Resoltuion - 58293 Start-->
</xsl:if>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">
</fo:block>
<xsl:if test="(in_01 = 'false' and in_02 = 'false')"> 
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">                                                       *********************** </fo:block>
<xsl:if test="(in_04 = 'false')">
<!--FSIT - 160689 Resoltuion - 58293 End-->
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">                                                       * BEGINNING OF REPORT * </fo:block>
<!--FSIT - 160689 Resoltuion - 58293 Start-->
</xsl:if>
<xsl:if test="(in_04 = 'true')">
<!--FSIT - 160689 Resoltuion - 58293 End-->
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">                                                       *    END  OF  REPORT  * </fo:block>
<!--FSIT - 160689 Resoltuion - 58293 Start-->
</xsl:if>
<!--FSIT - 160689 Resoltuion - 58293 End-->
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">                                                       *********************** </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"></fo:block>
<!--FSIT - 160689 Resoltuion - 58293 Start-->
</xsl:if>
<!--FSIT - 160689 Resoltuion - 58293 End-->
</xsl:template>
<xsl:template match="record[@name = 'DETAIL']" xml:space="preserve">
<!--FSIT - 160689 Resoltuion - 58293 Start-->
<!--<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" >  <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="itemnum"/></xsl:with-param><xsl:with-param name="len">7</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>  <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="symbol"/></xsl:with-param><xsl:with-param name="len">3</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="polnum"/></xsl:with-param><xsl:with-param name="len">7</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="agency"/></xsl:with-param><xsl:with-param name="len">7</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="mod"/></xsl:with-param><xsl:with-param name="len">2</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="insname"/></xsl:with-param><xsl:with-param name="len">30</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>                    <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="returnamt"/></xsl:with-param><xsl:with-param name="len">12</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>        <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="claimno"/></xsl:with-param><xsl:with-param name="len">12</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>         <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="clmtseq"/></xsl:with-param><xsl:with-param name="len">4</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> <xsl:call-template name="cvtdateCYYMMDDtoMMDDYY"><xsl:with-param name="datefld"><xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="gendate"/></xsl:with-param><xsl:with-param name="len">7</xsl:with-param><xsl:with-param name="padChar">0</xsl:with-param></xsl:call-template></xsl:with-param></xsl:call-template> <xsl:call-template name="ConvertTime"><xsl:with-param name="Time"><xsl:value-of select="gentime"/></xsl:with-param></xsl:call-template> </fo:block>-->
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" >  <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="itemnum"/></xsl:with-param><xsl:with-param name="len">7</xsl:with-param><xsl:with-param name="padChar">0</xsl:with-param></xsl:call-template>  <xsl:if test="(in_11 = 'true')"><xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="symbol"/></xsl:with-param><xsl:with-param name="len">3</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="polnum"/></xsl:with-param><xsl:with-param name="len">7</xsl:with-param><xsl:with-param name="padChar">0</xsl:with-param></xsl:call-template></xsl:if><xsl:if test="(in_10 = 'true')"> <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="agency"/></xsl:with-param><xsl:with-param name="len">7</xsl:with-param><xsl:with-param name="padChar">0</xsl:with-param></xsl:call-template></xsl:if><xsl:if test="(in_11 = 'true')"> <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="mod"/></xsl:with-param><xsl:with-param name="len">2</xsl:with-param><xsl:with-param name="padChar">0</xsl:with-param></xsl:call-template></xsl:if>       <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="insname"/></xsl:with-param><xsl:with-param name="len">30</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> <xsl:if test="(in_10 = 'true')">    </xsl:if><xsl:call-template name="cvtdateCYYMMDDtoMMDDYY"><xsl:with-param name="datefld"><xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="gendate"/></xsl:with-param><xsl:with-param name="len">7</xsl:with-param><xsl:with-param name="padChar">0</xsl:with-param></xsl:call-template></xsl:with-param></xsl:call-template> <xsl:call-template name="ConvertTime"><xsl:with-param name="Time"><xsl:value-of select="gentime"/></xsl:with-param></xsl:call-template><xsl:if test="(in_10 = 'true')">  </xsl:if>   <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="returnamt"/></xsl:with-param><xsl:with-param name="len">12</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>         <xsl:if test="(in_10 = 'false')"><xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="claimno"/></xsl:with-param><xsl:with-param name="len">12</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template></xsl:if>       <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="clmtseq"/></xsl:with-param><xsl:with-param name="len">4</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template><!-- <xsl:call-template name="cvtdateCYYMMDDtoMMDDYY"><xsl:with-param name="datefld"><xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="gendate"/></xsl:with-param><xsl:with-param name="len">7</xsl:with-param><xsl:with-param name="padChar">0</xsl:with-param></xsl:call-template></xsl:with-param></xsl:call-template> <xsl:call-template name="ConvertTime"><xsl:with-param name="Time"><xsl:value-of select="gentime"/></xsl:with-param></xsl:call-template>--> </fo:block>
<!--FSIT - 160689 Resoltuion - 58293 End-->
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">
</fo:block>
</xsl:template><xsl:template match="record[@name = 'TOTALS']" xml:space="preserve">
<!--FSIT - 160689 Resoltuion - 58293 Start-->
<!--<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" > BANK  <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="bankid"/></xsl:with-param><xsl:with-param name="len">4</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>    TOTAL RETURN ITEMS: TOTAL COMMISSION ITEMS: TOTAL CLAIMS ITEMS: TOTAL REFUND ITEMS: TOTAL ALL ITEMS: <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="ttlout"/></xsl:with-param><xsl:with-param name="len">9</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> AMOUNT: <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="ttlamt"/></xsl:with-param><xsl:with-param name="len">13</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> </fo:block>-->
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" > BANK  <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="bankid"/></xsl:with-param><xsl:with-param name="len">4</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template><xsl:if test="(in_05 = 'false' and in_06 = 'false' and in_08 = 'false')">  TOTAL RETURN ITEMS:  </xsl:if><xsl:if test="(in_05 = 'true' and in_06 = 'false' and in_08 = 'false')">TOTAL COMMISSION ITEMS:</xsl:if><xsl:if test="(in_05 = 'false' and in_06 = 'true'and in_08 = 'false')">  TOTAL CLAIMS ITEMS:  </xsl:if><xsl:if test="(in_05 = 'false' and in_06 = 'false' and in_08 = 'true')"> TOTAL REFUND ITEMS:</xsl:if> <xsl:if test="(in_05 = 'true' and in_06 = 'true')"> TOTAL ALL ITEMS:      </xsl:if><xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="ttlout"/></xsl:with-param><xsl:with-param name="len">9</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>         AMOUNT:                <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="ttlamt"/></xsl:with-param><xsl:with-param name="len">13</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> </fo:block>
<!--FSIT - 160689 Resoltuion - 58293 End-->
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">
</fo:block>
</xsl:template><xsl:template match="record[@name = 'GRNDTTLS']" xml:space="preserve">
<!--FSIT - 160689 Resoltuion - 58293 Start-->
<!--<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" > <xsl:call-template name="cvtdateCYYMMDDtoMMDDYY"><xsl:with-param name="datefld"><xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="bankidt"/></xsl:with-param><xsl:with-param name="len">4</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template></xsl:with-param></xsl:call-template><xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="numrtprm"/></xsl:with-param><xsl:with-param name="len">10</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template><xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="amtrtprm"/></xsl:with-param><xsl:with-param name="len">13</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>   <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="numclmpy"/></xsl:with-param><xsl:with-param name="len">10</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template><xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="amtclmpy"/></xsl:with-param><xsl:with-param name="len">13</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>  <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="numagntc"/></xsl:with-param><xsl:with-param name="len">10</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="amtagntc"/></xsl:with-param><xsl:with-param name="len">13</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>  <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="numagntr"/></xsl:with-param><xsl:with-param name="len">10</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="amtagntr"/></xsl:with-param><xsl:with-param name="len">13</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="bnkttlamt"/></xsl:with-param><xsl:with-param name="len">13</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> </fo:block>-->
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" > <!--<xsl:call-template name="cvtdateCYYMMDDtoMMDDYY"><xsl:with-param name="datefld">--><xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="bankidt"/></xsl:with-param><xsl:with-param name="len">4</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template><!--</xsl:with-param></xsl:call-template>--><xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="numrtprm"/></xsl:with-param><xsl:with-param name="len">10</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template><xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="amtrtprm"/></xsl:with-param><xsl:with-param name="len">13</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>   <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="numclmpy"/></xsl:with-param><xsl:with-param name="len">10</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template><xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="amtclmpy"/></xsl:with-param><xsl:with-param name="len">13</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>  <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="numagntc"/></xsl:with-param><xsl:with-param name="len">10</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="amtagntc"/></xsl:with-param><xsl:with-param name="len">13</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>  <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="numagntr"/></xsl:with-param><xsl:with-param name="len">10</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="amtagntr"/></xsl:with-param><xsl:with-param name="len">13</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="bnkttlamt"/></xsl:with-param><xsl:with-param name="len">13</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> </fo:block>
<!--FSIT - 160689 Resoltuion - 58293 End-->
<!--FSIT - 160689 Resoltuion - 58293 Start-->
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="30pt" white-space="pre">
<!--FSIT - 160689 Resoltuion - 58293 End-->
</fo:block>
</xsl:template>
<!--FSIT - 160689 Resoltuion - 58293 Start-->
<xsl:template name="Header1">	
	<xsl:param name="in_02"/>
	<xsl:param name="in_01"/>
		<xsl:choose>
		<xsl:when test="($in_01 ='true') and ($in_02 ='false')">
			<fo:block break-after='page'/>
		</xsl:when>
		</xsl:choose>
</xsl:template>
<xsl:template name="Header2">	
	<xsl:param name="in_02"/>
	<xsl:param name="in_01"/>
	<xsl:param name="in_04"/>
		<xsl:choose>
		<xsl:when test="($in_04 ='true')">
			<fo:block break-after='page'/>
		</xsl:when>
		</xsl:choose>
		<xsl:choose>
		<xsl:when test="($in_01 ='true') and ($in_02 ='true')">
			<fo:block break-after='page'/>
		</xsl:when>
		</xsl:choose>
</xsl:template>
<!--FSIT - 160689 Resoltuion - 58293 end-->
</xsl:stylesheet>