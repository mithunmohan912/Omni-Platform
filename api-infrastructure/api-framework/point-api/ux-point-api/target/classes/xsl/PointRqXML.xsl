<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes" method="xml" indent="no" />
	<xsl:template match="PayLoad">
		<xsl:variable name="ClientCode">
        	<xsl:call-template name="GetClientCode"/>
   		</xsl:variable>
		<xsl:variable name="RqCode">
        	<xsl:call-template name="RefactorRqCode"/>
   		</xsl:variable>
   		<xsl:variable name="calltype">
        	<xsl:value-of select="method"/>
   		</xsl:variable>
		<POINTXML>
			<SignonRq>
				<ClientApp>
					<Name><xsl:value-of select="$ClientCode" /></Name>
				</ClientApp>
				<SignonPswd>
					<CustId>
						<CustLoginId>
							<xsl:call-template name="cvtToUpper"><xsl:with-param name="user" select="User" /></xsl:call-template>
						</CustLoginId>
					</CustId>
				</SignonPswd>
				<rulesIntegrated><xsl:value-of select="rulesIntegrated" /></rulesIntegrated>
				<com.csc_SessKey>
					<xsl:value-of select="sessionKey" />
				</com.csc_SessKey>
			</SignonRq>
			<InsuranceSvcRq>
		        <!-- Determine if this is a multi-page message -->
		        <xsl:choose>
		          <xsl:when test="count(/PayLoad/MULTI_) = 0">
		            <!-- Original processing, single message -->
				<RqUID>
					<xsl:value-of select="$RqCode" />
				</RqUID>

				<xsl:element name="{concat(substring($RqCode,0,9),'Rq')}">
					<PayLoad>
						<xsl:for-each select="*">
						<xsl:choose>
						<xsl:when test="local-name()='KEY' and not($calltype='GET') and REQUESTCODE != 'WCVFORMSADDRq'">
						</xsl:when>
						<xsl:otherwise>
							<xsl:element name="{local-name()}">
								<xsl:value-of select="." />
							</xsl:element>
							</xsl:otherwise>
						</xsl:choose>
						</xsl:for-each>
					</PayLoad>
				</xsl:element>
		          </xsl:when>
		          <xsl:otherwise>
		            <xsl:variable name="RequestPostfix">
		              <xsl:value-of select="substring($RqCode, 9)" />
		            </xsl:variable>
		            <RqUID>MULTRQSTSTRRq</RqUID>
		            <MULTIRECCallRq>
		              <RecordCount><xsl:value-of select="count(/PayLoad/MULTI_/page)" /></RecordCount>
		              <!-- Create a sub-message for each unique page -->
		              <xsl:for-each select="/PayLoad/MULTI_/page">
		                <xsl:variable name="PageCode"><xsl:value-of select="." /></xsl:variable>
		                <xsl:variable name="PageControls"><xsl:value-of select="/PayLoad/*[local-name() = concat('MULTI_', $PageCode)]" /></xsl:variable>
		                <POINTXML>
		                  <SignonRq>
		                    <ClientApp>
		                      <Name>
		                        <xsl:value-of select="$ClientCode" />
		                      </Name>
		                    </ClientApp>
		                    <SignonPswd>
		                      <CustId>
		                        <CustLoginId>
		                          <xsl:call-template name="cvtToUpper">
		                            <xsl:with-param name="user" select="/PayLoad/User" />
		                          </xsl:call-template>
		                        </CustLoginId>
		                      </CustId>
		                    </SignonPswd>
		                    <rulesIntegrated>
		                      <xsl:value-of select="/PayLoad/rulesIntegrated" />
		                    </rulesIntegrated>
		                    <com.csc_SessKey>
		                      <xsl:value-of select="/PayLoad/sessionKey" />
		                    </com.csc_SessKey>
		                  </SignonRq>
		                  <InsuranceSvcRq>
		                    <RqUID><xsl:value-of select="$PageCode" /><xsl:value-of select="$RequestPostfix" /></RqUID>
		                    <xsl:element name="{concat($PageCode,'Rq')}">
		                      <PayLoad>
		                        <xsl:for-each select="/PayLoad/*">
		                          <xsl:choose>
		                            <xsl:when test="local-name()='KEY' and not($calltype='GET') and REQUESTCODE != 'WCVFORMSADDRq'">
		                            </xsl:when>
		                            <xsl:when test="starts-with(local-name(), 'MULTI_')"></xsl:when>
		                            <xsl:when test="local-name()='REQUESTCODE'">
		                              <REQUESTCODE><xsl:value-of select="$PageCode" /><xsl:value-of select="$RequestPostfix" /></REQUESTCODE>
		                            </xsl:when>
		                            <xsl:otherwise>
		                              <!-- Output the node only if in the controls collection for this page code. -->
		                              <xsl:if test="string-length($PageControls) = 0 or contains($PageControls, concat('[', local-name(), ']'))">
		                                <xsl:copy-of select="." />
		                              </xsl:if>
		                            </xsl:otherwise>
		                          </xsl:choose>
		                        </xsl:for-each>
		                      </PayLoad>
		                    </xsl:element>
		                  </InsuranceSvcRq>
		                </POINTXML>
		              </xsl:for-each>
		            </MULTIRECCallRq>
		          </xsl:otherwise>
		        </xsl:choose>
			</InsuranceSvcRq>
		</POINTXML>
	</xsl:template>
 
	<xsl:template name="GetClientCode">
		<xsl:choose>
			
			<xsl:when test="REQUESTCODE = 'MINRTOVRADDRq' or REQUESTCODE = 'MINRTOVRINQRq' or REQUESTCODE = 'MINRTOVRCHGRq' or REQUESTCODE = 'MINRTOVRDFTRq' or REQUESTCODE = 'BASLRARODFTRq' or REQUESTCODE ='BASSTASPRPTRq' or REQUESTCODE ='BASLRARODELRq' or REQUESTCODE ='P4JPRNTFLSTRq' or REQUESTCODE ='P4JPRNTFINQRq' or REQUESTCODE ='OCPOLISCRPTRq'or REQUESTCODE ='OCSLPICSRPTRq' or REQUESTCODE ='BASADDCHADDRq'  or REQUESTCODE ='OCUSRPTSBMTRq' or REQUESTCODE ='BASDFASPINQRq' or REQUESTCODE = 'RCVADDNTDFTRq' or REQUESTCODE = 'RCVADDNTCNGRq' or REQUESTCODE = 'RCVADDNTDELRq' or REQUESTCODE = 'RCVADDNTINQRq' or REQUESTCODE = 'RCVADLNTINQRq' or REQUESTCODE='RCVADLNTCNGRq' or REQUESTCODE='RCVADLNTDELRq' or REQUESTCODE='RCVADLNTDFTRq' or REQUESTCODE='WCVLSSRGDFTRq' or REQUESTCODE='WCVLSSRGDFTRq' or REQUESTCODE='WCVLSSRGADDRq' or REQUESTCODE='WCVLSSRGCHGRq' or REQUESTCODE='WCVLSSRGDLTRq' or REQUESTCODE='WCVLSSRGINQRq' or REQUESTCODE='WCVLSSPGINQRq' or REQUESTCODE='WCVLSSPGCHGRq' or REQUESTCODE = 'BASUNCOVINQRq' or REQUESTCODE = 'BASPPUC1DLTRq' or REQUESTCODE = 'BASPPUC1CHGRq' or REQUESTCODE = 'BASPPUC1ADDRq' or REQUESTCODE = 'BASUNCOVADDRq' or REQUESTCODE = 'BASUNCOVCHGRq' or REQUESTCODE = 'BASUNCOVDLTRq' or REQUESTCODE = 'BASUCOVCDFTRq' or REQUESTCODE = 'BASUCOVCDFTRq' or REQUESTCODE = 'BASUCOVCADDRq' or REQUESTCODE ='BASUCOVCINQRq' or REQUESTCODE ='BASUCOVCUPDRq' or REQUESTCODE = 'BASUCOVCDELRq' or REQUESTCODE = 'CPPEXPRTADDRq'  or REQUESTCODE = 'CPPEXPRTCHGRq' or REQUESTCODE = 'CPPEXPRTINQRq' or REQUESTCODE = 'CPPEXPRTDLTRq' or REQUESTCODE = 'WCIMPORTINQDFTRq' or REQUESTCODE = 'WCVLOCCHGDFTRq' or REQUESTCODE = 'WCIMPDELDFTRq' or REQUESTCODE = 'BASPLRATDFTRq' or REQUESTCODE ='STAMENTSADDRq' or REQUESTCODE ='STAMENTSCHGRq' or REQUESTCODE ='STAMENTSINQRq' or REQUESTCODE ='SMARTERRORADDRq' or REQUESTCODE ='QUOTECHGRq' or REQUESTCODE = 'WCIMPORTDFTRq'  or REQUESTCODE = 'WCVENDORDFTRq'  or REQUESTCODE = 'WCVENDORINQRq'  or REQUESTCODE = 'WCVENDORCHGRq'  or REQUESTCODE = 'WCVENDORDELRq'   or REQUESTCODE = 'WCVENDORADDRq' ">
				<xsl:value-of select="'PT4J'" />
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="'PT'" />
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	
	<xsl:template name="RefactorRqCode">
		<xsl:choose>
			<xsl:when test="method='GET'">
				<xsl:choose>
					<xsl:when test="REQUESTCODE = 'QUTPROCSISRRq' or REQUESTCODE = 'QUTPROCSISSRq'">
						<xsl:value-of select="'CPPBCONTISSRq'" />
					</xsl:when>
					<xsl:when test="REQUESTCODE = 'QUTPROCSIBIRq'">
						<xsl:value-of select="'CPPBCONTIBIRq'" />
					</xsl:when>
					<xsl:when test="REQUESTCODE = 'QUTPROCSCPYRq' or REQUESTCODE = 'QUTPROCSCRSRq' or REQUESTCODE = 'QUTPROCSXPYRq' or REQUESTCODE = 'QUTPROCSCNBRq' or REQUESTCODE = 'QUTPROCSCRBRq' or REQUESTCODE = 'QUTPROCSXNBRq' or REQUESTCODE = 'QUTPROCSXRBRq'">
						<xsl:value-of select="'CPPBCONTQUTRq'" />
					</xsl:when>
				   	<xsl:when test="contains(REQUESTCODE, 'ADDRq')">
						<xsl:value-of select="concat(substring(REQUESTCODE,0,string-length(REQUESTCODE)-4),'DFTRq')" />
					</xsl:when>
					<xsl:when test="contains(REQUESTCODE, 'CPYRq')">
						<xsl:value-of select="concat(substring(REQUESTCODE,0,string-length(REQUESTCODE)-4),'DFYRq')" />
					</xsl:when>
					<xsl:when test="contains(REQUESTCODE, 'CHGRq') or contains(REQUESTCODE,'DLTRq') or contains(REQUESTCODE,'UDORq') or contains(REQUESTCODE,'PRTRq') or contains(REQUESTCODE,'VODRq') or contains(REQUESTCODE,'RINRq') or contains(REQUESTCODE,'SBTRq')">
						<xsl:value-of select="concat(substring(REQUESTCODE,0,string-length(REQUESTCODE)-4),'INQRq')" />
					</xsl:when>
					<xsl:when test="contains(REQUESTCODE,'ADMRq') or contains(REQUESTCODE,'RAMRq')">
						<xsl:value-of select="concat(substring(REQUESTCODE,0,string-length(REQUESTCODE)-4),'DFMRq')" />
					</xsl:when>
					<xsl:when test="contains(REQUESTCODE, 'RADRq')">
						<xsl:value-of select="concat(substring(REQUESTCODE,0,string-length(REQUESTCODE)-4),'RDFRq')" />
					</xsl:when>
					<xsl:when test="contains(REQUESTCODE, 'RCHRq') or contains(REQUESTCODE,'RHCRq') or contains(REQUESTCODE,'RDRRq') or contains(REQUESTCODE,'PRTRq') or contains(REQUESTCODE,'RRHRq') or contains(REQUESTCODE,'RDCRq') or contains(REQUESTCODE,'RRDRq')">
						<xsl:value-of select="concat(substring(REQUESTCODE,0,string-length(REQUESTCODE)-4),'RCIRq')" />
					</xsl:when>
					<xsl:otherwise>
						<xsl:value-of select="REQUESTCODE" />
					</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="REQUESTCODE" />
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	
	<xsl:template name="cvtToUpper">
		<xsl:param name="user"/>
		<xsl:value-of select="translate($user, 'abcdefghijklmnopqrstuvwxyz', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ')" />
	</xsl:template>
</xsl:stylesheet>
