angular.module('productManager')

.config(DataManagerConfig)
    .controller('DataManagerCtrl', DataManagerController)
    .controller('DataJobEditCtrl', DataJobEditController)
    .controller('DataJobCreateCtrl', DataJobCreateController)
    .controller('DataJobCloneCtrl', DataJobCloneController)
    .controller('DataJobProcessCtrl', DataJobProcessController)
    .controller('DataJobAssignPartyCtrl', DataJobAssignPartyController)
    .controller('DataJobAssignProductCtrl', DataJobAssignProductController)
    .controller('DataJobAssignSpecCtrl', DataJobAssignSpecController)
    .controller('SelectDialogDataJobCtrl', SelectDialogController)
    .controller('DeselectDialogDataJobCtrl', DeselectDialogController)
    .controller('copyPasteModalCtrl', copyPasteModalCtrl);

function DataManagerConfig($stateProvider) {
    "use strict";
    $stateProvider
        .state('DataManager', {
            parent: 'base',

            templateUrl: 'dataManager/templates/dataJobList.tpl.html',
            controller: 'DataManagerCtrl',
            controllerAs: 'datamanager',
            url: '/DataManager',
            data: {
                componentName: 'Data Manager',
                OrderIndex: 7
            },
            resolve: {
                Parameters: function($stateParams, OrderCloudParameters) {
                    return OrderCloudParameters.Get($stateParams);
                },
                Buyer: function($stateParams, OrderCloud) {
                    return OrderCloud.Buyers.Get("orderagent");
                },
                DataJobList: function(OrderCloud, Parameters) {
                    var parameters = angular.copy(Parameters);
                    parameters.depth = 'all';
                    return OrderCloud.Categories.List(parameters.search, parameters.page, parameters.pageSize || 12, parameters.searchOn, parameters.sortBy, parameters.filters, parameters.depth, 'datamanager');
                },
                ProductGroups: function(ResourceService) {
                    return ResourceService.ProductGroups();
                }
            }
        })
        .state('DataManager.edit', {
            url: '/:DataJobid/edit',
            templateUrl: 'dataManager/templates/dataJobEdit.tpl.html',
            controller: 'DataJobEditCtrl',
            controllerAs: 'DataJobEdit',
            resolve: {
                Buyer: function($stateParams, OrderCloud) {
                    return OrderCloud.Buyers.Get("orderagent");
                },
                SelectedDataJob: function($stateParams, $state, OrderCloud, Buyer) {
                    return OrderCloud.Categories.Get($stateParams.DataJobid, 'datamanager');
                }
            }
        })
        .state('DataManager.create', {
            url: '/add',
            templateUrl: 'dataManager/templates/dataJobCreate.tpl.html',
            controller: 'DataJobCreateCtrl',
            controllerAs: 'DataJobCreate',
            resolve: {
                Buyer: function($stateParams, OrderCloud) {
                    return OrderCloud.Buyers.Get("orderagent");
                }
            }
        })
        .state('DataManager.clone', {
            url: '/:DataJobid/clone',
            templateUrl: 'dataManager/templates/dataJobClone.tpl.html',
            controller: 'DataJobCloneCtrl',
            controllerAs: 'DataJobClone',
            resolve: {
                Buyer: function($stateParams, OrderCloud) {
                    return OrderCloud.Buyers.Get("orderagent");
                },
                SelectedDataJob: function($stateParams, $state, OrderCloud, Buyer) {
                    return OrderCloud.Categories.Get($stateParams.DataJobid, 'datamanager').catch(function() {
                        $state.go('^.DataManager');
                    });
                }
            }
        })
        .state('DataManager.process', {
            url: '/:DataJobid/process',
            templateUrl: 'dataManager/templates/dataJobProcess.tpl.html',
            controller: 'DataJobProcessCtrl',
            controllerAs: 'DataJobProcess',
            resolve: {
                Buyer: function($stateParams, OrderCloud) {
                    return OrderCloud.Buyers.Get("orderagent");
                },
                SelectedDataJob: function($stateParams, $state, OrderCloud, Buyer) {
                    return OrderCloud.Categories.Get($stateParams.DataJobid, 'datamanager');
                },
                CurrentUser: function($rootScope, $q, $state, OrderCloud, UserGroupService, Audit) {
                    var dfd = $q.defer();
                    OrderCloud.Me.Get()
                        .then(function(data) {
                            $rootScope.user = data;
                            //Audit.log("LOGGED IN", "Sucessful", [{ "Type": "Login", "TargetID": data.ID }], 'EXECUTE', "", "INFORMATION");
                            UserGroupService.getList().then(function() {
                                dfd.resolve(data);
                            });

                        })
                        .catch(function() {
                            OrderCloud.Auth.RemoveToken();
                            OrderCloud.Auth.RemoveImpersonationToken();
                            OrderCloud.BuyerID.Set(null);
                            $state.go('login');
                            dfd.resolve();
                        });
                    return dfd.promise;
                },
            }
        })
        .state('DataManager.assignProduct', {
            url: '/:DataJobid/assign/product',
            templateUrl: 'dataManager/templates/dataJobAssignProduct.tpl.html',
            controller: 'DataJobAssignProductCtrl',
            controllerAs: 'DataJobAssignProd',
            resolve: {
                Buyer: function($stateParams, OrderCloud) {
                    return OrderCloud.Buyers.Get("orderagent");
                },
                DataJobList: function(OrderCloud, Buyer) {
                    return OrderCloud.Categories.List(null, 1, 100, null, null, null, null, 'datamanager');
                },
                ProductList: ["OrderCloud", "FullOrderCloud", "Helpers", "$q", "$stateParams", "ProductAssignments", function ProductList(OrderCloud, FullOrderCloud, Helpers, $q, $stateParams, ProductAssignments) {
                    return FullOrderCloud.Products.List(null, 1, 100, null, null, null).then(function(_data) {
                        _data.Items = _data.Items.filter(function(current) {



                            return ProductAssignments.Items.filter(function(current_b) {
                                return current_b.ID === current.ID;
                            }).length === 0;
                        });
                        return _data;
                    });
                }],
                ProductBuyerAssignments: function($stateParams, OrderCloud, Buyer) {
                    return OrderCloud.Products.ListAssignments(null, null, null, null, null, null, 100, Buyer.DefaultCatalogID);
                },
                Assignments: function(FullOrderCloud, $stateParams, Buyer) {
                    return FullOrderCloud.Categories.ListProductAssignments($stateParams.DataJobid, null, null, 100, 'datamanager');
                },
                ProductAssignments: function($stateParams, OrderCloud, Buyer, FullOrderCloud, Assignments) {
                    return FullOrderCloud.Products.List(null, 1, 100, null, null, {
                        'CatalogID': 'datamanager',
                        'CategoryID': $stateParams.DataJobid
                    });
                },
                SelectedDataJob: function($stateParams, $state, OrderCloud, Buyer) {
                    return OrderCloud.Categories.Get($stateParams.DataJobid, 'datamanager').catch(function() {

                        $state.go('^.DataManager');
                    });
                },
                Categories: function(FullOrderCloud) {
                    return FullOrderCloud.Categories.List(null, null, 100, null, null, null, null, 'product-groups').then(function(c) {

                        c.Items.sort(function(a, b) {
                            return a.Name.localeCompare(b.Name);
                        });

                        return FullOrderCloud.Categories.List(null, null, 100, null, null, null, null, 'master-product-groups').then(function(d) {
                            d.Items.sort(function(a, b) {
                                return a.Name.localeCompare(b.Name);
                            });
                            d.Items.forEach(function(itm) {
                                itm.ID = "MASTER_" + itm.Name;
                                itm.Type = "Master Product Groups";
                            });

                            c.Items.forEach(function(itm) {
                                itm.Type = "Product Groups";
                                d.Items.push(itm);
                            });

                            return d;

                        });
                    });
                },
                ProductGroups: function(OrderCloud, Categories) {
                    var c = {};
                    angular.forEach(Categories.Items, function(i) {
                        c[i.ID] = {
                            'ID': i.ID,
                            'Name': i.Name,
                            'Type': i.Type
                        };
                    });

                    return c;
                },

            }
        })

    .state('DataManager.assignSpec', {
        url: '/:DataJobid/assign/spec',
        templateUrl: 'dataManager/templates/dataJobAssignSpec.tpl.html',
        controller: 'DataJobAssignSpecCtrl',
        controllerAs: 'DataJobAssignSpec',
        resolve: {
            Buyer: function($stateParams, OrderCloud) {
                return OrderCloud.Buyers.Get('orderagent');
            },
            DataJobList: function(OrderCloud) {
                return OrderCloud.Categories.List(null, null, 100, null, null, null, null, null);
            },
            Parameters: function($stateParams, OrderCloudParameters) {
                return OrderCloudParameters.Get($stateParams);
            },
            SpecList: function(OrderCloud, SelectedDataJob) {
                var IDs = "!000";
                angular.forEach(SelectedDataJob.xp.specAssignments, function(item) {
                    IDs += "_amp_id_eq_!" + item.ID + "|";
                });
                IDs = IDs.substr(0, IDs.length - 1);

                return OrderCloud.Specs.List(null, 1, 100, null, null, {
                    'ID': IDs
                });
            },
            SpecGroups: function(option_list) {
                var groups = option_list.spec_groups;
                return groups;
            },

            SelectedDataJob: function($stateParams, $state, OrderCloud, Buyer) {
                return OrderCloud.Categories.Get($stateParams.DataJobid, 'datamanager').catch(function() {
                    $state.go('^.DataManager');
                });
            }
        }
    });
}

function SelectDialogController($scope, $uibModalInstance, Audit, $i18next, toastr, $stateParams, Scope) {
    'use strict';
    var vm = this;
    vm.scope = Scope;
    vm.all = function() {
        console.log(Scope);
        toastr.success("Processing Requests. Please wait.");
        Scope.application.apiAgentService.assignAllProductsToCategory(Scope.buyer.ID, Scope.Category.ID, {
            catalogID: "datamanager"
        });

        angular.forEach(Scope.list.Items, function(product) {
            Audit.log($i18next.t("Data Manager Product Assignment"), product.Name + " > " + Scope.buyer.Name, [{
                "Type": "Channel",
                "TargetID": 'Data Manager',
                "NewState": product.ID
            }], 'CREATE');
        });

        Scope.prodAssignments.Meta = Scope.list.Data;
        Scope.prodAssignments.Items.push.apply(Scope.prodAssignments.Items, Scope.list.Items);
        Scope.list.Items = [];
        $uibModalInstance.close();
    };

    vm.visible = function() {
        // Scope.paramObject.categoryid = 'datamanager';
        // Scope.paramObject.catalogID = 'datamanager';
        delete Scope.paramObject.ID;
        Scope.application.apiAgentService.assignAllProductsToCategory('datamanager', Scope.DataJob.ID, Scope.paramObject, Scope.searchFilter);
        Scope.prodAssignments.Items.push.apply(Scope.prodAssignments.Items, Scope.list.Items);
        Scope.list.Items = [];
        Scope.prodAssignments.Meta = angular.copy(Scope.list.Meta);
        Scope.list.Meta.TotalCount = 0;
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
        delete Scope.paramObject.ID;

        Scope.application.apiAgentService.unassignProductsFromCategory('datamanager', Scope.DataJob.ID);

        angular.forEach(Scope.list.Items, function(product) {
            Audit.log($i18next.t("Data Manager Product Assignment"), product.Name + " > " + Scope.buyer.Name, [{
                "Type": "Channel",
                "TargetID": 'Data Manager',
                "NewState": product.ID
            }], 'DELETE');
        });


        Scope.list.Items.push.apply(Scope.list.Items, Scope.prodAssignments.Items);
        Scope.prodAssignments.Items = [];
        Scope.list.Meta.ItemRange[1] = Scope.list.Items.length;
        Scope.TotalCount = Scope.list.Items.length;
        Scope.prodAssignments.Meta.ItemRange[1] = 0;
        Scope.prodAssignments.Meta.TotalCount = 0;
        $uibModalInstance.close();
    };

    vm.cancel = function() {
        $uibModalInstance.close();
    };
}

function DataManagerController($state, option_list, $ocMedia, OrderCloud, OrderCloudParameters, DataJobList, TrackSearch, Parameters, $q, toastr, $http, $rootScope, Buyer, clientsecret, $timeout) {
    "use strict";
    var vm = this;
    vm.list = DataJobList;
    vm.parameters = Parameters;
    vm.sortSelection = Parameters.sortBy ? (Parameters.sortBy.indexOf('!') === 0 ? Parameters.sortBy.split('!')[1] : Parameters.sortBy) : null;
    vm.selectedBuyer = Buyer;
    vm.options = option_list;
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
        $http({
            method: 'POST',
            url: 'https://pim-report.azurewebsites.net/CategoryReport?secret=' + clientsecret + '&BuyerID=datamanager' + '&CategoryID=' + cat.ID + '&vnext=true',

        }).then(function successCallback(response) {
            toastr.success('Distribution Template Ordered', 'Success');
            $rootScope.$emit('$stateChangeSuccess', $state);
            downloadURI(response.data.url, response.data.url);
            //  window.open(response.data.url);
        }, function errorCallback(response) {
            toastr.error('Distribution Template Order Failure', 'Error');
            $rootScope.$emit('$stateChangeSuccess', $state);
        });
    };

    function downloadURI(uri, name) {
        var link = document.createElement("a");
        link.download = name;
        link.href = uri;
        document.body.appendChild(link);
        $timeout(function() {
            link.click();
        });
        document.body.removeChild(link);

    }
}

function DataJobEditController($exceptionHandler, option_list, $state, OrderCloud, SelectedDataJob, toastr, Buyer) {
    "use strict";
    var vm = this,
        DataJobID = SelectedDataJob.ID;
    vm.DataJobName = SelectedDataJob.Name;
    vm.DataJob = SelectedDataJob;
    vm.selectedBuyer = Buyer;
    vm.options = option_list;
    vm.Submit = function(redirect) {
        vm.DataJob.xp.Headers = [{
            "ID": "ID",
            "Name": "ID"
        }];
        OrderCloud.Categories.Update(DataJobID, vm.DataJob, 'datamanager')
            .then(function() {
                if (redirect) {
                    $state.go('DataManager', {}, {
                        reload: true
                    });
                }
                toastr.success('Data Job Updated', 'Success');
            })
            .catch(function(ex) {
                $exceptionHandler(ex);
            });
    };

    vm.Delete = function() {
        if (confirm("Are you sure you want to delete this distribution template?")) {
            OrderCloud.Categories.Delete(SelectedDataJob.ID, 'datamanager')
                .then(function() {
                    $state.go('DataManager', {}, {
                        reload: true
                    });
                    toastr.success('Data Job Template Deleted', 'Success');
                })
                .catch(function(ex) {
                    $exceptionHandler(ex);
                });
        }
    };
}

function DataJobProcessController($rootScope, $exceptionHandler, $state, $http, OrderCloud, SelectedDataJob, toastr, Buyer, clientsecret, CurrentUser, option_list) {
    "use strict";
    var vm = this,
        DataJobID = SelectedDataJob.ID;
    vm.DataJobName = SelectedDataJob.Name;
    vm.DataJob = SelectedDataJob;
    vm.selectedBuyer = Buyer;
    vm.options = option_list;
    vm.DataJob["user"] = CurrentUser.Username;
    vm.Submit = function() {
        var report = angular.copy(SelectedDataJob);
        toastr.success('DataJob Pending', 'Success');
        $rootScope.$emit('$stateChangeSuccess', $state);
        $http({
            method: 'POST',
            url: 'https://pimbulkapi.azurewebsites.net/api/datajob',
            data: report,
            headers: {
                'client': clientsecret
            }
        }).then(function successCallback(response) {
            // $state.go('DataManager', {}, { reload: false });
            toastr.success('DataJob Completed', 'Success');
        }, function errorCallback(response) {
            toastr.error('DataJob Failure', 'Error');
            $rootScope.$emit('$stateChangeSuccess', $state);
        });

    };

    vm.Delete = function() {
        if (confirm("Are you sure you want to delete this?")) {
            OrderCloud.Categories.Delete(SelectedDataJob.ID, 'datamanager')
                .then(function() {
                    $state.go('DataManager', {}, {
                        reload: true
                    });
                    toastr.success('Data Job Template Deleted', 'Success');
                })
                .catch(function(ex) {
                    $exceptionHandler(ex);
                });
        }
    };
}

function DataJobCreateController($exceptionHandler, $state, OrderCloud, toastr, Buyer, option_list) {
    "use strict";
    var vm = this;
    vm.selectedBuyer = Buyer;
    vm.DataJob = {};
    vm.DataJob.Active = true;
    vm.options = option_list;
    vm.Submit = function(redirect) {

        if (vm.DataJob.ParentID === '') {
            vm.DataJob.ParentID = null;
        }

        vm.DataJob.xp.Headers = [{
            "ID": "ID",
            "Name": "ID"
        }];

        OrderCloud.Categories.Create(vm.DataJob, 'datamanager')
            .then(function(data) {
                if (redirect) {
                    $state.go('DataManager', {}, {
                        reload: true
                    });
                } else {
                    $state.go('DataManager.edit', {
                        DataJobid: data.ID
                    }, {
                        reload: true
                    });
                }

                toastr.success('Template Created', 'Success');
            })
            .catch(function(ex) {
                $exceptionHandler(ex);
            });
    };
}

function DataJobCloneController($exceptionHandler, $state, OrderCloud, SelectedDataJob, toastr, Buyer, $q, option_list) {
    "use strict";
    var vm = this,
        DataJobID = SelectedDataJob.ID;
    vm.DataJobName = SelectedDataJob.Name;
    vm.DataJob = angular.copy(SelectedDataJob);
    vm.DataJob.ID = '';
    vm.options = option_list;
    delete vm.DataJob.xp.Results;

    vm.selectedBuyer = Buyer;
    vm.Submit = function(redirect) {
        toastr.warning('Cloning Data Job', 'Success');

        if (vm.DataJob.ParentID === '') {
            vm.DataJob.ParentID = null;
        }

        vm.DataJob.xp.Headers = [{
            "ID": "ID",
            "Name": "ID"
        }];

        OrderCloud.Categories.Create(vm.DataJob, 'datamanager')
            .then(function(data) {
                vm.DataJobNewID = data.ID;
                var productIDList = [];
                OrderCloud.Categories.ListProductAssignments(DataJobID, null, 1, 100, 'datamanager').then(function(response) {

                    productIDList = function() {
                        var fullProductList = response.Items;
                        var q = [];
                        var uberQ = $q.defer();
                        if (response.Meta.TotalPages > 1) {
                            for (var v = 2; v <= response.Meta.TotalPages; v++) {
                                q.push(function() {
                                    OrderCloud.Categories.ListProductAssignments(DataJobID, null, v, 100, 'datamanager').then(function(data) {
                                        angular.forEach(data.Items, function(i) {
                                            fullProductList.Items.push(i);
                                        });
                                    });
                                }());
                            }
                            $q.all(q).then(function() {
                                uberQ.resolve(fullProductList);
                            });
                            return uberQ.promise;
                        } else {
                            return response.Items;
                        }
                    }();

                    angular.forEach(productIDList, function(product) {
                        SaveFunc(product.ProductID);
                    });

                    if (redirect) {
                        $state.go('DataManager', {}, {
                            reload: true
                        });
                    } else {
                        $state.go('DataManager.edit', {
                            DataJobid: data.ID
                        }, {
                            reload: true
                        });
                    }
                    toastr.success('Data Job Cloned', 'Success');
                });



            })
            .catch(function(ex) {
                $exceptionHandler(ex);
            });
    };

    function SaveFunc(ItemID) {
        return OrderCloud.Categories.SaveProductAssignment({
            CategoryID: vm.DataJobNewID,
            ProductID: ItemID
        }, 'datamanager');
    }
}

function DataJobAssignPartyController($scope, OrderCloud, Assignments, Paging, UserGroupList, AssignedUserGroups, SelectedDataJob, toastr, option_list) {
    "use strict";
    var vm = this;
    vm.DataJob = SelectedDataJob;
    vm.list = UserGroupList;
    vm.assignments = AssignedUserGroups;
    vm.saveAssignments = SaveAssignment;
    vm.pagingfunction = PagingFunction;
    vm.options = option_list;
    $scope.$watchCollection(function() {
        return vm.list;
    }, function() {
        Paging.setSelected(vm.list.Items, vm.assignments.Items, 'UserGroupID');
    });

    function SaveFunc(ItemID) {
        return OrderCloud.Categories.SaveAssignment({
            UserID: null,
            UserGroupID: ItemID,
            DataJobID: vm.DataJob.ID
        });
    }

    function DeleteFunc(ItemID) {
        return OrderCloud.Categories.DeleteAssignment(vm.DataJob.ID, null, ItemID);
    }

    function SaveAssignment() {
        toastr.success('Assignment Updated', 'Success');
        return Assignments.saveAssignments(vm.list.Items, vm.assignments.Items, SaveFunc, DeleteFunc);
    }

    function AssignmentFunc() {
        return OrderCloud.Categories.ListAssignments(vm.DataJob.ID, null, vm.assignments.Meta.PageSize);
    }

    function PagingFunction() {
        return Paging.paging(vm.list, 'UserGroups', vm.assignments, AssignmentFunc);
    }
}

function DataJobAssignProductController($scope, $stateParams, OrderCloud, option_list, FullOrderCloud, Assignments, Paging, ProductList, ProductAssignments, SelectedDataJob, $uibModal, toastr, ProductBuyerAssignments, $timeout, DataJobList, Buyer, ProductGroups) {
    "use strict";
    var vm = this;
    vm.DataJob = SelectedDataJob;
    vm.buyer = Buyer;
    vm.productGroups = ProductGroups;
    vm.buyerAssignments = ProductBuyerAssignments;
    vm.prodAssignments = ProductAssignments;

    vm.list = ProductList;
    vm.options = option_list;
    vm.application = $scope.application;
    vm.TotalCount = ProductList.Meta.TotalCount;
    var searching;
    vm.AssignArray = [];
    ProductAssignments.Items.forEach(function(itm) {
        vm.AssignArray.push(itm.ID);
    })
    vm.toggleListFilter = function() {
        vm.listFilter = !vm.listFilter;
        vm.research();
    };

    vm.toggleAssignFilter = function() {
        vm.assignedFilter = !vm.assignedFilter;
        vm.research();
    };

    vm.SelectAll = function() {
        $uibModal.open({
            animation: true,
            templateUrl: 'dataManager/templates/select.modal.tpl.html',
            controller: 'SelectDialogDataJobCtrl',
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

    vm.DeselectAll = function() {
        $uibModal.open({
            animation: true,
            templateUrl: 'dataManager/templates/deselect.modal.tpl.html',
            controller: 'DeselectDialogDataJobCtrl',
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

    vm.paramObject = {};
    vm.research = function() {
        vm.paramObject = {};

        if (vm.statusFilter && vm.statusFilter !== '') {
            vm.paramObject["xp.Status"] = vm.statusFilter;
        }
        if (vm.groupFilter && vm.groupFilter !== '') {
            if (vm.groupFilter.toString().includes("MASTER_")) {
                vm.paramObject["xp.Master-Group.Name"] = vm.groupFilter.replace('MASTER_', '');
            } else {
                vm.paramObject["xp.Product-Group"] = vm.groupFilter;
            }
        }
        if (vm.brandFilter && vm.brandFilter !== '') {
            vm.paramObject["xp.Brand-Name"] = vm.brandFilter;
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
                    vm.paramObject[vm.searchby] = "*" + vm.searchFilter + "*"; // "*" Fuzzy Search
            }
        }

        if (xpSearch) {
            keywords = null;
            searchby = null;
        }

        if (searching) {
            $timeout.cancel(searching);
        }
        searching = $timeout(function() {

            OrderCloud.Categories.ListProductAssignments(vm.DataJob.ID, null, null, 100, 'datamanager').then(function(data) {



                if (vm.listFilter) {
                    vm.paramObject.catalogID = $stateParams.buyerid;
                    vm.list.Items = [];
                    try {
                        delete vm.paramObject.CatalogID;
                        delete vm.paramObject.CategoryID;
                    } catch (e) {}
                    OrderCloud.Products.List(keywords, 1, 100, searchby, null, vm.paramObject).then(function(_data) {

                        try {
                            _data.Items.forEach(function(itm) {
                                if (!vm.AssignArray.includes(itm.ID)) {
                                    vm.list.Items.push(itm);
                                }
                            });
                        } catch (e) {}
                        vm.list.Meta.TotalCount = _data.Meta.TotalCount;
                        for (var i = 1, len = _data.Meta.TotalPages; i < len; i++) {

                            if (vm.list.Items.length < 100 && _data.Meta.TotalCount > 0) {

                                try {
                                    delete vm.paramObject.CatalogID;
                                    delete vm.paramObject.CategoryID;
                                } catch (e) {}
                                OrderCloud.Products.List(keywords, i + 1, 100, searchby, null, vm.paramObject).then(function(_datab) {
                                    _datab.Items.forEach(function(itm) {
                                        try {
                                            if (!vm.AssignArray.includes(itm.ID) && vm.list.Items.length < 100) {
                                                vm.list.Items.push(itm);
                                            }
                                        } catch (e) {}
                                    });
                                    vm.list.Meta.TotalCount = _data.Meta.TotalCount;
                                });
                            }
                        }

                    });
                } else {

                    OrderCloud.Products.List(null, 1, 100, null, null, { 'catalogID': $stateParams.buyerid, "categoryid": $stateParams.buyerid }).then(function(data) {
                        vm.list = data;
                        vm.TotalCount = vm.list.Meta.TotalCount;
                    });
                }


                if (vm.assignedFilter) {
                    vm.paramObject["ID"] = null;
                    vm.paramObject['CatalogID'] = 'datamanager';
                    vm.paramObject['CategoryID'] = $stateParams.DataJobid;

                    FullOrderCloud.Products.List(keywords, 1, 100, searchby, null, vm.paramObject).then(function(data) {
                        vm.prodAssignments = data;
                    });
                } else {


                    FullOrderCloud.Products.List(null, 1, 100, null, null, {
                        "CatalogID": 'datamanager',
                        "CategoryID": $stateParams.DataJobid
                    }).then(function(data) {
                        vm.prodAssignments = data;
                    });

                }
            });

        }, 300);
    };

    $scope.$on('prod-bag.drop-model', function(e, elScope, target, source) {
        if (angular.element(source).attr('id') === 'right-drag-col') {
            DeleteFunc(elScope.ID);
        } else {
            SaveFunc(elScope.ID);
        }
    });

    vm.pushOver = function(pd) {
        var _Index = 0;
        angular.forEach(vm.list.Items, function(prod, index) {
            if (prod.ID === pd.ID) {
                _Index = index;
            }
        });
        vm.list.Items.splice(_Index, 1);
        vm.prodAssignments.Items.push(pd);
        SaveFunc(pd.ID);
    };

    vm.pushBack = function(pd) {
        var _Index = 0;
        angular.forEach(vm.prodAssignments.Items, function(prod, index) {
            if (prod.ID === pd.ID) {
                _Index === index;
            }
        });
        vm.prodAssignments.Items.splice(_Index, 1);
        vm.list.Items.push(pd);
        DeleteFunc(pd.ID);
    };

    function SaveFunc(ItemID) {
        return OrderCloud.Categories.SaveProductAssignment({
            CategoryID: vm.DataJob.ID,
            ProductID: ItemID
        }, 'datamanager').then(function() {
            toastr.success('Assignment Updated', 'Success');

        });
    }

    function DeleteFunc(ItemID) {
        return OrderCloud.Categories.DeleteProductAssignment(vm.DataJob.ID, ItemID, 'datamanager').then(function() {
            toastr.success('Assignment Removed', 'Success');

        });
    }

    vm.listPagingFunction = function() {

        var expectedCount = vm.list.Items.length + 100;

        if (vm.list.Meta.TotalCount - vm.prodAssignments.Meta.TotalCount < expectedCount)
            expectedCount = vm.list.Meta.TotalCount - vm.prodAssignments.Meta.TotalCount;


        var paramObject = {};
        if (vm.statusFilter && vm.statusFilter !== '') { paramObject["xp.Status"] = vm.statusFilter; }
        if (vm.groupFilter && vm.groupFilter !== '') { paramObject["xp.Product-Group"] = vm.groupFilter; }
        if (vm.brandFilter && vm.brandFilter !== '') { paramObject["xp.Brand-Name"] = vm.brandFilter; }
        paramObject.catalogID = "product-groups";

        var getMore = function() {
            let pCopy = angular.copy(paramObject);
            delete pCopy.catalogID;

            try {
                if (vm.groupFilter.toString().includes("MASTER_")) {
                    pCopy["xp.Master-Group.Name"] = vm.groupFilter.replace('MASTER_', '');
                    delete pCopy["xp.Product-Group"];
                } else {
                    pCopy["xp.Product-Group"] = vm.groupFilter;
                }
            } catch (e) {}

            Paging.filteredPaging(vm.list, 'Products', vm.searchFilter, pCopy).then(function() {
                var _data = vm.list.Items;
                var index = _data.length - 1;
                while (index >= 0) {
                    if (vm.AssignArray.includes(_data[index].ID)) {
                        _data.splice(index, 1);
                    }
                    index--;
                }
                vm.list.Items = arrUnique(vm.list.Items);
                if (vm.list.Items.length < expectedCount) {
                    getMore();
                }
            });
        }

        getMore();
    };
}

function copyPasteModalCtrl($scope, $uibModalInstance, scope) {
    "use strict";
    var vm = this;

    vm.parseText = function() {
        vm.list = vm.source.split(/[\r\n\t]+/g);
    };

    vm.update = function() {
        scope.DataJobAdHoc.copyPasteSaveAssignments(vm.list);
    };

    vm.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
}

function DataJobAssignSpecController($scope, toastr, OrderCloud, Paging, SpecList, SelectedDataJob, $timeout, $state, Buyer, $q, Underscore, dragulaService, SpecGroups) {
    "use strict";
    var vm = this;
    vm.buyer = Buyer;
    vm.specGroups = SpecGroups;
    vm.DataJob = SelectedDataJob;
    vm.list = SpecList;

    vm.saveAssignments = SaveAssignment;
    if (!vm.DataJob.xp.specAssignments || !vm.DataJob.xp.specAssignments.Items) {
        vm.DataJob.xp.specAssignments = {
            "Items": []
        };
    }


    vm.colLetter = function colName(n) {
        var ordA = 'a'.charCodeAt(0);
        var ordZ = 'z'.charCodeAt(0);
        var len = ordZ - ordA + 1;

        var s = "";
        while (n >= 0) {
            s = String.fromCharCode(n % len + ordA) + s;
            n = Math.floor(n / len) - 1;
        }
        return s.toUpperCase();
    };

    dragulaService.options($scope, 'spec-bag', {
        moves: function(el, container, handle) {
            return handle.id === 'handle';
        }
    });

    $scope.$on('spec-bag.drop-model', function(e, elScope, target, source) {
        SaveAssignment();
    });

    vm.pushOver = function(specID) {
        var tempSpecIndex = 0;
        angular.forEach(vm.list.Items, function(spec, index) {
            if (spec.ID === specID) {
                tempSpecIndex = index;
            }
        });
        vm.DataJob.xp.specAssignments.Items.push(vm.list.Items[tempSpecIndex]);
        vm.list.Items.splice(tempSpecIndex, 1);
        SaveAssignment();
    };

    vm.pushBack = function(specID) {
        var tempSpecIndex = 0;
        angular.forEach(vm.DataJob.xp.specAssignments.Items, function(spec, index) {
            if (spec.ID === specID) {
                tempSpecIndex = index;
            }
        });
        vm.list.Items.push(vm.DataJob.xp.specAssignments.Items[tempSpecIndex]);
        vm.DataJob.xp.specAssignments.Items.splice(tempSpecIndex, 1);
        SaveAssignment();
    };

    var searching;

    vm.research = function() {

        if (vm.groupFilter === null) {
            vm.groupFilter = undefined;
        }

        if (searching) { $timeout.cancel(searching); }
        searching = $timeout(function() {
            if (vm.searchInput !== '') {
                vm.searchFilter = vm.searchInput;
            } else {
                vm.searchFilter = undefined;
            }
        }, 300);

    };

    vm.toggleListFilter = function() {
        vm.listFilter = !vm.listFilter;
    };

    vm.toggleAssignFilter = function() {
        vm.assignedFilter = !vm.assignedFilter;
    };

    function SaveAssignment() {
        OrderCloud.Categories.Update(vm.DataJob.ID, vm.DataJob, 'datamanager')
            .then(function() {
                toastr.success('Assignment Updated', 'Success');
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

function arrUnique(arr) {
    "use strict";
    var cleaned = [];
    arr.forEach(function(itm) {
        var unique = true;
        cleaned.forEach(function(itm2) {
            if (_.isEqual(itm, itm2)) unique = false;
        });
        if (unique) cleaned.push(itm);
    });
    return cleaned;
}

angular.module('productManager').filter('intersection', function() {
    "use strict";
    return function(objArray1, objArray2, doTheThing) {
        if (!doTheThing) {
            return objArray1;
        } else if (doTheThing && !objArray2) {
            return objArray1;
        } else {
            return objArray1.filter(function(n) {
                var found = false;
                angular.forEach(objArray2, function(x) {
                    if (x.ID === n.ID) {
                        found = true;
                    }
                });
                return found;
            });
        }
    };
});