angular.module('productManager')
    .config(SpecsConfig)
    .controller('SpecsCtrl', SpecsController)
    .controller('SpecEditCtrl', SpecEditController)
    .controller('SpecCreateCtrl', SpecCreateController)
    .controller('SpecAssignCtrl', SpecAssignController);

function SpecsConfig($stateProvider) {
    "use strict";
    $stateProvider
        .state('specs', {
            parent: 'base',
            views: {
                '': {
                    templateUrl: 'specs/templates/specs.tpl.html',
                    controller: 'SpecsCtrl',
                    controllerAs: 'specs'
                },
                'filters@specs': {
                    templateUrl: 'specs/templates/specs.filters.tpl.html'
                },
                'list@specs': {
                    templateUrl: 'specs/templates/specs.list.tpl.html'
                }
            },
            url: '/specs?search&page&pageSize&searchOn&sortBy&filters',
            data: {
                componentName: 'Product Attributes',
                OrderIndex: 3
            },
            resolve: {
                Parameters: function($stateParams, OrderCloudParameters) {
                    return OrderCloudParameters.Get($stateParams);
                },
                SpecList: function(OrderCloud, Parameters) {
                    return OrderCloud.Specs.List(Parameters.search, Parameters.page, Parameters.pageSize || 50, Parameters.searchOn, Parameters.sortBy, Parameters.filters);
                }
            }
        })
        .state('specs.edit', {
            url: '/:specid/edit',
            templateUrl: 'specs/templates/specEdit.tpl.html',
            controller: 'SpecEditCtrl',
            controllerAs: 'specEdit',
            resolve: {
                SelectedSpec: function($stateParams, OrderCloud) {
                    return OrderCloud.Specs.Get($stateParams.specid);
                },
                Buyers: function(OrderCloud) {
                    return OrderCloud.Buyers.List();
                },
                Options: function($stateParams, FullOrderCloud) {
                    return FullOrderCloud.Specs.ListOptions($stateParams.specid);
                }
            }
        })
        .state('specs.create', {
            url: '/create',
            templateUrl: 'specs/templates/specCreate.tpl.html',
            controller: 'SpecCreateCtrl',
            controllerAs: 'specCreate',
            resolve: {
                Buyers: function(OrderCloud) {
                    return OrderCloud.Buyers.List();
                }
            }
        })
        .state('specs.assign', {
            url: '/:specid/assign',
            templateUrl: 'specs/templates/specAssign.tpl.html',
            controller: 'SpecAssignCtrl',
            controllerAs: 'specAssign',
            resolve: {
                ProductList: function(OrderCloud) {
                    return OrderCloud.Products.List(null, 1, 20);
                },
                ProductAssignments: function($stateParams, OrderCloud) {
                    return OrderCloud.Specs.ListProductAssignments($stateParams.specid);
                },
                SelectedSpec: function($stateParams, OrderCloud) {
                    return OrderCloud.Specs.Get($stateParams.specid);
                }
            }
        });
}

function SpecsController($state, $ocMedia, OrderCloud, OrderCloudParameters, Parameters, SpecList) {
    "use strict";
    var vm = this;
    vm.list = SpecList;
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
        return OrderCloud.Specs.List(Parameters.search, vm.list.Meta.Page + 1, Parameters.pageSize || vm.list.Meta.PageSize, Parameters.searchOn, Parameters.sortBy, Parameters.filters)
            .then(function(data) {
                vm.list.Items = vm.list.Items.concat(data.Items);
                vm.list.Meta = data.Meta;
            });
    };
}

function SpecEditController($exceptionHandler, $state, Underscore, toastr, OrderCloud, SelectedSpec, Buyers, Options, $scope, ResourceService, Audit, option_list, asset_manager) {
    "use strict";
    var vm = this,
        specid = angular.copy(SelectedSpec.ID);
    vm.specName = angular.copy(SelectedSpec.Name);
    vm.spec = SelectedSpec;
    vm.buyers = Buyers;
    vm.Option = {};
    console.log(Options)
    vm.Options = Options.Items;
    vm.spec.xp.Options = Options.Items;
    vm.overwrite = false;
    vm._sortOptions = false;
    vm.specGroupOptions = option_list.spec_groups;
    vm.AssetManager = asset_manager;
    if (vm.spec.DefaultValue == "null") {
        vm.spec.DefaultValue = '';
    }



    vm.addSpecOpt = function() {
        if (Underscore.where(vm.Options, {
                ID: vm.Option.ID
            }).length) {
            vm.overwrite = true;
            toastr.warning('There is already a product attribute option with that ID, select Update Product Attribute Option to continue', 'Warning');
        }
        if (!Underscore.where(vm.Options, {
                ID: vm.Option.ID
            }).length) {
            vm.Options.push(vm.Option);
            if (vm.DefaultOptionID) {
                vm.spec.DefaultOptionID = vm.Option.ID;
            }
            OrderCloud.Specs.CreateOption(specid, vm.Option)
                .then(function() {
                    vm.Option = null;
                });
        }
    };
 console.log(vm.Options)
    // vm.updateSpecOpt = function () {
    //     var specOptIndex;
    //     if (Underscore.where(vm.Options, { ID: vm.Option.ID }).length) {
    //         angular.forEach(vm.Options, function (option, index) {
    //             if (option.ID == vm.Option.ID) {
    //                 specOptIndex = index;
    //             }
    //         });

    //         vm.Options.splice(specOptIndex, 1);
    //         vm.Options.push(vm.Option);
    //         if (vm.DefaultOptionID) {
    //             vm.spec.DefaultOptionID = vm.Option.ID;
    //         }
    //         OrderCloud.Specs.UpdateOption(specid, vm.Option.ID, vm.Option)
    //             .then(function () {
    //                 vm.Option = null;
    //                 vm.overwrite = false;
    //             });
    //     } else {
    //         vm.addSpecOpt();
    //     }
    // };

    vm.setSpecOptEdit = function(t) {
        t.canEdit = true;
        t.updateLabel = t.specOpts.Value;
    };

    vm.updateSpecOpt = function(t) {
        t.specOpts.Value = t.updateLabel;
        OrderCloud.Specs.UpdateOption(specid, t.specOpts.ID, t.specOpts).then(function() {
            toastr.success('Product Attribute Option Updated', 'Success');
            delete t.canEdit;
        });
    };

    vm.cancelSpecOptEdit = function(t) {
        delete t.canEdit;
    };

    vm.deleteSpecOpt = function($index) {
        if (vm.spec.DefaultOptionID === vm.spec.Options[$index].ID) {
            vm.spec.DefaultOptionID = null;
        }
        OrderCloud.Specs.DeleteOption(specid, vm.spec.Options[$index].ID)
            .then(function() {
                vm.Options.splice($index, 1);
            });
    };

    vm.Submit = function(success, redirect) {


        OrderCloud.Specs.Update(specid, vm.spec)
            .then(function() {
                if (redirect) {
                    $state.go('specs', {}, {
                        reload: true
                    });
                }
                if (success) {
                    success();
                }
                Audit.log("Product Attribute", SelectedSpec.Name, [{
                    "Type": "Product Attribute",
                    "TargetID": SelectedSpec.ID,
                }], 'UPDATE');
                toastr.success('Product Attribute Updated', 'Success');
            })
            .catch(function(ex) {
                $exceptionHandler(ex);
            });



    };

    vm.Delete = function() {
        OrderCloud.Specs.Delete(specid)
            .then(function() {
                Audit.log("Product Attribute", SelectedSpec.Name, [{
                    "Type": "Product Attribute",
                    "TargetID": SelectedSpec.ID,
                }], 'DELETE');
                $state.go('specs', {}, {
                    reload: true
                });
            })
            .catch(function(ex) {
                $exceptionHandler(ex);
            });
    };

    vm.addBuyerLabel = function() {
        if (vm.spec.xp === null) {
            vm.spec.xp = {};
        }
        if (!vm.spec.xp.CustomLabels) {
            vm.spec.xp.CustomLabels = {};
        }
        vm.spec.xp.CustomLabels[vm.Buyer.ID] = {
            'Name': vm.Buyer.Name,
            'Label': vm.BuyerLabel,
            'ID': vm.Buyer.ID
        };
        vm.Submit(function() {
            vm.Buyer = null;
            vm.BuyerLabel = null;
        }, false);
    };

    vm.deleteBuyerLabel = function(id) {
        delete vm.spec.xp.CustomLabels[id];
        if (angular.equals(vm.spec.xp.CustomLabels, {})) {
            delete vm.spec.xp.CustomLabels;
        }
        vm.Submit(null, false);
    };

    vm.setCustomLabelEdit = function(t) {
        t.canEdit = true;
        t.updateLabel = t.obj.Label;
    };

    vm.cancelCustomLabelEdit = function(t) {
        delete t.canEdit;
    };

    vm.updateCustomLabel = function(t) {
        vm.spec.xp.CustomLabels[t.obj.ID].Label = t.updateLabel;
        vm.Submit(vm.cancelCustomLabelEdit(t), false);
    };
    vm.sortOptions = function() {
        vm._sortOptions = !vm._sortOptions;
    }
}

function SpecCreateController($exceptionHandler, $q, $state, toastr, Underscore, OrderCloud, Buyers, ResourceService, Audit, option_list, asset_manager) {
    "use strict";
    var vm = this;
    vm.spec = {
        xp: {}
    };
    vm.spec.Name = null;
    vm.Options = [];
    vm.buyers = Buyers;
    var DefaultOptionID;
    vm.overwrite = false;
    vm.AssetManager = asset_manager;
    vm.specGroupOptions = option_list.spec_groups;

    vm.addSpecOpt = function() {
        if (Underscore.where(vm.Options, {
                ID: vm.Option.ID
            }).length) {
            vm.overwrite = true;
            toastr.warning('There is already a product attribute option with that ID, select Update Product Attribute Option to continue', 'Warning');
        }
        if (!Underscore.where(vm.Options, {
                ID: vm.Option.ID
            }).length) {
            vm.Options.push(vm.Option);
            if (vm.DefaultOptionID) {
                DefaultOptionID = vm.Option.ID;
            }
            vm.Option = null;
            vm.DefaultOptionID = null;
        }
    };

    // vm.updateSpecOpt = function () {
    //     var specOptIndex;

    //     if (Underscore.where(vm.Options, { ID: vm.Option.ID }).length) {
    //         angular.forEach(vm.Options, function (option, index) {
    //             if (option.ID == vm.Option.ID) {
    //                 specOptIndex = index;
    //             }
    //         });

    //         vm.Options.splice(specOptIndex, 1);
    //         vm.Options.push(vm.Option);
    //         if (vm.DefaultOptionID) {
    //             vm.spec.DefaultOptionID = vm.Option.ID;
    //         }
    //         vm.Option = null;
    //         vm.overwrite = false;
    //     } else {
    //         vm.addSpecOpt();
    //     }
    // };

    vm.setSpecOptEdit = function(t) {
        t.canEdit = true;
        t.updateLabel = t.specOpts.Value;
    };

    vm.updateSpecOpt = function(t) {
        t.specOpts.Value = t.updateLabel;
        delete t.canEdit;
    };

    vm.cancelSpecOptEdit = function(t) {
        delete t.canEdit;
    };

    vm.deleteSpecOpt = function($index) {
        if (vm.spec.DefaultOptionID === vm.Options[$index].ID) {
            vm.spec.DefaultOptionID = null;
        }
        vm.Options.splice($index, 1);
    };

    vm.Submit = function(redirect) {
        OrderCloud.Specs.List(vm.spec.Name, 1, 100, "Name", null, null).then(function(nmeCheck) {
            var okaytoSave = true;
            if (nmeCheck.Items.length != 0) {
                nmeCheck.Items.forEach(function(item) {
                    if (vm.spec.Name.toLowerCase() === item.Name.toLowerCase()) {
                        okaytoSave = false;
                    }
                });
            }

            if (okaytoSave) {

                OrderCloud.Specs.Create(vm.spec)
                    .then(function(spec) {
                        var queue = [],
                            dfd = $q.defer();
                        angular.forEach(vm.Options, function(opt) {
                            queue.push(OrderCloud.Specs.CreateOption(spec.ID, opt));
                        });
                        $q.all(queue).then(function() {
                            dfd.resolve();
                            if (DefaultOptionID !== null) {
                                OrderCloud.Specs.Patch(spec.ID, {
                                    DefaultOptionID: DefaultOptionID
                                });
                            }

                            if (redirect) {
                                $state.go('specs', {}, {
                                    reload: true
                                });
                            } else {
                                $state.go('specs.edit', {
                                    specid: spec.ID
                                }, {
                                    reload: false
                                });
                            }
                            Audit.log("Product Attribute", spec.Name, [{
                                "Type": "Product Attribute",
                                "TargetID": spec.ID,
                            }], 'CREATE');
                            toastr.success('Product Attribute Created', 'Success');
                        });
                        return dfd.promise;
                    })
                    .catch(function(ex) {
                        $exceptionHandler(ex);
                    });


            } else {

                alert("Attribute: " + vm.spec.Name + " Already Exist in the System. Duplicates are not permitted");
            }


        });




    };

    vm.addBuyerLabel = function() {
        if (vm.spec.xp === null) {
            vm.spec.xp = {};
        }
        if (!vm.spec.xp.CustomLabels) {
            vm.spec.xp.CustomLabels = {};
        }
        vm.spec.xp.CustomLabels[vm.Buyer.ID] = {
            'Name': vm.Buyer.Name,
            'Label': vm.BuyerLabel,
            'ID': vm.Buyer.ID
        };
        vm.Buyer = null;
        vm.BuyerLabel = null;
    };

    vm.deleteBuyerLabel = function(id) {
        delete vm.spec.xp.CustomLabels[id];
        if (angular.equals(vm.spec.xp.CustomLabels, {})) {
            delete vm.spec.xp.CustomLabels;
        }
    };

    vm.setCustomLabelEdit = function(t) {
        t.canEdit = true;
        t.updateLabel = t.obj.Label;
    };

    vm.cancelCustomLabelEdit = function(t) {
        delete t.canEdit;
    };

    vm.updateCustomLabel = function(t) {
        vm.spec.xp.CustomLabels[t.obj.ID].Label = t.updateLabel;
        delete t.canEdit;
    };
    vm.sortOptions = function() {
        vm.Options.reverse();
    }
}

function SpecAssignController($scope, toastr, OrderCloud, Assignments, Paging, ProductList, ProductAssignments, SelectedSpec) {
    "use strict";
    var vm = this;
    vm.Spec = SelectedSpec;
    vm.list = ProductList;
    vm.assignments = ProductAssignments;
    vm.saveAssignments = SaveAssignment;
    vm.pagingfunction = PagingFunction;

    $scope.$watchCollection(function() {
        return vm.list;
    }, function() {
        Paging.SetSelected(vm.list.Items, vm.assignments.Items, 'ProductID');
    });

    function SaveFunc(ItemID) {
        return OrderCloud.Specs.SaveProductAssignment({
            SpecID: vm.Spec.ID,
            ProductID: ItemID
        });
    }

    function DeleteFunc(ItemID) {
        return OrderCloud.Specs.DeleteProductAssignment(vm.Spec.ID, ItemID);
    }

    function SaveAssignment() {
        toastr.success('Assignment Updated', 'Success');
        return Assignments.SaveAssignments(vm.list.Items, vm.assignments.Items, SaveFunc, DeleteFunc, 'ProductID');
    }

    function AssignmentFunc() {
        return OrderCloud.Specs.ListProductAssignments(vm.Spec.ID, null, vm.assignments.Meta.PageSize);
    }

    function PagingFunction() {
        return Paging.Paging(vm.list, 'Products', vm.assignments, AssignmentFunc);
    }
}