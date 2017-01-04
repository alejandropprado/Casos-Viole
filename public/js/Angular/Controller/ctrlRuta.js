app.controller('ctrlRuta', 
	['$scope',
	'$location',
	'$state',
	'FBLogin',
	function($sp, $location, $state, FbAuth){

		$sp.Usuario = JSON.parse(window.localStorage.getItem('usuario'));

		$sp.Activo = function(rutaActual){		
			return rutaActual === $location.path();
		};

		$sp.logout = function(){	
			console.log('logout');
			
			window.localStorage.removeItem('token');
			window.localStorage.removeItem('usuario');
			$state.go('login');

		} 

	}]);