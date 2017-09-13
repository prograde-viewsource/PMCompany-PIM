////////////////////////////////////////////
// Product Information Manager - VSTG
// User Account Screens
// Refactored - 3.23.2017 ADG
///////////////////////////////////

angular.module('productManager')
    .config(AccountConfig)
    .controller('AuditCtrl', AuditController)
    .controller('AuditDetailCtrl', AuditDetailController);

function AccountConfig($stateProvider) {
    'use strict';

    $stateProvider
    // Audit Log Profile State
        .state('auditlogs', {
        parent: 'base',
        url: '/auditlog?from&to&search&page&pageSize&searchOn&sortBy&filters',
        templateUrl: 'audit/templates/auditList.tpl.html',
        controller: 'AuditCtrl',
        controllerAs: 'audit',
        data: {
            componentName: 'Audit Log',
            OrderIndex: 10
        },
        resolve: {
            Parameters: function($stateParams, OrderCloudParameters) {
                return OrderCloudParameters.Get($stateParams);
            },
            AuditList: function(Parameters, clientsecret, $http) {
                var config = {
                    headers: {
                        'client': clientsecret
                    }
                };
                return $http.get("https://pimaudit.azurewebsites.net/api/AuditLogs?page=" + Parameters.page + "", config);
            }
        }
    })

}

//  Confirm Password Controller
function AuditDetailController($uibModalInstance, log) {
    'use strict';
    var vm = this;
    vm.log = log

    vm.submit = function() {
        $uibModalInstance.close();
    };

    vm.cancel = function() {
        $uibModalInstance.close();
    };
}


// Account Profile Controller
function AuditController($state, $ocMedia, AuditList, OrderCloudParameters, OrderCloud, Parameters, $uibModal) {
    var vm = this;
    vm._pObj = "Products";
    vm.list = AuditList.data;

    vm.parameters = Parameters;
    vm.sortSelection = Parameters.sortBy ? (Parameters.sortBy.indexOf('!') == 0 ? Parameters.sortBy.split('!')[1] : Parameters.sortBy) : null;

    //Check if filters are applied
    vm.filtersApplied = vm.parameters.filters || ($ocMedia('max-width:767px') && vm.sortSelection); //Sort by is a filter on mobile devices
    vm.showFilters = vm.filtersApplied;

    //Check if search was used
    vm.searchResults = Parameters.search && Parameters.search.length > 0;

    //Reload the state with new parameters
    vm.filter = function(resetPage) {
        $state.go('.', OrderCloudParameters.Create(vm.parameters, resetPage));
    };

    //Reload the state with new search parameter & reset the page
    vm.search = function() {
        vm.filter(true);
    };

    //Clear the search parameter, reload the state & reset the page
    vm.clearSearch = function() {
        vm.parameters.search = null;
        vm.filter(true);
    };

    //Clear relevant filters, reload the state & reset the page
    vm.clearFilters = function() {
        vm.parameters.filters = null;
        $ocMedia('max-width:767px') ? vm.parameters.sortBy = null : angular.noop(); //Clear out sort by on mobile devices
        vm.filter(true);
    };

    //Conditionally set, reverse, remove the sortBy parameter & reload the state
    vm.updateSort = function(value) {
        value ? angular.noop() : value = vm.sortSelection;
        switch (vm.parameters.sortBy) {
            case value:
                vm.parameters.sortBy = '!' + value;
                break;
            case '!' + value:
                vm.parameters.sortBy = null;
                break;
            default:
                vm.parameters.sortBy = value;
        }
        vm.filter(false);
    };

    //Used on mobile devices
    vm.reverseSort = function() {
        Parameters.sortBy.indexOf('!') == 0 ? vm.parameters.sortBy = Parameters.sortBy.split('!')[1] : vm.parameters.sortBy = '!' + Parameters.sortBy;
        vm.filter(false);
    };

    //Reload the state with the incremented page parameter
    vm.pageChanged = function() {
        $state.go('auditlogs', { page: vm.list.Meta.Page });
    };

    //Load the next page of results with all of the same parameters
    vm.loadMore = function() {
        return OrderCloud.Buyers.List(Parameters.search, vm.list.Meta.Page + 1, Parameters.pageSize || vm.list.Meta.PageSize, Parameters.searchOn, Parameters.sortBy, Parameters.filters)
            .then(function(data) {
                vm.list.Items = vm.list.Items.concat(data.Items);
                vm.list.Meta = data.Meta;
            });
    };

    vm.detailClick = function(log) {
        $uibModal.open({
            animation: true,
            templateUrl: 'audit/templates/auditDetail.modal.tpl.html',
            controller: 'AuditDetailCtrl',
            controllerAs: 'auditDetail',
            size: 'md',
            resolve: {
                log: function() {
                    return log;
                }
            },
        }).result.then(function() {
            angular.noop();
        }, function() {
            angular.noop();
        });
    }

}