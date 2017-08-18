angular.module('productManager').factory('UserPermissionsService', UserPermissionsService);

function UserPermissionsService(UserGroupService) {
    "use strict";
    return {
        check: _checkValue
    };

    function _checkValue(obj, bit) {
        let xpBit = 0;
        obj = obj.toLowerCase();
        let promise = new Promise((resolve, reject) => {
            UserGroupService.getList().then(function (ug) {
                angular.forEach(ug, function (item) {
                    if (item.xp[obj] > xpBit)
                        {xpBit = item.xp[obj];}
                });
            }).then(function () {
                resolve(Boolean(xpBit & bit === bit));
            });
        });

        return promise;
    }
}