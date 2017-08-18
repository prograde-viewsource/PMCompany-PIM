angular.module( 'productManager' )
	.config( UnauthorizedConfig )
	.controller( 'unAuthorizedCtrl', unAuthorizedCtrl );

function UnauthorizedConfig( $stateProvider ) {
	"use strict";
	$stateProvider
		.state( 'unauthorized', {
			parent: 'base',
			url: '/401',
			templateUrl:'Unauthorized/templates/Unauthorized.tpl.html',
			controller:'unAuthorizedCtrl',
			controllerAs: 'unauthorized'
		})
}


function unAuthorizedCtrl( $exceptionHandler)  {
	"use strict";
	var vm = this;

}

