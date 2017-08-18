angular.module('productManager')
    .config(CategoryConfig)
    .controller('CategoryCtrl', CategoryController)
;

function CategoryConfig($stateProvider) {
    "use strict";
    $stateProvider
        .state('catalog.category', {
            url: '/category/:categoryid',
            templateUrl: 'catalog/category/templates/category.tpl.html',
            controller: 'CategoryCtrl',
            controllerAs: 'category',
            resolve: {
                CategoryList: function($stateParams, OrderCloud) {
                    return OrderCloud.Categories.Get($stateParams.categoryid);
                },
                ProductList: function($stateParams, OrderCloud) {
                    return OrderCloud.Categories.ListProductAssignments($stateParams.categoryid, null, null, null, null);
                },
                Products: function($stateParams, OrderCloud, ProductList, $q, FullProductService) {
                    return FullProductService.Test(ProductList.Items, 'ProductID', 'Products', 'Get');
                    // var products = [];
                    // var p = [];
                    // var uberQ = $q.defer();
                    // angular.forEach(ProductList.Items, function (a) {
                    //     products.push(function () {
                    //         OrderCloud.Products.Get(a.ProductID).then(function (response) {
                    //             p.push(response);
                    //         });
                    //     }());
                    // });
                    // $q.all(products).then(function () {
                    //     uberQ.resolve(p);
                    // });
                    // return uberQ.promise;
                }
            }
        });
}

function CategoryController($rootScope, CategoryList, ProductList, Products) {
    "use strict";
    var vm = this;
    vm.categories = CategoryList;
    vm.products = Products;

    $rootScope.$on('OC:FacetsUpdated', function(e, productList) {
        {productList ? vm.products = productList : vm.products = ProductList;}
    });
}
