angular.module('audit-logger', []).factory('Audit', Audit);

////////////////////////////////////////////////////////////
// Exposes 'Audit Logger' for all controller to use when needed
////////////////////////////////////////////////////////////

function Audit($q, $resource, $rootScope, clientsecret, audit_settings) {
    'use strict';

    return {
        log: _log
    };

    // Returns list of keys in an OrderCloud API object
    function _log(type, _humanName, _targets = [], _operation = 'READ', _tags = "", _logType = 'AUDIT') {

        let template = '[[USER]] [[OPERATION]] [[TYPE]] - [[HUMANNAME]]';
        let description = "";

        var op = ""
        switch (_operation.toUpperCase()) {
            case 'CREATE':
                {
                    op = "added a";
                    break;
                }
            case 'READ':
                {
                    op = "viewed a";
                    break;
                }
            case 'UPDATE':
                {
                    op = "updated a";
                    break;
                }
            case 'DELETE':
                {
                    op = "deleted a";
                    break;
                }
            case 'EXECUTE':
                {
                    op = "";
                    break;
                }
        }

        description = template
            .replace('[[USER]]', $rootScope.user.Email)
            .replace('[[OPERATION]]', op)
            .replace('[[TYPE]]', type)
            .replace('[[HUMANNAME]]', _humanName);

        let logObj = {
            'Type': _logType.toUpperCase(),
            'Operation': _operation.toUpperCase(),
            'UserID': $rootScope.user.Email,
            'Description': description.toUpperCase(),
            'Targets': _targets
        };


        function postLog(logObj) {
            var d = $q.defer();
            $resource(audit_settings.url, null, {
                    callApi: {
                        method: 'POST',
                        headers: {
                            'client': clientsecret
                        }
                    }
                }).callApi(logObj).$promise
                .then(function(data) {
                    d.resolve(data);
                })
                .catch(function(ex) {
                    d.reject(ex);
                });
            return d.promise;
        }


        return postLog(logObj);
    }



}