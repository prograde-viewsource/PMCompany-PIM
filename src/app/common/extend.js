/*angular.module('productManager').run(['$state', function ($state) {
    'use strict';
    $state.get('buyers.edit').controller = 'BuyerEditExtendCtrl';
}]).controller('BuyerEditExtendCtrl', BuyerEditExtendCtrl)

function BuyerEditExtendCtrl($scope, $controller, SelectedBuyer, LabeledSpecs) {
    "use strict";
    var vm = this;

    // Inherit from Base Controller
    angular.extend(vm, $controller('BuyerEditCtrl', {
        $scope: $scope,
        SelectedBuyer: SelectedBuyer,
        LabeledSpecs: LabeledSpecs
    }));

    console.log(vm)

    vm.buyerName = "bob";
    console.log('OVERRIDE!!!!')
};*/