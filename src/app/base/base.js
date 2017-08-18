angular.module('productManager').config(BaseConfig).controller('BaseCtrl', BaseController);

function BaseConfig($stateProvider, $injector) {
    "use strict";
    var baseViews = {
        '': {
            templateUrl: 'base/templates/base.tpl.html',
            controller: 'BaseCtrl',
            controllerAs: 'base'
        }
    };

    if ($injector.has('base')) {
        var baseConfig = $injector.get('base');

        //conditional base left
        baseConfig.left ? baseViews['left@base'] = {
            'templateUrl': 'base/templates/base.left.tpl.html'
        } : angular.noop();

        //conditional base right
        baseConfig.right ? baseViews['right@base'] = {
            'templateUrl': 'base/templates/base.right.tpl.html'
        } : angular.noop();

        //conditional base top
        baseConfig.top ? baseViews['top@base'] = {
            'templateUrl': 'base/templates/base.top.tpl.html'
        } : angular.noop();

        //conditional base bottom
        baseConfig.bottom ? baseViews['bottom@base'] = {
            'templateUrl': 'base/templates/base.bottom.tpl.html'
        } : angular.noop();
    }

    var baseState = {
        url: '',
        abstract: true,
        views: baseViews,
        resolve: {
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
            ComponentList: function($state, $q, Underscore, CurrentUser, UserGroupService, UserPermissionsService) {

                var deferred = $q.defer();
                var nonSpecific = ['Customers', 'Products', 'Product Attributes', 'Price Schedules', 'Users', 'User Groups', 'Product Facets',
                    'Channels', 'Report History', 'Catalog', 'Master Product Groups', 'Product Groups', 'Data Manager', 'Audit Log'
                ];
                var components = {
                    nonSpecific: [],
                    buyerSpecific: []
                };
                UserGroupService.getList().then(function() {
                    angular.forEach($state.get(), function(state) {
                        if (!state.data || !state.data.componentName) { return };
                        if (nonSpecific.indexOf(state.data.componentName) > -1) {
                            if (_.findWhere(components.nonSpecific, { Display: state.data.componentName }) == undefined) {

                                UserPermissionsService.check(state.name.replace(/ /g, '-'), 1).then(function(hasPerms) {
                                    if (hasPerms) {
                                        components.nonSpecific.push({
                                            Display: state.data.componentName,
                                            StateRef: state.name,
                                            OrderIndex: state.data.OrderIndex || 99
                                        });
                                    }
                                });
                            }
                        } else {
                            if (Underscore.findWhere(components.buyerSpecific, { Display: state.data.componentName }) == undefined) {
                                UserPermissionsService.check(state.name.replace(/ /g, '-'), 1).then(function(hasPerms) {
                                    if (hasPerms) {
                                        components.buyerSpecific.push({
                                            Display: state.data.componentName,
                                            StateRef: state.name,
                                            OrderIndex: state.data.OrderIndex || 99
                                        });
                                    }
                                });
                            }
                        }
                    });
                });

                deferred.resolve(components);
                return deferred.promise;
            }
        }
    };

    $stateProvider.state('base', baseState);
}

function BaseController($rootScope, $ocMedia, snapRemote, appversion, CurrentUser, ComponentList, defaultErrorMessageResolver, base, OrderCloud) {
    "use strict";
    var vm = this;
    vm.left = base.left;
    vm.right = base.right;
    vm.currentUser = CurrentUser;
    vm.version = appversion;
    console.log(ComponentList)

    vm.catalogItems = ComponentList.nonSpecific;
    vm.organizationItems = ComponentList.buyerSpecific;

    vm.superAdmin = function() {
        var tracker = false;
        angular.forEach(vm.currentUser.AvailableRoles, function(role) {
            if (role == 'FullAccess') {
                tracker = true;
            }
        });
        return tracker;
    }();

    defaultErrorMessageResolver.getErrorMessages().then(function(errorMessages) {
        errorMessages['customPassword'] = 'Password must be at least eight characters long and include at least one letter and one number';
        //regex for customPassword = ^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!$%@#£€*?&]{8,}$
        errorMessages['positiveInteger'] = 'Please enter a positive integer';
        //regex positiveInteger = ^[0-9]*[1-9][0-9]*$
        errorMessages['ID_Name'] = 'Only Alphanumeric characters, hyphens and slashes are allowed';
        //regex ID_Name = ([A-Za-z0-9-_]+)
        errorMessages['confirmpassword'] = 'Your passwords do not match';
        errorMessages['noSpecialChars'] = 'Only Alphanumeric characters are allowed';
    });

    vm.snapOptions = {
        disable: (!base.left && base.right) ? 'left' : ((base.left && !base.right) ? 'right' : 'none')
    };

    function _isMobile() {
        return $ocMedia('max-width:991px');
    }

    function _initDrawers(isMobile) {
        snapRemote.close('MAIN');
        if (isMobile && (base.left || base.right)) {
            snapRemote.enable('MAIN');
        } else {
            snapRemote.disable('MAIN');
        }
    }

    _initDrawers(_isMobile());

    $rootScope.$watch(_isMobile, function(n, o) {
        if (n === o) return;
        _initDrawers(n);
    });
}