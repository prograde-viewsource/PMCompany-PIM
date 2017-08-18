angular.module('user-permissions', ['productManager']);
angular.module('user-permissions')
    .directive('userPermissions', UserPermissonsDirective)

function UserPermissonsDirective(UserGroupService) {
    "use strict";
    return {
        restrict: 'A',
        scope: {
            pbit: '=',
            pobj: '@'
        },
        link: function (scope, element) {
            let xpBit = 0;
            
            UserGroupService.getList().then(function (ug) {


                angular.forEach(ug, function (item) {
                    if (item.xp[scope.pobj] > xpBit)
                        xpBit = item.xp[scope.pobj];
                });

                let bM = xpBit & scope.pbit;

                if (bM === scope.pbit ) {
                    //$(element).removeClass('disabled').attr('disabled', false);
                }else{
                    $(element).addClass('disabled').attr('disabled', true);
                }
            });
        }
    }

}

