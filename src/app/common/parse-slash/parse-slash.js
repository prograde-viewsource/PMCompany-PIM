angular.module('productManager').directive('parseSlash', function() {
    "use strict";
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attrs, ngModel) {

            //format text going to user (model to view)
            ngModel.$formatters.push(function(value) {
                if (value) {
                    return value.replace(/%2F/g, '/');
                } else {
                    return '';
                }
            });

            //format text from the user (view to model)
            ngModel.$parsers.push(function(value) {
                if (value) {
                    return value.replace(/\//g, '%2F');
                } else {
                    return '';
                }
            });
        }
    };
});

angular.module('productManager').filter('slashify', function() {
    "use strict";
    return function(value) {
        if (value) {
            return value.replace(/%2F/g, '/');
        }
    };
});