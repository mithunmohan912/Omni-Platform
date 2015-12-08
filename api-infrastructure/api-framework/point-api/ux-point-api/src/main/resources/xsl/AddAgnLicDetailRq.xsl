<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output omit-xml-declaration="yes" method="xml" indent="no" />

    <xsl:template match="PayLoad">

        <xsl:variable name="REQUEST_CODE">
            <xsl:value-of select="REQUESTCODE"/>
        </xsl:variable>
        
        <xsl:variable name="User_Name">
            <xsl:value-of select="USER"/>
        </xsl:variable>
        
        <xsl:variable name="Agency_Number">
            <xsl:value-of select="KEY_AGENCY_NUMBER"/>
        </xsl:variable>
        
        <xsl:variable name="MCO">
            <xsl:value-of select="KEY_AGENCY_MASTER_COMPANY"/>
        </xsl:variable>
        <xsl:variable name="LOC">
            <xsl:value-of select="KEY_AGENCY_POLICY_COMPANY"/>
        </xsl:variable>
        
        <POINTXML>
            <SignonRq>
                <ClientApp>
                    <Name>PT</Name>
                </ClientApp>
                <SignonPswd>
                    <CustId>
                        <CustLoginId>
                            <xsl:value-of select="User" />
                        </CustLoginId>
                    </CustId>
                </SignonPswd>
            </SignonRq>
            <InsuranceSvcRq>
                <RqUID><xsl:value-of select="$REQUEST_CODE"/></RqUID>
                <xsl:element name="{concat(substring($REQUEST_CODE,0,string-length($REQUEST_CODE)-4),'Rq')}">
                    <PayLoad>                   
                       <AGENCY_LIC_RECORDS_ROW>
                        <PROCESSING_INFO>
                                <PROC_TRANSACTION_TYPE/>
						        <PROC_PROGRAM_NAME/>
						        <PROC_EFFECTIVE_DATE>01/</PROC_EFFECTIVE_DATE>
						        <PROC_LDA_SELECT/>
						        <PROC_PANEL_MODE>ADD</PROC_PANEL_MODE>
						        <PROC_LDA_SYSTEM_DATE_OVERRIDE/>
						        <PROC_LDA_SECURITY/>
						        <PROC_LDA_ACCTG_DATE/>
						        <PROC_LDA_TRANSSEQ/>
						        <PROC_LDA_ISSUE_CODE/>
						        <PROC_LDA_RENEWAL_MODULE/>
						        <PROC_LDA_TYPE_ACTIVITY/>
						        <PROC_LDA_CUR_REC_SET_STATUS/>
						        <PROC_LDA_RECORD_IND/>
						        <PROC_LDA_SET_TYPE_NUMBER/>
						        <PROC_SUCCESS_INDIC/>
						        <target>AgnLicgrid.jsp</target>
                           </PROCESSING_INFO>
                           <AGENCY_LIC_KEY>
						        <KEY_AGENCY_NUMBER><xsl:value-of select="$Agency_Number"/></KEY_AGENCY_NUMBER>
						        <KEY_AGENCY_MASTER_COMPANY><xsl:value-of select="$MCO"/></KEY_AGENCY_MASTER_COMPANY>
						        <KEY_AGENCY_POLICY_COMPANY><xsl:value-of select="$LOC"/></KEY_AGENCY_POLICY_COMPANY>
						   </AGENCY_LIC_KEY>
                        <xsl:for-each select="list/PayLoad">
						   <AGENCY_LIC_INFO>
						      <AGENT_LIC_NUM><xsl:value-of select="AGENT_LIC_NUM"/></AGENT_LIC_NUM>
						      <AGENT_LIC_STATE><xsl:value-of select="AGENT_LIC_STATE"/></AGENT_LIC_STATE>
						      <AGENT_LIC_EFFDATE><xsl:value-of select="AGENT_LIC_EFFDATE"/></AGENT_LIC_EFFDATE>
						      <AGENT_LIC_EXPDATE><xsl:value-of select="AGENT_LIC_EXPDATE"/></AGENT_LIC_EXPDATE>
						      <AGENT_LIC_ENT_DATE><xsl:value-of select="AGENT_LIC_ENT_DATE"/></AGENT_LIC_ENT_DATE>
						      <ERROR_A><xsl:value-of select="ERROR_A"/></ERROR_A>
						      <ERRORINDIC_A><xsl:value-of select="ERRORINDIC_A"/></ERRORINDIC_A>
						   </AGENCY_LIC_INFO>
                         </xsl:for-each>
                      </AGENCY_LIC_RECORDS_ROW>
                   </PayLoad>
              </xsl:element>
          </InsuranceSvcRq>
     </POINTXML>
        
    </xsl:template>
</xsl:stylesheet>
