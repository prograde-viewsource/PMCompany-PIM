angular.module('pim-helpers',[]).factory('Helpers', PimHelpers);

////////////////////////////////////////////////////////////
// Exposes 'Helpers' for all controller to use when needed
// These are quick repeated functions
////////////////////////////////////////////////////////////

function PimHelpers() {
    "use strict";
    return {
        getFilterKeys: _getFilterKeys,
    };

    // Returns list of keys in an OrderCloud API object
    function _getFilterKeys(ocObject, negate = 'false', targetKey = 'ID', filterKey = 'ID') {

        let keys = '';
        let pipe = '|';
        let prefix = '';
        
        // $resource URL encodes everything!, and OrderCloud wants id=!xxx&id=!yyy for negated filter keys
        // we have to work around this see app.js for window.encodeURIComponent override/ use '_amp_' as '&' and '_eq_' as '='
        if (negate) {
            keys = '!--';
            pipe = '';
            prefix = '_amp_' + filterKey + '_eq_!';
        }
        
        // loop over ocObject.Items
        angular.forEach(ocObject.Items, function (itm) {
            keys += prefix + itm[targetKey] + pipe;
        });
        keys = keys.substr(0, keys.length); //Removed - 1 from the length

        return keys;
    }

}
