<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes" method="xml" indent="no" />

	<xsl:template match="PayLoad">

   		<xsl:variable name="REQUEST_CODE">
        	<xsl:value-of select="REQUESTCODE"/>
   		</xsl:variable>
   		
   		<xsl:variable name="Rq_UID">
        	<xsl:value-of select="RqUID"/>
   		</xsl:variable>
   		
   		<xsl:variable name="User_Name">
        	<xsl:value-of select="USER"/>
   		</xsl:variable>
   		
   		<xsl:variable name="ACTIONCODE">
        	<xsl:value-of select="actionCode"/>
   		</xsl:variable>
   		
		<POINTXML>
			<SignonRq>
				<ClientApp>
					<Name>PT</Name>
				</ClientApp>
				<SignonPswd>
					<CustId>
						<CustLoginId>
							<xsl:value-of select="USER" />
						</CustLoginId>
					</CustId>
				</SignonPswd>
			</SignonRq>
			<InsuranceSvcRq>
				<RqUID><xsl:value-of select="$Rq_UID"/></RqUID>
				<xsl:element name="{concat(substring($Rq_UID,0,string-length($Rq_UID)-4),'Rq')}">
					<PayLoad>					
	                   <DUNN_STOPCOLL_INFO_RECORD>
	                   	<xsl:for-each select="list/PayLoad">
		                   <PROCESSING_INFO></PROCESSING_INFO>
		                   <DUNN_STOPCOLL_INFO>
			                   <DUN_SYM><xsl:value-of select="OUTPUTSYM"/></DUN_SYM>
			                   <DUN_POL_NO><xsl:value-of select="OUTPUTPOLICY"/></DUN_POL_NO>
			                   <DUN_MOD><xsl:value-of select="OUTPUTMODULE"/></DUN_MOD>
			                   <DUN_LNAME><xsl:value-of select="OUTPUTLNAME"/></DUN_LNAME>
			                   <DUN_FNAME><xsl:value-of select="OUTPUTFNAME"/></DUN_FNAME>
			                   <DUN_EFFDATE><xsl:value-of select="OUTPUTEFFDATE"/></DUN_EFFDATE>
			                   <DUN_CANCDATE><xsl:value-of select="OUTPUTCANDATE"/></DUN_CANCDATE>
			                   <DUN_LOCATION><xsl:value-of select="OUTPUTLOCATION"/></DUN_LOCATION>
			                   <DUN_MASTER_CO><xsl:value-of select="OUTPUTMASTER"/></DUN_MASTER_CO>
			                   <DUN_AGENCY><xsl:value-of select="OUTPUTAGENCY"/></DUN_AGENCY>
			                   <DUN_REQUEST_CODE><xsl:value-of select="$REQUEST_CODE"/></DUN_REQUEST_CODE>
			                   <DUN_USERID><xsl:value-of select="$User_Name"/></DUN_USERID>
			                   <DUN_ROW_INDICATOR>B</DUN_ROW_INDICATOR>
			                   <DUN_ERROR_MSG/>
			                   <DUN_CHECK_BOX_CLICKED>Y</DUN_CHECK_BOX_CLICKED>
			                   <DUN_SEL_OPT><xsl:value-of select="OUTPUTRECTYPE"/></DUN_SEL_OPT>
			                   <DUN_BAL_AMT><xsl:value-of select="OUTPUTBALAMT"/></DUN_BAL_AMT>
			                   <DUN_STATUS><xsl:value-of select="STATUSINDIC"/></DUN_STATUS>
		                   </DUNN_STOPCOLL_INFO>
		                  </xsl:for-each>
	                   </DUNN_STOPCOLL_INFO_RECORD>
					</PayLoad>
			  </xsl:element>
		  </InsuranceSvcRq>
	 </POINTXML>
		
	</xsl:template>
</xsl:stylesheet>
