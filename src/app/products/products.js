angular.module('productManager')
    .config(ProductsConfig)
    .controller('ProductsCtrl', ProductsController)
    .controller('ProductEditCtrl', ProductEditController)
    .controller('ProductCreateCtrl', ProductCreateController)
    .controller('ProductAssignmentsCtrl', ProductAssignmentsController)
    .controller('ProductCloneCtrl', ProductCloneController)
    .filter('TempFixRegulation', TempFixRegulation);

function ProductsConfig($stateProvider) {
    "use strict";
    $stateProvider
        .state('products', {
            parent: 'base',
            templateUrl: 'products/templates/products.tpl.html',
            controller: 'ProductsCtrl',
            controllerAs: 'products',
            url: '/products?from&to&search&page&pageSize&searchOn&sortBy&filters',
            data: {
                componentName: 'Products',
                OrderIndex: 1
            },
            resolve: {
                CategoryList: function(OrderCloud) {
                    return OrderCloud.Categories.List(null, null, 100, null, null, null, null, null).then(function(c) {
                        c.Items.sort(function(a, b) {

                            return a.Name.localeCompare(b.Name);
                        });
                        return c;
                    });
                },
                Parameters: function($stateParams, OrderCloudParameters) {
                    return OrderCloudParameters.Get($stateParams);
                },
                ProductList: function(OrderCloud, Parameters) {

                    console.log('--------------------------------------------------------')
                    return OrderCloud.Products.List(Parameters.search, Parameters.page, Parameters.pageSize || 50, Parameters.searchOn, Parameters.sortBy, Parameters.filters);
                },
                /*  ProductUpdate: function(OrderCloud, FullOrderCloud, Parameters) {

                    /*
                     return FullOrderCloud.Products.List(Parameters.search, Parameters.page, Parameters.pageSize || 50, Parameters.searchOn, Parameters.sortBy, Parameters.filters).then(
                         function(p){
                             p.Items.forEach(function(prod){
                                 if(prod.xp){
                                     if(prod.xp['Master-Group']){
                                       if (prod.xp['Product-Group'] && !prod.xp['Master-Group'].Name) {                        
                                             OrderCloud.Categories.Get(prod.xp['Product-Group'], 'product-groups').then(function(pGroup){
                                                 
                                                 OrderCloud.Products.Get(prod.ID).then(function(uProd){
                                                     if(pGroup.xp['Master-Group']){
                                                         uProd.xp['Master-Group'] = pGroup.xp['Master-Group'];
                                                         OrderCloud.Products.Update(uProd.ID, uProd);
                                                     }
                                                 })
                                             });
                                         } 
                                     }
                                 }
                             })
                     });
                 },*/
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
                }
            }
        })
        .state('products.edit', {
            url: '/:productid/',
            templateUrl: 'products/templates/productEdit.tpl.html',
            controller: 'ProductEditCtrl',
            controllerAs: 'productEdit',
            resolve: {
                SelectedProduct: function($stateParams, OrderCloud, FullOrderCloud) {
                    return OrderCloud.Products.Get($stateParams.productid);
                },
                FullProduct: function($stateParams, FullProductService) {
                    return FullProductService.Get($stateParams.productid);
                },
                SpecAssignments: function($stateParams, FullOrderCloud) {
                    return FullOrderCloud.Specs.ListProductAssignments(null, $stateParams.productid);
                },
                MasterProductGroupXP: function(OrderCloud, SelectedProduct, ProductGroup) {
                    if (ProductGroup.xp != null && ProductGroup.xp['Master-Group'] !== undefined) {
                        SelectedProduct.xp['Master-Group'] = ProductGroup.xp['Master-Group'];
                        return OrderCloud.Categories.Get(ProductGroup.xp['Master-Group'].ID, 'master-product-groups')
                    } else {

                        return {};
                    }
                },
                ProductGroup: function(OrderCloud, SelectedProduct) {
                    if (SelectedProduct.xp['Product-Group']) {
                        return OrderCloud.Categories.Get(SelectedProduct.xp['Product-Group'], 'product-groups');
                    } else {
                        return OrderCloud.Categories.Get("unspecified", 'product-groups');
                    }

                },
                Categories: function(FullOrderCloud) {
                    return FullOrderCloud.Categories.List(null, null, 100, null, null, null, null, null).then(function(c) {
                        c.Items.sort(function(a, b) {
                            return a.Name.localeCompare(b.Name);
                        });
                        return c;
                    });
                },
                CategoryList: function(OrderCloud, Categories) {
                    var c = {};
                    angular.forEach(Categories.Items, function(i) {
                        c[i.ID] = {
                            'ID': i.ID,
                            'Name': i.Name
                        };
                    });
                    return c;
                }
            }
        })
        .state('products.create', {
            url: '/create',
            templateUrl: 'products/templates/productCreate.tpl.html',
            controller: 'ProductCreateCtrl',
            controllerAs: 'productCreate',
            resolve: {
                CategoryList: function(FullOrderCloud) {
                    return FullOrderCloud.Categories.List(null, null, 100, null, null, null, null, null);
                }
            }
        })
        .state('products.assignments', {
            templateUrl: 'products/templates/productAssignments.tpl.html',
            controller: 'ProductAssignmentsCtrl',
            controllerAs: 'productAssignments',
            url: '/:productid/assignments',
            resolve: {
                Parameters: function($stateParams, OrderCloudParameters) {
                    return OrderCloudParameters.Get($stateParams);
                },
                SelectedProduct: function($stateParams, OrderCloud) {
                    return OrderCloud.Products.Get($stateParams.productid);
                },
                Assignments: function($stateParams, OrderCloud, Parameters, $http, $q) {
                    var df = $q.defer();

                    $http({
                            method: 'GET',
                            url: 'https://api.ordercloud.io/v1/catalogs/productassignments?productid=' + $stateParams.productid,
                            headers: {
                                'Content-Type': 'application/json; charset=utf-8',
                                "Authorization": "Bearer " + OrderCloud.Auth.ReadToken()
                            }
                        }).success(function(data, status, headers, config) {

                            df.resolve(data);
                        })
                        .error(function(data, status, header, config) {
                            toastr.warning(data.Errors[0].Message);
                        });
                    return df.promise;
                    //return OrderCloud.Products.ListAssignments($stateParams.productid, Parameters.userID, Parameters.userGroupID, Parameters.level, Parameters.priceScheduleID, Parameters.page, 100);
                },
                BuyerList: function(OrderCloud, Parameters) {
                    return OrderCloud.Buyers.List(Parameters.search, null, 100 /*, Parameters.searchOn, Parameters.sortBy, Parameters.filters*/ );
                    //Commenting out params that don't exist yet in the API
                }
            }
        })
        .state('products.clone', {
            url: '/:productid/clone',
            templateUrl: 'products/templates/productClone.tpl.html',
            controller: 'ProductCloneCtrl',
            controllerAs: 'productClone',
            resolve: {
                SelectedProduct: function($stateParams, OrderCloud) {
                    return OrderCloud.Products.Get($stateParams.productid);
                },
                FullProduct: function($stateParams, FullProductService) {
                    return FullProductService.Get($stateParams.productid);
                },
                SpecAssignments: function($stateParams, FullOrderCloud) {
                    return FullOrderCloud.Specs.ListProductAssignments(null, $stateParams.productid);
                },
                Categories: function(FullOrderCloud) {
                    return FullOrderCloud.Categories.List(null, null, 100, null, null, null, null, null);
                },
                CategoryList: function(OrderCloud, Categories) {
                    var c = {};
                    angular.forEach(Categories.Items, function(i) {
                        c[i.ID] = {
                            'ID': i.ID,
                            'Name': i.Name
                        };
                    });
                    return c;
                }
            }
        });
}

function ProductsController($state, $ocMedia, erp_as_product_name, OrderCloud, OrderCloudParameters, ProductList, Parameters, $timeout, TrackSearch, CategoryList, ProductGroups, option_list) {
    "use strict";
    var vm = this;
    vm.erp_as_product_name = erp_as_product_name;
    vm.list = ProductList;
    vm.parameters = Parameters;
    vm.productGroups = ProductGroups;
    vm.sortSelection = Parameters.sortBy ? (Parameters.sortBy.indexOf('!') === 0 ? Parameters.sortBy.split('!')[1] : Parameters.sortBy) : null;
    vm.options = option_list;
    vm.pageSize = 50;
    vm.searchFilter = null;
    vm.research = function() {
        var xpSearch = false;
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
        if (vm.searchby == '') {
            vm.searchby = null;
        }
        if (vm.searchby) {
            if (vm.searchby.toString().includes("xp.")) {
                xpSearch = true;
                if (vm.searchFilter != '' && vm.searchFilter != undefined)
                    paramObject[vm.searchby] = "*" + vm.searchFilter + "*"; // "*" Fuzzy Search
            }
        }
        if (xpSearch) {
            OrderCloud.Products.List(null, null, Parameters.pageSize || 50, null, null, paramObject)
                .then(function(data) {
                    vm.list = data;
                });
        } else {
            OrderCloud.Products.List(vm.searchFilter, null, Parameters.pageSize || 50, vm.searchby, null, paramObject)
                .then(function(data) {
                    vm.list = data;
                });
        }
        vm.parameters = paramObject;
    };

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
        vm.parameters.searchby = null;
        vm.parameters.search = null;
        vm.parameters.searchFilter = null;
        vm.parameters.searchOn = null;
        vm.parameters.sortBy = null;

        $ocMedia('max-width:767px') ? vm.parameters.sortBy = null : angular.noop(); //Clear out sort by on mobile devices
        vm.filter(true);
    };

    vm.CustomListOrder = function(group) {
        var mapping = {
            'Marketing': 5,
            'Order/Shipping': 1,
            'Technical Specs': 2,
            'Exceptions': 3
        };
        return mapping[group.name];
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

    vm.updateSortStatic = function(value) {
        if (vm.sortByStatic != value) {
            vm.sortByStatic = value;
            vm.list.Items = _.sortBy(vm.list.Items, function(itm) {
                return itm.xp[value];
            });
        } else {
            vm.sortByStatic = null;
            vm.list.Items = _.sortBy(vm.list.Items, function(itm) {
                return itm.xp[value];
            });
            vm.list.Items.reverse();
        }
    };

    vm.updateSortByProducGroup = function(value) {
        if (vm.sortByStatic != value) {
            vm.sortByStatic = value;
            vm.list.Items = _.sortBy(vm.list.Items, function(itm) {
                return vm.productGroups[itm.xp['Product-Group']].Name;
            });
        } else {
            vm.sortByStatic = null;
            vm.list.Items = _.sortBy(vm.list.Items, function(itm) {
                return vm.productGroups[itm.xp['Product-Group']].Name;
            });
            vm.list.Items.reverse();
        }
    };

    //Used on mobile devices
    vm.reverseSort = function() {
        Parameters.sortBy.indexOf('!') === 0 ? vm.parameters.sortBy = Parameters.sortBy.split('!')[1] : vm.parameters.sortBy = '!' + Parameters.sortBy;
        vm.filter(false);
    };

    //Reload the state with the incremented page parameter
    vm.pageChanged = function() {
        console.log(vm.searchFilter)
        console.log(vm.list.Meta.Page)
        console.log(vm.pageSize)
        console.log(vm.parameters.searchOn)
        console.log(vm.parameters.sortBy)
        return OrderCloud.Products.List(vm.searchFilter, vm.list.Meta.Page, vm.pageSize, vm.parameters.searchOn, vm.parameters.sortBy, vm.parameters)
            .then(function(data) {
                vm.list.Items = data.Items;
                vm.list.Meta = data.Meta;
            });
    };

    //Load the next page of results with all of the same parameters
    vm.loadMore = function() {
        console.log(vm.parameters)
        return OrderCloud.Products.List(vm.searchFilter, vm.list.Meta.Page + 1, vm.pageSize || vm.list.Meta.PageSize, vm.parameters.searchOn, vm.parameters.sortBy, vm.parameters)
            .then(function(data) {
                vm.list.Items = data.Items;
                vm.list.Meta = data.Meta;
            });
    };

    vm.clearFilters();
}

function ProductEditController($http, $exceptionHandler, erp_as_product_name, protected_fields, MasterProductGroupXP, $timeout, $state, OrderCloud, SelectedProduct, toastr, FullProduct, CategoryList, clientsecret, SpecAssignments, $scope, $q, FullProductService, $rootScope, option_list, Audit) {
    "use strict";

    var vm = this,
        productid;
    console.log(protected_fields)
    vm.protected = protected_fields;
    vm.erp_as_product_name = erp_as_product_name;
    productid = angular.copy(SelectedProduct.ID);
    vm.productName = angular.copy(SelectedProduct.Name);
    vm.product = SelectedProduct;
    vm.fullProduct = FullProduct;
    vm.assignments = SpecAssignments;
    vm.multiSelects = {};
    vm.productGroupOptions = CategoryList;
    vm.specGroups = [];
    vm.missingSpecs = [];
    vm.options = option_list;

    try {
        vm.masterProductGroupXP = MasterProductGroupXP.xp.GroupProperties;

        if (vm.product.xp['Master-Product-Group-XP'] != undefined) {
            vm.masterProductGroupXP.unshift({
                Name: ""
            });
        }
    } catch (e) {}

    try {
        vm.currentProductGroup = vm.product.xp['Product-Group'].toString();
    } catch (e) {}


    if (vm.fullProduct.Specs) {
        angular.forEach(vm.fullProduct.Specs, function(spec) {
            var found = null;
            angular.forEach(vm.assignments.Items, function(a) {
                if (spec.ID === a.SpecID) {
                    spec.Assignment = a;

                    if (spec.xp.Multiselect) {
                        vm.multiSelects[spec.ID] = {};

                        try {
                            var tempList = spec.DefaultValue.split(", ");
                        } catch (e) {
                            var tempList = [];
                        }

                        angular.forEach(tempList, function(optionID) {
                            vm.multiSelects[spec.ID][optionID] = true;
                        });
                    }
                }
            });
            angular.forEach(vm.specGroups, function(g, i) {
                if (g.Name === spec.xp.Group) {
                    found = i;
                }
            });
            if (spec.xp && found === null) {
                var tempObj = {
                    "Name": spec.xp.Group,
                    "Specs": []
                };
                tempObj.Specs.push(spec);
                vm.specGroups.push(tempObj);
            } else if (spec.xp) {
                vm.specGroups[found].Specs.push(spec);
            }
        });
        vm.missingSpecs = [];
        angular.forEach(vm.specGroups, function(g) {
            angular.forEach(g.Specs, function(s) {
                if (s.Assignment !== undefined) {
                    if (s.Required) {
                        if (!s.Assignment.DefaultValue === undefined) {
                            vm.product.xp.productAttributesComplete = false;
                            vm.missingSpecs.push(s.Name);
                        } else if (s.Assignment.DefaultValue === "" && s.Assignment.DefaultOptionID === null) {
                            vm.missingSpecs.push(s.Name);
                            vm.product.xp.productAttributesComplete = false;
                        } else if (s.Assignment.DefaultValue === null && s.Assignment.DefaultOptionID === null) {
                            vm.missingSpecs.push(s.Name);
                            vm.product.xp.productAttributesComplete = false;
                        }
                    }

                }
            });
        });
    }

    vm.CustomListOrder = function(drp) {
        var mapping = {
            'MARKETING COPY ATTRIBUTES': 0,
            'ORDERING/SHIPPING ATTRIBUTES': 2,
            'TECHNICAL SPECIFICATION ATTRIBUTES': 1,
            'EXCEPTION ATTRIBUTES': 3,
            'RESOURCES': 4
        };
        return mapping[drp.Name];
    };

    if (vm.product.xp.Status === null)
        vm.product.xp.Status = "New";

    vm.updateMultiSelect = function(spec) {
        var tempValue = "";
        angular.forEach(vm.multiSelects[spec.ID], function(option, key) {
            if (option) {
                tempValue += key + ", ";
            }
        });
        angular.forEach(vm.specGroups, function(group) {
            angular.forEach(group.Specs, function(s) {
                if (s.ID === spec.ID) {
                    s.Assignment.DefaultValue = tempValue.substr(0, tempValue.length - 2);
                }
            });
        });
    };

    vm.Submit = function(redirect) {



        var auditTargets = [];
        auditTargets.push({
            "Type": "Product",
            "Name": vm.product.Name,
            "TargetID": productid
        });
        if (vm.product.xp.Status === 'Obsolete') {
            if (confirm('You have marked this product as obsolete. This will remove all assigned spec values. Continue?')) {
                OrderCloud.Products.Update(productid, vm.product)
                    .then(function() {
                        var q = [];
                        angular.forEach(vm.fullProduct.Specs, function(s) {
                            s.Assignment.DefaultValue = null;
                            s.Assignment.DefaultOptionID = null;
                            q.push(function() {
                                OrderCloud.Specs.SaveProductAssignment(s.Assignment);
                            }());
                            auditTargets.push({
                                "Type": "Product Attribute Assignment",
                                "TargetID": SpecID,
                                "PreviousState": s.ProductID
                            });
                        });
                        $q.all(q).then(function() {

                            if (redirect) {
                                $state.go('products', {}, {
                                    reload: true
                                });
                            }
                            Audit.log("Product", vm.product.Name, auditTargets, 'CREATE');

                            toastr.success('Product Updated', 'Success');
                        });
                    })
                    .catch(function(ex) {
                        $exceptionHandler(ex);
                    });
            }
        } else if (vm.product.xp.Status !== 'Obsolete') {
            vm.product.xp.productAttributesComplete = true;
            vm.missingSpecs = [];
            angular.forEach(vm.specGroups, function(g) {
                angular.forEach(g.Specs, function(s) {
                    if (s.Required) {
                        if (!s.Assignment.DefaultValue === undefined) {
                            vm.product.xp.productAttributesComplete = false;
                            vm.missingSpecs.push(s.Name);
                        } else if (s.Assignment.DefaultValue === "" && s.Assignment.DefaultOptionID === null) {
                            vm.product.xp.productAttributesComplete = false;
                            vm.missingSpecs.push(s.Name);
                        } else if (s.Assignment.DefaultValue === null && s.Assignment.DefaultOptionID === null) {
                            vm.product.xp.productAttributesComplete = false;
                            vm.missingSpecs.push(s.Name);
                        }
                    }


                });
            });

            OrderCloud.Products.Update(productid, vm.product)
                .then(function(data) {

                    if (vm.changedGroup) {
                        var q = [];
                        var uberQ = $q.defer();
                        angular.forEach(vm.assignments.Items, function(a) {
                            q.push(function() {
                                var df = $q.defer();
                                OrderCloud.Specs.DeleteProductAssignment(a.SpecID, a.ProductID).then(function() {
                                    df.resolve();
                                });
                                return df.promise;
                            }());
                        });
                        $q.all(q).then(function() {
                            uberQ.resolve();
                            var q2 = [];
                            angular.forEach(vm.specGroups, function(g) {
                                angular.forEach(g.Specs, function(s) {
                                    var body = s.Assignment;
                                    q2.push(function() {
                                        OrderCloud.Specs.SaveProductAssignment(body);
                                    }());
                                });
                            });
                            var body = {
                                "CategoryID": vm.product.xp['Product-Group'],
                                "ProductID": vm.product.ID,
                                "ListOrder": null
                            };
                            q2.push(function() {
                                OrderCloud.Categories.SaveProductAssignment(body);
                            }());
                            $q.all(q2).then(function() {
                                if (redirect) {
                                    $state.go('products', {}, {
                                        reload: true
                                    });
                                }
                                toastr.success('Product Updated', 'Success');
                            });
                        });
                        return uberQ.promise;
                    } else {
                        var q = [];
                        angular.forEach(vm.specGroups, function(g) {
                            angular.forEach(g.Specs, function(s) {
                                var body = s.Assignment;
                                q.push(function() {
                                    OrderCloud.Specs.SaveProductAssignment(body);
                                }());
                            });
                        });
                        $q.all(q).then(function() {
                            if (redirect) {
                                $state.go('products', {}, {
                                    reload: true
                                });
                            }
                            toastr.success('Product Updated', 'Success');
                        });
                    }
                    Audit.log("Product", data.Name, auditTargets, 'UPDATE');
                })
                .catch(function(ex) {
                    $exceptionHandler(ex);
                });
        }
    };
    var auditTargets = [];
    auditTargets.push({
        "Type": "Product",
        "Name": vm.product.Name,
        "TargetID": productid
    });
    vm.Delete = function() {
        if (confirm("Are you sure you want to delete this product?")) {
            OrderCloud.Products.Delete(productid)
                .then(function(data) {
                    $state.go('products', {}, {
                        reload: true
                    });

                    Audit.log("Product", vm.product.Name, auditTargets, 'DELETE');
                    toastr.success('Product Deleted', 'Success');
                })
                .catch(function(ex) {
                    $exceptionHandler(ex);
                });
        }
    };
    if (!vm.specGroups.length) {
        vm.noSpecs = true;
    } else {
        vm.noSpecs = false;
    }
    vm.applyGroup = function() {
        if (vm.product.xp['Product-Group']) {
            var auditTargets = [];
            auditTargets.push({
                "Type": "Product",
                "Name": vm.product.Name,
                "TargetID": vm.product.ID
            });
            $rootScope.$emit('$stateChangeStart', $state);
            vm.specGroups = [];
            $http({
                method: 'POST',
                url: 'https://pimbulkapi.azurewebsites.net/api/ProductSpec',
                data: {
                    "ProductID": vm.product.ID,
                    "ProductGroupID": vm.product.xp['Product-Group'],
                    BuyerID: "product-groups"
                },
                headers: {
                    'Content-Type': 'application/json',
                    'client': clientsecret
                },
            }).then(function successCallback(response) {
                vm.missingSpecs = [];
                vm.changedGroup = true;
                vm.Specs = response.data;

                if (!response.data.length) {
                    vm.noSpecs = true;
                } else {
                    vm.noSpecs = false;
                }
                if (vm.Specs) {
                    angular.forEach(vm.fullProduct.Specs, function(spec) {
                        var found = null;
                        angular.forEach(vm.assignments.Items, function(a) {
                            if (spec.ID === a.SpecID) {
                                spec.Assignment = a;

                                if (spec.xp.Multiselect) {
                                    vm.multiSelects[spec.ID] = {};

                                    try {
                                        var tempList = spec.DefaultValue.split(", ");
                                    } catch (e) {
                                        var tempList = [];
                                    }

                                    angular.forEach(tempList, function(optionID) {
                                        vm.multiSelects[spec.ID][optionID] = true;
                                    });
                                }
                            }
                        });
                        angular.forEach(vm.specGroups, function(g, i) {
                            if (g.Name === spec.xp.Group) {
                                found = i;
                            }
                        });
                        if (spec.xp && found === null) {
                            var tempObj = {
                                "Name": spec.xp.Group,
                                "Specs": []
                            };
                            tempObj.Specs.push(spec);
                            vm.specGroups.push(tempObj);
                        } else if (spec.xp) {
                            vm.specGroups[found].Specs.push(spec);
                        }
                    });
                    vm.missingSpecs = [];
                    angular.forEach(vm.specGroups, function(g) {
                        angular.forEach(g.Specs, function(s) {
                            if (s.Assignment !== undefined) {
                                if (s.Required) {
                                    if (!s.Assignment.DefaultValue === undefined) {
                                        vm.product.xp.productAttributesComplete = false;
                                        vm.missingSpecs.push(s.Name);
                                    } else if (s.Assignment.DefaultValue === "" && s.Assignment.DefaultOptionID === null) {
                                        vm.missingSpecs.push(s.Name);
                                        vm.product.xp.productAttributesComplete = false;
                                    } else if (s.Assignment.DefaultValue === null && s.Assignment.DefaultOptionID === null) {
                                        vm.missingSpecs.push(s.Name);
                                        vm.product.xp.productAttributesComplete = false;
                                    }
                                }

                            }
                        });
                    });
                }
                vm.Submit(false);
                $rootScope.$emit('$stateChangeSuccess', $state);
            }, function errorCallback(response) {
                $rootScope.$emit('$stateChangeSuccess', $state);
                toastr.error('An Error Occured');
            });
        } else {
            toastr.error('Please select a product group to apply');
        }

    };
    vm.editProductGroup = function(group) {
        $state.go('productgroups.assignSpec', {
            "group": group.Name,
            "categoryid": vm.product.xp['Product-Group']
        });
    };
    angular.forEach(vm.specGroups, function(g) {
        angular.forEach(g.Specs, function(s) {

            if (s.Assignment.DefaultValue == "null") {
                s.Assignment.DefaultValue = '';
            }

        });
    })

    vm.windowOpen = false;
    vm.OpenAssetManager = function(spec) {
        var openedWindow;
        _.delay(function() {
            if (!vm.windowOpen) {
                vm.windowOpen = true;
                openedWindow = window.open("https://pimassetmanager.azurewebsites.net/", "Asset Manager", "width=1400,height=1000");
            }
        }, 1000);

        window.onmessage = function(e) {
            spec.Assignment.DefaultValue = e.data;
            $scope.$apply();
            openedWindow.close();
            OrderCloud.Specs.SaveProductAssignment(spec.Assignment);
            vm.windowOpen = false;
        };
    }
}

function ProductCreateController($exceptionHandler, $http, clientsecret, option_list, $state, OrderCloud, toastr, CategoryList, $rootScope, $q, FullProductService, Audit, erp_as_product_name) {
    "use strict";
    var vm = this;
    vm.erp_as_product_name = erp_as_product_name;
    vm.product = {};
    vm.product.xp = {};
    vm.productGroupOptions = CategoryList;
    vm.specGroups = [];
    vm.multiSelects = {};
    vm.options = option_list;

    vm.CustomListOrder = function(drp) {
        var mapping = {
            'MARKETING COPY ATTRIBUTES': 0,
            'ORDERING/SHIPPING ATTRIBUTES': 2,
            'TECHNICAL SPECIFICATION ATTRIBUTES': 1,
            'EXCEPTION ATTRIBUTES': 3,
            'RESOURCES': 4
        };
        return mapping[drp.Name];
    };
    var auditTargets = [];
    vm.Submit = function(redirect) {
        vm.product.xp.productAttributesComplete = true;
        angular.forEach(vm.specGroups, function(g) {
            angular.forEach(g.Specs, function(s) {
                try {

                    if (!s.Assignment.DefaultValue === undefined) {
                        vm.product.xp.productAttributesComplete = false;
                    } else if (s.Assignment.DefaultValue === "" && s.Assignment.DefaultOptionID === null) {
                        vm.product.xp.productAttributesComplete = false;
                    } else if (s.Assignment.DefaultValue === null && s.Assignment.DefaultOptionID === null) {
                        vm.product.xp.productAttributesComplete = false;
                    }
                } catch (e) {}
            });
        });
        OrderCloud.Products.Create(vm.product)
            .then(function() {
                var q = [];

                angular.forEach(vm.specGroups, function(g) {
                    angular.forEach(g.Specs, function(s) {
                        var body = s.Assignment;
                        if (typeof body.ProductID === 'undefined') {
                            body.ProductID = vm.product.ID;
                        }
                        q.push(function() {
                            auditTargets.push({
                                "Type": "Spec",
                                "Name": s.Name,
                                "NewState": s.DefaultValue,
                                "TargetID": s.ID
                            });
                            OrderCloud.Specs.SaveProductAssignment(body);
                        }());
                    });
                });
                var body = {
                    "CategoryID": vm.product.xp['Product-Group'],
                    "ProductID": vm.product.ID,
                    "ListOrder": null
                };
                q.push(function() {
                    OrderCloud.Categories.SaveProductAssignment(body);
                }());
                $q.all(q).then(function() {
                    if (redirect) {
                        $state.go('products', {}, {
                            reload: true
                        });
                    } else {
                        $state.go('products.edit', {
                            productid: vm.product.ID
                        }, {
                            reload: false
                        });
                    }

                    auditTargets.push({
                        "Type": "Product",
                        "Name": vm.product.Name,
                        "TargetID": vm.product.ID
                    });

                    Audit.log("Product", vm.product.Name, auditTargets, 'CREATE');

                    toastr.success('Product Created', 'Success');
                });
            })
            .catch(function(ex) {
                $exceptionHandler(ex);
            });
    };

    vm.updateMultiSelect = function(spec) {
        var tempValue = "";
        angular.forEach(vm.multiSelects[spec.ID], function(option, key) {
            if (option) {
                tempValue += key + ", ";
            }
        });
        angular.forEach(vm.specGroups, function(group) {
            angular.forEach(group.Specs, function(s) {
                if (s.ID === spec.ID) {

                    if (s.Assignment !== undefined)
                        s.Assignment.DefaultValue = tempValue.substr(0, tempValue.length - 2);
                }
            });
        });
    };

    vm.applyGroup = function() {

        if (vm.product.xp['Product-Group']) {
            var auditTargets = [];
            auditTargets.push({
                "Type": "Product",
                "Name": vm.product.Name,
                "TargetID": vm.product.ID
            });
            $rootScope.$emit('$stateChangeStart', $state);
            vm.specGroups = [];
            $http({
                method: 'POST',
                url: 'https://pimbulkapi.azurewebsites.net/api/ProductSpec',
                data: {
                    "ProductID": null,
                    "ProductGroupID": vm.product.xp['Product-Group'],
                    BuyerID: "product-groups"
                },
                headers: {
                    'Content-Type': 'application/json',
                    'client': clientsecret
                },
            }).then(function successCallback(response) {

                if (!response.data.length) {
                    vm.noSpecs = true;
                } else {
                    vm.noSpecs = false;
                }

                vm.missingSpecs = [];
                vm.changedGroup = true;
                vm.Specs = response.data;
                angular.forEach(vm.Specs, function(spec) {
                    var found = null;
                    angular.forEach(vm.specGroups, function(g, i) {
                        if (g.Name === spec.xp.Group) {
                            found = i;
                        }
                    });
                    if (spec.xp && found === null) {
                        var tempObj = {
                            "Name": spec.xp.Group,
                            "Specs": []
                        };

                        spec.Assignment = {
                            DefaultValue: null,
                            ProductID: vm.productID,
                            SpecID: spec.ID,
                            DefaultOptionID: null
                        };
                        tempObj.Specs.push(spec);

                        vm.specGroups.push(tempObj);
                    } else if (spec.xp) {
                        spec.Assignment = {
                            DefaultValue: null,
                            ProductID: vm.productID,
                            SpecID: spec.ID,
                            DefaultOptionID: null
                        };
                        vm.specGroups[found].Specs.push(spec);
                    }
                });
                $rootScope.$emit('$stateChangeSuccess', $state);
            }, function errorCallback(response) {

                $rootScope.$emit('$stateChangeSuccess', $state);
                toastr.error('An Error Occured');
            });
        } else {
            toastr.error('Please select a product group to apply');
        }

    };
    vm.editProductGroup = function(group) {
        $state.go('productgroups.assignSpec', {
            "group": group.Name,
            "categoryid": vm.product.xp['Product-Group']
        });
    };
    angular.forEach(vm.specGroups, function(g) {
        angular.forEach(g.Specs, function(s) {

            if (s.Assignment.DefaultValue === "null") {
                s.Assignment.DefaultValue = '';
            }

        });
    });
    vm.windowOpen = false;
    vm.OpenAssetManager = function(spec) {
        var openedWindow;
        _.delay(function() {
            if (!vm.windowOpen) {
                vm.windowOpen = true;
                openedWindow = window.open("https://pimassetmanager.azurewebsites.net/", "Asset Manager", "width=1400,height=1000");
            }
        }, 1000);

        window.onmessage = function(e) {
            spec.Assignment.DefaultValue = e.data;
            $scope.$apply();
            openedWindow.close();
            OrderCloud.Specs.SaveProductAssignment(spec.Assignment);
            vm.windowOpen = false;
        };
    }
    vm.clearFilters();
}

function ProductCloneController($exceptionHandler, erp_as_product_name, $state, $http, clientsecret, OrderCloud, SelectedProduct, toastr, FullProduct, CategoryList, SpecAssignments, $scope, $q, FullProductService, $rootScope, option_list, Audit) {
    "use strict";
    var vm = this;
    var productid;
    vm.erp_as_product_name = erp_as_product_name;
    vm.productName = angular.copy(SelectedProduct.Name);
    vm.product = SelectedProduct;
    vm.fullProduct = FullProduct;
    vm.assignments = SpecAssignments;
    vm.multiSelects = {};
    vm.productGroupOptions = CategoryList;
    vm.specGroups = [];
    vm.missingSpecs = [];
    vm.product.ID = "";
    vm.options = option_list;
    if (vm.fullProduct.Specs) {
        angular.forEach(vm.fullProduct.Specs, function(spec) {
            var found = null;
            angular.forEach(vm.assignments.Items, function(a) {
                if (spec.ID === a.SpecID) {
                    spec.Assignment = a;

                    if (spec.xp.Multiselect) {
                        vm.multiSelects[spec.ID] = {};

                        try {
                            var tempList = spec.DefaultValue.split(", ");
                        } catch (e) {
                            var tempList = [];
                        }

                        angular.forEach(tempList, function(optionID) {
                            vm.multiSelects[spec.ID][optionID] = true;
                        });
                    }
                }
            });
            angular.forEach(vm.specGroups, function(g, i) {
                if (g.Name === spec.xp.Group) {
                    found = i;
                }
            });
            if (spec.xp && found === null) {
                var tempObj = {
                    "Name": spec.xp.Group,
                    "Specs": []
                };
                tempObj.Specs.push(spec);
                vm.specGroups.push(tempObj);
            } else if (spec.xp) {
                vm.specGroups[found].Specs.push(spec);
            }
        });

        angular.forEach(vm.specGroups, function(g) {
            angular.forEach(g.Specs, function(s) {
                if (!s.Assignment.DefaultValue === undefined) {
                    vm.product.xp.productAttributesComplete = false;
                } else if (s.Assignment.DefaultValue === "" && s.Assignment.DefaultOptionID === null) {
                    vm.product.xp.productAttributesComplete = false;
                } else if (s.Assignment.DefaultValue === null && s.Assignment.DefaultOptionID === null) {
                    vm.product.xp.productAttributesComplete = false;
                }
            });
        });
    }

    vm.CustomListOrder = function(drp) {
        var mapping = {
            'MARKETING COPY ATTRIBUTES': 0,
            'ORDERING/SHIPPING ATTRIBUTES': 1,
            'TECHNICAL SPECIFICATION ATTRIBUTES': 2,
            'EXCEPTION ATTRIBUTES': 3
        };
        return mapping[drp.Name];
    };

    vm.updateMultiSelect = function(spec) {
        var tempValue = "";
        angular.forEach(vm.multiSelects[spec.ID], function(option, key) {
            if (option) {
                tempValue += key + ", ";
            }
        });
        angular.forEach(vm.specGroups, function(group) {
            angular.forEach(group.Specs, function(s) {
                if (s.ID === spec.ID) {
                    s.Assignment.DefaultValue = tempValue.substr(0, tempValue.length - 2);
                }
            });
        });
    };

    vm.Submit = function(redirect) {

        OrderCloud.Products.Create(vm.product).then(function(newProduct) {
            vm.product = newProduct
            productid = vm.product.ID;

            var auditTargets = [];
            auditTargets.push({
                "Type": "Product",
                "Name": vm.product.Name,
                "TargetID": vm.product.ID
            });
            if (vm.product.xp.Status === 'Obsolete') {
                if (confirm('You have marked this product as obsolete. This will remove all assigned spec values. Continue?')) {
                    OrderCloud.Products.Update(vm.product.ID, vm.product)
                        .then(function() {
                            var q = [];
                            angular.forEach(vm.fullProduct.Specs, function(s) {
                                s.Assignment.DefaultValue = null;
                                s.Assignment.DefaultOptionID = null;
                                q.push(function() {
                                    OrderCloud.Specs.SaveProductAssignment(s.Assignment);
                                }());
                                auditTargets.push({
                                    "Type": "Product Attribute Assignment",
                                    "TargetID": SpecID,
                                    "PreviousState": s.ProductID
                                });
                            });
                            $q.all(q).then(function() {
                                if (redirect) {
                                    $state.go('products', {}, {
                                        reload: true
                                    });
                                } else {
                                    $state.go('products.edit', {
                                        productid: vm.product.ID
                                    }, {
                                        reload: false
                                    });
                                }
                                toastr.success('Product Updated', 'Success');
                            });
                        })
                        .catch(function(ex) {
                            $exceptionHandler(ex);
                        });
                }
            } else if (vm.product.xp.Status !== 'Obsolete') {
                vm.product.xp.productAttributesComplete = true;
                angular.forEach(vm.specGroups, function(g) {
                    angular.forEach(g.Specs, function(s) {
                        if (!s.Assignment.DefaultValue && !s.Assignment.DefaultOptionID && s.Assignment.Required) {
                            vm.product.xp.productAttributesComplete = false;
                        }


                    });
                });

                OrderCloud.Products.Update(vm.product.ID, vm.product)
                    .then(function(data) {
                        if (vm.changedGroup) {
                            var q = [];
                            var uberQ = $q.defer();
                            angular.forEach(vm.assignments.Items, function(a) {
                                q.push(function() {
                                    var df = $q.defer();
                                    OrderCloud.Specs.DeleteProductAssignment(a.SpecID, a.ProductID).then(function() {
                                        df.resolve();
                                    });
                                    return df.promise;
                                }());
                            });
                            $q.all(q).then(function() {
                                uberQ.resolve();
                                var q2 = [];
                                angular.forEach(vm.specGroups, function(g) {
                                    angular.forEach(g.Specs, function(s) {
                                        var body = s.Assignment;
                                        body.ProductID = vm.product.ID;
                                        q2.push(function() {
                                            OrderCloud.Specs.SaveProductAssignment(body);
                                        }());
                                    });
                                });
                                var body = {
                                    "CategoryID": vm.product.xp['Product-Group'],
                                    "ProductID": vm.product.ID,
                                    "ListOrder": null
                                };
                                q2.push(function() {
                                    OrderCloud.Categories.SaveProductAssignment(body);
                                }());
                                $q.all(q2).then(function() {
                                    if (redirect) {
                                        $state.go('products', {}, {
                                            reload: true
                                        });
                                    } else {
                                        $state.go('products.edit', {
                                            productid: vm.product.ID
                                        }, {
                                            reload: true
                                        });
                                    }
                                    toastr.success('Product Cloned', 'Success');
                                });
                            });
                            return uberQ.promise;
                        } else {
                            var q = [];
                            angular.forEach(vm.specGroups, function(g) {
                                angular.forEach(g.Specs, function(s) {
                                    var body = s.Assignment;
                                    body.ProductID = vm.product.ID;
                                    q.push(function() {
                                        OrderCloud.Specs.SaveProductAssignment(body);
                                    }());
                                });
                            });
                            $q.all(q).then(function() {
                                if (redirect) {
                                    $state.go('products', {}, {
                                        reload: true
                                    });
                                } else {
                                    $state.go('products.edit', {
                                        productid: vm.product.ID
                                    }, {
                                        reload: true
                                    });
                                }
                                toastr.success('Product Cloned', 'Success');
                            });
                        }
                        Audit.log("Product", data.Name, auditTargets, 'UPDATE');
                    })
                    .catch(function(ex) {
                        $exceptionHandler(ex);
                    });
            }
        });
        angular.forEach(vm.specGroups, function(g) {
            angular.forEach(g.Specs, function(s) {

                if (s.Assignment.DefaultValue == "null") {
                    s.Assignment.DefaultValue = '';
                }

            });
        })
    };

    vm.Delete = function() {
        if (confirm("Are you sure you want to delete this product?")) {
            OrderCloud.Products.Delete(productid)
                .then(function(data) {
                    $state.go('products', {}, {
                        reload: true
                    });
                    Audit.log("Product", data.Name, [{
                        "Type": "Product",
                        "TargetID": data.ID,
                    }], 'DELETE');
                    toastr.success('Product Deleted', 'Success');
                })
                .catch(function(ex) {
                    $exceptionHandler(ex);
                });
        }
    };

    vm.applyGroup = function() {
        if (vm.product.xp['Product-Group']) {
            var auditTargets = [];
            auditTargets.push({
                "Type": "Product",
                "Name": vm.product.Name,
                "TargetID": vm.product.ID
            });
            $rootScope.$emit('$stateChangeStart', $state);
            vm.specGroups = [];
            $http({
                method: 'POST',
                url: 'https://pimbulkapi.azurewebsites.net/api/ProductSpec',
                data: {
                    "ProductID": vm.product.ID,
                    "ProductGroupID": vm.product.xp['Product-Group'],
                    BuyerID: "product-groups"
                },
                headers: {
                    'Content-Type': 'application/json',
                    'client': clientsecret
                },
            }).then(function successCallback(response) {

                console.log(response)

                if (!response.data.length) {
                    vm.noSpecs = true;
                } else {
                    vm.noSpecs = false;
                }


                vm.missingSpecs = [];
                vm.changedGroup = true;
                vm.Specs = response.data;
                angular.forEach(vm.Specs, function(spec) {
                    var found = null;
                    angular.forEach(vm.specGroups, function(g, i) {
                        if (g.Name === spec.xp.Group) {
                            found = i;
                        }
                    });
                    if (spec.xp && found === null) {
                        spec.Assignment = {
                            DefaultValue: null,
                            ProductID: vm.productID,
                            SpecID: spec.ID,
                            DefaultOptionID: null
                        };

                        angular.forEach(vm.assignments.Items, function(a) {
                            if (spec.ID === a.SpecID) {
                                spec.Assignment = a;
                            }
                        });

                        var tempObj = {
                            "Name": spec.xp.Group,
                            "Specs": []
                        };
                        tempObj.Specs.push(spec);
                        vm.specGroups.push(tempObj);
                    } else if (spec.xp) {
                        spec.Assignment = {
                            DefaultValue: null,
                            ProductID: vm.productID,
                            SpecID: spec.ID,
                            DefaultOptionID: null
                        };

                        angular.forEach(vm.assignments.Items, function(a) {
                            if (spec.ID === a.SpecID) {
                                spec.Assignment = a;
                            }
                        });
                        vm.specGroups[found].Specs.push(spec);
                    }
                });
                $rootScope.$emit('$stateChangeSuccess', $state);
            }, function errorCallback(response) {
                $rootScope.$emit('$stateChangeSuccess', $state);
                toastr.error('An Error Occured');
            });
        } else {
            toastr.error('Please select a product group to apply');
        }

    };
    vm.editProductGroup = function(group) {
        $state.go('productgroups.assignSpec', {
            "group": group.Name,
            "categoryid": vm.product.xp['Product-Group']
        });
    };
    angular.forEach(vm.specGroups, function(g) {
        angular.forEach(g.Specs, function(s) {
            if (s.Assignment.DefaultValue == "null") {
                s.Assignment.DefaultValue = '';
            }

        });
    })
}

function ProductAssignmentsController($exceptionHandler, $http, erp_as_product_name, $q, $stateParams, $state, $scope, OrderCloud, SelectedProduct, Assignments, toastr, BuyerList, Paging, Underscore, Audit) {
    "use strict";
    var vm = this;
    vm.erp_as_product_name = erp_as_product_name;
    vm.list = BuyerList;
    vm.assignments = Assignments;
    vm.productID = $stateParams.productid;
    vm.productName = angular.copy(SelectedProduct.Name);
    vm.pagingfunction = PagingFunction;
    vm.assignmentList = {};
    angular.forEach(vm.assignments.Items, function(a) {
        vm.assignmentList[a.CatalogID] = true;
    });


    angular.forEach(vm.list.Items, function(b) {

        if (vm.assignmentList[b.ID] === true) {
            b.selected = true;
        }
    });

    $scope.$watchCollection(function() {
        return vm.list;
    }, function() {
        Paging.setSelected(vm.list.Items, vm.assignments.Items, 'ID');
    });

    vm.model = {
        ProductID: $stateParams.productid,
        CatalogID: null
    };
    vm.model = {
        ProductID: "",

    };
    vm.submit = function() {
        var assignmentQueue = [];
        angular.forEach(vm.list.Items, function(buyer) {
            if (buyer.selected) {
                assignmentQueue.push((function() {
                    var df = $q.defer();
                    var assignment = angular.copy(vm.model);
                    assignment.CatalogID = buyer.ID;
                    assignment.ProductID = $stateParams.productid;

                    $http({
                            method: 'POST',
                            url: 'https://api.ordercloud.io/v1/catalogs/productassignments',
                            data: assignment,
                            headers: {
                                'Content-Type': 'application/json; charset=utf-8',
                                "Authorization": "Bearer " + OrderCloud.Auth.ReadToken()
                            }
                        }).success(function(data, status, headers, config) {

                            df.resolve();
                        })
                        .error(function(data, status, header, config) {
                            toastr.warning(data.Errors[0].Message);
                        });


                    Audit.log("Channel Product Assignment", assignment.id + " > " + buyer.Name, [{
                        Type: "Channel",
                        TargetID: "assignment.BuyerID"
                    }, {
                        Type: "Product",
                        TargetID: "assignment.ProductID"
                    }], 'CREATE');
                    return df.promise;
                })());
            } else {
                assignmentQueue.push((function() {
                    var df = $q.defer();
                    var assignment = angular.copy(vm.model);
                    assignment.BuyerID = buyer.ID;



                    $http({
                            method: 'DELETE',
                            url: 'https://api.ordercloud.io/v1/catalogs/' + buyer.ID + '/productassignments/' + $stateParams.productid,
                            headers: {
                                'Content-Type': 'application/json; charset=utf-8',
                                "Authorization": "Bearer " + OrderCloud.Auth.ReadToken()
                            }
                        }).success(function(data, status, headers, config) {
                            df.resolve();
                        })
                        .error(function(data, status, header, config) {
                            toastr.warning(data.Errors[0].Message);
                        });




                    Audit.log("Channel Product Assignment", assignment.Name + " > " + assignment.BuyerID, [{
                        Type: "Channel",
                        TargetID: "assignment.BuyerID"
                    }, {
                        Type: "Product",
                        TargetID: "assignment.ProductID"
                    }], 'DELETE');
                    return df.promise;
                })());
            }
        });
        $q.all(assignmentQueue).then(function() {

            $state.go('products.assignments', {
                productid: $stateParams.productid
            });
            toastr.success('Assignments Updated', 'Success');
        });

    };

    vm.Delete = function(scope) {
        OrderCloud.Products.DeleteAssignment($stateParams.productid, null, scope.assignment.UserGroupID)
            .then(function() {
                $state.reload();
                toastr.success('Product Assignment Deleted', 'Success');
            })
            .catch(function(ex) {
                $exceptionHandler(ex);
            });
    };

    function PagingFunction() {
        if (vm.list.Meta.Page < vm.list.Meta.TotalPages) {
            OrderCloud.Products.ListAssignments($stateParams.productid, null, null, null, null, vm.list.Meta.Page + 1, vm.list.Meta.PageSize)
                .then(function(data) {
                    vm.list.Items = [].concat(vm.list.Items, data.Items);
                    vm.list.Meta = data.Meta;
                });
        }
    }
}

function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key];
        var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

function TempFixRegulation() {
    return function(input) {
        if (input != 'Regualtion Specs') {
            return input;
        } else {
            return 'Regulation Specs';
        }
    }
}