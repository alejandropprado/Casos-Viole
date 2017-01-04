app.controller('consultorioCtrl', ['$scope', 'ApiJovenes', 'NgTableParams', function($sp, ApiJovenes, NgTableParams){
	$sp.Consultorios = [];
	$sp.mensaje ={mostrar:false,tipo:"",descripcion:""};
	$sp.Consultorio = {};
	$sp.NuevoConsultorio = {};

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

		$sp.Consultorio = new Consultorio(obj.Id, obj.Nombre, obj.Direccion, obj.Telefono);
		$('#EditConsultorio').modal();
	};
	$sp.EditarConsultorioOK = function(){		

		if(validarConsultorio($sp.Consultorio)){
			ApiConsultorios('PUT','/api/consultorios/'+$sp.Consultorio.Id, $sp.Consultorio, function(datos){

				for (var i = $sp.Consultorios.length - 1; i >= 0; i--) {
					if($sp.Consultorios[i].Id === datos.Id){
						$sp.Consultorios[i] = datos;
						break;
					}
				}

				$('#EditConsultorio').modal('hide');
				$sp.mensaje.mostrar = false;
				$sp.Consultorio = {};
				initTablaConsultorios($sp.Consultorios);			

			}, function(err){
				$sp.mensaje ={mostrar:true,tipo:"edit",descripcion:"¡ERROR!, Ha ocurrido un erro al actualizar los datos"};		
			});
		} else {
			$sp.mensaje ={mostrar:true,tipo:"edit",descripcion:"¡ERROR!, Debe Completar todos los campos"};			
		}	
	};

	$sp.EliminarConsultorio = function(obj){
		$('#confirm').modal();
		$sp.Consultorio = new Consultorio(obj.Id, obj.Nombre, obj.Direccion, obj.Telefono);
	};

	$sp.EliminarConsultorioOK = function(){
		ApiConsultorios('DELETE','/api/consultorios/'+$sp.Consultorio.Id, {}, function (data) {

			for (var i = $sp.Consultorios.length - 1; i >= 0; i--) {
				if($sp.Consultorios[i].Id === data.Id){
					$sp.Consultorios.splice(i, 1);
				}
			}

			initTablaConsultorios($sp.Consultorios);
			$sp.Consultorio = {};
			$sp.mensaje.mostrar = false;
			$('#confirm').modal('hide');
		}, function (err) {
			$sp.mensaje.mostrar = true;
			$sp.mensaje.descripcion = "¡ERROR!, Ha ocurrio un error al eliminar.";
			$sp.mensaje.tipo = "delete";
		});	
	};

	$sp.AgregarConsultorio = function(){
		if(validarConsultorio($sp.NuevoConsultorio)){

			ApiConsultorios('POST', '/api/consultorios', $sp.NuevoConsultorio , function(datos){
				$sp.Consultorios.push(datos);
				$('#addConsultorio').modal('hide');
				initTablaConsultorios($sp.Consultorios);
				$sp.NuevoConsultorio = {};
				$sp.mensaje.mostrar = false;
			}, function(err){
				$sp.mensaje.mostrar = true;
				$sp.mensaje.descripcion = "¡ERROR!, Ha ocurrio un error al agregar.";
				$sp.mensaje.tipo = "add";
			});
		}else{
			$sp.mensaje.mostrar = true;
			$sp.mensaje.descripcion = "¡ERROR!, Debe completar todos los campos.";
			$sp.mensaje.tipo = "add";
		}
	};

	function validarConsultorio(consultorio) {
		var valido = true;

		if( /^\s*$/.test(consultorio.Nombre) ){
			valido = false;
		} else if( /^\s*$/.test(consultorio.Direccion) ){
			valido = false;
		} else if( /^\s*$/.test(consultorio.Telefono) ){
			valido = false;
		}

		return valido;
	}

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

}]);