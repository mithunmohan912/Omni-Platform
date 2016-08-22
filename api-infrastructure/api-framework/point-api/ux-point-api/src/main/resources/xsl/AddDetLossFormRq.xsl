<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes" method="xml" indent="no" />

	<xsl:template match="PayLoad">

   		<xsl:variable name="REQUEST_CODE">
        	<xsl:value-of select="REQUESTCODE"/>
   		</xsl:variable>
   		<xsl:variable name="MSLAD">
        	<xsl:value-of select="mslad"/>
   		</xsl:variable>
   		<xsl:variable name="ACTIONCODE">
        	<xsl:value-of select="actionCode"/>
   		</xsl:variable>
   		<xsl:variable name="TOTAL_RECORD">
        	<xsl:value-of select="totalrecords"/>
   		</xsl:variable>
   		<xsl:variable name="USER">
        	<xsl:value-of select="userName"/>
   		</xsl:variable>
   		<xsl:variable name="INSLINE">
        	<xsl:value-of select="insline"/>
   		</xsl:variable>
   		<xsl:variable name="COVERAGE">
        	<xsl:value-of select="coverage"/>
   		</xsl:variable>
   		<xsl:variable name="YEAR">
        	<xsl:value-of select="year"/>
   		</xsl:variable>
   		<!-- <xsl:variable name="KEY">
        	<xsl:value-of select="KEY"/>
   		</xsl:variable> -->
   		
   		<xsl:variable name="LOCATION">
        	<xsl:value-of select="location"/>
   		</xsl:variable>
   		<xsl:variable name="MCO">
        	<xsl:value-of select="mco"/>
   		</xsl:variable>
   		<xsl:variable name="SYMBOL">
        	<xsl:value-of select="symbol"/>
   		</xsl:variable>
   		<xsl:variable name="POLICYNO">
        	<xsl:value-of select="policyno"/>
   		</xsl:variable>
   		<xsl:variable name="MODULE">
        	<xsl:value-of select="module"/>
   		</xsl:variable>
   		<xsl:variable name="LOB">
        	<xsl:value-of select="lob"/>
   		</xsl:variable>
   		
   		
		<POINTXML>
			<SignonRq>
				<ClientApp>
					<Name>PT4J</Name>
				</ClientApp>
				<SignonPswd>
					<CustId>
						<CustLoginId>
							<xsl:value-of select="$USER" />
						</CustLoginId>
					</CustId>
				</SignonPswd>
			</SignonRq>
		<xsl:for-each select="list/PayLoad">
			<InsuranceSvcRq>
				<RqUID><xsl:value-of select="$REQUEST_CODE" /></RqUID>
				<xsl:element name="{concat(substring($REQUEST_CODE,0,9),'Rq')}">
					<PayLoad>
						<KEY_LOCATION><xsl:value-of select="$LOCATION"/></KEY_LOCATION>
						<KEY_MASTER_COMPANY><xsl:value-of select="$MCO"/></KEY_MASTER_COMPANY>
						<KEY_SYMBOL><xsl:value-of select="$SYMBOL"/></KEY_SYMBOL>
						<KEY_POLICYNO><xsl:value-of select="$POLICYNO"/></KEY_POLICYNO> 
						<KEY_SEQNUMB><xsl:value-of select="SEQNUMB"/></KEY_SEQNUMB> 
						<KEY_USR><xsl:value-of select="$USER"/></KEY_USR> 
						<!-- <KEY_ENV>change this entry -YOURENVDAT</KEY_ENV> -->  
						<KEY_MODULE><xsl:value-of select="$MODULE"/></KEY_MODULE> 
						<KEY_LOB><xsl:value-of select="$LOB"/></KEY_LOB> 
						<KEY_PRODPAIDLOSSES><xsl:value-of select="PAIDNOUTLOSS"/></KEY_PRODPAIDLOSSES> 
						<KEY_EXPPAIDNOUT><xsl:value-of select="EXPPAIDNOUT"/></KEY_EXPPAIDNOUT>
						<KEY_MSLADD><xsl:value-of select="$MSLAD"/></KEY_MSLADD> 
						<KEY_INSLINE><xsl:value-of select="$INSLINE"/></KEY_INSLINE> 
						<KEY_COVERAGE><xsl:value-of select="$COVERAGE"/></KEY_COVERAGE>
						<KEY_YEAR><xsl:value-of select="$YEAR"/></KEY_YEAR>
						<ACTION_TO_PERFORM><xsl:value-of select="ACTIONTOPERFORM"/></ACTION_TO_PERFORM>
						<TOTAL_RECORD><xsl:value-of select="$TOTAL_RECORD"/></TOTAL_RECORD>
					</PayLoad>
			  </xsl:element>
		  </InsuranceSvcRq>
	  </xsl:for-each>
	</POINTXML>
		
	</xsl:template>
</xsl:stylesheet>
