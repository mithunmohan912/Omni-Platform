'use strict';


/**
* This is a recursive function that is searching deeply 
* into an jerarchy structure of objects
*
**/

/*function findDeeplyObject(id, currentNode) {
    var i,
        currentChild,
        result;

    if (id === currentNode.id) {
        return currentNode;
    } else {

        // Use a for loop instead of forEach to avoid nested functions
        // Otherwise "return" will not work properly
        for (i = 0; i < currentNode.children.length; i += 1) {
            currentChild = currentNode.children[i];
            // Search in the current child
            result = findDeeplyObject(id, currentChild);
            // Return the result if the node has been found
            if (!_.isEmpty(result)) {
                return result;
            }
        }
        // The node has not been found and we have no more options
        return null;
    }
}*/