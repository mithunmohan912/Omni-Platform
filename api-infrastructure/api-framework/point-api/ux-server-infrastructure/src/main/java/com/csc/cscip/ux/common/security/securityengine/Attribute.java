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

public class Attribute {

    String nameAttribute = "";
    boolean render;
    boolean editable;
    boolean required;
    String context;
    String viewID = "";

    public Attribute() {

    }

    public String getNameAttribute() {
	return nameAttribute;
    }

    public void setNameAttribute(String nameAttribute) {
	this.nameAttribute = nameAttribute;
    }

    public boolean isRender() {
	return render;
    }

    public void setRender(boolean render) {
	this.render = render;
    }

    public boolean isEditable() {
	return editable;
    }

    public void setEditable(boolean editable) {
	this.editable = editable;
    }

    public String getViewID() {
	return viewID;
    }

    public void setViewID(String viewID) {
	this.viewID = viewID;
    }

}
