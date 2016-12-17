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
			
			if($sp.Usuario.proveedor){
				FbAuth.Logout( function () {
					console.log('cerrando sesion de fb');
					window.localStorage.removeItem('token');
					window.localStorage.removeItem('usuario');
					$state.go('login');
				});
			} else {
				window.localStorage.removeItem('token');
				window.localStorage.removeItem('usuario');
				$state.go('login');
			}

		} 

	}]);