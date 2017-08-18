angular.module('productManager')

.config(OrdersConfig)
    .controller('OrdersCtrl', OrdersController)
    .factory('OrdersFactory', OrdersFactory)
    .filter('paymentmethods', paymentmethods);

function OrdersConfig($stateProvider) {
    "use strict";
    $stateProvider
        .state('reports', {
            parent: 'base',
            templateUrl: 'orders/templates/orders.tpl.html',
            controller: 'OrdersCtrl',
            controllerAs: 'orders',
            url: '/orders?from&to&search&page&pageSize&searchOn&sortBy&filters',
            data: { componentName: 'Report History', OrderIndex: 6 },
            resolve: {
                UserType: function(OrderCloud) {
                    return JSON.parse(atob(OrderCloud.Auth.ReadToken().split('.')[1])).usrtype;
                },
                Parameters: function($stateParams, OrderCloudParameters) {
                    return OrderCloudParameters.Get($stateParams);
                },
                OrderList: function(OrderCloud, Parameters) {
                    return OrderCloud.Orders.ListIncoming(Parameters.from, Parameters.to, Parameters.search, Parameters.page, Parameters.pageSize || 100, Parameters.searchOn, Parameters.sortBy, Parameters.filters);
                }
            }
        })
        .state('reports.detail', {
            url: '/:orderid',
            templateUrl: 'orders/templates/orders.detail.tpl.html',
            controller: 'OrdersDetailCtrl',
            controllerAs: 'ordersDetail',
            resolve: {
                SelectedOrder: function($stateParams, OrdersFactory) {
                    return OrdersFactory.GetOrderDetails($stateParams.orderid);
                }
            }
        });
}

function OrdersController($state, $ocMedia, OrderCloudParameters, OrderCloud, UserType, OrderList, Parameters) {
    "use strict";
    var vm = this;
    vm.list = OrderList;
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

    if (!vm.parameters.sortBy) {
        vm.parameters.sortBy = 'DateCreated';
        vm.sortSelection = Parameters.sortBy ? (Parameters.sortBy.indexOf('!') === 0 ? Parameters.sortBy.split('!')[1] : Parameters.sortBy) : null;
        vm.updateSort();
    }

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
        return OrderCloud.Orders[UserType === 'admin' ? 'ListIncoming' : 'ListOutgoing'](Parameters.from, Parameters.to, Parameters.search, vm.list.Meta.Page + 1, Parameters.pageSize || vm.list.Meta.PageSize, Parameters.searchOn, Parameters.sortBy, Parameters.filters)
            .then(function(data) {
                vm.list.Items = vm.list.Items.concat(data.Items);
                vm.list.Meta = data.Meta;
            });
    };

    vm.redownload = function(order) {
        window.open(order.xp["Template URL"]);
    };
}

function OrdersFactory($q, Underscore, OrderCloud) {
    "use strict";
    var service = {
        GetOrderDetails: _getOrderDetails,
        GetLineItemDetails: _getLineItemDetails,
        SearchOrders: _searchOrders,
        GetGroupOrders: _getGroupOrders
    };

    function _getOrderDetails(orderID) {
        var deferred = $q.defer();
        var order;
        var lineItemQueue = [];
        var productQueue = [];

        OrderCloud.Orders.Get(orderID, 'orderagent')
            .then(function(data) {
                order = data;
                order.LineItems = [];
                gatherLineItems();
            });

        function gatherLineItems() {
            OrderCloud.LineItems.List(orderID, null, 1, 100, null, null, null, 'orderagent')
                .then(function(data) {
                    order.LineItems = order.LineItems.concat(data.Items);
                    for (var i = 2; i <= data.Meta.TotalPages; i++) {
                        lineItemQueue.push(OrderCloud.LineItems.List(orderID, null, i, 100));
                    }
                    $q.all(lineItemQueue).then(function(results) {
                        angular.forEach(results, function(result) {
                            order.LineItems = order.LineItems.concat(result.Items);
                        });
                        gatherProducts();
                    });
                });
        }

        function gatherProducts() {
            var productIDs = Underscore.uniq(Underscore.pluck(order.LineItems, 'ProductID'));

            angular.forEach(productIDs, function(productID) {
                productQueue.push((function() {
                    var d = $q.defer();

                    OrderCloud.Products.Get(productID)
                        .then(function(product) {
                            angular.forEach(Underscore.where(order.LineItems, { ProductID: product.ID }), function(item) {
                                item.Product = product;
                            });

                            d.resolve();
                        });

                    return d.promise;
                })());
            });

            $q.all(productQueue).then(function() {
                if (order.SpendingAccountID) {
                    OrderCloud.SpendingAccounts.Get(order.SpendingAccountID)
                        .then(function(sa) {
                            order.SpendingAccount = sa;
                            deferred.resolve(order);
                        });
                } else {
                    deferred.resolve(order);
                }
            });
        }

        return deferred.promise;
    }

    function _getLineItemDetails(orderID, lineItemID) {
        var deferred = $q.defer();
        var lineItem;

        OrderCloud.LineItems.Get(orderID, lineItemID)
            .then(function(li) {
                lineItem = li;
                getProduct();
            });

        function getProduct() {
            OrderCloud.Products.Get(lineItem.ProductID)
                .then(function(product) {
                    lineItem.Product = product;
                    deferred.resolve(lineItem);
                });
        }

        return deferred.promise;
    }

    function _searchOrders(filters, userType) {
        var deferred = $q.defer();

        if (!filters.groupOrders && filters.searchingGroupOrders) {
            deferred.resolve();
        } else {
            if (filters.favorite) {
                OrderCloud.Orders[userType === 'admin' ? 'ListIncoming' : 'ListOutgoing'](filters.FromDate, filters.ToDate, filters.searchTerm, 1, 100, null, filters.sortType, { ID: filters.OrderID, Status: filters.Status, FromUserID: filters.groupOrders, xp: { favorite: filters.favorite } }, filters.FromCompanyID)
                    .then(function(data) {
                        deferred.resolve(data);
                    });
            } else {
                OrderCloud.Orders[userType === 'admin' ? 'ListIncoming' : 'ListOutgoing'](filters.FromDate, filters.ToDate, filters.searchTerm, 1, 100, null, filters.sortType, { ID: filters.OrderID, Status: filters.Status, FromUserID: filters.groupOrders }, filters.FromCompanyID)
                    .then(function(data) {
                        deferred.resolve(data);
                    });
            }
        }

        return deferred.promise;
    }

    function _getGroupOrders(groupList) {
        var userIDs = [];
        var dfd = $q.defer();
        GetUserIDs(groupList)
            .then(function(users) {
                angular.forEach(users, function(user) {
                    userIDs.push(user.UserID);
                });
                dfd.resolve(userIDs.join('|'));
            });
        return dfd.promise;

        function GetUserIDs(groups) {
            var dfd = $q.defer();
            var queue = [];
            var userList = [];
            angular.forEach(groups, function(group) {
                queue.push(OrderCloud.UserGroups.ListUserAssignments(group));
            });

            $q.all(queue)
                .then(function(users) {
                    angular.forEach(users, function(user) {
                        userList = userList.concat(user.Items);
                    });

                    dfd.resolve(userList);
                });

            return dfd.promise;
        }
    }

    return service;
}

function paymentmethods() {
    "use strict";
    var map = {
        'PurchaseOrder': 'Purchase Order',
        'CreditCard': 'CreditCard',
        'SpendingAccount': 'Spending Account',
        'PayPalExpressCheckout': 'PayPal Express Checkout'
    };
    return function(method) {
        if (!map[method]) { return method; }
        return map[method];
    };
}