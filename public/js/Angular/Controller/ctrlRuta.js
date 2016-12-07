app.controller('ctrlRuta', ['$scope','$location','$state', function($sp,$location,$state){
	$sp.Activo = function(rutaActual){		
		return rutaActual === $location.path();
	};

	$sp.logout = function(){
		window.localStorage.removeItem('token');
		$state.go('login');
	} 
}]);