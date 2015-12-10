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

<!-- Auto Generated XSLT for printer file DDS PMSPAP54-->
<xsl:template match="record[@name = 'HEADER']" xml:space="preserve">
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" > PMSBAP54                                          <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="prtlocation"/></xsl:with-param><xsl:with-param name="len">30</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>                                    PAGE : <fo:page-number/> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">                                            P A Y A B L E S   A C T I V I T Y   L I S T                              DATE :  <xsl:value-of select="$date"/> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">  MCO  <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="prtmcocode"/></xsl:with-param><xsl:with-param name="len">2</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="prtmcotext"/></xsl:with-param><xsl:with-param name="len">30</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>                                                                             TIME :  <xsl:value-of select="$time"/> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">                                                    FROM <xsl:call-template name="cvtdateCYYMMDDtoMMDDYYYY"><xsl:with-param name="datefld"><xsl:value-of select="prtstartdate"/></xsl:with-param></xsl:call-template>  TO <xsl:call-template name="cvtdateCYYMMDDtoMMDDYYYY"><xsl:with-param name="datefld"><xsl:value-of select="prtenddate"/></xsl:with-param></xsl:call-template> </fo:block>
<!--FSIT - 160690, RESOLUTION - 59815 , START-->
<!--<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">  RETURN PREMIUMS </fo:block>-->
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> <xsl:call-template name="Header1"><xsl:with-param name="in_03"><xsl:value-of select="in_03"/></xsl:with-param><xsl:with-param name="in_02"><xsl:value-of select="in_02"/></xsl:with-param></xsl:call-template> </fo:block>
<!--FSIT - 160690, RESOLUTION - 59815 , END-->
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<!--FSIT - 160690, RESOLUTION - 59815 , START-->
<!--<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">  CLAIMS PAID </fo:block>-->
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">  <xsl:call-template name="Header2"><xsl:with-param name="in_03"><xsl:value-of select="in_03"/></xsl:with-param><xsl:with-param name="in_02"><xsl:value-of select="in_02"/></xsl:with-param></xsl:call-template> </fo:block>
<!--FSIT - 160690, RESOLUTION - 59815 , END-->
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<!--FSIT - 160690, RESOLUTION - 59815 , START-->
<!--<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">  AGENTS COMMISSIONS </fo:block>-->
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> <xsl:call-template name="Header3"><xsl:with-param name="in_03"><xsl:value-of select="in_03"/></xsl:with-param><xsl:with-param name="in_02"><xsl:value-of select="in_02"/></xsl:with-param></xsl:call-template> </fo:block>
<!--FSIT - 160690, RESOLUTION - 59815 , END-->
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> ------------------------------------------------------------------------------------------------------------------------------------ </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">                                                      PAYABLE      LAST </fo:block>
<!--FSIT - 160690, RESOLUTION - 59815 , START-->
<!--<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">      POLICY       STATUS                   PAYABLE   ENTRY      CHANGE    PAID      BANK    CHECK      AGENTCLAIM    CLAIMANT EXMNR  </fo:block>-->
	<!--FSIT - 176004, RESOLUTION - 63402 , START-->
<!-- <fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> <xsl:call-template name="Header4"><xsl:with-param name="in_04"><xsl:value-of select="in_04"/></xsl:with-param></xsl:call-template>   STATUS                   PAYABLE   ENTRY      CHANGE    PAID      BANK    CHECK     <xsl:call-template name="Header5"><xsl:with-param name="in_03"><xsl:value-of select="in_03"/></xsl:with-param><xsl:with-param name="in_02"><xsl:value-of select="in_02"/></xsl:with-param></xsl:call-template>   </fo:block> -->
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> <xsl:call-template name="Header4"><xsl:with-param name="in_04"><xsl:value-of select="in_04"/></xsl:with-param></xsl:call-template>   STATUS                PAYABLE     ENTRY      CHANGE    PAID      BANK    CHECK     <xsl:call-template name="Header5"><xsl:with-param name="in_03"><xsl:value-of select="in_03"/></xsl:with-param><xsl:with-param name="in_02"><xsl:value-of select="in_02"/></xsl:with-param></xsl:call-template>   </fo:block>
	<!--FSIT - 176004, RESOLUTION - 63402 , END-->
<!--FSIT - 160690, RESOLUTION - 59815 , END-->
<!--FSIT - 160690, RESOLUTION - 59815 , START-->
<!--<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">  SYM NUMBER  MOD AGENT NUMBER               AMOUNT   DATE         DATE    DATE      CODE    NUMBER     NUMBERNUMBER   NUMBER   CODE  </fo:block>-->
	<!--FSIT - 176004, RESOLUTION - 63402 , START-->
<!-- <fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">  <xsl:call-template name="Header6"><xsl:with-param name="in_04"><xsl:value-of select="in_04"/></xsl:with-param></xsl:call-template>                            AMOUNT   DATE         DATE    DATE      CODE    NUMBER     <xsl:call-template name="Header7"><xsl:with-param name="in_03"><xsl:value-of select="in_03"/></xsl:with-param><xsl:with-param name="in_02"><xsl:value-of select="in_02"/></xsl:with-param></xsl:call-template>  </fo:block> -->
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">  <xsl:call-template name="Header6"><xsl:with-param name="in_04"><xsl:value-of select="in_04"/></xsl:with-param></xsl:call-template>                         AMOUNT      DATE         DATE    DATE      CODE    NUMBER     <xsl:call-template name="Header7"><xsl:with-param name="in_03"><xsl:value-of select="in_03"/></xsl:with-param><xsl:with-param name="in_02"><xsl:value-of select="in_02"/></xsl:with-param></xsl:call-template>  </fo:block>
	<!--FSIT - 176004, RESOLUTION - 63402 , END-->

<!--FSIT - 160690, RESOLUTION - 59815 , END-->
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> ------------------------------------------------------------------------------------------------------------------------------------ </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">
</fo:block>
</xsl:template><xsl:template match="record[@name = 'NORCDFMT']" xml:space="preserve">
<!--FSIT - 160690, RESOLUTION - 59815 , START-->
<!--<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" > <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="dummy9"/></xsl:with-param><xsl:with-param name="len">1</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>                            * * * * * * * * * * * *  NO DATA FOUND FOR REPORT  * * * * * * * * * * * * *********************** </fo:block>-->
<!--<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">                                                       * BEGINNING OF REPORT * </fo:block>-->
<!--<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">                                                       *    END  OF  REPORT  * </fo:block>-->
<!--<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">                                                       ***********************
</fo:block>-->
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" > <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="dummy9"/></xsl:with-param><xsl:with-param name="len">1</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>                            <xsl:call-template name="Header8"><xsl:with-param name="in_11"><xsl:value-of select="in_11"/></xsl:with-param><xsl:with-param name="in_12"><xsl:value-of select="in_12"/></xsl:with-param></xsl:call-template> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">                                                       <xsl:call-template name="Header9"><xsl:with-param name="in_11"><xsl:value-of select="in_11"/></xsl:with-param><xsl:with-param name="in_12"><xsl:value-of select="in_12"/></xsl:with-param></xsl:call-template> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">                                                       <xsl:call-template name="Header10"><xsl:with-param name="in_11"><xsl:value-of select="in_11"/></xsl:with-param><xsl:with-param name="in_12"><xsl:value-of select="in_12"/></xsl:with-param></xsl:call-template> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">                                                       <xsl:call-template name="Header11"><xsl:with-param name="in_12"><xsl:value-of select="in_12"/></xsl:with-param></xsl:call-template>
</fo:block>
<!--FSIT - 160690, RESOLUTION - 59815 , END-->
</xsl:template><xsl:template match="record[@name = 'DETAIL']" xml:space="preserve">
<!--FSIT - 160690, RESOLUTION - 59815 , START-->
<!--<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" >  <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="prtsymbol"/></xsl:with-param><xsl:with-param name="len">3</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="prtpolicyno"/></xsl:with-param><xsl:with-param name="len">7</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="prtmod"/></xsl:with-param><xsl:with-param name="len">2</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>   SYSTEM CHECK MANUAL CHECK ITEM ON HOLD CHECK VOIDED ITEM CORRECTED INACTIVE <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="prtpayableamount"/></xsl:with-param><xsl:with-param name="len">10</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> <xsl:call-template name="cvtdateCYYMMDDtoMMDDYYYY"><xsl:with-param name="datefld"><xsl:value-of select="prtpayableentrydt"/></xsl:with-param></xsl:call-template> <xsl:call-template name="cvtdateCYYMMDDtoMMDDYYYY"><xsl:with-param name="datefld"><xsl:value-of select="prtlastchangedt"/></xsl:with-param></xsl:call-template> <xsl:call-template name="cvtdateCYYMMDDtoMMDDYYYY"><xsl:with-param name="datefld"><xsl:value-of select="prtpaiddate"/></xsl:with-param></xsl:call-template> <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="prtbankcode"/></xsl:with-param><xsl:with-param name="len">4</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="prtcheckno"/></xsl:with-param><xsl:with-param name="len">7</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="prtagentno"/></xsl:with-param><xsl:with-param name="len">7</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="agntnum"/></xsl:with-param><xsl:with-param name="len">7</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="prtclaimno"/></xsl:with-param><xsl:with-param name="len">12</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="prtclmntno"/></xsl:with-param><xsl:with-param name="len">4</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="prtexaminercd"/></xsl:with-param><xsl:with-param name="len">2</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>   </fo:block>-->
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" >  <xsl:call-template name="Header12"><xsl:with-param name="in_04"><xsl:value-of select="in_04"/></xsl:with-param><xsl:with-param name="in_41"><xsl:value-of select="in_41"/></xsl:with-param><xsl:with-param name="in_42"><xsl:value-of select="in_42"/></xsl:with-param><xsl:with-param name="in_43"><xsl:value-of select="in_43"/></xsl:with-param></xsl:call-template>       <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="prtpayableamount"/></xsl:with-param><xsl:with-param name="len">10</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>   <xsl:call-template name="cvtdateCYYMMDDtoMMDDYYYY"><xsl:with-param name="datefld"><xsl:value-of select="prtpayableentrydt"/></xsl:with-param></xsl:call-template>   <xsl:call-template name="cvtdateCYYMMDDtoMMDDYYYY"><xsl:with-param name="datefld"><xsl:value-of select="prtlastchangedt"/></xsl:with-param></xsl:call-template>   <xsl:call-template name="cvtdateCYYMMDDtoMMDDYYYY"><xsl:with-param name="datefld"><xsl:value-of select="prtpaiddate"/></xsl:with-param></xsl:call-template>   <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="prtbankcode"/></xsl:with-param><xsl:with-param name="len">4</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>   <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="prtcheckno"/></xsl:with-param><xsl:with-param name="len">7</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>   <xsl:call-template name="Header13"><xsl:with-param name="in_04"><xsl:value-of select="in_04"/></xsl:with-param><xsl:with-param name="in_05"><xsl:value-of select="in_05"/></xsl:with-param></xsl:call-template>   </fo:block>
<!--FSIT - 160690, RESOLUTION - 59815 , END-->
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">
</fo:block>
</xsl:template><xsl:template match="record[@name = 'TOTALS']" xml:space="preserve">
<!--FSIT - 160690, RESOLUTION - 59815 , START-->
<!--<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" >  TOTAL RETURN PREMIUMS: TOTAL CLAIMS PAID: TOTAL AGENTS COMMISSIONS: TOTAL LOCATION TOTAL MASTER CO <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="prtlocmcoident"/></xsl:with-param><xsl:with-param name="len">2</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> : <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="prttotalcount"/></xsl:with-param><xsl:with-param name="len">7</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> </fo:block>-->
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre" >  <xsl:call-template name="Header14"><xsl:with-param name="in_21"><xsl:value-of select="in_21"/></xsl:with-param><xsl:with-param name="in_22"><xsl:value-of select="in_22"/></xsl:with-param><xsl:with-param name="in_23"><xsl:value-of select="in_23"/></xsl:with-param></xsl:call-template><xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="prtlocmcoident"/></xsl:with-param><xsl:with-param name="len">2</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> : <xsl:call-template name="Prepad"><xsl:with-param name="padVar"><xsl:value-of select="prttotalcount"/></xsl:with-param><xsl:with-param name="len">7</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> </fo:block>
<!--FSIT - 160690, RESOLUTION - 59815 , END-->
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre"> </fo:block>
<fo:block text-align="justify" font-size="9pt" font-family="monospace" line-height="9pt" white-space="pre">
</fo:block>
</xsl:template>
<!--FSIT - 160690, RESOLUTION - 59815 , START-->
<xsl:template name="Header1">	
	<xsl:param name="in_02"/>
	<xsl:param name="in_03"/>
		<xsl:if test="($in_03 ='false') and ($in_02 ='false')">
		<!--FSIT - 176004, RESOLUTION - 63402 , START-->
	<!--		<xsl:value-of select="'  RETURN PREMIUMS  '"/>-->
			 <xsl:value-of select="'RETURN PREMIUMS'"/>   
			<!--FSIT - 176004, RESOLUTION - 63402 , END--> 
		</xsl:if>
</xsl:template>
<xsl:template name="Header2">	
	<xsl:param name="in_02"/>
	<xsl:param name="in_03"/>
		<xsl:if test="($in_03 ='true') and ($in_02 ='false')">
		<!--FSIT - 176004, RESOLUTION - 63402 , START-->
		<!--	<xsl:value-of select="'  CLAIMS PAID '"/>-->
			<xsl:value-of select="'CLAIMS PAID'"/>
		<!--FSIT - 176004, RESOLUTION - 63402 , END-->
		</xsl:if>
</xsl:template>
<xsl:template name="Header3">	
	<xsl:param name="in_02"/>
	<xsl:param name="in_03"/>
		<xsl:if test="($in_03 ='false') and ($in_02 ='true')">
		<!--FSIT - 176004, RESOLUTION - 63402 , START-->
		<!--	<xsl:value-of select="'  AGENTS COMMISSIONS '"/>-->
			<xsl:value-of select="'AGENTS COMMISSIONS'"/>
		<!--FSIT - 176004, RESOLUTION - 63402 , END-->
		</xsl:if>
</xsl:template>
<xsl:template name="Header4">	
    <xsl:param name="in_04"/>
		<xsl:if test="($in_04 ='false') ">
			<xsl:value-of select="'     POLICY      '"/>
		</xsl:if>
</xsl:template>
<xsl:template name="Header5">	
	<xsl:param name="in_02"/>
	<xsl:param name="in_03"/>
		<xsl:if test="($in_03 ='false') and ($in_02 ='false')">
			<xsl:value-of select="' AGENT '"/>
		</xsl:if>
		<xsl:if test="($in_03 ='true') and ($in_02 ='false')">
		<!--FSIT - 176004, RESOLUTION - 63402 , START-->
		<!-- <xsl:value-of select="'CLAIM    CLAIMANT EXMNR  '"/> -->
				<xsl:value-of select="'  CLAIM    CLAIMANT EXMNR  '"/>
		<!--FSIT - 176004, RESOLUTION - 63402 , END-->
		</xsl:if>
</xsl:template>
<xsl:template name="Header6">	
	<xsl:param name="in_04"/>
		<xsl:if test="($in_04 ='false') ">
			<xsl:value-of select="'SYM NUMBER  MOD '"/>
		</xsl:if>
		<xsl:if test="($in_04 ='true') ">
			<xsl:value-of select="'AGENT NUMBER'"/>
		</xsl:if>
</xsl:template>
<xsl:template name="Header7">	
	<xsl:param name="in_02"/>
	<xsl:param name="in_03"/>
		<xsl:if test="($in_03 ='false') and ($in_02 ='false')">
			<xsl:value-of select="'NUMBER'"/>
		</xsl:if>
		<xsl:if test="($in_03 ='true') and ($in_02 ='false')">
			<!--FSIT - 176004, RESOLUTION - 63402 , START-->
		<!--<xsl:value-of select="'NUMBER   NUMBER   CODE'"/> -->
			<xsl:value-of select="'NUMBER     NUMBER   CODE'"/>
		<!--FSIT - 176004, RESOLUTION - 63402 , END-->
		</xsl:if>
</xsl:template>
<xsl:template name="Header8">	
	<xsl:param name="in_12"/>
	<xsl:param name="in_11"/>
		<xsl:if test="($in_11 ='false') and ($in_12 ='false')">
			<xsl:value-of select="'* * * * * * * * * * * *  NO DATA FOUND FOR REPORT  * * * * * * * * * * * * '"/>
		</xsl:if>
		<xsl:if test="($in_12 ='true')">
			<xsl:value-of select="'                          *********************** '"/>
		</xsl:if>
</xsl:template>
<xsl:template name="Header9">	
	<xsl:param name="in_12"/>
	<xsl:param name="in_11"/>
		<xsl:if test="($in_11 ='false') and ($in_12 ='true')">
			<xsl:value-of select="' * BEGINNING OF REPORT * '"/>
		</xsl:if>
</xsl:template>
<xsl:template name="Header10">	
	<xsl:param name="in_12"/>
	<xsl:param name="in_11"/>
		<xsl:if test="($in_11 ='true') and ($in_12 ='true')">
			<xsl:value-of select="'*    END  OF  REPORT  * '"/>
		</xsl:if>
</xsl:template>
<xsl:template name="Header11">	
	<xsl:param name="in_12"/>
		<xsl:if test="($in_12 ='true')">
			<xsl:value-of select="' *********************** '"/>
		</xsl:if>
</xsl:template>
<xsl:template name="Header12">	
	<xsl:param name="in_04"/>
	<xsl:param name="in_41"/>
	<xsl:param name="in_42"/>
	<xsl:param name="in_43"/>
		<xsl:if test="($in_04 ='false')">
			<xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="prtsymbol"/></xsl:with-param><xsl:with-param name="len">3</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> <xsl:value-of select="' '"/> <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="prtpolicyno"/></xsl:with-param><xsl:with-param name="len">7</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> <xsl:value-of select="' '"/>    <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="prtmod"/></xsl:with-param><xsl:with-param name="len">2</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>
		</xsl:if>
		<xsl:if test="($in_41 ='false') and ($in_42 ='false')and ($in_43 ='false')">
		<!--FSIT - 176004, RESOLUTION - 63402 , START-->
		<!--	<xsl:value-of select="'      SYSTEM CHECK '"/>-->
			<xsl:value-of select="'   SYSTEM CHECK  '"/>
		 <!--FSIT - 176004, RESOLUTION - 63402 , END-->	
		</xsl:if>
		<xsl:if test="($in_41 ='false') and ($in_42 ='false')and ($in_43 ='true')">
		<!--FSIT - 176004, RESOLUTION - 63402 , START-->
		<!--	<xsl:value-of select="'     MANUAL CHECK  '"/>-->
			<xsl:value-of select="'   MANUAL CHECK  '"/>  
		 <!--FSIT - 176004, RESOLUTION - 63402 , END-->	
		</xsl:if>
		<xsl:if test="($in_41 ='false') and ($in_42 ='true')and ($in_43 ='false')">
		<!--FSIT - 176004, RESOLUTION - 63402 , START-->
		<!--	<xsl:value-of select="'     ITEM ON HOLD  '"/>-->
			<xsl:value-of select="'   ITEM ON HOLD  '"/>
		 <!--FSIT - 176004, RESOLUTION - 63402 , END-->	  
		</xsl:if>
		<xsl:if test="($in_41 ='false') and ($in_42 ='true')and ($in_43 ='true')">
		<!--FSIT - 176004, RESOLUTION - 63402 , START-->
			<!--<xsl:value-of select="'     CHECK VOIDED  '"/>-->
			<xsl:value-of select="'   CHECK VOIDED  '"/>
		 <!--FSIT - 176004, RESOLUTION - 63402 , END-->	 
		</xsl:if>
		<xsl:if test="($in_41 ='true') and ($in_42 ='false')and ($in_43 ='false')">
		<!--FSIT - 176004, RESOLUTION - 63402 , START-->
		<!--	<xsl:value-of select="'     ITEM CORRECTED  '"/>-->
			<xsl:value-of select="'   ITEM CORRECTED'"/>
		 <!--FSIT - 176004, RESOLUTION - 63402 , END-->	 
		</xsl:if>
		<xsl:if test="($in_41 ='true') and ($in_42 ='true')and ($in_43 ='true')">
		<!--FSIT - 176004, RESOLUTION - 63402 , START-->
			<!--<xsl:value-of select="'     INACTIVE '"/>-->
			 <xsl:value-of select="'   INACTIVE      '"/>   
		 <!--FSIT - 176004, RESOLUTION - 63402 , END-->	 
		</xsl:if>
</xsl:template>
<xsl:template name="Header13">	
	<xsl:param name="in_04"/>
	<xsl:param name="in_05"/>
		<xsl:if test="($in_05 ='false') and ($in_04 ='false')">
			<xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="prtagentno"/></xsl:with-param><xsl:with-param name="len">7</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>   
		</xsl:if>
		<xsl:if test="($in_05 ='false') and ($in_04 ='true')">
		    <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="agntnum"/></xsl:with-param><xsl:with-param name="len">7</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>   
		</xsl:if>
		<xsl:if test="($in_05 ='true')">
			<!--FSIT - 176004, RESOLUTION - 63402 , START-->
		 <!-- <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="prtclaimno"/></xsl:with-param><xsl:with-param name="len">12</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>  <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="prtclmntno"/></xsl:with-param><xsl:with-param name="len">4</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>  <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="prtexaminercd"/></xsl:with-param><xsl:with-param name="len">2</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template> -->
		    <xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="prtclaimno"/></xsl:with-param><xsl:with-param name="len">12</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template><xsl:value-of select="'   '"/><xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="prtclmntno"/></xsl:with-param><xsl:with-param name="len">4</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template><xsl:value-of select="'    '"/><xsl:call-template name="Postpad"><xsl:with-param name="padVar"><xsl:value-of select="prtexaminercd"/></xsl:with-param><xsl:with-param name="len">2</xsl:with-param><xsl:with-param name="padChar"> </xsl:with-param></xsl:call-template>
		 <!--FSIT - 176004, RESOLUTION - 63402 , END-->		
		</xsl:if>
</xsl:template>
<xsl:template name="Header14">	
	<xsl:param name="in_21"/>
	<xsl:param name="in_22"/>
	<xsl:param name="in_23"/>
		<xsl:if test="($in_21 ='false')and ($in_22 ='false')and ($in_23 ='false')">
		<!--FSIT - 176004, RESOLUTION - 63402 , START-->
			<!--<xsl:value-of select="' TOTAL RETURN PREMIUMS: '"/>-->
		        <xsl:value-of select="'TOTAL RETURN PREMIUMS: '"/>
		 <!--FSIT - 176004, RESOLUTION - 63402 , END-->
		</xsl:if>
		<xsl:if test="($in_21 ='false')and ($in_22 ='false')and ($in_23 ='true')">
		<!--FSIT - 176004, RESOLUTION - 63402 , START-->
			<!--<xsl:value-of select="'  TOTAL CLAIMS PAID:   '"/>-->
				<xsl:value-of select="'TOTAL CLAIMS PAID      '"/>
		 <!--FSIT - 176004, RESOLUTION - 63402 , END-->		
		</xsl:if>
		<xsl:if test="($in_21 ='false')and ($in_22 ='true')and ($in_23 ='false')">
		<!--FSIT - 176004, RESOLUTION - 63402 , START-->
		<!--	<xsl:value-of select="' TOTAL AGENTS COMMISSIONS:  '"/>-->
				<xsl:value-of select="'TOTAL AGENTS COMMISSIONS:  '"/>		
 		<!--FSIT - 176004, RESOLUTION - 63402 , END-->
		</xsl:if>
		<xsl:if test="($in_21 ='true')and ($in_22 ='false')and ($in_23 ='false')">
		<!--FSIT - 176004, RESOLUTION - 63402 , START-->
			<!--<xsl:value-of select="' TOTAL LOCATION         '"/>-->
				<xsl:value-of select="'TOTAL LOCATION         '"/>
 		<!--FSIT - 176004, RESOLUTION - 63402 , END-->
		</xsl:if>
		<xsl:if test="($in_21 ='true')and ($in_22 ='false')and ($in_23 ='true')">
		<!--FSIT - 176004, RESOLUTION - 63402 , START-->
		<!--	<xsl:value-of select="' TOTAL MASTER CO        '"/>-->
				<xsl:value-of select="'TOTAL MASTER CO        '"/>
			
        <!--FSIT - 176004, RESOLUTION - 63402 , END-->
		</xsl:if>
</xsl:template>
<!--FSIT - 160690, RESOLUTION - 59815 , END-->
</xsl:stylesheet>