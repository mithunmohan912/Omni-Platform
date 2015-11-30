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
package com.csc.cscip.ux.common.security.acl;

import org.springframework.security.acls.domain.AbstractPermission;
import org.springframework.security.acls.model.Permission;

public class CustomPermission extends AbstractPermission {

    /*
     * NE: User cannot edit the data D: User see the field disabled I: User cannot see the field CE: User cannot execute
     * (applies to Buttons)"
     */

    public static final Permission CANNOTEXECUTE = new CustomPermission(1 << 0, 'X'); /* 1 */
    public static final Permission INVISIBLE = new CustomPermission(1 << 1, 'I'); /* 2 */
    public static final Permission DISABLE = new CustomPermission(1 << 2, 'D'); /* 4 */
    public static final Permission FILTERED = new CustomPermission(1 << 3, 'F'); /* 8 */


    protected CustomPermission(int mask) {
	super(mask);
    }

    protected CustomPermission(int mask, char code) {
	super(mask, code);
    }

}