//*******************************************************************************
// * Copyright (c) 2012 CSC.
// *
// * The information contained in this document is the exclusive property of
// * CSC.  This work is protected under USA copyright law
// * and the copyright laws of given countries of origin and international
// * laws, treaties and/or conventions. No part of this document may be
// * reproduced or transmitted in any form or by any means, electronic or
// * mechanical including photocopying or by any informational storage or
// * retrieval system, unless as expressly permitted by CSC.
// ******************************************************************************
package com.csc.cscip.ux.common.security.securityengine;

import java.util.Iterator;
import java.util.List;

import javax.faces.component.UIComponent;
import javax.faces.component.UIViewRoot;
import javax.faces.component.html.HtmlCommandButton;
import javax.faces.component.html.HtmlCommandLink;
import javax.faces.component.html.HtmlInputText;
import javax.faces.component.html.HtmlInputTextarea;
import javax.faces.component.html.HtmlOutputLabel;
import javax.faces.component.html.HtmlOutputLink;
import javax.faces.component.html.HtmlOutputText;
import javax.faces.component.html.HtmlPanelGroup;
import javax.faces.component.html.HtmlSelectBooleanCheckbox;
import javax.faces.component.html.HtmlSelectOneMenu;
import javax.faces.component.html.HtmlSelectOneRadio;
import javax.faces.context.FacesContext;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.primefaces.component.calendar.Calendar;
import org.primefaces.component.column.Column;
import org.primefaces.component.commandbutton.CommandButton;
import org.primefaces.component.commandlink.CommandLink;
import org.primefaces.component.inputmask.InputMask;
import org.primefaces.component.inputtext.InputText;
import org.primefaces.component.inputtextarea.InputTextarea;
import org.primefaces.component.menuitem.MenuItem;
import org.primefaces.component.outputlabel.OutputLabel;
import org.primefaces.component.panel.Panel;
import org.primefaces.component.tabview.Tab;
import org.primefaces.extensions.component.inputnumber.InputNumber;
import org.springframework.context.ApplicationContext;
import org.springframework.security.access.PermissionEvaluator;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.jsf.FacesContextUtils;

import com.csc.cscip.ux.common.security.acl.CustomLookupStrategy;
import com.csc.cscip.ux.common.util.ApplicationContextProvider;
import com.csc.cscip.ux.common.util.GlobalConfigData;

public class UIComponentManipulator {
    private static final Log logger = LogFactory.getLog(UIComponentManipulator.class);
    private UIViewRoot componentTree;
    private String screen;
    private List<String> securedElementList;

    public static final String CANNOTEXECUTE = "CANNOTEXECUTE"; /* 1 */
    public static final String INVISIBLE = "INVISIBLE"; /* 2 */
    public static final String DISABLE = "DISABLE"; /* 4 */
    public static final String NONEDITABLE = "NONEDITABLE"; /* 8 */

    public UIComponentManipulator(UIViewRoot componentTree) {
		this.componentTree = componentTree;
		this.screen = setScreenName(componentTree.getViewId());
    }

    public UIComponentManipulator() {

    }

    public void getSecuredElementListForScreen() {
		ApplicationContext ctx = ApplicationContextProvider.getApplicationContext();
		CustomLookupStrategy lookupStrategy = (CustomLookupStrategy) ctx.getBean("lookupStrategy");
		securedElementList = lookupStrategy.getSecuredElementList(screen);
		if (securedElementList.size() > 0) {
		    rulesEngineCheck();
		    uiElememetDelegator();
		}
    }

    private void rulesEngineCheck() {

		ApplicationContext context = FacesContextUtils.getWebApplicationContext(FacesContext.getCurrentInstance());
		GlobalConfigData globalConfigBean = (GlobalConfigData) context.getBean("globalConfigBean");

		if (screen.contentEquals("recurPayment") || screen.contentEquals("changePolicyPlan")) {
		    if (!globalConfigBean.getValueRule("EQED")) {
				String equityOverrideInd = "Billing_Policy_equityOverrideInd";
				String equityOverrideInd2 = "Billing_Policy_equityOverrideInd2";
				
				UIComponent componentInd = componentTree.findComponent(equityOverrideInd);
				if (componentInd == null) {
				    componentInd = getUIcomponent(componentTree, equityOverrideInd);
				}	
				UIComponent componentInd2 = componentTree.findComponent(equityOverrideInd2);
				if (componentInd2 == null) {
				    componentInd2 = getUIcomponent(componentTree, equityOverrideInd2);
				}
				if (componentInd != null) {
				    if (componentInd instanceof HtmlPanelGroup) {
						HtmlPanelGroup panel = (HtmlPanelGroup) componentInd;
						hideLabel(equityOverrideInd);
						((HtmlPanelGroup) panel).setRendered(false);		
				    } else if (componentInd instanceof HtmlSelectBooleanCheckbox) {
						HtmlSelectBooleanCheckbox selectBooleanCheckbox = (HtmlSelectBooleanCheckbox) componentInd;
						hideLabel(equityOverrideInd);
						((HtmlSelectBooleanCheckbox) selectBooleanCheckbox).setRendered(false);
				    }		
				}
				if (componentInd2 != null) {
				    HtmlSelectBooleanCheckbox selectBooleanCheckbox2 = (HtmlSelectBooleanCheckbox) componentInd2;
				
				    hideLabel(equityOverrideInd2);
				    ((HtmlSelectBooleanCheckbox) selectBooleanCheckbox2).setRendered(false);
				}

		    }
		}
    }

    public String getScreen() {
    	return screen;
    }

    public void invokeManipulator() {
    	getSecuredElementListForScreen();
    }

    public void uiElememetDelegator() {
		final boolean debug = logger.isDebugEnabled();
		if (debug) {
		    logger.debug("UX Security engine setting permissions for screen :" + screen);
		}
	
		for (String temp : securedElementList) {
		    logger.debug("UIElement " + temp);
		    // logger.info("temp " + temp);
	
		    UIComponent component = componentTree.findComponent(temp);
		    if (component == null) {
		    	component = getUIcomponent(componentTree, temp);
		    }
	
		    if (component != null) {
				logger.debug("component founded1 " + component.toString());
	
			if (component instanceof HtmlInputText) {
			    processHtmlInputText(component, temp);
			}
			if (component instanceof InputText) {
			    processPrimefacesInputText(component, temp);
			}
			if (component instanceof HtmlInputTextarea) {
			    processHtmlInputTextArea(component, temp);
			}
			if (component instanceof HtmlCommandButton) {
				processHtmlCommandButton(component, temp);
			}
			if (component instanceof CommandButton) {
			 	processPrimefacesCommandButton(component, temp);
			}
			if (component instanceof HtmlCommandLink) {
				processHtmlCommandLink(component, temp);
			}
			if (component instanceof HtmlOutputLink) {
			    processHtmlOutputLink(component, temp);
			}
			if (component instanceof HtmlSelectOneRadio) {
			    processHtmlSelectOneRadio(component, temp);
			}
			if (component instanceof HtmlSelectOneMenu) {
				processHtmlSelectOneMenu(component, temp);
			}
			if (component instanceof HtmlOutputText) {
				processHtmlOutputText(component, temp);
			}
			if (component instanceof Panel) {
				processPrimefacesPanel(component, temp);
			}
			if (component instanceof HtmlPanelGroup) {
			    processHtmlPanelGroup(component, temp);
			}
			if (component instanceof HtmlSelectBooleanCheckbox) {
				processHtmlSelectBooleanCheckbox(component, temp);
			}
			if (component instanceof Column) {
				processPrimefacesColumn(component, temp);
			}
			if (component instanceof Calendar) {
			    processPrimefacesCalendar(component, temp);
			}
			if (component instanceof HtmlOutputLabel) {
				processHtmlOutputLabel(component, temp);
			}
			if (component instanceof Tab ) {
				processPrimefacesTabView(component, temp);
			}
			if (component instanceof MenuItem ) {
				processPrimefacesMenuItem(component, temp);
			}
			if (component instanceof InputTextarea) {
				processPrimefacesInputTextArea(component, temp);
			}
			if (component instanceof InputMask) {
				processPrimefacesInputMask(component, temp);
			}
			if (component instanceof InputNumber) {
				processPrimefacesInputNumber(component, temp);
			}
		    } else {
				logger.info("component is null :" + temp);
				logger.debug("component is null ");
		    }
		}

    }
    
    /**
     * Obtain the ID component associated with the view Note: Recurisve search method / if exist performance issues
     * change to another efficient search tree method
     * @param comp
     * @param id
     * @return
     */
    public UIComponent getUIcomponent(UIComponent comp, String id) {

		if (id.equals(comp.getId())) {
		    return comp;
		}
		Iterator<UIComponent> components = comp.getFacetsAndChildren();
		while (components.hasNext()) {
		    UIComponent found = getUIcomponent(components.next(), id);
		    if (found != null) {
		    	return found;
		    }
		}
		return null;
    }

    private void processHtmlOutputLabel(UIComponent component, String elId) {
    	HtmlOutputLabel label = (HtmlOutputLabel) component;
    	if (checkpermision(elId, INVISIBLE)) {
    		hideLabel(elId);
    		label.setRendered(false);
    	}   	
    }

    private void processPrimefacesCalendar(UIComponent component, String elId) {
		org.primefaces.component.calendar.Calendar cal = (org.primefaces.component.calendar.Calendar) component;
		if (checkpermision(elId, INVISIBLE)) {
		    hideLabel(elId);
		    cal.setRendered(false);
		}
		if (checkpermision(elId, DISABLE)) {
		    cal.setDisabled(true);
		}
    }

    private void processHtmlPanelGroup(UIComponent component, String elId) {
		HtmlPanelGroup panel = (HtmlPanelGroup) component;
		if (checkpermision(elId, INVISIBLE)) {
			hideSeparator(elId);
		    hideLabel(elId);
		    ((HtmlPanelGroup) panel).setRendered(false);
		}
    }
	
	private void processPrimefacesColumn(UIComponent component, String elId) {
		Column column = (Column) component;
		if (checkpermision(elId, INVISIBLE)) {
			hideColumnHeader(elId);
		    column.setRendered(false);
		}
    }

    private void processHtmlSelectBooleanCheckbox(UIComponent component, String elId) {
		HtmlSelectBooleanCheckbox selectBooleanCheckbox = (HtmlSelectBooleanCheckbox) component;
		if (checkpermision(elId, INVISIBLE)) {
		    hideLabel(elId);
		    ((HtmlSelectBooleanCheckbox) selectBooleanCheckbox).setStyle("visibility:hidden");
		}
		if (checkpermision(elId, DISABLE)) {
			selectBooleanCheckbox.setDisabled(true);
		}
    }

    private void processPrimefacesPanel(UIComponent component, String elId) {
		Panel panel = (Panel) component;
		if (checkpermision(elId, INVISIBLE)) {
		    hideLabel(elId);
		    ((Panel) panel).setRendered(false);
		}
    }

    private void processHtmlOutputText(UIComponent component, String elId) {
    	HtmlOutputText outputTxt = (HtmlOutputText) component;
		if (checkpermision(elId, INVISIBLE)) {
			hideLabel(elId);
			((HtmlOutputText) outputTxt).setRendered(false);
		}
    }

    private void processHtmlSelectOneMenu(UIComponent component, String temp) {
    	HtmlSelectOneMenu cdMenu = (HtmlSelectOneMenu) component;
    	if (checkpermision(temp, INVISIBLE)) {
    		hideLabel(temp);
    		cdMenu.setDisabled(true);
    		cdMenu.setStyle("visibility:hidden");
    	}
    	if (checkpermision(temp, DISABLE)) {
    		cdMenu.setDisabled(true);
    	}
    }

    public void processHtmlCommandButton(UIComponent el, String elId) {
    	HtmlCommandButton cdBtn = (HtmlCommandButton) el;
		if (checkpermision(elId, INVISIBLE)) {
			cdBtn.setStyle("visibility:hidden");
			cdBtn.setDisabled(true);
		}
		if (checkpermision(elId, DISABLE)) {
			cdBtn.setDisabled(true);
		}
    }

    public void processPrimefacesCommandButton(UIComponent el, String elId) {
		org.primefaces.component.commandbutton.CommandButton cdBtn = (org.primefaces.component.commandbutton.CommandButton) el;
		if (checkpermision(elId, INVISIBLE)) {
		    hideSeparator(elId);
		    cdBtn.setRendered(false);
		    cdBtn.setDisabled(true);
		}
		if (checkpermision(elId, DISABLE)) {
		    hideSeparator(elId);
		    cdBtn.setDisabled(true);
		}
    }

    public void processHtmlCommandLink(UIComponent el, String elId) {
		HtmlCommandLink cdLink = (HtmlCommandLink) el;
		if (checkpermision(elId, INVISIBLE)) {
			hideLabel(elId);
		    cdLink.setStyle("visibility:hidden");
		    cdLink.setRendered(false);
		    cdLink.setDisabled(true);
		}
		if (checkpermision(elId, DISABLE)) {
			hideLabel(elId);
		    cdLink.setStyle("visibility:hidden");
		    cdLink.setDisabled(true);
		}
    }

    private void processHtmlOutputLink(UIComponent component, String elId) {
		HtmlOutputLink oLink = (HtmlOutputLink) component;
		if (checkpermision(elId, INVISIBLE)) {
		    oLink.setStyle("visibility:hidden");
		    oLink.setDisabled(true);
		}
		if (checkpermision(elId, DISABLE)) {
		    oLink.setDisabled(true);
		}
    }

    public void processHtmlInputText(UIComponent el, String elId) {
		HtmlInputText inputTxt = (HtmlInputText) el;
		logger.debug("InputText " + elId);
		if (checkpermision(elId, INVISIBLE)) {
		    hideLabel(elId);
		    inputTxt.setRendered(false);
		}
		if (checkpermision(elId, DISABLE)) {
		    inputTxt.setDisabled(true);
		}
    }

    public void processPrimefacesInputText(UIComponent el, String elId) {
		InputText inputTxt = (InputText) el;
		logger.debug("InputText " + elId);
		if (checkpermision(elId, INVISIBLE)) {
		    hideLabel(elId);
		    inputTxt.setRendered(false);
		}
		if (checkpermision(elId, DISABLE)) {
			hideLabel(elId);
		    inputTxt.setDisabled(true);
		}
    }

    public void processHtmlInputTextArea(UIComponent el, String elId) {
		HtmlInputTextarea inputTxtAr = (HtmlInputTextarea) el;
		logger.debug("InputTextArea " + elId);
		if (checkpermision(elId, INVISIBLE)) {
		    hideLabel(elId);
		    inputTxtAr.setStyle("visibility:hidden");
		}
		if (checkpermision(elId, DISABLE)) {
		    hideLabel(elId);
		    inputTxtAr.setDisabled(true);
		}
    }

    public void processHtmlSelectOneRadio(UIComponent el, String elId) {
		HtmlSelectOneRadio cdLink = (HtmlSelectOneRadio) el;
		logger.debug("SelectOneRadio " + elId);
		if (cdLink.getAccesskey().equals("F")) {
		    
		} else {
		    if (checkpermision(elId, INVISIBLE)) {
				hideLabel(elId);
				cdLink.setStyle("visibility:hidden");
				cdLink.setDisabled(true);
		    }
		    if (checkpermision(elId, DISABLE)) {
				hideLabel(elId);			
				cdLink.setDisabled(true);
		    }
		}

    }
    
    private void processPrimefacesTabView(UIComponent component, String elId) {
    	org.primefaces.component.tabview.Tab tab = (org.primefaces.component.tabview.Tab) component;
       	if (checkpermision(elId, INVISIBLE)) {
    	    //hideLabel(elId);
    	    tab.setRendered(false);
    	}
    	if (checkpermision(elId, DISABLE)) {
    		tab.setDisabled(true);
    	}
	}
    
    private void processPrimefacesMenuItem(UIComponent component, String elId) {
    	org.primefaces.component.menuitem.MenuItem item = (org.primefaces.component.menuitem.MenuItem) component;
    	if (checkpermision(elId, INVISIBLE)) {
    	    hideLabel(elId);
    	    item.setRendered(false);
    	}
    	if (checkpermision(elId, DISABLE)) {
    		item.setDisabled(true);
    	}
		
	}
    
    private void processPrimefacesInputTextArea(UIComponent component, String elId) {
    	org.primefaces.component.inputtextarea.InputTextarea inputTxtArea = (org.primefaces.component.inputtextarea.InputTextarea) component;
    	if (checkpermision(elId, INVISIBLE)) {
    	    hideLabel(elId);
    	    inputTxtArea.setRendered(false);
    	}
    	if (checkpermision(elId, DISABLE)) {
    		inputTxtArea.setDisabled(true);
    	}
	}

    
    private void processPrimefacesInputMask(UIComponent component, String elId) {
    	org.primefaces.component.inputmask.InputMask inputMask = (org.primefaces.component.inputmask.InputMask) component;
    	if (checkpermision(elId, INVISIBLE)) {
    	    hideLabel(elId);
    	    inputMask.setRendered(false);
    	}
    	if (checkpermision(elId, DISABLE)) {
    		inputMask.setDisabled(true);
    	}
	}

    private void processPrimefacesInputNumber(UIComponent component, String elId) {
    	org.primefaces.extensions.component.inputnumber.InputNumber inputNumber = (org.primefaces.extensions.component.inputnumber.InputNumber) component;
    	if (checkpermision(elId, INVISIBLE)) {
    	    hideLabel(elId);
    	    inputNumber.setRendered(false);
    	}
    	if (checkpermision(elId, DISABLE)) {
    		inputNumber.setDisabled(true);
    	}
	}
 	

    public void hideSeparator(String elId) {
		String elIdSEP = elId + "SEP";
		UIComponent componentSEP = componentTree.findComponent(elIdSEP);
		if (componentSEP == null) {
		    componentSEP = getUIcomponent(componentTree, elIdSEP);
		}	
		if (componentSEP != null) {
		    if (componentSEP instanceof org.primefaces.component.separator.Separator) {
			((org.primefaces.component.separator.Separator) componentSEP).setRendered(false);
		    }
		}
    }

    public void hideLabel(String elId) {
		String elIdTXT = elId + "TXT";
		String elIdREQ = elId + "REQ";
		String elIdSYM = elId + "SYM";
	
		UIComponent componentTXT = componentTree.findComponent(elIdTXT);
		if (componentTXT == null) {
		    componentTXT = getUIcomponent(componentTree, elIdTXT);
		  
		}
		  
		UIComponent componentREQ = componentTree.findComponent(elIdREQ);
		if (componentREQ == null) {
		    componentREQ = getUIcomponent(componentTree, elIdREQ);
		}
		UIComponent componentSYM = componentTree.findComponent(elIdSYM);
		if (componentSYM == null) {
		    componentSYM = getUIcomponent(componentTree, elIdSYM);
		}

		if (componentTXT != null) {
		    if (componentTXT instanceof OutputLabel) {
		    	
		    		
		    		((OutputLabel) componentTXT).setStyle("visibility:hidden");
		    		((OutputLabel) componentTXT).setRendered(false);		    	   		
		    	
		    } else if (componentTXT instanceof HtmlOutputLabel) {
		    	((HtmlOutputLabel) componentTXT).setStyle("visibility:hidden");
		    	((HtmlOutputLabel) componentTXT).setRendered(false);
		    } else if (componentTXT instanceof HtmlOutputText) {
				((HtmlOutputText) componentTXT).setStyle("visibility:hidden");
				((HtmlOutputText) componentTXT).setRendered(false);
		    } else if (componentTXT instanceof HtmlPanelGroup) {
				((HtmlPanelGroup) componentTXT).setStyle("visibility:hidden");
				((HtmlPanelGroup) componentTXT).setRendered(false);
		    }
		}
		if (componentREQ != null) {
		    if (componentREQ instanceof OutputLabel) {
				((OutputLabel) componentREQ).setStyle("visibility:hidden");
				((OutputLabel) componentREQ).setRendered(false);
		    } else if (componentREQ instanceof HtmlOutputLabel) {
				((HtmlOutputLabel) componentREQ).setStyle("visibility:hidden");
				((HtmlOutputLabel) componentREQ).setRendered(false);
		    } else if (componentREQ instanceof javax.faces.component.html.HtmlInputText) {
				((javax.faces.component.html.HtmlInputText) componentREQ).setStyle("visibility:hidden");
				((javax.faces.component.html.HtmlInputText) componentREQ).setRendered(false);
		    }
		}
		if (componentSYM != null) {
			if (componentSYM instanceof OutputLabel) {
				((OutputLabel) componentSYM).setStyle("visibility:hidden");
				((OutputLabel) componentSYM).setRendered(false);
		    } else if (componentSYM instanceof HtmlOutputLabel) {
				((HtmlOutputLabel) componentSYM).setStyle("visibility:hidden");
				((HtmlOutputLabel) componentSYM).setRendered(false);
		    } else if (componentSYM instanceof javax.faces.component.html.HtmlInputText) {
				((javax.faces.component.html.HtmlInputText) componentSYM).setStyle("visibility:hidden");
				((javax.faces.component.html.HtmlInputText) componentSYM).setRendered(false);
		    } else if (componentSYM instanceof CommandLink) {
		    	if (checkpermision(elId, INVISIBLE)) {
		    		((CommandLink) componentSYM).setRendered(false);
		    	} else if (checkpermision(elId, DISABLE)) {
		    		((CommandLink) componentSYM).setDisabled(true);		    		
		    	}				
		    }  else if (componentSYM instanceof javax.faces.component.html.HtmlCommandLink ) {
		    	((javax.faces.component.html.HtmlCommandLink) componentSYM).setStyle("visibility:hidden");
				((javax.faces.component.html.HtmlCommandLink) componentSYM).setRendered(false);
		    }
		}
		
	}

 

	public void hideColumnHeader(String elId) {
		String elIdTXT = elId + "TXT";

		UIComponent componentTXT = componentTree.findComponent(elIdTXT);
		if (componentTXT == null) {
			componentTXT = getUIcomponent(componentTree, elIdTXT);
		}

		if (componentTXT != null) {
			if (componentTXT instanceof Column) {
				((Column) componentTXT).setRendered(false);
			}
		} else {
		
		}
	}

    
    public String processNamingConvention(String inStr) {
		String[] strArr = inStr.split(":");
		String[] retStr = strArr[1].split("_");
		return retStr[0];
    }

    public String setScreenName(String viewID) {
		final boolean debug = logger.isDebugEnabled();
		String[] viewURL = viewID.split("/");
		int lenght = viewURL.length;
		String first = viewURL[lenght - 2];
		String second = viewURL[lenght - 1];
		String[] secondArray = second.split("\\.");
		String viewURLconcat = secondArray[0];
	
		logger.debug("UX Security engine invoked for screen :" + viewURLconcat);
	
		return viewURLconcat;
    }

    public boolean checkpermision(String ScreenElementID, String ScreenPermission) {
		Object permission = new String(ScreenPermission);
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		ApplicationContext ctx = ApplicationContextProvider.getApplicationContext();
		PermissionEvaluator permissionEvaluator = (PermissionEvaluator) ctx.getBean("permissionEvaluator");
	
		boolean result = false;
		result = permissionEvaluator.hasPermission(authentication, ScreenElementID, screen, permission);
		return result;
    }

    public String getCurrentSessionRole() {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		String userRoles = auth.getAuthorities().toString();
		return userRoles;
    }
}
