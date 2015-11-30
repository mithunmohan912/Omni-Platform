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

import org.springframework.security.access.PermissionEvaluator;

public class SecurityService {

    private PermissionEvaluator permissionEvaluator;

    public SecurityService() {

    }

    public void setPermissionEvaluator(PermissionEvaluator permissionEvaluator) {
	this.permissionEvaluator = permissionEvaluator;
    }

}
