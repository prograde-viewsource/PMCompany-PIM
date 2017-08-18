/* angular.module( 'productManager' )

	.config( HomeConfig )
	.controller( 'HomeCtrl', HomeController )

;

function HomeConfig( $stateProvider ) {
	$stateProvider
		.state( 'home', {
			parent: 'base',
			url: '/home',
			templateUrl: 'home/templates/home.tpl.html',
			controller: 'HomeCtrl',
			controllerAs: 'home'
		})
}

function HomeController($http, OrderCloud) {
	var vm = this;
	vm.file = {};

}
*/