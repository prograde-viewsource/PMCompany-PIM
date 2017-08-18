angular.module('productManager', [
        'ngSanitize',
        'ngAnimate',
        'ngMessages',
        'ngResource',
        'ngTouch',
        'snap',
        'ui.tree',
        'ui.router',
        'ui.bootstrap',
        'orderCloud.sdk',
        'orderCloud.customsdk',
        'LocalForageModule',
        'toastr',
        'cgBusy',
        'jcs-autoValidate',
        'ordercloud-infinite-scroll',
        'ordercloud-buyer-select',
        'ordercloud-search',
        'ordercloud-assignment-helpers',
        'ordercloud-paging-helpers',
        'ordercloud-auto-id',
        'ordercloud-current-order',
        'ordercloud-address',
        'ordercloud-lineitems',
        'ordercloud-geography',
        'pim-helpers',
        'audit-logger',
        'user-permissions',
        'jm.i18next',

        angularDragula(angular)
    ])
    .run(SetBuyerID)
    .config(Routing)
    .config(ErrorHandling)
    .config(Interceptor).controller('AppCtrl', AppCtrl)

function AppCtrl($q, $rootScope, $state, appname, LoginService, toastr, $ocMedia,
    $i18next, OrderCloud, apiAgentService, UserGroupService, UserPermissionsService) {
    'use strict';
    let vm = this;

    vm.currentState = $state.current.name
        // Views that don't require user group permissions.
    let baseViewsArray = ['login', 'unauthorized', 'account'];
    vm.name = appname;
    vm.title = appname;
    vm.$state = $state;
    vm.$ocMedia = $ocMedia;
    vm.contentLoading = undefined;
    vm.apiAgentService = apiAgentService;
    vm.signalrActive = false;

    function cleanLoadingIndicators() {
        if (vm.contentLoading && vm.contentLoading.promise && !vm.contentLoading.promise.$cgBusyFulfilled) vm.contentLoading.resolve(); //resolve leftover loading promises
    }

    OrderCloud.CatalogID.Set('product-groups');

    vm.isTouchDevice = (function() {
        var el = document.createElement('div');
        el.setAttribute('ongesturestart', 'return;'); // or try "ontouchstart"
        return typeof el.ongesturestart === "function";
    })();

    vm.logout = function() {
        LoginService.Logout();
    };


    // RootScop Functions 
    // START

    $rootScope.$on('$stateChangeStart', function(e, toState) {
        cleanLoadingIndicators();
        var defer = $q.defer();
        defer.wrapperClass = 'indicator-container';
        (toState.data && toState.data.loadingMessage) ? defer.message = toState.data.loadingMessage: defer.message = null;
        defer.templateUrl = 'common/loading-indicators/templates/view.loading.tpl.html';
        vm.contentLoading = defer;
        if (vm.currentState.toLowerCase() !== 'login') {
            // Check to see if the user has permissions to view the page.
            UserGroupService.getList().then(function(Data) {

                if (toState.name !== undefined) {
                    let sName = toState.name.replace(/ /g, '-').split('.');
                    UserPermissionsService.check(sName[0], 1).then(function(hasPerms) {
                        if (!hasPerms && !baseViewsArray.indexOf(sName)) {
                            e.preventDefault();
                            $state.go('unauthorized');
                        }
                    });
                }
            }).catch(function(reason) {
                console.log(reason);
            });
        }
    });


    $rootScope.$on('$stateChangeSuccess', function(e, toState) {
        cleanLoadingIndicators();
        if (toState.data && toState.data.componentName) {
            vm.title = toState.data.componentName + ' | ' + appname;
        } else {
            vm.title = appname;
        }
    });


    $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
        cleanLoadingIndicators();
    });


    $rootScope.$on('OC:AccessInvalidOrExpired', function() {
        LoginService.RememberMe();
    });


    $rootScope.$on('OC:AccessForbidden', function() {
        //  toastr.warning("You do not have permission to access this page.");
    });


    $rootScope.$on('signalrStop', function(ev, r) {
        toastr.success("Processing Complete.");
        //vm.signalrActive = false;
           $rootScope.$emit('$stateChangeSuccess', $state);
    });

    $rootScope.$on('signalrStart', function() {
        toastr.success("Processing Requests. Please wait.");
        //vm.signalrActive = true;
        $rootScope.$emit('$stateChangeStart', $state);
        
    });


    // RootScop Functions 
    // END
}

function Interceptor($httpProvider) {
    'use strict';
    $httpProvider.interceptors.push(function($q, $rootScope) {
        return {
            'request': function(config) {
                return config || $q.when(config);
            },
            'responseError': function(rejection) {
                if (rejection.config.url.indexOf('ordercloud.io') > -1 && rejection.status == 401) {
                    $rootScope.$broadcast('OC:AccessInvalidOrExpired');
                }
                if (rejection.config.url.indexOf('ordercloud.io') > -1 && rejection.status == 403) {
                    $rootScope.$broadcast('OC:AccessForbidden');
                }
                return $q.reject(rejection);
            }
        };
    });
}

function SetBuyerID(OrderCloud, buyerid) {
    'use strict';
    OrderCloud.BuyerID.Get() == buyerid ? angular.noop() : OrderCloud.BuyerID.Set(buyerid);
}

function Routing($urlRouterProvider, $urlMatcherFactoryProvider, $locationProvider) {
    'use strict';
    $urlMatcherFactoryProvider.strictMode(false);
    $urlRouterProvider.otherwise('/channels');
    $locationProvider.html5Mode(true);
}

function ErrorHandling($provide) {
    'use strict';
    $provide.decorator('$exceptionHandler', handler);

    function handler($delegate, $injector) {
        return function(ex, cause) {
            $delegate(ex, cause);
            if (ex.data == undefined || !ex.data.error_description) {
                $injector.get('toastr').error(ex.data ? (ex.data.error || (ex.data.Errors ? ex.data.Errors[0].Message : ex.data)) : ex.message, 'Error');
            } else {
                $injector.get('toastr').error(ex.data.error_description, 'Error');
            }
        };
    }
}

// Window/DOM Overrides
var realEncodeURIComponent = window.encodeURIComponent;
window.encodeURIComponent = function(input) {
    'use strict';
    return realEncodeURIComponent(input).split("_amp_").join("&").split("_eq_").join("=").split("_pipe_").join("|");
};

window.i18next
    .use(window.i18nextXHRBackend);

window.i18next.init({
    debug: false,
    lng: 'en', // If not given, i18n will detect the browser language.
    fallbackLng: 'dev', // Default is dev
    backend: {
        loadPath: '/locales/{{lng}}/resource.json'
    },
    useCookie: false,
    useLocalStorage: true
}, function(err, t) {});