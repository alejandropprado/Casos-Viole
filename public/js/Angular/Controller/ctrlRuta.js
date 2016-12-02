app.controller('ctrlRuta', ['$scope','$location', function($sp,$location){
	$sp.Activo = function(rutaActual){		
		return rutaActual === $location.path();
	};
}]);