angular.module('productManager')

.config(MasterProductGroupsConfig)
    .controller('MasterProductGroupsCtrl', MasterProductGroupsController)
    .controller('MasterProductGroupsEditCtrl', MasterProductGroupsEditController)
    .controller('MasterProductGroupsCreateCtrl', MasterProductGroupsCreateController)
    .controller('MasterProductGroupsAssignCtrl', MasterProductGroupsAssignController)

function MasterProductGroupsConfig($stateProvider) {
    "use strict";
    $stateProvider
        .state('masterproductgroups', {
            parent: 'base',
            templateUrl: 'masterProductGroups/templates/masterproductgroups.tpl.html',
            controller: 'MasterProductGroupsCtrl',
            controllerAs: 'masterproductgroups',
            url: '/masterproductgroups?from&to&search&page&pageSize&searchOn&sortBy&filters',
            data: { componentName: 'Master Product Groups', OrderIndex: 2 },
            resolve: {
                Parameters: function($stateParams, OrderCloudParameters) {
                    return OrderCloudParameters.Get($stateParams);
                },
                CategoryList: function(OrderCloud, Parameters) {
                    var parameters = angular.copy(Parameters);
                    parameters.depth = 'all';
                    return OrderCloud.Categories.List(parameters.search, parameters.page, parameters.pageSize || 50, parameters.searchOn, parameters.sortBy, parameters.filters, parameters.depth, 'master-product-groups');
                }
            }
        })
        .state('masterproductgroups.edit', {
            url: '/:categoryid/edit',
            templateUrl: 'masterProductGroups/templates/masterproductgroupsEdit.tpl.html',
            controller: 'MasterProductGroupsEditCtrl',
            controllerAs: 'masterproductgroupsEdit',
            resolve: {
                SelectedCategory: function($stateParams, $state, OrderCloud) {
                    return OrderCloud.Categories.Get($stateParams.categoryid, 'master-product-groups').catch(function() {
                        $state.go('^.masterproductgroups');
                    });
                }
            }
        })
        .state('masterproductgroups.create', {
            url: '/create',
            templateUrl: 'masterProductGroups/templates/masterproductgroupsCreate.tpl.html',
            controller: 'MasterProductGroupsCreateCtrl',
            controllerAs: 'masterproductgroupsCreate'
        })
        .state('masterproductgroups.assign', {
            url: '/:categoryid/assign/',
            templateUrl: 'masterProductGroups/templates/masterproductgroupsAssign.tpl.html',
            controller: 'MasterProductGroupsAssignCtrl',
            controllerAs: 'masterproductgroupsassign',
            params: { group: null },
            resolve: {
                assignedGroups: function(SelectedCategory) {
                    var assingments = { Items: (typeof SelectedCategory.xp.ProductGroups !== 'undefined') ? SelectedCategory.xp.ProductGroups : [] };
                    return assingments;
                },
                SelectedCategory: function($stateParams, $state, OrderCloud) {
                    return OrderCloud.Categories.Get($stateParams.categoryid, 'master-product-groups').catch(function() {
                        $state.go('^.masterproductgroups');
                    });
                },
                fullCategoryList: function($stateParams, $state, FullOrderCloud) {
                    return FullOrderCloud.Categories.List(null, null, 100, null, null, null, 100, null).then(function(c) {
                        c.Items.sort(function(a, b) {
                            return a.Name.localeCompare(b.Name);
                        });
                        return c;
                    });
                },
            }
        });
}

function MasterProductGroupsController($state, $ocMedia, OrderCloud, OrderCloudParameters, CategoryList, TrackSearch, Parameters) {
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
        $state.go('.', { page: vm.list.Meta.Page });
    };

    //Load the next page of results with all of the same parameters
    vm.loadMore = function() {
        return OrderCloud.Products.List(Parameters.search, vm.list.Meta.Page + 1, Parameters.pageSize || vm.list.Meta.PageSize, Parameters.searchOn, Parameters.sortBy, Parameters.filters)
            .then(function(data) {
                vm.list.Items = vm.list.Items.concat(data.Items);
                vm.list.Meta = data.Meta;
            });
    };

}

function MasterProductGroupsEditController($exceptionHandler, $state, OrderCloud, SelectedCategory, toastr, option_list, Audit) {
    "use strict";
    var vm = this,
        categoryID = SelectedCategory.ID;
    vm.categoryName = SelectedCategory.Name;
    vm.category = SelectedCategory;
    vm.options = option_list;

    if (!vm.category.xp) {
        vm.category.xp = { "GroupProperties": [] };
    }

    vm.Submit = function(redirect) {
        OrderCloud.Categories.Update(categoryID, vm.category, 'master-product-groups')
            .then(function() {
                Audit.log("Master Product Group", SelectedCategory.Name, [{ "Type": "Master Product Group", "TargetID": categoryID }], 'UPDATE');

                if (redirect) {
                    $state.go('masterproductgroups', {}, { reload: true });
                }

                toastr.success('Master Product Group Updated', 'Success');
            })
            .catch(function(ex) {
                $exceptionHandler(ex);
            });
    };

    vm.Delete = function() {

        if(!SelectedCategory.xp['ProductGroups']){
            SelectedCategory.xp['ProductGroups'] = [];
        }

     if (SelectedCategory.xp['ProductGroups'].length === 0) {


                if (confirm("Are you sure you want to delete this Master Product Group?")) {
                    OrderCloud.Categories.Delete(SelectedCategory.ID, 'master-product-groups')
                        .then(function() {
                            Audit.log("Master Product Group", SelectedCategory.Name, [{ "Type": "Master Product Group", "TargetID": categoryID }], 'DELETE');
                            $state.go('masterproductgroups', {}, { reload: true });
                            toastr.success('Master Product Group Deleted', 'Success');
                        })
                        .catch(function(ex) {
                            $exceptionHandler(ex);
                        });
                }
            } else {
                alert('WARNING! - All Product Groups must be unassigned before a Master Product Group can be deleted')
            }

    

    };

    vm.addGroupProp = function() {
        let tProp = { Name: vm.temp };
        vm.category.xp.GroupProperties.push(tProp);
        vm.temp = '';
    }
    vm.deleteProperty = function(idx) {
        vm.category.xp.GroupProperties.splice(idx, 1);
    }
}

function MasterProductGroupsCreateController($exceptionHandler, $state, OrderCloud, toastr, option_list, Audit) {
    "use strict";
    var vm = this;
    vm.category = {xp:{}};
       vm.category.xp = { "GroupProperties": [] };
    vm.options = option_list;
    vm.Submit = function(redirect) {
  
     
    
        OrderCloud.Categories.Create(vm.category, 'master-product-groups').then(function(data) {

                Audit.log("Mater Product Group", data.Name, [{ "Type": "Master Product Group", "TargetID": data.ID }], 'CREATE');

                if (redirect) {
                    $state.go('masterproductgroups', {}, { reload: true });
                } else {
                    $state.go('masterproductgroups.edit', { categoryid: data.ID }, {
                        reload: true
                    });
                }

                toastr.success('Product Group Created', 'Success');
            })
            .catch(function(ex) {
                $exceptionHandler(ex);
            });
    };
     vm.addGroupProp = function() {
        let tProp = { Name: vm.temp };
        vm.category.xp.GroupProperties.push(tProp);
        vm.temp = '';
    }
    vm.deleteProperty = function(idx) {
        vm.category.xp.GroupProperties.splice(idx, 1);
    }
}

function MasterProductGroupsAssignController($scope, OrderCloud, FullOrderCloud, toastr, $timeout, fullCategoryList, option_list, $state, $stateParams, dragulaService, assignedGroups, $q, Audit, SelectedCategory) {
    "use strict";
    var vm = this;

    vm.groupFilter = $stateParams.group;

    var assingments = []
    fullCategoryList.Items.forEach(function(cat, idx) {
        assignedGroups.Items.forEach(function(assign) {
            if (cat.ID == assign.CategoryID) {
                assingments.push(cat);
                fullCategoryList.Items.splice(idx, 1);
                fullCategoryList.Meta.TotalCount--;
            }
        });
    });
    assignedGroups.Items = assingments;

    vm.Category = SelectedCategory;
    if (!vm.Category.xp) {
        vm.Category.xp = {};
    }
    try {

        if (typeof(vm.Category.xp) == "string") {
            vm.Category.xp = JSON.parse(vm.Category.xp);
        }


    } catch (e) {}

    vm.doTheBack = function() {
        window.history.back();
    };


    vm.list = fullCategoryList;

    vm.changedSpecs = {};
    vm.assignedGroups = assignedGroups;

    var searching;
    vm.research = function() {
        if (searching) $timeout.cancel(searching);
        searching = $timeout(function() {
            var paramObject = {};

            if (vm.groupFilter && vm.groupFilter !== '') { paramObject["xp.Group"] = vm.groupFilter; }

            if (vm.searchFilter === '') { vm.searchFilter = null; }

            var _paramObject = jQuery.extend(true, {}, paramObject);

        }, 300);
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
        var assingments = []
        fullCategoryList.Items.forEach(function(cat, idx) {
            assignedGroups.Items.forEach(function(assign) {
                if (cat.ID == assign.CategoryID) {
                    //assingments.push(cat);
                    fullCategoryList.Items.splice(idx, 1);
                    fullCategoryList.Meta.TotalCount--;
                }
            });
        });
        assignedGroups.Items = assingments;
        vm.research();
    };

    vm.toggleAssignFilter = function() {
        vm.assignedFilter = !vm.assignedFilter;
        var assingments = []
        fullCategoryList.Items.forEach(function(cat, idx) {
            assignedGroups.Items.forEach(function(assign) {
                if (cat.ID == assign.CategoryID) {
                    assingments.push(cat);
                    //fullCategoryList.Items.splice(idx, 1);
                    //fullCategoryList.Meta.TotalCount--;
                }
            });
        });
        assignedGroups.Items = assingments;
        vm.research();
    };

    vm.pushOver = function(spec) {
        var _Index = 0;

        angular.forEach(vm.list.Items, function(sp, index) {
            if (sp.ID === spec.ID) { _Index = index; }
        });



        vm.list.Items.splice(_Index, 1);
        vm.assignedGroups.Items.unshift(spec);

        if (spec.xp['Master-Group'] != undefined && spec.xp['Master-Group'] != null && spec.xp['Master-Group'].ID != null && spec.xp['Master-Group'].Name != vm.Category.Name) {
            var result = confirm("Are you Sure you want to change the Assisnment of this Group? the current Master Product Group is - " + spec.xp['Master-Group'].Name);
            if (result) {

                FullOrderCloud.Categories.ListProductAssignments( spec.ID, null, 1, 100, null).then(function(data) {
                    data.Items.forEach(function(prodass){
                         OrderCloud.Products.Get(prodass.ProductID).then(function(prod){
                            prod.xp['Master-Product-Group-XP'] = "";
                            prod.xp['Master-Group'] = vm.Category.Name;
                            OrderCloud.Products.Update(prod.ID, prod);
                         });
                    });


                    vm.saveAssignment();
                 });
            }

        } else {
             FullOrderCloud.Categories.ListProductAssignments(spec.ID, null, 1, 100, null).then(function(data) {
            
                    data.Items.forEach(function(prodass){
                         OrderCloud.Products.Get(prodass.ProductID).then(function(prod){
                            prod.xp['Master-Product-Group-XP'] = "";
                            prod.xp['Master-Group'] = { ID: vm.Category.ID, Name: vm.Category.Name };
                            OrderCloud.Products.Update(prod.ID, prod);
                         });
                    });


                    vm.saveAssignment();
                 });
          
        }
    };

    vm.pushBack = function(spec) {
        var _Index = 0;

        angular.forEach(vm.assignedGroups.Items, function(sp, index) {
            if (sp.ID === spec.ID) { _Index = index; }
        });

        vm.assignedGroups.Items.splice(_Index, 1);
        vm.list.Items.unshift(spec);
        spec.xp['Master-Group'] = null;
        OrderCloud.Categories.Update(spec.ID, spec, 'product-groups').then(function() {
               FullOrderCloud.Categories.ListProductAssignments( spec.ID, null, 1, 100, null).then(function(data) {
                  data.Items.forEach(function(prodass){
                         OrderCloud.Products.Get(prodass.ProductID).then(function(prod){
                            prod.xp['Master-Product-Group-XP'] = "";
                            prod.xp['Master-Group'] = "";
                            OrderCloud.Products.Update(prod.ID, prod);
                         })
                    })


                    vm.saveAssignment();
                 });
        });

    };

    vm.saveAssignment = function() {

        var assingments = []

        vm.assignedGroups.Items.forEach(function(assign) {
            assingments.push({ CategoryID: assign.ID, Name: assign.Name });

            OrderCloud.Categories.Get(assign.ID, 'product-groups')
                .then(function(catA) {
                    catA.xp['Master-Group'] = { ID: vm.Category.ID, Name: vm.Category.Name };
                    OrderCloud.Categories.Update(catA.ID, catA, 'product-groups')
                });
        });
        vm.Category.xp.ProductGroups = assingments;

        OrderCloud.Categories.Update(vm.Category.ID, vm.Category, 'master-product-groups')
            .then(function() {
                toastr.success('Assignment Updated', 'Success');
            });
    }
}