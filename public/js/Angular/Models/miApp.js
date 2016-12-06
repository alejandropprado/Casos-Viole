var app = angular.module('Casos',['ngRoute',"ngTable"]);

app.config(['$routeProvider',function($ruta) {
	$ruta.when('/',{
		templateUrl : "/pages/inicio.html",
		controller : "ctrlRutas",
    controller : "ctrlCasos"
  })
	.when('/todos-los-casos',{
		templateUrl : "/pages/casos.html",
		controller : "ctrlCasos"
	})
	.when('/tareas-por-caso',{
		templateUrl : "/pages/tareasCaso.html",
		controller : "ctrlCasos"
	})
	.when('/administrativo',{
		templateUrl : "/pages/administrativo.html",
		controller : "ctrlCasos"
	})
	.when('/intervenciones',{
		templateUrl : "/pages/intervenciones.html",
		controller : "ctrlCasos"
	})
	.when('/consultorios',{
		templateUrl : "/pages/consultorios.html",
		controller : "ctrlCasos"
	})
	.when('/horarios',{
		templateUrl : "/pages/horarios.html",
		controller : "ctrlHorarios"
	})
	.otherwise('/',{
		templateUrl : "/pages/casos.html",
		controller : "ctrlCasos"
	});
	
}]);

app.service('ApiJovenes', ['$http','$q', function($http,$q){
  this.Api = function(method,url,data){
    var deferred = $q.defer();
    var options = {};

    switch (method) {
      case 'GET':
      options.method = method;
      options.url = url;      
      break;
      case 'POST':
      options.method = method;
      options.url = url;    
      options.data = data 
      break;
      case 'DELETE':
      options.method = method;
      options.url = url;  
      break;
      case 'PUT':
      options.method = method;
      options.url = url;    
      options.data = data 
      break;
    }

    $http(options).success(function(data){
      deferred.resolve(data);
    })
    .error(function(msg,code){
      deferred.reject(msg);
    });
    return deferred.promise;
  };
  
}]);