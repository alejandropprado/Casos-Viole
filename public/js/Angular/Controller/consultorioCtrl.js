app.controller('consultorioCtrl', ['$scope', 'ApiJovenes', 'NgTableParams', function($sp, ApiJovenes, NgTableParams){
	$sp.Consultorios = [];
	$sp.mensaje ={mostrar:false,tipo:"",descripcion:""};
	$sp.Consultorio = {};

	function initTablaConsultorios(array) {
		var param = {
			page:1,
			count:5
		};
		var conf={
			dataset: array,
			counts:[5,10,15]
		};
		$sp.tablaConsultorio = new NgTableParams(param,conf);
	}
	$sp.FiltroConsultorio = function(){
		$sp.tablaConsultorio.filter({ $: $sp.busquedaConsultorio });
	};

	ApiConsultorios('GET', '/api/consultorios/', {}, function(datos){
		$sp.Consultorios = datos;
		initTablaConsultorios($sp.Consultorios);
	});

	$sp.EditarConsultorio = function(obj){

		$sp.Consultorio = new Consultorio(obj.Id, obj.Nombre, obj.Direccion, obj.Telefono);;
		$('#EditConsultorio').modal();
	};
	$sp.EditarConsultorioOK = function(){

		var valido = true;

		if( /^\s*$/.test($sp.Consultorio.Nombre) ){
			valido = false;
		} else if( /^\s*$/.test($sp.Consultorio.Direccion) ){
			valido = false;
		} else if( /^\s*$/.test($sp.Consultorio.Telefono) ){
			valido = false;
		}

		if(valido){
			ApiConsultorios('PUT','/api/consultorios/'+$sp.Consultorio.Id, $sp.Consultorio, function(datos){

				for (var i = $sp.Consultorios.length - 1; i >= 0; i--) {
					if($sp.Consultorios[i].Id === datos.Id){
						$sp.Consultorios[i] = datos;
						break;
					}
				}

				$sp.Consultorio = {};
				initTablaConsultorios($sp.Consultorios);
				$('#addConsultorio').modal('hide');

			}, function(err){
			});
		} else {
			$sp.mensaje ={mostrar:true,tipo:"edit",descripcion:"¡ERROR!, Debe Completar todos los campos"};			
		}	
	};

	/*Falta agregar y completar el eliminar*/

	$sp.EliminarConsultorio = function(obj){
		$('.deleteConsultorio').confirmation({
			onConfirm: function() {
				ApiConsultorios('DELETE','/api/consultorios/'+obj.Id, {}, function (data) {

					for (var i = $sp.Consultorios.length - 1; i >= 0; i--) {
						if($sp.Consultorios[i].Id === data.Id){
							$sp.Consultorios.splice(i, 1);
						}
					}

					initTablaConsultorios($sp.Consultorios);
				}, function (err) {
					$sp.mensaje.mostrar = true;
					$sp.mensaje.descripcion = "¡ERROR!, Al eliminar";
					$sp.mensaje.tipo = "add";
				});		
			},
			buttons: [
			{
				label: 'SI',
				class: 'btn btn-xs btn-primary',
				icon: 'fa fa-check'
			},
			{
				label: 'NO',
				class: 'btn btn-xs btn-default',
				icon: 'fa fa-close'
			}],

		});
	};

	function ApiConsultorios(method, url, data, success, error) {
		ApiJovenes.Api(method, url, data)
		.then(function(data){
			switch (method.toUpperCase()) {
				case 'GET':
				try {
					var arrayConsultorios = data.consultorios;
					var consultorios = [];

					for (var i = arrayConsultorios.length - 1; i >= 0; i--) {
						var nuevoConsultorio = new Consultorio(
							arrayConsultorios[i].id,
							arrayConsultorios[i].nombre,
							arrayConsultorios[i].direccion,
							arrayConsultorios[i].telefono
							);

						consultorios.push(nuevoConsultorio);
					}

					success(consultorios);					

				} catch(e) {
					console.log(e);
				}
				break;
				case 'POST':
				case 'PUT':
				case 'DELETE':
				try {
					var consu = data.consultorio;
					var consultorio = new Consultorio(
						consu.id,
						consu.nombre,
						consu.direccion,
						consu.telefono
						);

					success(consultorio);

				} catch(e) {
					console.log(e);
				}
				break;
			}
		},function (err){
			try {
				error(err);
			} catch(e) {
				console.log(e);
			}
		});
	}
	
	//jquery
	$('.btnInfo').popover();
	$('.deleteConsultorio').confirmation('show');

}]);