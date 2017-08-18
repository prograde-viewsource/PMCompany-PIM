angular.module('productManager').factory('AuditLogService', AuditLogService);

function AuditLogService($rootScope) {
    "use strict";
    return {
        log: _log
    };

    function _log(type = "", operation = "", targets = [], tags = "") {
        let log = {
            "type": type,
            "operation": operation,
            "userId": $rootScope.user.UserName,
            "description": getDescription(),
            "targets": targets,
            "tags": tags
        };


        let promise = new Promise((resolve, reject) => {

        });

        return promise;
    }

    function getDescription() {
        let dString = "";

        "[[USER]] ";


        return dString;
    }
}