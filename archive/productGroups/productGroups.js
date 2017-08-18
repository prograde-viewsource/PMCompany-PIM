angular.module('productManager')

    .config(ProductGroupsConfig)
    .controller('ProductGroupsCtrl', ProductGroupsController)

    ;

function ProductGroupsConfig($stateProvider) {
    $stateProvider
        .state('productgroups', {
            parent: 'base',
            templateUrl: 'productGroups/templates/productGroups.tpl.html',
            controller: 'ProductGroupsCtrl',
            controllerAs: 'productGroups',
            url: '/productgroups?from&to&search&page&pageSize&searchOn&sortBy&filters',
            data: { componentName: 'Product Groups' },
            resolve: {
                Parameters: function ($stateParams, OrderCloudParameters) {
                    return OrderCloudParameters.Get($stateParams);
                },
                ProductGroupList: function (OrderCloud, Parameters, $stateParams) {
                    console.log($stateParams);
                    var parameters = angular.copy(Parameters);
                    parameters.depth = 'all';
                    return OrderCloud.Categories.List(parameters.search, parameters.page, parameters.pageSize || 12, parameters.searchOn, parameters.sortBy, parameters.filters, parameters.parentID, parameters.depth);
                }
            }
        });
}

function ProductGroupsController($state, $ocMedia, OrderCloud, OrderCloudParameters, TrackSearch, Parameters) {
    var vm = this;
    vm.parameters = Parameters;
    vm.sortSelection = Parameters.sortBy ? (Parameters.sortBy.indexOf('!') == 0 ? Parameters.sortBy.split('!')[1] : Parameters.sortBy) : null;

    //Check if filters are applied
    vm.filtersApplied = vm.parameters.filters || vm.parameters.from || vm.parameters.to || ($ocMedia('max-width:767px') && vm.sortSelection); //Sort by is a filter on mobile devices
    vm.showFilters = vm.filtersApplied;

    //Check if search was used
    vm.searchResults = Parameters.search && Parameters.search.length > 0;

    //Reload the state with new parameters
    vm.filter = function (resetPage) {
        $state.go('.', OrderCloudParameters.Create(vm.parameters, resetPage));
    };

    //Reload the state with new search parameter & reset the page
    vm.search = function () {
        vm.filter(true);
    };

    //Clear the search parameter, reload the state & reset the page
    vm.clearSearch = function () {
        vm.parameters.search = null;
        vm.filter(true);
    };

    //Clear relevant filters, reload the state & reset the page
    vm.clearFilters = function () {
        vm.parameters.filters = null;
        vm.parameters.from = null;
        vm.parameters.to = null;
        $ocMedia('max-width:767px') ? vm.parameters.sortBy = null : angular.noop(); //Clear out sort by on mobile devices
        vm.filter(true);
    };

    //Conditionally set, reverse, remove the sortBy parameter & reload the state
    vm.updateSort = function (value) {
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
    vm.reverseSort = function () {
        Parameters.sortBy.indexOf('!') == 0 ? vm.parameters.sortBy = Parameters.sortBy.split('!')[1] : vm.parameters.sortBy = '!' + Parameters.sortBy;
        vm.filter(false);
    };

    //Reload the state with the incremented page parameter
    vm.pageChanged = function () {
        $state.go('.', { page: vm.list.Meta.Page });
    };

    //Load the next page of results with all of the same parameters
    vm.loadMore = function () {
        return OrderCloud.Products.List(Parameters.search, vm.list.Meta.Page + 1, Parameters.pageSize || vm.list.Meta.PageSize, Parameters.searchOn, Parameters.sortBy, Parameters.filters)
            .then(function (data) {
                vm.list.Items = vm.list.Items.concat(data.Items);
                vm.list.Meta = data.Meta;
            });
    };
}