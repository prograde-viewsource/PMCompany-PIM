angular.module('productManager')
	.directive('ordercloudLogo', ordercloudLogo)
;

function ordercloudLogo() {
	"use strict";
	return {
		templateUrl: 'common/ordercloud-logo/templates/ordercloud-logo.tpl.html',
		replace:true,
		link: function(scope, element, attrs) {
			scope.OrderCloudLogo = {
				'Icon': attrs.icon ? true : false,
				'maxHeight':attrs.height,
				'fillColor': attrs.color,
				'width': attrs.width
			};
		}
	};
}