(function() {
    "use strict";
    'use strict';

    /* Channels */
    /* JSLINT & lite-Refactor  AG 3/30/17 */

    /* TEMP Suppress JSHINT errors */
    /* jshint -W030 */
    /* jshint -W038 */

    ChannelConfig.$inject = ["$stateProvider"];
    ChannelsController.$inject = ["$state", "$ocMedia", "BuyerList", "OrderCloudParameters", "OrderCloud", "Parameters"];
    ChannelEditController.$inject = ["$exceptionHandler", "$state", "$i18next", "SelectedBuyer", "OrderCloud", "toastr", "$q", "LabeledSpecs", "$scope", "option_list", "Audit"];
    ChannelCreateController.$inject = ["$exceptionHandler", "$state", "$i18next", "OrderCloud", "toastr", "option_list", "Audit"];
    ChannelProductsController.$inject = ["$http", "$rootScope", "$scope", "$exceptionHandler", "$i18next", "$state", "SelectedBuyer", "ProductList", "Assignments", "FullOrderCloud", "OrderCloud", "toastr", "Underscore", "$q", "$stateParams", "ProductAssignments", "Paging", "ProductGroups", "dragulaService", "Helpers", "option_list", "Audit", "$uibModal"];
    SelectDialogController.$inject = ["$scope", "$uibModalInstance", "Audit", "$i18next", "toastr", "Scope"];
    DeselectDialogController.$inject = ["$scope", "$uibModalInstance", "Audit", "$i18next", "toastr", "Scope"];
    angular.module('productManager').config(ChannelConfig).controller('ChannelsCtrl', ChannelsController).controller('ChannelEditCtrl', ChannelEditController).controller('ChannelCreateCtrl', ChannelCreateController).controller('ChannelProductsCtrl', ChannelProductsController).controller('SelectDialogCtrl', SelectDialogController).controller('DeselectDialogCtrl', DeselectDialogController);

    function ChannelConfig($stateProvider) {
        'use strict';

        $stateProvider
        // List State
            .state('channels', {
                parent: 'base',
                templateUrl: 'channels/templates/channels.tpl.html',
                controller: 'ChannelsCtrl',
                controllerAs: 'channels',
                url: '/' + i18next.t('Channels').toLowerCase() + '?search&page&pageSize&searchOn&sortBy',
                data: {
                    componentName: 'Channels',
                    OrderIndex: 5
                },
                resolve: {
                    Parameters: ["$stateParams", "OrderCloudParameters", function Parameters($stateParams, OrderCloudParameters) {
                        return OrderCloudParameters.Get($stateParams);
                    }],
                    BuyerList: ["OrderCloud", "Parameters", function BuyerList(OrderCloud, Parameters) {
                        var sort = Parameters.sortBy ? Parameters.sortBy.indexOf('!') === 0 ? Parameters.sortBy.split('!')[1] : Parameters.sortBy : "Name";
                        return OrderCloud.Buyers.List(Parameters.search, Parameters.page, Parameters.pageSize || 50, Parameters.searchOn, sort, Parameters.filters);
                    }]
                }
            })
            // Edit State
            .state('channels.edit', {
                url: '/:buyerid/edit',
                templateUrl: 'channels/templates/channelEdit.tpl.html',
                controller: 'ChannelEditCtrl',
                controllerAs: 'channelEdit',
                resolve: {
                    SelectedBuyer: ["$stateParams", "OrderCloud", function SelectedBuyer($stateParams, OrderCloud) {
                        return OrderCloud.Buyers.Get($stateParams.buyerid);
                    }],
                    LabeledSpecs: ["OrderCloud", "$q", "SelectedBuyer", "Underscore", function LabeledSpecs(OrderCloud, $q, SelectedBuyer, Underscore) {
                        return OrderCloud.Specs.List(null, null, 100, null, null, null).then(function(data) {
                            var t = data;
                            var q = [];
                            if (data.Meta.TotalPages > 1) {
                                for (var v = 2; v <= data.Meta.TotalPages; v++) {
                                    q.push(function() {
                                        OrderCloud.Specs.List(null, v, 100, null, null, null).then(function(response) {
                                            angular.forEach(response.Items, function(i) {
                                                t.Items.push(i);
                                            });
                                        });
                                    }());
                                }
                                return $q.all(q).then(function() {
                                    var labeledSpecs = [];
                                    angular.forEach(t.Items, function(spec) {
                                        if (spec.xp && spec.xp.CustomLabels && spec.xp.CustomLabels[SelectedBuyer.ID]) {
                                            var tempSpec = angular.copy(spec);
                                            delete tempSpec.xp.CustomLabels[SelectedBuyer.ID];
                                            if (Underscore.keys(tempSpec.xp.CustomLabels).length === 0) {
                                                delete tempSpec.xp.CustomLabels;
                                            }
                                            labeledSpecs.push(tempSpec);
                                        }
                                    });
                                    return labeledSpecs;
                                });
                            } else {
                                var labeledSpecs = [];
                                angular.forEach(t.Items, function(spec) {
                                    if (spec.xp && spec.xp.CustomLabels && spec.xp.CustomLabels[SelectedBuyer.ID]) {
                                        var tempSpec = angular.copy(spec);
                                        delete tempSpec.xp.CustomLabels[SelectedBuyer.ID];
                                        if (Underscore.keys(tempSpec.xp.CustomLabels).length === 0) {
                                            delete tempSpec.xp.CustomLabels;
                                        }
                                        labeledSpecs.push(tempSpec);
                                    }
                                });
                                return labeledSpecs;
                            }
                        });
                    }]
                }
            })
            // Create State
            .state('channels.create', {
                url: '/create',
                templateUrl: 'channels/templates/channelCreate.tpl.html',
                controller: 'ChannelCreateCtrl',
                controllerAs: 'channelsCreate'
            })
            // Product Assignment State
            .state('channels.products', {
                url: '/:buyerid/products',
                templateUrl: 'channels/templates/channelProducts.tpl.html',
                controller: 'ChannelProductsCtrl',
                controllerAs: 'channelProducts',
                resolve: {
                    Assignments: ["FullOrderCloud", "$stateParams", function Assignments(FullOrderCloud, $stateParams) {
                        return FullOrderCloud.Products.List(null, 1, 100, null, null, {
                            'catalogID': $stateParams.buyerid
                        });
                    }],
                    SelectedBuyer: ["$stateParams", "OrderCloud", function SelectedBuyer($stateParams, OrderCloud) {
                        return OrderCloud.Buyers.Get($stateParams.buyerid);
                    }],
                    ProductGroups: ["OrderCloud", "Categories", function ProductGroups(OrderCloud, Categories) {
                        var c = {};
                        angular.forEach(Categories.Items, function(i) {
                            c[i.ID] = {
                                'ID': i.ID,
                                'Name': i.Name,
                                'Type': i.Type
                            };
                        });
                        console.log(c);
                        return c;
                    }],
                    Categories: ["FullOrderCloud", function Categories(FullOrderCloud) {
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
                    }],
                    ProductList: ["OrderCloud", "FullOrderCloud", "Helpers", "$q", "$stateParams", "Assignments", function ProductList(OrderCloud, FullOrderCloud, Helpers, $q, $stateParams, Assignments) {
                        return OrderCloud.Products.List(null, 1, 100, null, null, null).then(function(_data) {
                            _data.Items = _data.Items.filter(function(current) {
                                return Assignments.Items.filter(function(current_b) {
                                    return current_b.ID === current.ID;
                                }).length === 0;
                            });
                            if (_data.Items.length < 100 && _data.Meta.TotalCount > 0) {
                                for (var i = 0, len = _data.Meta.TotalPages; i < len; i++) {
                                    OrderCloud.Products.List(null, i + 1, 100 - _data.Items.length, null, null, null).then(function(_datab) {
                                        _datab.Items = _datab.Items.filter(function(current) {
                                            return Assignments.Items.filter(function(current_b) {
                                                return current_b.ID === current.ID;
                                            }).length === 0;
                                        });
                                        if (_data.Items.length < 100) {
                                            for (var j = 0, len = _datab.Items.length; j < len; j++) {
                                                if (_data.Items.length < 100) {
                                                    _data.Items.push(_datab.Items[j]);
                                                }
                                            }
                                        }
                                    });
                                }
                            }

                            return _data;
                        });
                    }],
                    ProductAssignments: ["$stateParams", "FullOrderCloud", "Helpers", "$q", function ProductAssignments($stateParams, FullOrderCloud, OrderCloud, Helpers, $q) {
                        return FullOrderCloud.Products.List(null, 1, 100, null, null, {
                            'catalogID': $stateParams.buyerid
                        });
                    }]
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
                Audit.log($i18next.t("Channel Product Assignment"), product.Name + " > " + Scope.buyer.Name, [{
                    "Type": "Channel",
                    "TargetID": Scope.buyer.ID,
                    "NewState": product.ID
                }], 'CREATE');
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
                Audit.log($i18next.t("Channel Product Assignment"), product.Name + " > " + Scope.buyer.Name, [{
                    "Type": "Channel",
                    "TargetID": Scope.buyer.ID,
                    "NewState": product.ID
                }], 'DELETE');
            });
            Scope.AssignArray = [];
            Scope.list.Items.unshift.apply(Scope.list.Items, Scope.assignments.Items);
            Scope.assignments.Items = [];
            Scope.list.Meta = angular.copy(Scope.assignments.Meta);

            Scope.list.Meta.ItemRange[1] = Scope.list.Items.length;
            Scope.assignments.Meta.ItemRange[1] = 0;
            Scope.assignments.Meta.TotalCount = 0;
            $uibModalInstance.close();
        };

        vm.cancel = function() {
            $uibModalInstance.close();
        };
    }

    function ChannelsController($state, $ocMedia, BuyerList, OrderCloudParameters, OrderCloud, Parameters) {
        "use strict";

        var vm = this;
        vm._pObj = "Products";
        vm.list = BuyerList;
        vm.parameters = Parameters;
        vm.sortSelection = Parameters.sortBy ? Parameters.sortBy.indexOf('!') === 0 ? Parameters.sortBy.split('!')[1] : Parameters.sortBy : "Name";

        //Check if filters are applied
        vm.filtersApplied = vm.parameters.filters || $ocMedia('max-width:767px') && vm.sortSelection; //Sort by is a filter on mobile devices
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
            return OrderCloud.Buyers.List(Parameters.search, vm.list.Meta.Page + 1, Parameters.pageSize || vm.list.Meta.PageSize, Parameters.searchOn, Parameters.sortBy, Parameters.filters).then(function(data) {
                vm.list.Items = vm.list.Items.concat(data.Items);
                vm.list.Meta = data.Meta;
            });
        };
    }

    function ChannelEditController($exceptionHandler, $state, $i18next, SelectedBuyer, OrderCloud, toastr, $q, LabeledSpecs, $scope, option_list, Audit) {
        "use strict";

        var vm = this;
        vm.buyer = SelectedBuyer;
        vm.buyerName = SelectedBuyer.Name;
        vm.labeledSpecs = LabeledSpecs;
        vm.options = option_list;
        vm.Delete = function() {
            if (confirm("Are you sure you want to delete this Channel?")) {
                OrderCloud.Buyers.Delete(SelectedBuyer.ID).then(function() {
                    var calls = [];
                    angular.forEach(vm.labeledSpecs, function(a) {
                        var c = {};
                        c.Method = 'PUT';
                        c.URL = 'https://api.ordercloud.io/v1/specs/' + a.ID;
                        c.Body = a;
                        calls.push(c);
                    });
                    if (calls.length > 0) {
                        $scope.application.apiAgentService.send(calls);
                        toastr.warning('Deleting Channel. Please do not exit.', 'Warning');
                    } else {
                        toastr.success('Channel Deleted', 'Success');
                        Audit.log($i18next.t("Channel"), SelectedBuyer.Name, [{
                            "Type": "Channel",
                            "TargetID": SelectedBuyer.ID
                        }], 'DELETE');
                    }
                    $state.go('channels', {}, {
                        reload: true
                    });
                }).catch(function(ex) {
                    $exceptionHandler(ex);
                });
            }
        };

        vm.Submit = function() {
            OrderCloud.Buyers.Update(vm.buyer, SelectedBuyer.ID).then(function() {

                OrderCloud.Catalogs.SaveAssignment({
                    "CatalogID": "product-groups",
                    "BuyerID": SelectedBuyer.ID
                }).then(function() {
                    $state.go('channels', {}, {
                        reload: true
                    });
                    toastr.success('Channel Updated', 'Success');
                    Audit.log($i18next.t("Channel"), SelectedBuyer.Name, [{
                        "Type": "Channel",
                        "TargetID": SelectedBuyer.ID
                    }], 'UPDATE');
                });
            }).catch(function(ex) {
                $exceptionHandler(ex);
            });
        };
    }

    function ChannelCreateController($exceptionHandler, $state, $i18next, OrderCloud, toastr, option_list, Audit) {
        "use strict";

        var vm = this;
        vm.options = option_list;
        vm.Submit = function() {
            OrderCloud.Buyers.Create(vm.buyer).then(function(data) {
                OrderCloud.Catalogs.SaveAssignment({
                    "CatalogID": "product-groups",
                    "BuyerID": data.ID
                }).then(function(dta) {
                    $state.go('channels', {}, {
                        reload: true
                    });
                    toastr.success('Channel Created', 'Success');
                    Audit.log($i18next.t("Channel"), vm.buyer.Name, [{
                        "Type": "Channel",
                        "TargetID": data.ID
                    }], 'CREATE');
                });
            }).catch(function(ex) {
                $exceptionHandler(ex);
            });
        };
    }

    function GetProductList(OrderCloud, FullOrderCloud, Helpers, $q, buyerid) {
        var searchFilter = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;
        var paramObject = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : null;

        var ret = [];
        var q = [];
        var uberQ = $q.defer();
        FullOrderCloud.Products.ListAssignments(null, null, null, null, null, null, null, buyerid).then(function(Assignments) {
            q.push(function() {
                var ids = Helpers.getFilterKeys(Assignments, false, "ProductID", "ID").split("|");
                try {
                    delete paramObject.ID;
                } catch (e) {}
                OrderCloud.Products.List(searchFilter, 1, 100, null, null, paramObject).then(function(data) {
                    for (var i = data.Items.length, len = 0; i > len; i--) {
                        if (_.contains(ids, data.Items[i - 1].ID)) {
                            data.Items.splice(i - 1, 1);
                            data.Meta.TotalCount--;
                        }
                    }
                    var pNumber = 1;
                    if (data.Meta.TotalPages == 1) {
                        _.delay(function() {
                            uberQ.resolve(data);
                        }, 250);
                    }

                    for (var v = 2; v <= data.Meta.TotalPages; v++) {
                        if (data.Items.length < 100 && pNumber < data.Meta.TotalPages) {
                            pNumber++;
                            try {
                                delete paramObject.ID;
                            } catch (e) {}
                            OrderCloud.Products.List(searchFilter, pNumber, 100, null, null, paramObject).then(function(subData) {
                                for (var i = subData.Items.length, len = 0; i > len; i--) {
                                    if (!_.contains(ids, subData.Items[i - 1].ID)) {
                                        if (data.Items.length < 100) {
                                            data.Items.push(subData.Items[i - 1]);
                                        }
                                    } else {
                                        data.Meta.TotalCount--;
                                    }
                                };
                                _.delay(function() {
                                    uberQ.resolve(data);
                                }, 250);
                            });
                        }
                    }
                    _.delay(function() {
                        uberQ.resolve(data);
                    }, 250);
                });
            }());
        });
        return uberQ.promise;
    }

    function GetProductAssignmentLists(OrderCloud, FullOrderCloud, Helpers, $q, buyerid) {
        var searchFilter = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;
        var paramObject = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : {};

        var uberQ = $q.defer();
        FullOrderCloud.Products.ListAssignments(null, null, null, null, null, null, null, buyerid).then(function(Assignments) {
            var base = {
                Items: [],
                Meta: {
                    TotalCount: Assignments.Items.length,
                    ItemRange: [Assignments.Items.length, Assignments.Items.length]
                }
            };
            var q = [];
            var lists = _.groupBy(Assignments.Items, function(element, index) {
                return Math.floor(index / 50);
            });
            angular.forEach(lists, function(list) {
                q.push(function() {
                    var tL = {
                        "Items": list
                    };
                    var ids = Helpers.getFilterKeys(tL, false, "ProductID", "ID");
                    paramObject.ID = ids;
                    OrderCloud.Products.List(searchFilter, 1, 100, null, null, paramObject).then(function(data) {
                        base.Items = base.Items.concat(data.Items);
                    });
                }());
            });
            $q.all(q).then(function() {
                _.delay(function() {
                    uberQ.resolve(base);
                }, 500);
            });
        });
        return uberQ.promise;
    }

    function ChannelProductsController($http, $rootScope, $scope, $exceptionHandler, $i18next, $state, SelectedBuyer, ProductList, Assignments, FullOrderCloud, OrderCloud, toastr, Underscore, $q, $stateParams, ProductAssignments, Paging, ProductGroups, dragulaService, Helpers, option_list, Audit, $uibModal) {
        "use strict";

        var vm = this;
        vm.buyer = SelectedBuyer;
        vm.buyerName = SelectedBuyer.Name;
        vm.list = ProductList;
        vm.productGroups = ProductGroups;
        vm.assignments = ProductAssignments;
        vm.options = option_list;
        vm.application = $scope.application;
        //Save Unfiltered Count
        vm.TotalCount = vm.list.Meta.TotalCount; //- vm.assignments.Meta.TotalCount;

        vm.AssignArray = [];

        Assignments.Items.forEach(function(itm) {
            vm.AssignArray.push(itm.ID);
        });

        vm.selectAll = function() {
            $uibModal.open({
                animation: true,
                templateUrl: 'channels/templates/select.modal.tpl.html',
                controller: 'SelectDialogCtrl',
                controllerAs: 'select',
                size: 'sm',
                resolve: {
                    Scope: function Scope() {
                        return vm;
                    }
                }
            }).result.then(function() {
                angular.noop();
            }, function() {
                angular.noop();
            });
        };

        vm.deselectAll = function() {
            $uibModal.open({
                animation: true,
                templateUrl: 'channels/templates/deselect.modal.tpl.html',
                controller: 'DeselectDialogCtrl',
                controllerAs: 'select',
                size: 'sm',
                resolve: {
                    Scope: function Scope() {
                        return vm;
                    }
                }
            }).result.then(function() {
                angular.noop();
            }, function() {
                angular.noop();
            });
        };

        dragulaService.options($scope, 'spec-bag', {
            moves: function moves(el, container, handle) {
                return handle.id === 'handle';
            }
        });

        vm.model = {
            ProductID: "",
            CatalogID: SelectedBuyer.ID
        };

        $scope.$on('prod-bag.drop-model', function(e, elScope, target, source) {
            if (angular.element(source).attr('id') === 'right-drag-col') {
                vm.unassign(elScope);
            } else {
                vm.assign(elScope);
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
            vm.assign(pd);
            vm.assignments.Items.push(pd);
        };

        vm.pushBack = function(pd) {
            var _Index = 0;
            angular.forEach(vm.assignments.Items, function(prod, index) {
                if (prod.ID === pd.ID) {
                    _Index = index;
                }
            });

            vm.assignments.Items.splice(_Index, 1);
            vm.unassign(pd);
            vm.list.Items.push(pd);
        };
        vm.paramObject = {};
        vm.research = _.debounce(function() {
            //  $rootScope.$emit('$stateChangeStart', $state);
            vm.paramObject = {};

            if (vm.groupFilter === null) vm.groupFilter = undefined;

            if (vm.statusFilter === null) vm.statusFilter = undefined;

            if (vm.brandFilter === null) vm.brandFilter = undefined;

            if (vm.searchFilter === null) vm.searchFilter = undefined;

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

            var xpSearch = false;
            var keywords = vm.searchFilter;
            var searchby = vm.searchby;

            if (vm.searchby) {
                if (vm.searchby.toString().includes("xp.")) {
                    xpSearch = true;
                    if (vm.searchFilter != '' && vm.searchFilter != undefined) {
                        vm.paramObject[vm.searchby] = "*" + vm.searchFilter + "*"; // "*" Fuzzy Search
                        keywords = null;
                        searchby = null;
                    }
                }
            }

            if (vm.listFilter) {

                delete vm.paramObject.catalogID;
                OrderCloud.Products.List(keywords, 1, 100, null, searchby, vm.paramObject).then(function(_data) {

                    vm.list.Meta = _data.Meta;
                    vm.list.Items = [];

                    _data.Items.forEach(function(itm) {
                        if (!vm.AssignArray.includes(itm.ID)) {
                            vm.list.Items.push(itm);
                        }
                    });
                    for (var i = 1, len = _data.Meta.TotalPages; i < len; i++) {
                        if (vm.list.Items.length < 100 && _data.Meta.TotalCount > 0) {
                            vm.paramObject.catalogID = "product-groups";
                            OrderCloud.Products.List(keywords, i + 1, 100, null, searchby, vm.paramObject).then(function(_datab) {
                                _datab.Items.forEach(function(itm) {
                                    if (!vm.AssignArray.includes(itm.ID) && vm.list.Items.length < 100) {
                                        vm.list.Items.push(itm);
                                    }
                                });
                            });
                        }
                    }

                    if (!vm.assignedFilter) {
                        $rootScope.$emit('$stateChangeSuccess', $state);
                    };
                });
            } else {

                delete vm.paramObject.catalogID;
                OrderCloud.Products.List(null, 1, 100, null, null, null).then(function(_data) {

                    vm.list.Meta = _data.Meta;
                    vm.list.Items = [];
                    _data.Items.forEach(function(itm) {
                        if (!vm.AssignArray.includes(itm.ID)) {
                            vm.list.Items.push(itm);
                        }
                    });
                    for (var i = 1, len = _data.Meta.TotalPages; i < len; i++) {
                        if (vm.list.Items.length < 100 && _data.Meta.TotalCount > 0) {
                            delete vm.paramObject.catalogID;
                            OrderCloud.Products.List(null, i + 1, 100, null, null, null).then(function(_datab) {
                                _datab.Items.forEach(function(itm) {
                                    if (!vm.AssignArray.includes(itm.ID) && vm.list.Items.length < 100) {
                                        vm.list.Items.push(itm);
                                    }
                                });
                            });
                        }
                    }
                    vm.list.Items = arrUnique(vm.list.Items);
                    if (!vm.assignedFilter) {
                        $rootScope.$emit('$stateChangeSuccess', $state);
                    };
                });
            }

            if (vm.assignedFilter) {
                vm.paramObject.catalogID = $stateParams.buyerid;
                FullOrderCloud.Products.List(keywords, 1, 100, null, searchby, vm.paramObject).then(function(data) {
                    vm.assignments = data;
                    $rootScope.$emit('$stateChangeSuccess', $state);
                });
            } else {
                FullOrderCloud.Products.List(null, 1, 100, null, null, {
                    catalogID: $stateParams.buyerid
                }).then(function(data) {
                    vm.assignments = data;
                    vm.list.Meta.TotalCount = vm.list.Meta.TotalCount + data.Items.length;
                    $rootScope.$emit('$stateChangeSuccess', $state);
                });
            }
        }, 100);

        vm.toggleListFilter = function() {
            vm.listFilter = !vm.listFilter;
            vm.research();
        };

        vm.toggleAssignFilter = function() {
            vm.assignedFilter = !vm.assignedFilter;
            vm.research();
        };

        vm.assign = function(product) {
            var assignment = angular.copy(vm.model);
            assignment.ProductID = product.ID;
            $http({
                method: 'POST',
                url: 'https://api.ordercloud.io/v1/catalogs/productassignments',
                data: assignment,
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    "Authorization": "Bearer " + OrderCloud.Auth.ReadToken()
                }
            }).success(function(data, status, headers, config) {
                toastr.success("Product Added", 'Success');
            }).error(function(data, status, header, config) {
                toastr.warning(data.Errors[0].Message);
            });
        };

        vm.unassign = function(product) {
            $http({
                method: 'DELETE',
                url: 'https://api.ordercloud.io/v1/catalogs/' + SelectedBuyer.ID + '/productassignments/' + product.ID,
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    "Authorization": "Bearer " + OrderCloud.Auth.ReadToken()
                }
            }).success(function(data, status, headers, config) {
                toastr.success("Product Removed", 'Success');
            }).error(function(data, status, header, config) {
                toastr.warning(data.Errors[0].Message);
            });
        };

        vm.listPagingFunction = function() {

            var expectedCount = vm.list.Items.length + 100;

            if (vm.list.Meta.TotalCount - vm.assignments.Meta.TotalCount < expectedCount) expectedCount = vm.list.Meta.TotalCount - vm.assignments.Meta.TotalCount;

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
            paramObject.catalogID = "product-groups";

            var getMore = function getMore() {
                Paging.filteredPaging(vm.list, 'Products', vm.searchFilter, paramObject, vm.assignments).then(function() {
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
            };

            getMore();
        };

        vm.assignmentPagingFunction = function() {
            var paramObject = {};
            paramObject.catalogID = $stateParams.buyerid;
            if (vm.statusFilter && vm.statusFilter !== '') {
                paramObject["xp.Status"] = vm.statusFilter;
            }

            if (vm.groupFilter && vm.groupFilter !== '') {
                paramObject["xp.Product-Group"] = vm.groupFilter;
            }

            if (vm.brandFilter && vm.brandFilter !== '') {
                paramObject["xp.Brand-Name"] = vm.brandFilter;
            }

            return Paging.filteredPaging(vm.assignments, 'Products', vm.searchFilter, paramObject);
        };

        function arrUnique(arr) {
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
    }
}());