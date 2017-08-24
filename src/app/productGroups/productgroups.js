angular.module('productManager')

.config(ProductGroupConfig)
    .controller('ProductGroupCtrl', ProductGroupController)
    .controller('ProductGroupEditCtrl', ProductGroupEditController)
    .controller('ProductGroupCreateCtrl', ProductGroupCreateController)
    .controller('ProductGroupCloneCtrl', ProductGroupCloneController)
    .controller('ProductGroupTreeCtrl', ProductGroupTreeController)
    .controller('ProductGroupAssignPartyCtrl', ProductGroupAssignPartyController)
    .controller('ProductGroupAssignProductCtrl', ProductGroupAssignProductController)
    .controller('ProductGroupAssignSpecCtrl', ProductGroupAssignSpecController)
    .factory('ProductGroupTreeService', ProductGroupTreeService)
    .directive('productGroupNode', ProductGroupNode)
    .directive('productGroupTree', ProductGroupTree)
    .controller('SelectDialogCtrl', SelectDialogController)
    .controller('DeselectDialogCtrl', DeselectDialogController);

function ProductGroupConfig($stateProvider) {
    "use strict";
    $stateProvider
        .state('productgroups', {
            parent: 'base',
            templateUrl: 'productGroups/templates/productgroups.tpl.html',
            controller: 'ProductGroupCtrl',
            controllerAs: 'productgroups',
            url: '/productgroups?from&to&search&page&pageSize&searchOn&sortBy&filters',
            data: {
                componentName: 'Product Groups',
                OrderIndex: 2
            },
            resolve: {
                Parameters: function($stateParams, OrderCloudParameters) {
                    return OrderCloudParameters.Get($stateParams);
                },
                CategoryList: function(OrderCloud, Parameters, $stateParams) {
                    var parameters = angular.copy(Parameters);
                    parameters.depth = 'all';
                    return OrderCloud.Categories.List(parameters.search, Parameters.page, 100, null, parameters.sortBy, null, 'all', null);
                }
            }
        })
        .state('productgroups.tree', {
            url: '/tree',
            templateUrl: 'productGroups/templates/productgroupsTree.tpl.html',
            controller: 'ProductGroupTreeCtrl',
            controllerAs: 'productgroupsTree',
            resolve: {
                Tree: function(CategoryTreeService) {
                    return CategoryTreeService.GetCategoryTree();
                }
            }
        })
        .state('productgroups.edit', {
            url: '/:categoryid/edit',
            templateUrl: 'productGroups/templates/productgroupsEdit.tpl.html',
            controller: 'ProductGroupEditCtrl',
            controllerAs: 'productgroupsEdit',
            resolve: {
                SelectedCategory: function($stateParams, $state, OrderCloud) {
                    return OrderCloud.Categories.Get($stateParams.categoryid).catch(function() {
                        $state.go('^.productgroups');
                    });
                },
                MasterCategoryList: function(OrderCloud, Parameters) {
                    var parameters = angular.copy(Parameters);
                    parameters.depth = 'all';
                    return OrderCloud.Categories.List(null, parameters.page, parameters.pageSize || 50, null, parameters.sortBy, parameters.filters, parameters.depth, 'master-product-groups');
                }
            }
        })
        .state('productgroups.create', {
            url: '/create',
            templateUrl: 'productGroups/templates/productgroupsCreate.tpl.html',
            controller: 'ProductGroupCreateCtrl',
            controllerAs: 'productgroupsCreate',
            resolve: {
                MasterCategoryList: function(OrderCloud, Parameters) {
                    var parameters = angular.copy(Parameters);
                    parameters.depth = 'all';
                    return OrderCloud.Categories.List(null, parameters.page, parameters.pageSize || 50, null, parameters.sortBy, parameters.filters, parameters.depth, 'master-product-groups');
                }
            }
        })
        .state('productgroups.clone', {
            url: '/:categoryid/clone',
            templateUrl: 'productGroups/templates/productgroupsClone.tpl.html',
            controller: 'ProductGroupCloneCtrl',
            controllerAs: 'productgroupsClone',
            resolve: {
                SelectedCategory: function($stateParams, $state, OrderCloud) {
                    return OrderCloud.Categories.Get($stateParams.categoryid).catch(function() {
                        $state.go('^.productgroups');
                    });
                }
            }
        })
        .state('productgroups.assignParty', {
            url: '/:categoryid/assign/party',
            templateUrl: 'productGroups/templates/productgroupsAssignParty.tpl.html',
            controller: 'ProductGroupAssignPartyCtrl',
            controllerAs: 'productgroupsAssignParty',
            resolve: {
                UserGroupList: function(OrderCloud) {
                    return OrderCloud.UserGroups.List();
                },
                AssignedUserGroups: function($stateParams, OrderCloud) {
                    return OrderCloud.Categories.ListAssignments($stateParams.categoryid);
                },
                SelectedCategory: function($stateParams, $state, OrderCloud) {
                    return OrderCloud.Categories.Get($stateParams.categoryid).catch(function() {
                        $state.go('^.productgroups');
                    });
                }
            }
        })
        .state('productgroups.assignProduct', {
            url: '/:categoryid/assign/product',
            templateUrl: 'productGroups/templates/productgroupsAssignProduct.tpl.html',
            controller: 'ProductGroupAssignProductCtrl',
            controllerAs: 'productgroupsAssignProd',

            resolve: {
                ProductList: function(FullOrderCloud, ProductAssignments, OrderCloud) {
                    console.log(ProductAssignments)
                    return FullOrderCloud.Products.List(null, 1, 100, null, null, null).then(function(data) {
                        var _data = data;
                        _data.Items = _data.Items.filter(function(current) {
                            return ProductAssignments.Items.filter(function(current_b) {
                                return current_b.ID === current.ID;
                            }).length === 0;
                        });
                        return _data;
                    });
                },
                ProductAssignments: function($stateParams, OrderCloud, FullOrderCloud, $q) {
                    return FullOrderCloud.Categories.ListProductAssignments($stateParams.categoryid).then(
                        function(data) {
                            var Calls = [];
                            var rtn = {
                                Meta: null,
                                Items: []
                            };
                            var uberQ = $q.defer();
                            var i, j, temparray, chunk = 20;

                            var array = [];
                            for (var i in data.Items) {

                                array.push(data.Items[i].ProductID);
                            }

                            for (i = 0, j = array.length; i < j; i += chunk) {
                                temparray = array.slice(i, i + chunk);

                                let ids = {
                                    "Items": null
                                }
                                if (temparray != undefined) {
                                    ids = temparray;
                                }

                                var re = new RegExp(',', 'g');
                                let keys = ids.toString().replace(re, "_pipe_");

                                if (keys === undefined) {
                                    keys = "";
                                }

                                Calls.push(OrderCloud.Products.List(null, 1, 100, null, null, {
                                    'ID': keys
                                }).then(function(response) {
                                    var conCatArr = rtn.Items.concat(response.Items);
                                    rtn.Items = conCatArr;
                                    rtn.Meta = response.Meta;
                                }));
                            }

                            $q.all(Calls).then(function() {
                                uberQ.resolve(rtn);
                            });

                            return uberQ.promise;
                        });
                },
                Assignments: function($stateParams, FullOrderCloud) {
                    return FullOrderCloud.Categories.ListProductAssignments($stateParams.categoryid);
                },
                SelectedCategory: function($stateParams, $state, OrderCloud) {
                    return OrderCloud.Categories.Get($stateParams.categoryid).catch(function() {
                        $state.go('^.productgroups');
                    });
                }
            }
        })
        .state('productgroups.assignSpec', {
            url: '/:categoryid/assign/spec',
            templateUrl: 'productGroups/templates/productgroupsAssignSpec.tpl.html',
            controller: 'ProductGroupAssignSpecCtrl',
            controllerAs: 'productgroupsAssignSpec',
            params: {
                group: null
            },
            resolve: {
                AssignedSpecs: function($stateParams, OrderCloud, FullOrderCloud, $q) {
                    return OrderCloud.Categories.Get($stateParams.categoryid).then(
                        function(data) {
                            var IDs = "";

                            if (data.xp == null) {
                                data.xp = {};
                                data.xp.specAssignments = [];
                            }

                            var specCalls = [];
                            var specs = {
                                Meta: null,
                                Items: []
                            };
                            var uberQ = $q.defer();
                            var i, j, temparray, chunk = 20;

                            var array = [];
                            for (var i in data.xp.specAssignments) {
                                array.push(i);
                            }

                            for (i = 0, j = array.length; i < j; i += chunk) {
                                temparray = array.slice(i, i + chunk);

                                let ids = {
                                    "Items": null
                                }
                                if (temparray != undefined) {
                                    ids = temparray;
                                }

                                var re = new RegExp(',', 'g');
                                let keys = ids.toString().replace(re, "_pipe_");

                                if (keys === undefined) {
                                    keys = "";
                                }

                                specCalls.push(OrderCloud.Specs.List(null, 1, 100, null, null, {
                                    'ID': keys
                                }).then(function(response) {
                                    var conCatArr = specs.Items.concat(response.Items);
                                    specs.Items = conCatArr;
                                    specs.Meta = response.Meta;
                                }));
                            }

                            $q.all(specCalls).then(function() {
                                uberQ.resolve(specs);
                            });

                            return uberQ.promise;

                        });
                },
                FullSpecList: function(FullOrderCloud, AssignedSpecs, $q) {
                    return FullOrderCloud.Specs.List(null, 1, 100, null, null, null).then(function(data) {
                        var _data = data;
                        _data.Items = _data.Items.filter(function(current) {
                            return AssignedSpecs.Items.filter(function(current_b) {
                                return current_b.ID === current.ID;
                            }).length === 0;
                        });

                        return _data;
                    });
                },
                SpecGroups: function(option_list) {

                    return option_list.spec_groups;
                },
                ProductAssignments: function($stateParams, FullOrderCloud) {
                    return FullOrderCloud.Categories.ListProductAssignments($stateParams.categoryid);
                },
                SelectedCategory: function($stateParams, $state, OrderCloud) {
                    return OrderCloud.Categories.Get($stateParams.categoryid).catch(function() {
                        $state.go('^.productgroups');
                    });
                }
            }
        });
}

//  Confirm Password Controller
function SelectDialogController($scope, $uibModalInstance, Audit, $i18next, toastr, Scope) {
    'use strict';
    var vm = this;
    vm.scope = Scope;
    vm.all = function() {
        delete Scope.paramObject.catalogID;
        toastr.success("Processing Requests. Please wait.");
        Scope.application.apiAgentService.assignProducts(Scope.buyer.ID);
        angular.forEach(Scope.list.Items, function(product) {
            Audit.log($i18next.t("Channel Product Assignment"), product.Name + " > " + Scope.buyer.Name, [{ "Type": "Channel", "TargetID": Scope.buyer.ID, "NewState": product.ID }], 'CREATE');
        });
        Scope.assignments.Meta = Scope.list.Data;
        Scope.assignments.Items.unshift.apply(Scope.assignments.Items, Scope.list.Items);
        Scope.list.Items = [];
        $uibModalInstance.close();
    };

    vm.visible = function() {
        delete Scope.paramObject.catalogID;
        Scope.application.apiAgentService.assignProducts(Scope.buyer.ID, Scope.paramObject, Scope.searchFilter);
        Scope.assignments.Meta = angular.copy(Scope.list.Meta);
        Scope.list.Meta.TotalCount = 0;
        Scope.assignments.Items.unshift.apply(Scope.assignments.Items, Scope.list.Items);
        Scope.list.Items = [];
        $uibModalInstance.close();
    };

    vm.cancel = function() {
        $uibModalInstance.close();
    };
}

function DeselectDialogController($scope, $uibModalInstance, Audit, $i18next, toastr, Scope) {
    'use strict';
    var vm = this;
    vm.all = function() {
        toastr.success("Processing Requests. Please wait.");
        Scope.application.apiAgentService.unassignProducts(Scope.buyer.ID);

        angular.forEach(Scope.list.Items, function(product) {
            Audit.log($i18next.t("Channel Product Assignment"), product.Name + " > " + Scope.buyer.Name, [{ "Type": "Channel", "TargetID": Scope.buyer.ID, "NewState": product.ID }], 'DELETE');
        });
        Scope.AssignArray = [];
        Scope.list.Items.unshift.apply(Scope.list.Items, Scope.assignments.Items);
        Scope.assignments.Items = [];
        Scope.list.Meta.ItemRange[1] = Scope.list.Items.length;
        Scope.assignments.Meta.ItemRange[1] = 0;
        Scope.assignments.Meta.TotalCount = 0
        $uibModalInstance.close();
    };

    vm.cancel = function() {
        $uibModalInstance.close();
    };
}


function ProductGroupController($state, $ocMedia, OrderCloud, OrderCloudParameters, CategoryList, TrackSearch, Parameters, $q, toastr, $http, $rootScope) {
    "use strict";
    var vm = this;
    vm.list = CategoryList;
    vm.parameters = Parameters;
    vm.sortSelection = Parameters.sortBy ? (Parameters.sortBy.indexOf('!') === 0 ? Parameters.sortBy.split('!')[1] : Parameters.sortBy) : null;

    //Check if filters are applied
    vm.filtersApplied = vm.parameters.filters || vm.parameters.from || vm.parameters.to || ($ocMedia('max-width:767px') && vm.sortSelection); //Sort by is a filter on mobile devices
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
        vm.parameters.from = null;
        vm.parameters.to = null;
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
        Parameters.sortBy.indexOf('!') === 0 ? vm.parameters.sortBy = Parameters.sortBy.split('!')[1] : vm.parameters.sortBy = '!' + Parameters.sortBy;
        vm.filter(false);
    };

    //Reload the state with the incremented page parameter
    vm.pageChanged = function() {
        $state.go('.', {
            page: vm.list.Meta.Page
        });
    };

    //Load the next page of results with all of the same parameters
    vm.loadMore = function() {
        return OrderCloud.Products.List(Parameters.search, vm.list.Meta.Page + 1, Parameters.pageSize || vm.list.Meta.PageSize, Parameters.searchOn, Parameters.sortBy, Parameters.filters)
            .then(function(data) {
                vm.list.Items = vm.list.Items.concat(data.Items);
                vm.list.Meta = data.Meta;
            });
    };

    vm.runTemplate = function(cat) {

        $rootScope.$emit('$stateChangeStart', $state);

        var report = angular.copy(cat);
        report.BuyerID = vm.selectedBuyer.ID;
        report.Products = [];
        report.Headers = {
            "ID": "Part Number",
            "Name": "Short Description",
            "Description": "Long Description",
            "xp.Status": "Status",
            "xp.UPC Each": "UPC Each",
            "xp.Product-Group": "Product Group",
            "xp.Brand-Name": "Brand Name"
        };

        var productQueue = [];

        OrderCloud.Categories.ListProductAssignments(report.ID).then(function(response) {
            var productIDList = response.Items;

            angular.forEach(productIDList, function(product) {
                productQueue.push((function() {
                    var df = $q.defer();
                    OrderCloud.Products.Get(product.ProductID).then(function(response) {
                        df.resolve();
                        report.Products.push(response);
                    });
                    return df.promise;
                })());
            });

            $q.all(productQueue).then(function() {
                $http({
                    method: 'POST',
                    url: 'https://harrisxlsgen.azurewebsites.net/xlsgen',
                    data: report
                }).then(function successCallback(response) {
                    toastr.success('Product Group Ordered', 'Success');
                    $rootScope.$emit('$stateChangeSuccess', $state);
                    window.open(response.data);
                }, function errorCallback(response) {
                    toastr.error('Product Group Order Failure', 'Error');
                    $rootScope.$emit('$stateChangeSuccess', $state);
                    console.log("failure");
                });
            });
        });
    };
}

function ProductGroupEditController($exceptionHandler, $state, FullOrderCloud, OrderCloud, SelectedCategory, toastr, option_list, Audit, MasterCategoryList) {
    "use strict";
    var vm = this,
        categoryID = SelectedCategory.ID;
    vm.categoryName = SelectedCategory.Name;
    vm.category = SelectedCategory;
    vm.options = option_list;
    vm.MasterProductGroup = MasterCategoryList.Items;

    let ogMasterGroup;


    try {
        ogMasterGroup = vm.category.xp['Master-Group'].ID;
        vm.SelectedGroup = vm.category.xp['Master-Group'].ID;
    } catch (e) {}

    vm.Submit = function(redirect) {

        vm.MasterProductGroup.forEach(function(mg) {
            if (vm.SelectedGroup == mg.ID) {
                vm.category.xp['Master-Group'] = {
                    ID: mg.ID,
                    Name: mg.Name
                };
            }
        });

        if (vm.SelectedGroup != ogMasterGroup) {

            OrderCloud.Categories.Get(ogMasterGroup, 'master-product-groups').then(function(og) {
                try {
                    og.xp.ProductGroups.forEach(function(grp, idx) {
                        if (grp.ID == ogMasterGroup) {
                            og.xp.ProductGroups.slice(og.xp.ProductGroups[idx], 1)
                        }
                    });
                    OrderCloud.Categories.Update(og.ID, og, 'master-product-groups').then(function() {
                        OrderCloud.Categories.Get(vm.SelectedGroup, 'master-product-groups').then(function(og) {
                            og.xp.ProductGroups.unshift({
                                ID: vm.category.ID,
                                Name: vm.category.Name
                            });
                            OrderCloud.Categories.Update(og.ID, og, 'master-product-groups');
                        });
                    });
                } catch (e) {}
            });




        }


        FullOrderCloud.Categories.ListProductAssignments(categoryID, null, 1, 100, null).then(function(data) {
            data.Items.forEach(function(prodass) {
                OrderCloud.Products.Get(prodass.ProductID).then(function(prod) {
                    prod.xp['Master-Product-Group-XP'] = "";
                    prod.xp['Master-Group'] = {
                        ID: vm.category.xp['Master-Group'].ID,
                        Name: vm.category.xp['Master-Group'].Name
                    };
                    OrderCloud.Products.Update(prod.ID, prod);
                });
            });
        });




        OrderCloud.Categories.Update(categoryID, vm.category)
            .then(function() {
                Audit.log("Product Group", SelectedCategory.Name, [{
                    "Type": "Product Group",
                    "TargetID": categoryID
                }], 'UPDATE');

                if (redirect) {
                    $state.go('productgroups', {}, {
                        reload: true
                    });
                }

                toastr.success('Product Group Updated', 'Success');
            })
            .catch(function(ex) {
                $exceptionHandler(ex);
            });
    };

    vm.Delete = function() {

        OrderCloud.Categories.ListProductAssignments(SelectedCategory.ID).then(function(data) {

            if (data.Items.length === 0) {


                if (confirm("Are you sure you want to delete this product group?")) {
                    OrderCloud.Categories.Delete(SelectedCategory.ID)
                        .then(function() {
                            Audit.log("Product Group", SelectedCategory.Name, [{
                                "Type": "Product Group",
                                "TargetID": categoryID
                            }], 'DELETE');
                            $state.go('productgroups', {}, {
                                reload: true
                            });
                            toastr.success('Product Group Deleted', 'Success');
                        })
                        .catch(function(ex) {
                            $exceptionHandler(ex);
                        });
                }
            } else {
                alert('WARNING! - All products must be unassigned before a Product Group can be deleted')
            }

        });

    };
}

function ProductGroupCreateController($exceptionHandler, $state, OrderCloud, toastr, option_list, Audit, MasterCategoryList) {
    "use strict";
    var vm = this;
    vm.category = {
        xp: {}
    };
    vm.options = option_list;
    vm.MasterProductGroup = MasterCategoryList.Items;
    vm.Submit = function(redirect) {
        if (vm.category.ParentID === '') {
            vm.category.ParentID = null;
        }
        vm.MasterProductGroup.forEach(function(mg) {
            if (vm.SelectedGroup == mg.ID) {
                vm.category.xp['Master-Group'] = {
                    ID: mg.ID,
                    Name: mg.Name
                };
            }
        });

        OrderCloud.Categories.Create(vm.category)
            .then(function(data) {
                Audit.log("Product Group", data.Name, [{
                    "Type": "Product Group",
                    "TargetID": data.ID
                }], 'CREATE');


                if (redirect) {
                    $state.go('productgroups', {}, {
                        reload: true
                    });
                } else {
                    $state.go('productgroups.edit', {
                        categoryid: data.ID
                    }, {
                        reload: true
                    });
                }

                toastr.success('Product Group Created', 'Success');
            })
            .catch(function(ex) {
                $exceptionHandler(ex);
            });
    };
}

function ProductGroupCloneController($exceptionHandler, $state, OrderCloud, SelectedCategory, toastr, Audit) {
    "use strict";
    var vm = this,
        oldName = SelectedCategory.Name + '',
        categoryID = SelectedCategory.ID;
    vm.categoryName = SelectedCategory.Name;
    vm.category = SelectedCategory;
    delete vm.category.ID;

    vm.Submit = function(redirect) {
        if (vm.category.ParentID === '') {
            vm.category.ParentID = null;
        }
        OrderCloud.Categories.Create(vm.category)
            .then(function(data) {
                Audit.log("Product Group", data.Name + " -- Cloned From -- " + oldName, [{
                    "Type": "Product Group",
                    "TargetID": data.ID
                }], 'CREATE');
                if (redirect) {
                    $state.go('productgroups', {}, {
                        reload: true
                    });
                } else {
                    $state.go('productgroups.edit', {
                        categoryid: data.ID
                    }, {
                        reload: true
                    });
                }
                toastr.success('Product Group Created', 'Success');
            })
            .catch(function(ex) {
                $exceptionHandler(ex);
            });
    };
}

function ProductGroupTreeController(Tree, CategoryTreeService) {
    "use strict";
    var vm = this;
    vm.tree = Tree;

    vm.treeOptions = {
        dropped: function(event) {
            CategoryTreeService.UpdateCategoryNode(event);
        }
    };
}

function ProductGroupAssignPartyController($scope, OrderCloud, Assignments, Paging, UserGroupList, AssignedUserGroups, SelectedCategory, toastr) {
    "use strict";
    var vm = this;
    vm.Category = SelectedCategory;
    vm.list = UserGroupList;
    vm.assignments = AssignedUserGroups;
    vm.saveAssignments = SaveAssignment;
    vm.pagingfunction = PagingFunction;

    $scope.$watchCollection(function() {
        return vm.list;
    }, function() {
        Paging.setSelected(vm.list.Items, vm.assignments.Items, 'UserGroupID');
    });

    function SaveFunc(ItemID) {

        return OrderCloud.Categories.SaveAssignment({
            UserID: null,
            UserGroupID: ItemID,
            CategoryID: vm.Category.ID
        });
    }

    function DeleteFunc(ItemID) {
        return OrderCloud.Categories.DeleteAssignment(vm.Category.ID, null, ItemID);
    }

    function SaveAssignment() {
        toastr.success('Assignment Updated', 'Success');
        return Assignments.saveAssignments(vm.list.Items, vm.assignments.Items, SaveFunc, DeleteFunc);
    }

    function AssignmentFunc() {
        return OrderCloud.Categories.ListAssignments(vm.Category.ID, null, vm.assignments.Meta.PageSize);
    }

    function PagingFunction() {
        return Paging.paging(vm.list, 'UserGroups', vm.assignments, AssignmentFunc);
    }
}

function ProductGroupAssignProductController($scope, OrderCloud, FullOrderCloud, $uibModal, Assignments, Paging, ProductList, ProductAssignments, SelectedCategory, toastr, $timeout, dragulaService, $state, $stateParams, Audit, option_list) {
    "use strict";
    var vm = this;
    vm.Category = SelectedCategory;
    vm.prodAssignments = ProductAssignments;
    vm.pagingfunction = PagingFunction;
    vm.list = ProductList;
    vm.changedProducts = {};
    vm.options = option_list;
    var searching;

    console.log(Assignments);

    vm.research = function() {
        var paramObject = {};


        if (searching) {
            $timeout.cancel(searching);
        }
        searching = $timeout(function() {
            if (vm.statusFilter && vm.statusFilter !== '') {
                paramObject["xp.Status"] = vm.statusFilter;
            }
            if (vm.groupFilter && vm.groupFilter !== '') {
                paramObject["xp.Product-Group"] = vm.groupFilter;
            }
            if (vm.brandFilter && vm.brandFilter !== '') {
                paramObject["xp.Brand-Name"] = vm.brandFilter;
            }

            if (vm.searchby == '') {
                vm.searchby = null;
            }
            if (searching) $timeout.cancel(searching);


            var xpSearch = false;
            var keywords = vm.searchFilter;
            var searchby = vm.searchby;

            if (vm.searchby) {
                if (vm.searchby.toString().includes("xp.")) {
                    xpSearch = true;
                    if (vm.searchFilter != '' && vm.searchFilter != undefined)
                        paramObject[vm.searchby] = "*" + vm.searchFilter + "*"; // "*" Fuzzy Search
                }
            }

            if (xpSearch) {
                keywords = null;
                searchby = null;
            }


            OrderCloud.Categories.ListProductAssignments(vm.Category.ID).then(
                function(data) {
                    let IDs = "";
                    angular.forEach(data.Items, function(item) {

                        IDs += item.ProductID + "|";
                    });
                    IDs = IDs.substr(0, IDs.length - 1);

                    var _paramObject = jQuery.extend(true, {}, paramObject);
                    _paramObject.ID = IDs;


                    OrderCloud.Products.List(keywords, 1, 100, searchby, null, _paramObject).then(function(data) {

                        if (vm.assignedFilter) {
                            vm.prodAssignments = data;
                        }


                        OrderCloud.Products.List(keywords, 1, 100, searchby, null, paramObject).then(function(d2) {
                            var _data = d2;
                            _data.Items = _data.Items.filter(function(current) {
                                return vm.prodAssignments.Items.filter(function(current_b) {
                                    return current_b.ID === current.ID;
                                }).length === 0;
                            });

                            if (vm.listFilter) {
                                vm.list = _data;
                            }
                        });
                    });

                });
        }, 100);

    };
    vm.selectAll = function() {
        $uibModal.open({
            animation: true,
            templateUrl: 'productGroups/templates/select.modal.tpl.html',
            controller: 'SelectDialogCtrl',
            controllerAs: 'select',
            size: 'sm',
            resolve: {
                Scope: function() {
                    return vm;
                }
            },
        }).result.then(function() {
            angular.noop();
        }, function() {
            angular.noop();
        });
    }

    vm.deselectAll = function() {
        $uibModal.open({
            animation: true,
            templateUrl: 'productGroups/templates/deselect.modal.tpl.html',
            controller: 'DeselectDialogCtrl',
            controllerAs: 'select',
            size: 'sm',
            resolve: {
                Scope: function() {
                    return vm;
                }
            },
        }).result.then(function() {
            angular.noop();
        }, function() {
            angular.noop();
        });
    };
    dragulaService.options($scope, 'drag-bag', {
        moves: function(el, container, handle) {
            return handle.id === 'handle';
        },
    });

    $scope.$on('drag-bag.drop-model', function(e, elScope, target, source) {
        if (angular.element(source).attr('id') !== 'right-drag-col') {
            SaveFunc(elScope.ID);
        } else {
            DeleteFunc(elScope.ID);
        }
    });


    vm.toggleListFilter = function() {
        vm.listFilter = !vm.listFilter;
        vm.list = ProductList;
        vm.research();
    };

    vm.toggleAssignFilter = function() {
        vm.assignedFilter = !vm.assignedFilter;
        vm.prodAssignments = ProductAssignments;
        vm.research();
    };

    vm.pushOver = function(pd) {
        var _Index = 0;

        angular.forEach(vm.list.Items, function(sp, index) {
            if (sp.ID === pd.ID) {
                _Index = index;
            }
        });

        vm.list.Items.splice(_Index, 1);

        OrderCloud.Categories.ListProductAssignments(null, pd.ID, 1, 100, null).then(function(data) {
            if (data.Items.length === 0) {
                SaveFunc(pd.ID);
                vm.prodAssignments.Items.unshift(pd);
            } else {

                OrderCloud.Categories.Get(data.Items[0].CategoryID, "product-groups").then(function(curCat) {
                    // var result = confirm("Are you Sure you want to change the Assisnment of this product? the current category is - " + curCat.Name);
                    //if (result) {
                    OrderCloud.Categories.DeleteProductAssignment(vm.Category.ID, pd.ID, "product-groups").then(function() {
                        SaveFunc(pd.ID);
                        vm.prodAssignments.Items.unshift(pd);
                    });
                    //}
                });
            }
        });
    };

    vm.pushBack = function(pd) {
        var _Index = 0;

        angular.forEach(vm.prodAssignments.Items, function(sp, index) {
            if (sp.ID === pd.ID) {
                _Index = index;
            }
        });

        vm.prodAssignments.Items.splice(_Index, 1);

        DeleteFunc(pd.ID);
        vm.list.Items.unshift(pd);

        OrderCloud.Products.Get(pd.ID).then(function(data) {

            data.xp["Product-Group"] = null;
            OrderCloud.Products.Update(pd.ID, data).then(function() {
                FullOrderCloud.Specs.ListProductAssignments(null, pd.ID).then(function(dta) {
                    angular.forEach(dta.Items, function(a) {
                        OrderCloud.Specs.DeleteProductAssignment(a.SpecID, pd.ID)
                    });
                });
            });

        })
    };

    function SaveFunc(ItemID) {
        return OrderCloud.Categories.SaveProductAssignment({
            CategoryID: vm.Category.ID,
            ProductID: ItemID
        }).then(function() {
            Audit.log("Product Group Product Assignment", vm.Category.Name, {
                TargetID: ItemID,
                Type: "Product"
            }, 'CREATE');
            toastr.success('Assignment Added', 'Success');
        });
    }

    function DeleteFunc(ItemID) {

        return OrderCloud.Categories.DeleteProductAssignment(vm.Category.ID, ItemID).then(function() {
            Audit.log("Product Group Product Assignment", vm.Category.Name, {
                TargetID: ItemID,
                Type: "Product"
            }, 'DELETE');
            toastr.success('Assignment Removed', 'Success');
        });
    }

    function PagingFunction() {
        var paramObject = {};

        if (vm.statusFilter && vm.statusFilter !== '') {
            paramObject["xp.Status"] = vm.statusFilter;
        }
        if (vm.groupFilter && vm.groupFilter !== '') {
            paramObject["xp.Product-Group"] = vm.groupFilter;
        }
        if (vm.brandFilter && vm.brandFilter !== '') {
            paramObject["xp.Brand-Name"] = vm.brandFilter;
        }
        paramObject.catalogID = $stateParams.buyerid;

        return Paging.filteredPaging(vm.list, 'Products', vm.searchFilter, paramObject);
        // return Paging.paging(vm.list, 'Products', vm.list, function () {});
    }

}

function ProductGroupAssignSpecController($scope, OrderCloud, FullOrderCloud, Assignments, Paging, SelectedCategory, toastr, $timeout, FullSpecList, option_list, $state, $stateParams, dragulaService, ProductAssignments, AssignedSpecs, $q, Audit) {
    "use strict";
    var vm = this;




    vm.groupFilter = $stateParams.group;


    vm.Category = SelectedCategory;
    if (!vm.Category.xp) {
        vm.Category.xp = {};
    }
    try {

        if (typeof(vm.Category.xp) == "string") {
            vm.Category.xp = JSON.parse(vm.Category.xp);
        }
        if (typeof(vm.Category.xp.specAssignments) == "string") {
            vm.Category.xp.specAssignments = JSON.parse(vm.Category.xp.specAssignments);
        }
    } catch (e) {}

    vm.doTheBack = function() {
        window.history.back();
    };



    console.log(AssignedSpecs)

    vm.productAssignments = ProductAssignments;
    vm.SpecGroups = option_list.spec_groups;
    vm.SpecGroups.splice(0, 1);



    vm.updateAssignment = updateAssignment;
    vm.pagingfunction = PagingFunction;
    vm.list = FullSpecList;
    vm.changedSpecs = {};
    vm.assignedSpecs = AssignedSpecs;

    var searching;
    vm.research = function() {
        if (searching) $timeout.cancel(searching);
        searching = $timeout(function() {
            var paramObject = {};

            if (vm.groupFilter && vm.groupFilter !== '') {
                paramObject["xp.Group"] = vm.groupFilter;
            }

            if (vm.searchFilter === '') {
                vm.searchFilter = null;
            }


            var _paramObject = jQuery.extend(true, {}, paramObject);
            //    _paramObject.ID = IDs;


            OrderCloud.Categories.Get($stateParams.categoryid).then(
                function(data) {
                    var IDs = "";

                    if (data.xp == null) {
                        data.xp = {};
                        data.xp.specAssignments = [];
                    }

                    var specCalls = [];
                    var specs = {
                        Meta: null,
                        Items: []
                    };
                    var uberQ = $q.defer();
                    var i, j, temparray, chunk = 20;

                    var array = [];

                    for (var i in data.xp.specAssignments) {
                        array.push(i);
                    }

                    for (i = 0, j = array.length; i < j; i += chunk) {
                        temparray = array.slice(i, i + chunk);

                        let ids = {
                            "Items": null
                        }
                        if (temparray != undefined) {
                            ids = temparray;
                        }

                        var re = new RegExp(',', 'g');
                        let keys = ids.toString().replace(re, "_pipe_");

                        if (keys === undefined) {
                            keys = "";
                        }
                        _paramObject.ID = keys
                        specCalls.push(OrderCloud.Specs.List(vm.searchFilter, 1, 100, null, null, _paramObject).then(function(response) {
                            var conCatArr = specs.Items.concat(response.Items);
                            specs.Items = conCatArr;
                            specs.Meta = response.Meta;
                        }));
                    }

                    $q.all(specCalls).then(function() {
                        uberQ.resolve(specs);
                    });

                    uberQ.promise.then(function(specResolve) {

                        if (vm.assignedFilter) {
                            vm.assignedSpecs = specResolve;
                        }


                        FullOrderCloud.Specs.List(vm.searchFilter, 1, 100, null, null, paramObject)
                            .then(function(data) {
                                data.Items = data.Items.filter(function(current) {
                                    return vm.assignedSpecs.Items.filter(function(current_b) {
                                        return current_b.ID === current.ID;
                                    }).length === 0;
                                });
                                if (vm.listFilter) {
                                    vm.list = data;
                                }
                            });

                    });

                });




        }, 100);
    };

    dragulaService.options($scope, 'spec-bag', {
        moves: function(el, container, handle) {
            return handle.id === 'handle';
        },
    });

    $scope.$on('spec-bag.drop-model', function(e, elScope, target, source) {
        vm.updateAssignment(elScope);
    });

    vm.toggleListFilter = function() {
        vm.listFilter = !vm.listFilter;
        vm.list = FullSpecList;
        vm.research();
    };

    vm.toggleAssignFilter = function() {
        vm.assignedFilter = !vm.assignedFilter;
        vm.assignedSpecs = AssignedSpecs;
        vm.research();
    };

    vm.pushOver = function(spec) {
        var _Index = 0;

        angular.forEach(vm.list.Items, function(sp, index) {
            if (sp.ID === spec.ID) {
                _Index = index;
            }
        });

        vm.list.Items.splice(_Index, 1);
        vm.updateAssignment(spec);
        vm.assignedSpecs.Items.unshift(spec);
    };

    vm.pushBack = function(spec) {
        var _Index = 0;

        angular.forEach(vm.assignedSpecs.Items, function(sp, index) {
            if (sp.ID === spec.ID) {
                _Index = index;
            }
        });

        vm.assignedSpecs.Items.splice(_Index, 1);
        vm.updateAssignment(spec);
        vm.list.Items.unshift(spec);
    };


    function updateAssignment(s) {

        var auditTargets = [];
        if (s !== undefined) {
            auditTargets.push({
                "Type": "Product Group",
                "TargetID": s.ID
            });
            var auditTargets = [];
            var specTargets = [];

            // create an object if needed
            if (!vm.Category.xp.specAssignments) {
                vm.Category.xp.specAssignments = {};
            }
            vm.assignmentsToBeDeleted = [];
            vm.assignmentsToBeCreated = [];

            // if it doesn't exist in the Category.xp CREATE it. 
            if (!vm.Category.xp.specAssignments[s.ID] || vm.Category.xp.specAssignments[s.ID] === 'undefined') {
                vm.Category.xp.specAssignments[s.ID] = s.ID;
                vm.assignmentsToBeCreated.push(s.ID);
                auditTargets.push({
                    "Type": "Product Group Attribute Assignments",
                    "TargetID": vm.Category.ID,
                    "NewState": s.ID
                });
            }
            // Else DELETE it
            else if (vm.Category.xp.specAssignments[s.ID] === s.ID) {
                vm.assignmentsToBeDeleted.push(s.ID);
                delete vm.Category.xp.specAssignments[s.ID];
                auditTargets.push({
                    "Type": "Product Group Attribute Assignments",
                    "TargetID": vm.Category.ID,
                    "PerviousState": s.ID
                });
            }

            // UPDATE the Category with the new XP
            OrderCloud.Categories.Update(vm.Category.ID, vm.Category)
                .then(function() {

                    var calls = [];
                    angular.forEach(vm.productAssignments.Items, function(a) {

                        // If we are adding we have to update all the products with the new spec...
                        angular.forEach(vm.assignmentsToBeCreated, function(sa) {
                            var c = {};
                            c.Method = 'POST';
                            c.URL = 'https://api.ordercloud.io/v1/specs/productassignments';
                            c.Body = {
                                'ProductID': a.ProductID,
                                'SpecID': sa,
                                'DefaultValue': a.DefaultValue ? a.DefaultValue : null,
                                'DefaultOptionID': a.DefaultOptionID ? a.DefaultOptionID : null
                            };
                            calls.push(c);

                            auditTargets.push({
                                "Type": "Product Attribute Assignment",
                                "TargetID": sa,
                                "NewState": a.ProductID
                            });
                        });

                        // We need to remove the spec from any product that happens to have it
                        angular.forEach(vm.assignmentsToBeDeleted, function(sa) {
                            var c = {};
                            c.Method = 'DELETE';
                            c.URL = 'https://api.ordercloud.io/v1/specs/' + sa + '/productassignments/' + a.ProductID;
                            c.Body = {
                                'ProductID': a.ProductID,
                                'SpecID': sa
                            };
                            calls.push(c);
                            auditTargets.push({
                                "Type": "Product Attribute Assignment",
                                "TargetID": sa,
                                "PreviousState": a.ProductID
                            });
                        });
                    });

                    if (calls.length > 0) {
                        $scope.application.apiAgentService.send(calls);
                        toastr.success("Processing Requests. Please wait.");

                    } else {
                        toastr.success('Assignments Updated', 'Success');
                    }

                    Audit.log("Product Group Attribute Assignments", s.Name + " - " + vm.Category.Name, auditTargets, 'UPDATE');

                });
        }
    }

    function AssignmentFunc() {
        return OrderCloud.Categories.ListProductAssignments(vm.Category.ID, null, 100);
    }

    function PagingFunction() {
        return; //Paging.paging(vm.list, 'Specs', vm.list, function() {});
    }

    vm.specSelectChange = function(s) {
        s.selected === true ? vm.changedSpecs[s.ID] = s : vm.changedSpecs[s.ID] = 'delete';
    };
}

function ProductGroupTree() {
    "use strict";
    return {
        restrict: 'E',
        replace: true,
        scope: {
            tree: '='
        },
        template: "<ul><category-node ng-repeat='node in tree' node='node'></category-node></ul>"
    };
}

function ProductGroupNode($compile) {
    "use strict";
    return {
        restrict: 'E',
        replace: true,
        scope: {
            node: '='
        },
        template: '<li><a ui-sref="base.adminCategories.edit({id:node.ID})" ng-bind-html="node.Name"></a></li>',
        link: function(scope, element) {
            if (angular.isArray(scope.node.children)) {
                element.append("<category-tree tree='node.children' />");
                $compile(element.contents())(scope);
            }
        }
    };
}

function ProductGroupTreeService($q, Underscore, OrderCloud) {
    "use strict";
    return {
        GetCategoryTree: tree,
        UpdateCategoryNode: update
    };

    function tree() {
        var tree = [];
        var deferred = $q.defer();
        OrderCloud.Categories.List(null, 1, 100, null, null, null, null, 'all')
            .then(function(list) {
                angular.forEach(Underscore.where(list.Items, {
                    ParentID: null
                }), function(node) {
                    tree.push(getnode(node));
                });

                function getnode(node) {
                    var children = Underscore.where(list.Items, {
                        ParentID: node.ID
                    });
                    if (children.length > 0) {
                        node.children = children;
                        angular.forEach(children, function(child) {
                            return getnode(child);
                        });
                    } else {
                        node.children = [];
                    }
                    return node;
                }

                deferred.resolve(tree);
            });
        return deferred.promise;
    }

    function update(event) {
        var sourceParentNodeList = event.source.nodesScope.$modelValue,
            destParentNodeList = event.dest.nodesScope.$modelValue,
            masterDeferred = $q.defer();

        updateNodeList(destParentNodeList).then(function() {
            if (sourceParentNodeList !== destParentNodeList) {
                if (sourceParentNodeList.length) {
                    updateNodeList(sourceParentNodeList).then(function() {
                        updateParentID().then(function() {
                            masterDeferred.resolve();
                        });
                    });
                } else {
                    updateParentID().then(function() {
                        masterDeferred.resolve();
                    });
                }
            }
        });

        function updateNodeList(nodeList) {
            var deferred = $q.defer(),
                nodeQueue = [];
            angular.forEach(nodeList, function(cat, index) {
                nodeQueue.push((function() {
                    return OrderCloud.Categories.Patch(cat.ID, {
                        ListOrder: index
                    });
                }));
            });

            var queueIndex = 0;

            function run(i) {
                nodeQueue[i]().then(function() {
                    queueIndex++;
                    if (queueIndex < nodeQueue.length) {
                        run(queueIndex);
                    } else {
                        deferred.resolve();
                    }
                });
            }
            run(queueIndex);

            return deferred.promise;
        }

        function updateParentID() {
            var deferred = $q.defer(),
                parentID;

            if (event.dest.nodesScope.node) {
                parentID = event.dest.nodesScope.node.ID;
            } else {
                parentID = null;
            }
            event.source.nodeScope.node.ParentID = parentID;
            OrderCloud.Categories.Update(event.source.nodeScope.node.ID, event.source.nodeScope.node)
                .then(function() {
                    deferred.resolve();
                });
            return deferred.promise;
        }

        return masterDeferred.promise;
    }
}