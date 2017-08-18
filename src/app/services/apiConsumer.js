angular.module('productManager').factory('apiConsumerService', apiConsumerService);

function apiConsumerService(OrderCloud, $q) {
    "use strict";
    return {
        GetProducts: _fetchProducts,
    };

    function _fetchProducts(filterOn, pipeList) { 
        filterOn = (typeof b !== 'undefined') ?  filterOn : null;
        pipeList = (typeof b !== 'undefined') ?  pipeList : null;
        




        var allData=[];
        var meta;
        var defer = $q.defer();
        var q = [];

        var filters = {};
        if(filterOn !== null)
            {filters[filterOn] = pipeList;}

        OrderCloud.Products.List(null, 1, 100, null, null, filters).then(function(resp) {
            allData = allData.concat(resp.Items);
            meta = resp.Meta;

            if (meta.TotalPages > 1) {                

                for (var i = 1; i < meta.TotalPages; i++) { 
                    q.push(
                        OrderCloud.Products.List(null, i, 100, null, null, filters).then(function(_resp) {
                            allData = allData.concat(_resp.Items);
                        })
                    );
                }

            }

            $q.all(q).then(function() {
                defer.resolve({Items: allData});
            });
        });

         return defer.promise;
    }

}