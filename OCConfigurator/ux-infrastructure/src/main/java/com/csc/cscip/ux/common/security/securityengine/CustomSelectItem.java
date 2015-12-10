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

import java.io.Serializable;

public class CustomSelectItem implements Serializable {

    /**
     * 
     */
    private static final long serialVersionUID = 1L;

    public CustomSelectItem(Object value, String label, String id) {
	this.value = value;
	this.label = label;
	this.id = id;
    }

    private Object value;
    private String label;
    private String id;

    public Object getValue() {
	return value;
    }

    public void setValue(String value) {
	this.value = value;
    }

    public String getLabel() {
	return label;
    }

    public void setLabel(String label) {
	this.label = label;
    }

    public String getId() {
	return id;
    }

    public void setId(String id) {
	this.id = id;
    }

}
