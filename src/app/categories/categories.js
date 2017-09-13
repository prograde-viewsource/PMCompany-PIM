angular.module('productManager')

.config(CategoriesConfig)
    .controller('CategoriesCtrl', CategoriesController)
    .controller('CategoryEditCtrl', CategoryEditController)
    .controller('CategoryCreateCtrl', CategoryCreateController)
    .controller('CategoryCloneCtrl', CategoryCloneController)
    .controller('CategoryAssignProductCtrl', CategoryAssignProductController)
    .controller('CategoryAdHocCtrl', CategoryAdHocController)
    .controller('CategoryAssignSpecCtrl', CategoryAssignSpecController)
    .controller('SelectDialogCategoriesCtrl', SelectDialogController)
    .controller('DeselectDialogCategoriesCtrl', DeselectDialogController)
    .controller('SelectSpecDialogCategoriesCtrl', SelectSpecDialogController)
    .controller('DeselectSpecDialogCategoriesCtrl', DeselectSpecDialogController)
    .controller('CopyPasteModalCtrl', CopyPasteModalCtrl);

function CategoriesConfig($stateProvider) {
    "use strict";
    $stateProvider
        .state('templates', {
            parent: 'base',
            templateUrl: 'categories/templates/categories.tpl.html',
            controller: 'CategoriesCtrl',
            controllerAs: 'categories',
            url: '/:buyerid/categories?from&to&search&page&pageSize&searchOn&sortBy&filters',
            data: { componentName: 'Distribution Templates', OrderIndex: 6 },
            resolve: {
                Parameters: function($stateParams, OrderCloudParameters) {
                    return OrderCloudParameters.Get($stateParams);
                },
                Buyer: function($stateParams, OrderCloud) {
                    return OrderCloud.Buyers.Get($stateParams.buyerid);
                },
                CategoryList: function(OrderCloud, Parameters, $stateParams, Buyer) {
                    var parameters = angular.copy(Parameters);
                    parameters.depth = 'all';
                    return OrderCloud.Categories.List(parameters.search, parameters.page, parameters.pageSize || 12, parameters.searchOn, parameters.sortBy, parameters.filters, parameters.depth, Buyer.DefaultCatalogID ? Buyer.DefaultCatalogID : null);
                },
                ProductGroups: function(ResourceService) {
                    return ResourceService.ProductGroups();
                }
            }
        })
        .state('templates.edit', {
            url: '/:categoryid/edit',
            templateUrl: 'categories/templates/categoryEdit.tpl.html',
            controller: 'CategoryEditCtrl',
            controllerAs: 'categoryEdit',
            resolve: {
                Buyer: function($stateParams, OrderCloud) {
                    return OrderCloud.Buyers.Get($stateParams.buyerid);
                },
                SelectedCategory: function($stateParams, $state, OrderCloud, Buyer) {
                    return OrderCloud.Categories.Get($stateParams.categoryid, Buyer.DefaultCatalogID).catch(function() {
                        $state.go('^.templates');
                    });
                }
            }
        })
        .state('templates.create', {
            url: '/categories/create',
            templateUrl: 'categories/templates/categoryCreate.tpl.html',
            controller: 'CategoryCreateCtrl',
            controllerAs: 'categoryCreate',
            resolve: {
                Buyer: function($stateParams, OrderCloud) {
                    return OrderCloud.Buyers.Get($stateParams.buyerid);
                }
            }
        })
        .state('templates.clone', {
            url: '/:categoryid/clone',
            templateUrl: 'categories/templates/categoryClone.tpl.html',
            controller: 'CategoryCloneCtrl',
            controllerAs: 'categoryClone',
            resolve: {
                Buyer: function($stateParams, OrderCloud) {
                    return OrderCloud.Buyers.Get($stateParams.buyerid);
                },
                SelectedCategory: function($stateParams, $state, OrderCloud, Buyer) {
                    return OrderCloud.Categories.Get($stateParams.categoryid, Buyer.DefaultCatalogID).catch(function() {
                        $state.go('^.templates');
                    });
                }
            }
        })

    .state('templates.assignProduct', {
            url: '/:categoryid/assign/product',
            templateUrl: 'categories/templates/categoryAssignProduct.tpl.html',
            controller: 'CategoryAssignProductCtrl',
            controllerAs: 'categoryAssignProd',
            resolve: {
                BuyerAssignments: function(FullOrderCloud, $stateParams) {
                    return FullOrderCloud.Products.ListAssignments(null, null, null, null, null, null, null, $stateParams.buyerid);
                },
                Buyer: function($stateParams, OrderCloud) {
                    return OrderCloud.Buyers.Get($stateParams.buyerid);
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
                ProductList: function(OrderCloud, FullOrderCloud, Helpers, $q, $stateParams, ProductAssignments) {

                    return OrderCloud.Products.List(null, 1, 100, null, null, { 'catalogID': $stateParams.buyerid }).then(function(_data) {
                        _data.Items = _data.Items.filter(function(current) {
                            return ProductAssignments.Items.filter(function(current_b) {
                                return current_b.ID === current.ID;
                            }).length === 0;
                        });



                        for (var i = 2, len = _data.Meta.TotalPages; i < len; i++) {
                            if (_data.Items.length < 100 && _data.Meta.TotalCount > 0) {

                                OrderCloud.Products.List(null, i, 100, null, null, { 'catalogID': $stateParams.buyerid }).then(function(_datab) {
                                    _datab.Items = _datab.Items.filter(function(current) {
                                        return ProductAssignments.Items.filter(function(current_b) {
                                            return current_b.ID === current.ID;
                                        }).length === 0;
                                    });
                                    if (_data.Items.length < 100) {
                                        _data.Items = _data.Items.concat(_datab.Items);
                                    }
                                    if (_data.Items.length > 100) {
                                        _data.Items = _data.Items.slice(0, 100);
                                    }
                                });
                            }
                        }
                        /** 
                        var AssignArray = [];

                        ProductAssignments.Items.forEach(function(itm) {
                            AssignArray.push(itm.ID);
                        })

                        var t = [];
                        _data.Items.forEach(function(itm) {
                            if (!AssignArray.includes(itm.ID)) {
                                t.push(itm);
                            }
                        });
                        _data.Meta.TotalCount = t.length > 0 ? _data.Meta.TotalCount : 0;


                        
*/

                        _data.Items = _.uniq(_data.Items, function(item, key, a) {
                            console.log(item.ID)
                            return item.ID;
                        });
                        return _data
                    });

                    //return OrderCloud.Products.List(null, 1, 100, null, null, { 'catalogID': $stateParams.buyerid });
                },
                ProductBuyerAssignments: function($stateParams, OrderCloud, Buyer) {
                    return OrderCloud.Products.ListAssignments(null, null, null, null, null, null, 100, Buyer.DefaultCatalogID);
                },
                ProductAssignments: function($stateParams, OrderCloud, Buyer, FullOrderCloud) {
                    return FullOrderCloud.Products.List(null, 1, 100, null, null, { 'catalogID': $stateParams.buyerid, "categoryid": $stateParams.categoryid });
                },
                SelectedCategory: function($stateParams, $state, OrderCloud, Buyer) {
                    return OrderCloud.Categories.Get($stateParams.categoryid, Buyer.DefaultCatalogID).catch(function() {
                        $state.go('^.templates');
                    });
                }
            }
        })
        .state('templates.adhoc', {
            url: '/:categoryid/adhoc',
            templateUrl: 'categories/templates/categoryAdHoc.tpl.html',
            controller: 'CategoryAdHocCtrl',
            controllerAs: 'categoryAdHoc',
            resolve: {
                Buyer: function($stateParams, OrderCloud) {
                    return OrderCloud.Buyers.Get($stateParams.buyerid);
                },
                CategoryList: function(OrderCloud, Buyer) {
                    return OrderCloud.Categories.List(null, null, 100, null, null, null, null, Buyer.DefaultCatalogID);
                },
                ProductList: function($stateParams, OrderCloud, Buyer, FullOrderCloud) {
                    return OrderCloud.Products.List(null, 1, 100, null, null, { 'catalogID': $stateParams.buyerid });
                },
                ProductBuyerAssignments: function($stateParams, OrderCloud, Buyer) {
                    return OrderCloud.Products.ListAssignments(null, null, null, null, null, null, null, Buyer.DefaultCatalogID);
                },
                SelectedCategory: function($stateParams, $state, OrderCloud, Buyer) {
                    return OrderCloud.Categories.Get($stateParams.categoryid, Buyer.DefaultCatalogID).catch(function() {
                        $state.go('^.templates');
                    });
                },
                ProductGroups: function(ResourceService) {
                    return ResourceService.ProductGroups();
                }
            }
        })
        .state('templates.assignSpec', {
            url: '/:categoryid/assign/spec',
            templateUrl: 'categories/templates/categoryAssignSpec.tpl.html',
            controller: 'CategoryAssignSpecCtrl',
            controllerAs: 'categoryAssignSpec',
            resolve: {
                Buyer: function($stateParams, OrderCloud) {
                    return OrderCloud.Buyers.Get($stateParams.buyerid);
                },
                CategoryList: function(OrderCloud) {
                    return OrderCloud.Categories.List(null, null, 100, null, null, null, null, null);
                },
                SelectedCategory: function($stateParams, $state, OrderCloud, Buyer) {
                    return OrderCloud.Categories.Get($stateParams.categoryid, Buyer.DefaultCatalogID);
                },
                Parameters: function($stateParams, OrderCloudParameters) {
                    return OrderCloudParameters.Get($stateParams);
                },
                AssignedSpecList: function(OrderCloud, Helpers, SelectedCategory, $q) {

                    let ids = { "Items": null }

                    if (SelectedCategory.xp.specAssignments != undefined) {
                        ids = SelectedCategory.xp.specAssignments;
                    }


                    if (SelectedCategory.xp.specAssignments.Items !== undefined) {
                        let keys = Helpers.getFilterKeys(ids, false);

                        if (keys === undefined) {
                            keys = "";
                        }
                        return OrderCloud.Specs.List(null, 1, 100, null, null, { 'ID': keys });
                    } else {


                        var Calls = [];
                        var rtn = {
                            Meta: null,
                            Items: []
                        };
                        var uberQ = $q.defer();
                        var i,
                            j,
                            temparray,
                            chunk = 20;

                        var array = [];
                        for (var i in SelectedCategory.xp.specAssignments) {
                            array.push(SelectedCategory.xp.specAssignments[i][0]);
                        }

                        for (i = 0, j = array.length; i < j; i += chunk) {
                            temparray = array.slice(i, i + chunk);

                            var id = [];
                            if (temparray != undefined) {
                                id = temparray;
                            }

                            var re = new RegExp(',', 'g');
                            var keys = id.toString().replace(re, "_pipe_");

                            console.log(keys)

                            if (keys === undefined) {
                                keys = "";
                            }

                            Calls.push(OrderCloud.Specs.List(null, 1, 100, null, null, { 'ID': keys }).then(function(response) {
                                console.log(response);
                                var conCatArr = rtn.Items.concat(response.Items);
                                rtn.Items = conCatArr;
                                rtn.Meta = response.Meta;
                            }));
                        }

                        $q.all(Calls).then(function() {
                            uberQ.resolve(rtn);
                        });

                        return uberQ.promise;



                    }
                },
                FullSpecList: function(FullOrderCloud) {
                    // Negate any slected specs
                    return FullOrderCloud.Specs.List(null, 1, 100, null, null);
                },
                SpecGroups: function(option_list) {
                    var groups = option_list.spec_groups;
                    return groups;
                }
            }
        });
}


function CategoriesController($state, $stateParams, option_list, $ocMedia, OrderCloud, OrderCloudParameters, CategoryList, TrackSearch, Parameters, $timeout, clientsecret, $q, toastr, $http, $rootScope, Buyer, FullOrderCloud, FullProductService, ResourceService, ProductGroups) {
    "use strict";
    var vm = this;
    vm.list = CategoryList;
    vm.parameters = Parameters;
    vm.sortSelection = Parameters.sortBy ? (Parameters.sortBy.indexOf('!') === 0 ? Parameters.sortBy.split('!')[1] : Parameters.sortBy) : null;
    vm.selectedBuyer = Buyer;
    vm.options = option_list;

    vm.list.Items.forEach(function(Item) {
        Item.ProductCount = 0;
        Item.SpecCount = 0;

        OrderCloud.Products.List(null, 1, 1, null, null, { 'catalogID': $stateParams.buyerid, "categoryid": Item.ID }).then(function(_data) {
            Item.ProductCount = _data.Meta.TotalCount;
        });

        try {
            Item.SpecCount = Item.xp.specAssignments.length;

            if (Item.SpecCount == undefined) {
                Item.SpecCount = 0;
            }
        } catch (e) {

        }
    })


    //Check if filters are applied
    vm.filtersApplied = vm.parameters.filters || vm.parameters.from || vm.parameters.to || ($ocMedia('max-width:767px') && vm.sortSelection); //Sort by is a filter on mobile devices
    vm.showFilters = vm.filtersApplied;

    //Check if search was used
    vm.searchResults = Parameters.search && Parameters.search.length > 0;
    //
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


    vm.runTemplate = function(cat) {
        $rootScope.$emit('$stateChangeStart', $state);
        $http({
            method: 'POST',
            url: 'https://pim-report.azurewebsites.net/CategoryReportv2?secret=' + clientsecret + '&BuyerID=' + vm.selectedBuyer.ID + '&CategoryID=' + cat.ID + '&vnext=true',

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

    vm.runTemplateOld = function(cat) {
        $rootScope.$emit('$stateChangeStart', $state);

        var report = angular.copy(cat);
        report.BuyerID = vm.selectedBuyer.ID;
        report.Products = [];

        var productQueue = [];
        var productIDList = [];

        report.xp.specAssignments = report.xp.specAssignments.Items;
        FullOrderCloud.Categories.ListProductAssignments(report.ID, null, 1, 100, report.BuyerID).then(function(response) {
            productIDList = response.Items;

            angular.forEach(productIDList, function(product) {
                productQueue.push((function() {
                    var df = $q.defer();
                    FullProductService.Get(product.ProductID, report.xp.specAssignments).then(function(response) {
                        response.ID = response.ID.replace(/_/g, '/');
                        response.Name = response.Name.replace(/_/g, '/');
                        angular.forEach(response.Specs, function(spec) {
                            df.resolve();
                        });
                        report.Products.push(response);
                    });
                    return df.promise;
                })());
            });

            for (let xpItem of report.xp.specAssignments) {
                if (xpItem.ID === "_blank")
                    xpItem.Name = "";
            }

            $q.all(productQueue).then(function() {
                $http({
                    method: 'POST',
                    url: 'https://harrisxlsgen.azurewebsites.net/xlsgen',
                    data: report,
                    headers: { client: clientsecret }
                }).then(function successCallback(response) {
                    toastr.success('Distribution Template Ordered', 'Success');
                    $rootScope.$emit('$stateChangeSuccess', $state);

                    window.open(response.data.url);
                }, function errorCallback(response) {
                    toastr.error('Distribution Template Order Failure', 'Error');
                    $rootScope.$emit('$stateChangeSuccess', $state);
                });
            });
        });
    };
}

function CategoryEditController($exceptionHandler, $state, OrderCloud, SelectedCategory, toastr, Buyer, option_list) {
    "use strict";
    var vm = this,
        categoryID = SelectedCategory.ID;
    vm.categoryName = SelectedCategory.Name;
    vm.category = SelectedCategory;
    vm.selectedBuyer = Buyer;
    vm.options = option_list;
    vm.Submit = function(redirect) {
        OrderCloud.Categories.Update(categoryID, vm.category, vm.selectedBuyer.DefaultCatalogID ? vm.selectedBuyer.DefaultCatalogID : null)
            .then(function() {
                if (redirect) {
                    $state.go('templates', {}, { reload: true });
                }
                toastr.success('Distribution Template Updated', 'Success');
            })
            .catch(function(ex) {
                $exceptionHandler(ex);
            });
    };

    vm.Delete = function() {
        if (confirm("Are you sure you want to delete this distribution template?")) {
            OrderCloud.Categories.Delete(SelectedCategory.ID, vm.selectedBuyer.DefaultCatalogID ? vm.selectedBuyer.DefaultCatalogID : null)
                .then(function() {
                    $state.go('templates', {}, { reload: true });
                    toastr.success('Distribution Template Deleted', 'Success');
                })
                .catch(function(ex) {
                    $exceptionHandler(ex);
                });
        }
    };
}

function CategoryCreateController($exceptionHandler, $state, OrderCloud, toastr, Buyer, option_list) {
    "use strict";
    var vm = this;
    vm.selectedBuyer = Buyer;
    vm.category = {};
    vm.options = option_list;
    vm.category.xp = { "specAssignments": { "Items": [] } };
    vm.Submit = function(redirect) {
        if (vm.category.ParentID === '') {
            vm.category.ParentID = null;
        }
        OrderCloud.Categories.Create(vm.category, vm.selectedBuyer.DefaultCatalogID ? vm.selectedBuyer.DefaultCatalogID : null)
            .then(function(data) {
                if (redirect) {
                    $state.go('templates', {}, { reload: true });
                } else {
                    $state.go('templates.edit', { categoryid: data.ID }, { reload: true });
                }
                toastr.success('Distribution Template Created', 'Success');
            })
            .catch(function(ex) {
                $exceptionHandler(ex);
            });
    };
}

function CategoryCloneController($exceptionHandler, $state, OrderCloud, FullOrderCloud, SelectedCategory, toastr, Buyer) {
    "use strict";
    var vm = this,
        categoryID = SelectedCategory.ID;
    vm.categoryName = SelectedCategory.Name;
    vm.category = SelectedCategory;
    vm.category.ID = '';
    vm.selectedBuyer = Buyer;

    vm.Submit = function(redirect) {
        if (vm.category.ParentID === '') {
            vm.category.ParentID = null;
        }
        OrderCloud.Categories.Create(vm.category, vm.selectedBuyer.DefaultCatalogID ? vm.selectedBuyer.DefaultCatalogID : null)
            .then(function(data) {
                FullOrderCloud.Products.List(null, 1, 100, null, null, { 'catalogID': Buyer.ID, "categoryid": categoryID }).then(function(_data) {
                    _data.Items.forEach(function(itm) {
                        return OrderCloud.Categories.SaveProductAssignment({
                            CategoryID: data.ID,
                            ProductID: itm.ID
                        }, Buyer.DefaultCatalogID)
                    });
                    if (redirect) {
                        $state.go('templates', {}, { reload: true });
                    } else {
                        $state.go('templates.edit', { categoryid: data.ID }, { reload: true });
                    }
                    toastr.success('Distribution Template Created', 'Success');
                });

            })
            .catch(function(ex) {
                $exceptionHandler(ex);
            });
    };
}

function CategoryAssignProductController($scope, option_list, $stateParams, $uibModal, OrderCloud, $q, FullOrderCloud, Assignments, BuyerAssignments, Paging, ProductList, ProductAssignments, SelectedCategory, toastr, ProductBuyerAssignments, Helpers, $timeout, ProductGroups, Buyer) {
    "use strict";
    var vm = this;
    vm.application = $scope.application;
    vm.Category = SelectedCategory;
    vm.buyer = Buyer;
    vm.productGroups = ProductGroups;
    vm.buyerAssignments = ProductBuyerAssignments;
    vm.prodAssignments = ProductAssignments;
    vm.list = ProductList;
    vm.LeftPagingFunction = LeftPagingFunction;
    vm.RightPagingFunction = RightPagingFunction;
    vm.AssignArray = [];
    vm.TotalCount = ProductList.Meta.TotalCount;
    ProductAssignments.Items.forEach(function(itm) {
        vm.AssignArray.push(itm.ID);
    })

    vm.options = option_list;
    var searching;

    vm.toggleListFilter = function() {
        vm.listFilter = !vm.listFilter;
        vm.research();
    };

    vm.toggleAssignFilter = function() {
        vm.assignedFilter = !vm.assignedFilter;
        vm.research();
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

        var xpSearch = false;
        var keywords = vm.searchFilter;
        var searchby = vm.searchby;

        if (vm.searchby) {
            if (vm.searchby.toString().includes("xp.")) {
                xpSearch = true;
                vm.paramObject[vm.searchby] = "*" + vm.searchFilter + "*"; // "*" Fuzzy Search
            }
        }

        if (xpSearch) {
            keywords = null;
            searchby = null;
        }


        if (searching) $timeout.cancel(searching);
        searching = $timeout(function() {


            if (vm.listFilter) {
                vm.paramObject.catalogID = $stateParams.buyerid;
                vm.list.Items = [];
                OrderCloud.Products.List(keywords, 1, 100, searchby, null, vm.paramObject).then(function(_data) {
                    _data.Items.forEach(function(itm) {
                        if (!vm.AssignArray.includes(itm.ID)) {
                            vm.list.Items.push(itm);
                        }
                    });

                    vm.list.Meta.TotalCount = _data.Meta.TotalCount;
                    for (var i = 1, len = _data.Meta.TotalPages; i < len; i++) {

                        if (vm.list.Items.length < 100 && _data.Meta.TotalCount > 0) {

                            try {
                                delete vm.paramObject.catalogID;
                            } catch (e) {}
                            OrderCloud.Products.List(keywords, i + 1, 100, searchby, null, vm.paramObject).then(function(_datab) {
                                _datab.Items.forEach(function(itm) {
                                    if (!vm.AssignArray.includes(itm.ID) && vm.list.Items.length < 100) {
                                        vm.list.Items.push(itm);
                                    }
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
                var parms = angular.copy(vm.paramObject)
                parms.catalogID = $stateParams.buyerid;
                parms.categoryid = $stateParams.categoryid;
                vm.prodAssignments.Items = [];

                console.log(vm.paramObject)
                FullOrderCloud.Products.List(null, 1, 100, null, searchby, parms).then(function(_data) {
                    vm.prodAssignments.Meta = _data.Meta;
                    _data.Items.forEach(function(itm) {
                        vm.prodAssignments.Items.push(itm);
                    });
                });
            } else {
                FullOrderCloud.Products.List(null, 1, 100, null, searchby, { 'catalogID': $stateParams.buyerid, "categoryid": $stateParams.categoryid }).then(function(data) {

                    vm.prodAssignments = data;
                    vm.list.Meta.TotalCount = vm.list.Meta.TotalCount + vm.prodAssignments.Items.length;

                });
            }


        }, 300);
    };

    $scope.$on('prod-bag.drop-model', function(e, elScope, target, source) {
        if (angular.element(source).attr('id') === 'right-drag-col') {
            DeleteFunc(elScope.ID);
        } else {
            SaveFunc(elScope.ID);
        }
    });
    vm.model = {
        CategoryID: SelectedCategory.ID,
        ProductID: "",
    };
    vm.selectAll = function() {
        $uibModal.open({
            animation: true,
            templateUrl: 'categories/templates/select.modal.tpl.html',
            controller: 'SelectDialogCategoriesCtrl',
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
            templateUrl: 'categories/templates/deselect.modal.tpl.html',
            controller: 'DeselectDialogCategoriesCtrl',
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

    vm.pushOver = function(pd) {
        var _Index = 0;
        angular.forEach(vm.list.Items, function(prod, index) {
            if (prod.ID === pd.ID) {
                _Index = index;
            }
        });
        vm.list.Items.splice(_Index, 1);
        vm.prodAssignments.Items.push(pd);
        vm.prodAssignments.Meta.TotalCount++;
        vm.list.Meta.TotalCount--;
        vm.TotalCount--;
        SaveFunc(pd.ID);
    };

    vm.pushBack = function(pd) {
        var _Index = 0;
        angular.forEach(vm.prodAssignments.Items, function(prod, index) {
            if (prod.ID === pd.ID) {
                _Index = index;
            }
        });
        vm.prodAssignments.Items.splice(_Index, 1);
        vm.list.Items.push(pd);

        vm.prodAssignments.Meta.TotalCount--;
        //vm.list.Meta.TotalCount++;
        vm.TotalCount++;
        DeleteFunc(pd.ID);
    };

    function SaveFunc(ItemID) {
        return OrderCloud.Categories.SaveProductAssignment({
            CategoryID: vm.Category.ID,
            ProductID: ItemID
        }, Buyer.DefaultCatalogID).then(function() {
            toastr.success('Assignment Updated', 'Success');
        });
    }

    function DeleteFunc(ItemID) {
        return OrderCloud.Categories.DeleteProductAssignment(vm.Category.ID, ItemID, Buyer.DefaultCatalogID).then(function() {
            toastr.success('Assignment Removed', 'Success');
        });
    }

    function LeftPagingFunction() {
        var paramObject = {};

        if (vm.statusFilter && vm.statusFilter !== '') {
            paramObject["xp.Status"] = vm.statusFilter;
        }
        if (vm.groupFilter && vm.groupFilter !== '') {
            if (vm.groupFilter.toString().includes("MASTER_")) {
                paramObject["xp.Master-Group.Name"] = vm.groupFilter.replace('MASTER_', '');
            } else {
                paramObject["xp.Product-Group"] = vm.groupFilter;
            }
        }
        if (vm.brandFilter && vm.brandFilter !== '') {
            paramObject["xp.Brand-Name"] = vm.brandFilter;
        }
        paramObject.catalogID = $stateParams.buyerid;

        if (vm.list.Items.length < vm.list.Meta.TotalCount - vm.prodAssignments.Items.length) {
            return Paging.filteredPaging(vm.list, 'Products', vm.searchFilter, paramObject, vm.prodAssignments);




        }
    }

    function RightPagingFunction() {
        var paramObject = {};

        if (vm.statusFilter && vm.statusFilter !== '') {
            paramObject["xp.Status"] = vm.statusFilter;
        }

        if (vm.groupFilter && vm.groupFilter !== '') {
            if (vm.groupFilter.toString().includes("MASTER_")) {
                paramObject["xp.Master-Group.Name"] = vm.groupFilter.replace('MASTER_', '');
            } else {
                paramObject["xp.Product-Group"] = vm.groupFilter;
            }
        }

        if (vm.brandFilter && vm.brandFilter !== '') {
            paramObject["xp.Brand-Name"] = vm.brandFilter;
        }
        paramObject.catalogID = $stateParams.buyerid;
        paramObject.categoryid = $stateParams.categoryid;

        return Paging.filteredPaging(vm.prodAssignments, 'Products', vm.searchFilter, paramObject);
    }
}

function SelectDialogController($scope, $uibModalInstance, Audit, $i18next, toastr, $stateParams, Scope) {
    'use strict';
    var vm = this;
    vm.scope = Scope;
    vm.all = function() {

        toastr.success("Processing Requests. Please wait.");
        Scope.application.apiAgentService.assignAllProductsToCategory(Scope.buyer.ID, Scope.Category.ID, { catalogID: Scope.buyer.ID });

        angular.forEach(Scope.list.Items, function(product) {
            Audit.log($i18next.t("Distribution Product Assignment"), product.Name + " > " + Scope.buyer.Name, [{ "Type": "Channel", "TargetID": Scope.buyer.ID, "NewState": product.ID }], 'CREATE');
        });
        Scope.prodAssignments.Meta = Scope.list.Data;
        Scope.prodAssignments.Items.unshift.apply(Scope.prodAssignments.Items, Scope.list.Items);
        Scope.list.Items = [];
        $uibModalInstance.close();
    };

    vm.visible = function() {
        Scope.paramObject.categoryid = Scope.buyer.ID;
        Scope.paramObject.catalogID = Scope.buyer.ID;
        Scope.application.apiAgentService.assignAllProductsToCategory(Scope.buyer.ID, Scope.Category.ID, Scope.paramObject, Scope.searchFilter);
        Scope.prodAssignments.Items.unshift.apply(Scope.prodAssignments.Items, Scope.list.Items);
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
        Scope.application.apiAgentService.unassignProductsFromCategory(Scope.buyer.ID, Scope.Category.ID);

        angular.forEach(Scope.list.Items, function(product) {
            Audit.log($i18next.t("Channel Product Assignment"), product.Name + " > " + Scope.buyer.Name, [{ "Type": "Channel", "TargetID": Scope.buyer.ID, "NewState": product.ID }], 'DELETE');
        });

        Scope.list.Items.unshift.apply(Scope.list.Items, Scope.prodAssignments.Items);
        Scope.prodAssignments.Items = [];
        Scope.list.Meta.ItemRange[1] = Scope.list.Items.length;
        Scope.TotalCount = Scope.list.Items.length;
        Scope.prodAssignments.Meta.ItemRange[1] = 0;
        Scope.prodAssignments.Meta.TotalCount = 0
        $uibModalInstance.close();
    };

    vm.cancel = function() {
        $uibModalInstance.close();
    };
}

function SelectSpecDialogController($scope, $uibModalInstance, Audit, $i18next, toastr, Scope) {
    'use strict';
    var vm = this;
    vm.scope = Scope;

    vm.list = angular.copy(Scope.list.Items);
    if (Scope.groupFilter != undefined && Scope.listFilter) {
        vm.list = vm.list.filter(function(itm) {
            return (itm.xp.Group == Scope.groupFilter);
        });
    }

    if (Scope.searchFilter != undefined && Scope.listFilter) {
        vm.list = vm.list.filter(function(itm) {
            return (itm.Name.toLowerCase().includes(Scope.searchFilter.toLowerCase()));
        });
    }

    vm.all = function() {
        toastr.success("Processing Requests. Please wait.");
        Scope.assignments.Items.unshift.apply(Scope.assignments.Items, Scope.list.Items);
        Scope.list.Items = [];
        Scope.save();
        $uibModalInstance.close();
    };




    vm.visible = function() {
        toastr.success("Processing Requests. Please wait.");

        Scope.assignments.Items.unshift.apply(Scope.assignments.Items, vm.list);
        for (var i = Scope.list.Items.length - 1; i >= 0; i--) {
            try {
                vm.list.forEach(function(itm) {
                    if (itm.ID == Scope.list.Items[i].ID) {
                        Scope.list.Items.splice(i, 1);
                        Scope.list.Meta.TotalCount--;
                    }
                });
            } catch (e) {}
        }
        Scope.save();
        $uibModalInstance.close();
    };

    vm.cancel = function() {
        $uibModalInstance.close();
    };
}

function DeselectSpecDialogController($scope, $uibModalInstance, Audit, $i18next, toastr, Scope) {
    'use strict';
    var vm = this;
    vm.all = function() {
        toastr.success("Processing Requests. Please wait.");
        Scope.list.Items.unshift.apply(Scope.list.Items, Scope.assignments.Items);
        Scope.assignments.Items = [];
        Scope.save();
        $uibModalInstance.close();
    };

    vm.cancel = function() {
        $uibModalInstance.close();
    };
}

function CategoryAdHocController($scope, $stateParams, Helpers, option_list, OrderCloud, Assignments, Paging, ProductList, SelectedCategory, toastr, ProductBuyerAssignments, $timeout, clientsecret, $uibModal, CategoryList, Buyer, $rootScope, $state, $q, FullProductService, $http, ResourceService, ProductGroups) {
    "use strict";
    var vm = this;
    vm.Category = SelectedCategory;
    vm.buyer = Buyer;
    vm.productGroupOptions = CategoryList;
    vm.buyerAssignments = ProductBuyerAssignments;
    vm.assignments = { "Meta": { "Page": 1, "PageSize": 20, "TotalCount": 0, "TotalPages": 0, "ItemRange": [1, 0] }, "Items": [] }; //empty object
    vm.copyPasteSaveAssignments = CopyPasteSaveAssignment;
    vm.pagingfunction = PagingFunction;
    vm.list = ProductList;
    vm.options = option_list;
    vm.animationsEnabled = true;

    vm.selectAll = false;
    vm.toggleSelectAll = function() {
        angular.forEach(vm.list.Items, function(item) {
            item.selected = vm.selectAll;
            vm.toggleCheck(item);
        });
    };

    vm.openModal = function() {
        var modalInstance = $uibModal.open({
            animation: vm.animationsEnabled,
            backdrop: 'static',
            templateUrl: 'copyPasteModal.html',
            controller: 'CopyPasteModalCtrl',
            controllerAs: 'copyPasteModal',
            resolve: {
                scope: function() {
                    return $scope;
                }
            }
        });
    };

    $scope.$watchCollection(function() {
        return vm.list;
    }, function() {
        Paging.setSelected(vm.list.Items, vm.assignments.Items, 'ProductID');
    });

    vm.reviseList = function() {

        var newList = [];

        angular.forEach(vm.list.Items, function(item) {
            angular.forEach(ProductBuyerAssignments.Items, function(assignment) {
                if (item.ID === assignment.ProductID) {
                    newList.push(item);
                }
            });
        });
        // vm.list.Items = newList;
    };

    var searching;

    vm.paramObject = {};
    vm.research = function() {
        vm.paramObject = {};

        if (vm.statusFilter && vm.statusFilter !== '') {
            vm.paramObject["xp.Status"] = vm.statusFilter;
        }
        if (vm.groupFilter && vm.groupFilter !== '') {
            vm.paramObject["xp.Product-Group"] = vm.groupFilter;
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

        vm.paramObject['catalogID'] = $stateParams.buyerid;
        //vm.paramObject['categoryid'] = $stateParams.categoryid;

        searching = $timeout(function() {
            OrderCloud.Products.List(keywords, null, 100, searchby, null, vm.paramObject)
                .then(function(data) {
                    vm.list = data;
                    vm.reviseList();
                });
        }, 100);
    };

    //vm.reviseList();

    function CopyPasteSaveAssignment(pastedList) {
        toastr.success('Products Selected', 'Success');
        angular.forEach(pastedList, function(itemID) {
            var finder = false;
            angular.forEach(vm.assignments.Items, function(assignment) {
                if (assignment.ProductID === itemID)
                    finder = true;
                return;
            });
            if (!finder) {
                var tempObj = {
                    CategoryID: vm.Category,
                    ListOrder: null,
                    ProductID: itemID
                };
                vm.assignments.Items.push(tempObj);
            }
            angular.forEach(vm.list.Items, function(listitem) {
                if (listitem.ID === itemID) {
                    listitem.selected = true;
                }
            });
        });

    }

    vm.toggleCheck = function(product) {
        if (product.selected) {
            var tempObj = {
                CategoryID: vm.Category,
                ListOrder: null,
                ProductID: product.ID
            };
            vm.assignments.Items.push(tempObj);
        } else {
            angular.forEach(vm.assignments.Items, function(item, index) {
                if (item.ProductID === product.ID) {
                    vm.assignments.Items.splice(index, 1);
                }
            });
        }
    };

    function AssignmentFunc() {
        return OrderCloud.Categories.ListProductAssignments(vm.Category.ID, null, null, vm.assignments.Meta.PageSize, Buyer.DefaultCatalogID);
    }

    function PagingFunction() {
        return Paging.paging(vm.list, 'Products', vm.assignments, AssignmentFunc);
    }

    vm.runTemplate = function() {
        $rootScope.$emit('$stateChangeStart', $state);

        var report = angular.copy(vm.Category);
        report.BuyerID = vm.buyer.ID;
        report.Products = [];

        var productQueue = [];

        try {

            var productIDList = angular.copy(vm.assignments.Items);

            angular.forEach(productIDList, function(product) {
                productQueue.push((function() {
                    var df = $q.defer();
                    FullProductService.Get(product.ProductID, report.xp.specAssignments.Items).then(function(response) {
                        response.ID = response.ID.replace(/_/g, '/');
                        response.Name = response.Name.replace(/_/g, '/');
                        angular.forEach(response.Specs, function(spec) {
                            df.resolve();
                        });
                        report.Products.push(response);
                    });
                    return df.promise;
                })());
            });
            report.xp.specAssignments = report.xp.specAssignments.Items;
            $q.all(productQueue).then(function() {
                $http({
                    method: 'POST',
                    url: 'https://harrisxlsgen.azurewebsites.net/xlsgen',
                    data: report,
                    headers: { client: clientsecret }
                }).then(function successCallback(response) {
                    toastr.success('Distribution Template Ordered', 'Success');
                    $rootScope.$emit('$stateChangeSuccess', $state);

                    window.open(response.data.url);
                }, function errorCallback(response) {
                    toastr.error('Distribution Template Order Failure', 'Error');
                    $rootScope.$emit('$stateChangeSuccess', $state);
                });
            });
        } catch (e) {
            toastr.error('Distribution Template Order Failure, Missing Attributes', 'Error');
            $rootScope.$emit('$stateChangeSuccess', $state);
        }

    };

}

function CopyPasteModalCtrl($scope, $uibModalInstance, scope) {
    "use strict";
    var vm = this;

    vm.parseText = function() {
        vm.list = vm.source.split(/[\r\n\t]+/g);
    };

    vm.update = function() {
        scope.categoryAdHoc.copyPasteSaveAssignments(vm.list);
    };

    vm.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
}

function CategoryAssignSpecController($scope, toastr, OrderCloud, Paging, FullSpecList, AssignedSpecList, SelectedCategory, $rootScope, $http,
    $timeout, $state, Buyer, $q, Underscore, dragulaService, static_template_headers_map, Helpers, SpecGroups, $uibModal, clientsecret) {
    "use strict";
    // REFACTOR COMPLETE 3/31/17 AG

    let _self = this;
    var vNext = false;
    if (SelectedCategory.xp.specAssignments === undefined) {
        SelectedCategory.xp.specAssignments = { "Items": [] }
    }
    if (SelectedCategory.xp.specAssignments.Items === undefined) {
        vNext = true;
    }
    _self.assignments = SelectedCategory.xp.specAssignments;

    let blankObj = {
        "ID": "_blank",
        "Name": "Blank Column",
        "xp": {
            "Group": SpecGroups[0],
            "Base": true,
            "CustomLabels": {}
        }
    };

    let colLetter = function colName(n) {
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


    let SelectAll = function() {
        $uibModal.open({
            animation: true,
            templateUrl: 'categories/templates/select.spec.modal.tpl.html',
            controller: 'SelectSpecDialogCategoriesCtrl',
            controllerAs: 'select',
            size: 'sm',
            resolve: {
                Scope: function() {
                    return _self;
                }
            },
        }).result.then(function() {
            angular.noop();
        }, function() {
            angular.noop();
        });
    }

    let DeselectAll = function() {
        $uibModal.open({
            animation: true,
            templateUrl: 'categories/templates/deselect.spec.modal.tpl.html',
            controller: 'DeselectSpecDialogCategoriesCtrl',
            controllerAs: 'select',
            size: 'sm',
            resolve: {
                Scope: function() {
                    return _self;
                }
            },
        }).result.then(function() {
            angular.noop();
        }, function() {
            angular.noop();
        });
    };


    let SelectAllas = function() {
        if (confirm('Are you sure you want to assign all of the displayed Product Attributes?')) {
            _self.assignments.Items.unshift.apply(_self.assignments.Items, FullSpecList.Items);
            FullSpecList.Items = [];
            SaveAssignment();
        }
    };
    let DeselectAllas = function() {
        if (confirm('Are you sure you want to unassign all of the displayed products?')) {
            FullSpecList.Items.unshift.apply(FullSpecList.Items, _self.assignments.Items);
            _self.assignments.Items = [];
            SaveAssignment();
        }
    };

    let ids = "";

    if (!vNext) {
        ids = Helpers.getFilterKeys(SelectedCategory.xp.specAssignments, false, 'ID', '^');
        ids = "|" + ids;
    } else {

        var array = [];
        for (var i in SelectedCategory.xp.specAssignments) {
            array.push(SelectedCategory.xp.specAssignments[i][0]);
        }

        var re = new RegExp(',', 'g');
        var keys = array.toString().replace(re, "|");
        ids = "|" + keys + "|";;
    }



    var idxToRemove = [];
    FullSpecList.Items.forEach(function(cat, idx) {
        if (ids.indexOf(cat.ID) !== -1) {
            idxToRemove.push(idx);
        }
    });

    idxToRemove.sort(function(a, b) {
        return b - a;
    });

    idxToRemove.forEach(function(idx) {
        FullSpecList.Items.splice(idx, 1);
    });

    FullSpecList.Meta.TotalCount = FullSpecList.Items.length;

    let ids2 = Helpers.getFilterKeys(FullSpecList, false, 'ID', '^');
    ids2 = "|" + ids2;
    console.log(ids2)
    if (ids2.indexOf('_blank') === -1) {
        FullSpecList.Items.unshift(blankObj);
        FullSpecList.Meta.TotalCount++;
    }




    let statics = new Map(static_template_headers_map);
    for (let [key, value] of statics) {
        let staticObj = {
            "ID": key,
            "Name": value,
            "xp": {
                "Group": SpecGroups[0],
                "Base": true
            }
        };
        if (ids.indexOf("|" + key + "|") > -1) {
            var hasStaticAdded = false;
            try {
                AssignedSpecList.Items.forEach(function(stat) {
                    if (stat.ID == key)
                        hasStaticAdded = true;
                });
            } catch (e) {}
            if (!hasStaticAdded)

                AssignedSpecList.Items.push(staticObj);
        } else {

            FullSpecList.Items.unshift(staticObj);
            FullSpecList.Meta.TotalCount++;
        }
    }



    // add Order In
    if (!vNext) {
        for (let xpItem of SelectedCategory.xp.specAssignments.Items) {
            for (let item of AssignedSpecList.Items) {
                if (xpItem[0] === item.ID) {
                    item.ListOrder = xpItem[1];
                }
            }
        }

        AssignedSpecList.Items.forEach(function(itm, idx) {
            if (itm.ID === "_blank") {
                AssignedSpecList.Items.splice(idx, 1);
            }
        });

        // Add Blanks
        for (let xpItem of SelectedCategory.xp.specAssignments.Items) {
            if (xpItem[0] === "_blank") {
                var blank = angular.copy(blankObj);
                blank.ListOrder = xpItem.ListOrder;
                //try { blank.Base.CustomLabels = xpItem.Base.CustomLabels; } catch (e) {}
                AssignedSpecList.Items.push(blank);
            }
        }
    } else {

        for (let xpItem of SelectedCategory.xp.specAssignments) {
            for (let item of AssignedSpecList.Items) {
                if (xpItem[0] === item.ID) {
                    item.ListOrder = xpItem[1];
                }
            }
        }

        AssignedSpecList.Items.forEach(function(itm, idx) {
            if (itm.ID === "_blank") {
                AssignedSpecList.Items.splice(idx, 1);
            }
        });

        // Add Blanks
        for (let xpItem of SelectedCategory.xp.specAssignments) {
            if (xpItem[0] === "_blank") {
                console.log(xpItem)
                var blank = angular.copy(blankObj);
                blank.ListOrder = xpItem[1];

                try {
                    blank.xp.CustomLabels[Buyer.ID] = {
                        "Name": Buyer.Name,
                        "Label": xpItem[3],
                        "ID": Buyer.ID
                    }

                } catch (e) {
                    console.log(e)

                }
                AssignedSpecList.Items.push(blank);
            }
        }
    }

    AssignedSpecList.Items = _.sortBy(AssignedSpecList.Items, function(o) { return o.ListOrder; });

    // PRIVATE METHODS
    let searching;

    let ToggleListFilter = () => _self.listFilter = !_self.listFilter;
    let ToggleAssignFilter = () => _self.assignedFilter = !_self.assignedFilter;


    let runTemplate = function() {
        $rootScope.$emit('$stateChangeStart', $state);
        $http({
            method: 'POST',
            url: 'https://pim-report.azurewebsites.net/CategoryReportv2?secret=' + clientsecret + '&BuyerID=' + Buyer.ID + '&CategoryID=' + _self.Category.ID + '&vnext=true',

        }).then(function successCallback(response) {
            toastr.success('Distribution Template Ordered', 'Success');
            $rootScope.$emit('$stateChangeSuccess', $state);
            downloadURI(response.data.url, response.data.url);
            //  window.open(response.data.url);
        }, function errorCallback() {
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
    let SaveAssignment = _.debounce(() => {
        // Clean the specs out before adding new ones
        SelectedCategory.xp.specAssignments = [];
        for (let [i, item] of _self.assignments.Items.entries()) {
            item.ListOrder = i + 1;
            delete item.xp.Description;
            delete item.xp.isMediaAttribute;
            delete item.xp.options;
            let spec = [item.ID, item.ListOrder];


            if (item.xp.Base) {
                spec.push(item.Name);



                if (item.xp["CustomLabels"]) {
                    if (item.xp.CustomLabels[Buyer.ID]) {
                        spec.push(item.xp.CustomLabels[Buyer.ID].Label);
                    }
                }


            }


            SelectedCategory.xp.specAssignments.push(spec);
        }

        OrderCloud.Categories.Update(_self.Category.ID, SelectedCategory, _self.buyer.DefaultCatalogID)
            .then(function() {
                toastr.success('Assignment Updated', 'Success');
            });

    }, 1000);

    let PushOver = (id) => {
        for (let [i, item] of _self.list.Items.entries()) {
            if (item.ID === id) {
                if (id !== '_blank') {
                    _self.list.Items.splice(i, 1);
                }
                _self.assignments.Items.push(item);
                SaveAssignment();
            }
        }
    };

    let PushBack = (id) => {

        var moved = false;
        for (let [i, item] of _self.assignments.Items.entries()) {

            if (item.ID === id && !moved) {
                moved = true;
                if (id !== "_blank") {
                    _self.list.Items.push(item);
                }
                _self.assignments.Items.splice(i, 1);
                SaveAssignment();

            }
        }
    };

    let Research = () => {

        if (_self.groupFilter === null) {
            _self.groupFilter = undefined;
        }

        if (searching) { $timeout.cancel(searching); }
        searching = $timeout(function() {
            if (_self.searchInput !== '') {
                _self.searchFilter = _self.searchInput;
            } else {
                _self.searchFilter = undefined;
            }
        }, 300);
    };

    let UpdateSpec = (spec) => {
        spec.editMode = false;
        if (!spec.xp["Base"]) {
            OrderCloud.Specs.Update(spec.ID, spec);
        }
        SaveAssignment();
    };

    let addCustomLabel = (spec) => {

        if (spec.xp.CustomLabels === undefined) {
            spec.xp.CustomLabels = {}
        }
        spec.xp.CustomLabels[Buyer.ID] = {
            "Name": Buyer.Name,
            "Label": "",
            "ID": Buyer.ID
        }
        spec.editMode = true;
    }

    let removeCustomLabel = (spec) => {
            var result = confirm("Remove Custom Label?");
            if (result) {
                spec.editMode = false;
                delete spec.xp.CustomLabels[Buyer.ID];
                if (!spec.xp["Base"]) {
                    OrderCloud.Specs.Update(spec.ID, spec);
                }
            }
            SaveAssignment();

        }
        // Setup drag service
    dragulaService.options($scope, 'spec-bag', {
        moves: (el, container, handle) => { return handle.id === 'handle'; }
    });

    $scope.$on('spec-bag.drop-model', () => SaveAssignment());

    // EXPORTS
    angular.extend(this, {
        specGroups: SpecGroups,
        save: SaveAssignment,
        buyer: Buyer,
        selectAll: SelectAll,
        deselectAll: DeselectAll,
        Category: SelectedCategory,
        list: FullSpecList,
        assignments: AssignedSpecList,
        toggleListFilter: ToggleListFilter,
        toggleAssignFilter: ToggleAssignFilter,
        pushOver: PushOver,
        pushBack: PushBack,
        research: Research,
        UpdateSpec: UpdateSpec,
        colLetter: colLetter,
        addCustomLabel: addCustomLabel,
        removeCustomLabel: removeCustomLabel,
        runTemplate: runTemplate
    });


}

angular.module('productManager').filter('intersection', function() {
    "use strict";
    return function(objArray1, objArray2, doTheThing) {
        if (!doTheThing) { return objArray1; } else if (doTheThing && !objArray2) {
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