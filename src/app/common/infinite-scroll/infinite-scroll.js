angular.module('ordercloud-infinite-scroll', ['ordercloud-search', 'ordercloud-paging-helpers']);
angular.module('ordercloud-infinite-scroll')

.directive('ordercloudInfiniteScroll', InfiniteScrollDirective)
    .controller('InfiniteScrollCtrl', InfiniteScrollController);

function InfiniteScrollDirective(Paging) {
    "use strict";
    return {
        restrict: 'A',
        scope: {
            servicename: '@',
            controlleras: '=',
            idname: '@',
            threshold: '@',
            // AG Added Custom paging function
            pagingfunction: '@'
        },
        controller: 'InfiniteScrollCtrl',
        controllerAs: 'InfiniteScroll',
        link: function(scope, element) {
            var threshold = scope.threshold || 0;
            var ele = element[0];
            element.bind('scroll', function() {
                if (ele.scrollTop + ele.offsetHeight + threshold >= ele.scrollHeight) {
                    if (scope.controlleras && scope.controlleras.pagingfunction !== undefined) {
                        scope.controlleras.pagingfunction();
                    }
                    //Ag Added Custom paging function
                    else if (scope.controlleras && scope.pagingfunction !== undefined) {
                        scope.controlleras[scope.pagingfunction]();
                    } else if (scope.servicename && scope.controlleras && scope.controlleras.list) {
                        Paging.paging(scope.controlleras.list, scope.servicename);
                    }
                    /* Else display a console error */
                    else {
                        console.log('Error: Infinite scroll directive not fully defined.');
                    }
                }
            });
        }
    };
}

function InfiniteScrollController($scope, Paging, TrackSearch) {
    "use strict";
    TrackSearch.SetTerm(null);
    $scope.$watchCollection(function() {
        if ($scope.controlleras && $scope.controlleras.assignments) {
            return $scope.controlleras.assignments;
        }
    }, function() {
        if ($scope.controlleras && $scope.controlleras.assignments && $scope.controlleras.list && $scope.idname) {
            Paging.setSelected($scope.controlleras.list.Items, $scope.controlleras.assignments.Items, $scope.idname);
        }
    });
}