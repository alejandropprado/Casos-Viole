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

app.service('ApiJovenes',['$http', function ($http) {
  this.Api = function(method,url,data, next, error) {
    scope = [];
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
    }

    $http(options).then(
      function success(data) {
        var arrayJovenes = data.data.jovenes;
        var jovenes = [] ;
        for (var i = arrayJovenes.length - 1; i >= 0; i--) {
          var joven = new Joven(
            arrayJovenes[i].nombre, 
            arrayJovenes[i].apellido, 
            arrayJovenes[i].rut, 
            moment(arrayJovenes[i].fecha_Nacimiento).format('DD/MM/YYYY'), 
            arrayJovenes[i].direccion, 
            arrayJovenes[i].adulto_responsable, 
            arrayJovenes[i].numero_contacto, 
            moment(arrayJovenes[i].fecha_ingreso).format('DD/MM/YYYY'), 
            arrayJovenes[i].rit, 
            arrayJovenes[i].tribunal
            );
          jovenes.push(joven);
        }

        try {
          console.log('Envio Jovenes');
          console.log(jovenes);
          next(jovenes);
        }
        catch(err) {}
        
      }, function error(data) {
        try{
          error(data)
        }
        catch(err){}
      });
  }
}]);