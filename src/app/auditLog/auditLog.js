angular.module('productManager')
    .config(AuditLogConfig)
    .controller('AuditLogCtrl', AuditLogController);

function AuditLogConfig($stateProvider) {
    $stateProvider
        .state('auditLog', {
            parent: 'base',
            templateUrl: 'auditLog/templates/auditLog.tpl.html',
            controller: 'AuditLogCtrl',
            controllerAs: 'auditLog',
            url: '/auditlog',
            data: { componentName: 'Audit Log', OrderIndex: 7 },
            resolve: {
                Parameters: function($stateParams, OrderCloudParameters) {
                    return OrderCloudParameters.Get($stateParams);
                },
            }
        });
}

function AuditLogController($state, $ocMedia, OrderCloud, OrderCloudParameters, Parameters) {
    var vm = this;
    vm.searchAudits = function() {
        vm.searchKeyword = "Hello"
    }
}