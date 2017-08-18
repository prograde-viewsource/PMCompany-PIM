angular.module('productManager')
	.factory('Underscore', UnderscoreFactory)
;

function UnderscoreFactory($window) {
	"use strict";
	return $window._;
}