angular.module('productManager')
    .config(BuyerConfig)
    .controller('BuyerCtrl', BuyerController)
    .controller('BuyerEditCtrl', BuyerEditController)
    .controller('BuyerCreateCtrl', BuyerCreateController)
    .controller('BuyerProductsCtrl', BuyerProductsController);

function BuyerConfig($stateProvider) {
    'use strict';
    $stateProvider
        .state('buyers', {
            parent: 'base',
            templateUrl: 'buyers/templates/buyers.tpl.html',
            controller: 'BuyerCtrl',
            controllerAs: 'buyers',
            url: '/buyers?search&page&pageSize&searchOn&sortBy',
            data: { componentName: 'Channels', OrderIndex: 1 },
            resolve: {
                Parameters: function ($stateParams, OrderCloudParameters) {
                    return OrderCloudParameters.Get($stateParams);
                },
                BuyerList: function (OrderCloud, Parameters) {
                    return OrderCloud.Buyers.List(Parameters.search, Parameters.page, Parameters.pageSize || 12, Parameters.searchOn, Parameters.sortBy, Parameters.filters);
                    //Commenting out params that don't exist yet in the API
                }
            }
        })
        .state('buyers.edit', {
            url: '/:buyerid/edit',
            templateUrl: 'buyers/templates/buyerEdit.tpl.html',
            controller: 'BuyerEditCtrl',
            controllerAs: 'buyerEdit',
            resolve: {
                SelectedBuyer: function ($stateParams, OrderCloud) {
                    return OrderCloud.Buyers.Get($stateParams.buyerid);
                },
                LabeledSpecs: function (OrderCloud, $q, SelectedBuyer, Underscore) {
                    return OrderCloud.Specs.List(null, null, 100, null, null, null)
                        .then(function (data) {
                            var t = data;
                            var q = [];
                            if (data.Meta.TotalPages > 1) {
                                for (var v = 2; v <= data.Meta.TotalPages; v++) {
                                    q.push(function () {
                                        OrderCloud.Specs.List(null, v, 100, null, null, null).then(function (response) {
                                            angular.forEach(response.Items, function (i) {
                                                t.Items.push(i);
                                            });

                                        });
                                    }());
                                }
                                return $q.all(q).then(function (results) {
                                    var labeledSpecs = [];
                                    angular.forEach(t.Items, function (spec) {
                                        if (spec.xp && spec.xp.CustomLabels && spec.xp.CustomLabels[SelectedBuyer.ID]) {
                                            var tempSpec = angular.copy(spec);
                                            delete tempSpec.xp.CustomLabels[SelectedBuyer.ID];
                                            if (Underscore.keys(tempSpec.xp.CustomLabels).length == 0) {
                                                delete tempSpec.xp.CustomLabels;
                                            }
                                            labeledSpecs.push(tempSpec);
                                        }
                                    });
                                    return labeledSpecs;
                                });
                            } else {
                                var labeledSpecs = [];
                                angular.forEach(t.Items, function (spec) {
                                    if (spec.xp && spec.xp.CustomLabels && spec.xp.CustomLabels[SelectedBuyer.ID]) {
                                        var tempSpec = angular.copy(spec);
                                        delete tempSpec.xp.CustomLabels[SelectedBuyer.ID];
                                        if (Underscore.keys(tempSpec.xp.CustomLabels).length == 0) {
                                            delete tempSpec.xp.CustomLabels;
                                        }
                                        labeledSpecs.push(tempSpec);
                                    }
                                });
                                return labeledSpecs;
                            }
                        });
                }
            }
        })
        .state('buyers.create', {
            url: '/create',
            templateUrl: 'buyers/templates/buyerCreate.tpl.html',
            controller: 'BuyerCreateCtrl',
            controllerAs: 'buyerCreate'
        })
        .state('buyers.products', {
            url: '/:buyerid/products',
            templateUrl: 'buyers/templates/buyerProducts.tpl.html',
            controller: 'BuyerProductsCtrl',
            controllerAs: 'buyerProducts',
            resolve: {
                Assignments: function (FullOrderCloud, $stateParams) {
                    return FullOrderCloud.Products.ListAssignments(null, null, null, null, null, null, null, $stateParams.buyerid)
                },
                SelectedBuyer: function ($stateParams, OrderCloud) {
                    return OrderCloud.Buyers.Get($stateParams.buyerid);
                },
                ProductGroups: function (ResourceService) {
                    return ResourceService.ProductGroups();
                },
                ProductList: function (OrderCloud, Assignments, Helpers) {
                    let ids = Helpers.getFilterKeys(Assignments, true, "ProductID", "ID");

                    return OrderCloud.Products.List(null, 1, 100, null, null, { 'ID': ids });
                },
                ProductAssignments: function (Assignments, OrderCloud, Helpers) {
                    let ids = Helpers.getFilterKeys(Assignments, false, "ProductID", "ID");

                    return OrderCloud.Products.List(null, 1, 100, null, null, { 'ID': ids });
                }
            }
        });
}

function BuyerController($state, $ocMedia, BuyerList, OrderCloudParameters, OrderCloud, Parameters) {
    var vm = this;
    vm._pObj = "Products";
    vm.list = BuyerList;
    vm.parameters = Parameters;
    vm.sortSelection = Parameters.sortBy ? (Parameters.sortBy.indexOf('!') == 0 ? Parameters.sortBy.split('!')[1] : Parameters.sortBy) : null;

    //Check if filters are applied
    vm.filtersApplied = vm.parameters.filters || ($ocMedia('max-width:767px') && vm.sortSelection); //Sort by is a filter on mobile devices
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
        return OrderCloud.Buyers.List(Parameters.search, vm.list.Meta.Page + 1, Parameters.pageSize || vm.list.Meta.PageSize, Parameters.searchOn, Parameters.sortBy, Parameters.filters)
            .then(function (data) {
                vm.list.Items = vm.list.Items.concat(data.Items);
                vm.list.Meta = data.Meta;
            });
    };
}

function BuyerEditController($exceptionHandler, $state, $i18next, SelectedBuyer, OrderCloud, toastr, $q, LabeledSpecs, $scope, option_list, Audit) {
    var vm = this;
    vm.buyer = SelectedBuyer;
    vm.buyerName = SelectedBuyer.Name;
    vm.labeledSpecs = LabeledSpecs;
    vm.options = option_list;
    vm.Delete = function () {
        if (confirm("Are you sure you want to delete this Channel?")) {
            OrderCloud.Buyers.Delete(SelectedBuyer.ID)
                .then(function () {
                    var calls = [];
                    angular.forEach(vm.labeledSpecs, function (a) {
                        var c = {};
                        c.Method = 'PUT';
                        c.URL = 'http://api.ordercloud.io/v1/specs/' + a.ID;
                        c.Body = a;
                        calls.push(c);
                    });
                    if (calls.length > 0) {
                        $scope.application.apiAgentService.send(calls);
                        toastr.warning('Deleting Channel. Please do not exit.', 'Warning');
                    }
                    else {
                        toastr.success('Channel Deleted', 'Success');
                        Audit.log($i18next.t("Channel"), SelectedBuyer.Name, [{ "Type": "Channel", "TargetID": SelectedBuyer.ID}], 'DELETE');
                    }
                    $state.go('buyers', {}, { reload: true });
                })
                .catch(function (ex) {
                    $exceptionHandler(ex);
                });
        }
    }

    vm.Submit = function () {
        OrderCloud.Buyers.Update(vm.buyer, SelectedBuyer.ID)
            .then(function () {
                $state.go('buyers', {}, { reload: true });
                toastr.success('Channel Updated', 'Success');
                Audit.log($i18next.t("Channel"), SelectedBuyer.Name, [{ "Type": "Channel", "TargetID": SelectedBuyer.ID}], 'UPDATE');
            })
            .catch(function (ex) {
                $exceptionHandler(ex);
            });
    }
}

function BuyerCreateController($exceptionHandler, $state, $i18next, OrderCloud, toastr, option_list,Audit) {
    var vm = this;
    vm.options = option_list;
    vm.Submit = function () {
        OrderCloud.Buyers.Create(vm.buyer)
            .then(function (data) {
               
                var model = {
                "CatalogID": "product-groups",
                "BuyerID": data.ID,
                "ViewAllCategories": true,
                "ViewAllProducts": true
                }

                OrderCloud.Catalog.SaveAssignment(model).then(function(){
                    $state.go('buyers', {}, { reload: true });
                    toastr.success('Channel Created', 'Success');
                    Audit.log($i18next.t("Channel"), vm.buyer.Name, [{ "Type": "Channel", "TargetID": data.ID}], 'CREATE');

                 })



            })
            .catch(function (ex) {
                $exceptionHandler(ex);
            });
    }
}

function BuyerProductsController($scope, $exceptionHandler, $i18next, $state, SelectedBuyer, ProductList, Assignments, FullOrderCloud, OrderCloud,
    toastr, Underscore, $q, $stateParams, ProductAssignments, Paging, ProductGroups, dragulaService, Helpers, option_list, Audit) { 
    var vm = this;
    vm.buyer = SelectedBuyer;
    vm.buyerName = SelectedBuyer.Name;
    vm.list = ProductList;
    vm.productGroups = ProductGroups;
    vm.assignments = ProductAssignments;
    vm.listPagingFunction = ListPagingFunction;
    vm.assignmentPagingFunction = AssignmentPagingFunction;
    vm.options = option_list;
    vm.selectAll = function () {
        if (confirm('Are you sure you want to assign all products to this channel?')) {
            var calls = [];
            angular.forEach(vm.list.Items, function (product) {
                var c = {};
                c.Method = 'POST';
                c.URL = 'http://api.ordercloud.io/v1/products/assignments';
                c.Body = angular.copy(vm.model);
                c.Body.ProductID = product.ID;
                calls.push(c);
                vm.list.Meta.ItemRange[1]--;
                vm.list.Meta.TotalCount--;
                vm.assignments.Meta.ItemRange[1]++;
                vm.assignments.Meta.TotalCount++;
            });

            if (calls.length > 0) {
                $scope.application.apiAgentService.send(calls);
                toastr.success("Processing Requests. Please wait.");
            }
            else {
                toastr.success('Assignments Updated', 'Success');
            }

            vm.assignments.Items.unshift.apply(vm.assignments.Items, vm.list.Items);
            vm.list.Items = [];
        }
    };


    dragulaService.options($scope, 'spec-bag', {
        moves: function (el, container, handle) {
            return handle.id === 'handle';
        }
    });

    vm.model = {
        ProductID: "",
        PriceScheduleID: 1,
        BuyerID: SelectedBuyer.ID,
    };

    $scope.$on('prod-bag.drop-model', function (e, elScope, target, source) {
        if (angular.element(source).attr('id') == 'right-drag-col') {
            vm.unassign(elScope);
        }
        else {
            vm.assign(elScope);
        }
    });

    vm.pushOver = function (pd) {
        var _Index = 0;
        angular.forEach(vm.list.Items, function (prod, index) {
            if (prod.ID == pd.ID)
                _Index = index;
        });

        vm.list.Items.splice(_Index, 1);
        vm.assign(pd);
        vm.assignments.Items.unshift(pd);
    };

    vm.pushBack = function (pd) {
        var _Index = 0;
        angular.forEach(vm.assignments.Items, function (prod, index) {
            if (prod.ID == pd.ID)
                _Index = index;
        });

        vm.assignments.Items.splice(_Index, 1);
        vm.unassign(pd);
        vm.list.Items.unshift(pd);
    };

    vm.research = function () {
        var paramObject = {};

        if (vm.statusFilter && vm.statusFilter !== '')
            paramObject["xp.Status"] = vm.statusFilter;

        if (vm.groupFilter && vm.groupFilter !== '')
            paramObject["xp.Product-Group"] = vm.groupFilter;

        if (vm.brandFilter && vm.brandFilter !== '')
            paramObject["xp.Brand-Name"] = vm.brandFilter;

        let idList = Helpers.getFilterKeys(Assignments, false, "ProductID", "ID");
        let exList = Helpers.getFilterKeys(Assignments, true, "ProductID", "ID");

        if (vm.listFilter) {
            paramObject["ID"] = exList;
            OrderCloud.Products.List(vm.searchFilter, 1, 100, null, null, paramObject).then(function (data) {
                vm.list = data;
            });
        } else {
            OrderCloud.Products.List(null, 1, 100, null, null, { 'ID': exList }).then(function (data) {
                vm.list = data;
            });
        }

        if (vm.assignedFilter) {
            paramObject["ID"] = idList;
            OrderCloud.Products.List(vm.searchFilter, 1, 100, null, null, paramObject).then(function (data) {
                vm.assignments = data;
            });
        } else {
            OrderCloud.Products.List(null, 1, 100, null, null, { 'ID': idList }).then(function (data) {
                vm.assignments = data;
            });
        }
    };

    vm.toggleListFilter = function () {
        vm.listFilter = !vm.listFilter;
        vm.research();
    };

    vm.toggleAssignFilter = function () {
        vm.assignedFilter = !vm.assignedFilter;
        vm.research();
    };

    vm.assign = function (product) {
        var assignment = angular.copy(vm.model);
        assignment.ProductID = product.ID;
        OrderCloud.Products.SaveAssignment(assignment).then(function () {
            vm.list.Meta.ItemRange[1]--;
            vm.list.Meta.TotalCount--;
            vm.assignments.Meta.ItemRange[1]++;
            vm.assignments.Meta.TotalCount++;
            toastr.success('Product Assigned', 'Success');
            
            Audit.log($i18next.t("Channel Product Assignment"), product.Name +" > "+ SelectedBuyer.Name, [{ "Type": "Channel", "TargetID": SelectedBuyer.ID, "NewState": product.ID}], 'CREATE');
        });
    };

    vm.unassign = function (product) {
        OrderCloud.Products.DeleteAssignment(product.ID, null, null, SelectedBuyer.ID).then().then(function () {
            vm.list.Meta.ItemRange[1]++;
            vm.list.Meta.TotalCount++;
            vm.assignments.Meta.ItemRange[1]--;
            vm.assignments.Meta.TotalCount--;
            toastr.success('Product Removed', 'Success');

            Audit.log($i18next.t("Channel Product Assignment"), product.Name +" < "+ SelectedBuyer.Name, [{ "Type": "Channel", "TargetID": SelectedBuyer.ID, "PreviousState": product.ID}], 'DELETE');
        });
    };

    function ListPagingFunction() {
        let exList = Helpers.getFilterKeys(Assignments, true, "ProductID", "ID");
        return Paging.filteredPaging(vm.list, 'Products', vm.searchFilter, { 'ID': exList });
    }
    function AssignmentPagingFunction() {
        let idList = Helpers.getFilterKeys(Assignments, false, "ProductID", "ID");
        return Paging.filteredPaging(vm.assignments, 'Products', vm.searchFilter, { 'ID': idList });
    }
};

