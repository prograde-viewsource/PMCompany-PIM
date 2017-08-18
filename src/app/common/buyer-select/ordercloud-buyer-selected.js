angular.module('ordercloud-buyer-select', [])

    .directive('ordercloudSelectBuyer', SelectBuyerDirective)
    .controller('SelectBuyerCtrl', SelectBuyerController)

;

function SelectBuyerDirective() {
    "use strict";
    return {
        restrict: 'E',
        templateUrl: 'common/buyer-select/templates/buyer-select.tpl.html',
        controller: 'SelectBuyerCtrl',
        controllerAs: 'selectBuyer'
    };
}

function SelectBuyerController($scope, $state, OrderCloud) {
    "use strict";
    var vm = this;

    vm.align = $scope.align;

    OrderCloud.Buyers.List().then(function(data) {
        vm.BuyerList = data;
        if(!vm.selectedBuyer)
            {
                OrderCloud.BuyerID.Set(vm.BuyerList[0].ID);
                $state.reload($state.current);
            }
    });

    OrderCloud.Buyers.Get(OrderCloud.BuyerID.Get()).then(function(data) {
        vm.selectedBuyer = data;
    });

    vm.ChangeBuyer = function(buyer) {
        OrderCloud.Buyers.Get(buyer.ID).then(function(data) {
            vm.selectedBuyer = data;
            OrderCloud.BuyerID.Set(data.ID);
            $state.go('categories');
            if(buyer.ID !== vm.selectedBuyer.ID){
                $state.reload($state.current);
            }
        });
    };

    vm.pagingfunction = function() {
        if (vm.BuyerList.Meta.Page <= vm.BuyerList.Meta.TotalPages) {
            OrderCloud.Buyers.List(null, vm.BuyerList.Meta.Page + 1, vm.BuyerList.Meta.PageSize)
                .then(function(data) {
                    vm.BuyerList.Meta = data.Meta;
                    vm.BuyerList.Items = [].concat(vm.BuyerList.Items, data.Items);
                });
        }
    };
}
