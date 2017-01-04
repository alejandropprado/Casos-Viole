app.controller('programaSaludCtrl', ['$scope', 'ApiJovenes', 'NgTableParams', function($sp, ApiJovenes, NgTableParams){
	$sp.ProgramasDeSalud = [];
	$sp.mensaje ={mostrar:false,tipo:"",descripcion:""};
	$sp.Programa = {};
	$sp.NuevoPrograma = {};

	function initTablaProgramasDeSalud(array) {
		console.log(array);
		var param = {
			page:1,
			count:5
		};
		var conf={
			dataset: array,
			counts:[5,10,15]
		};
		$sp.tablaProgramasDeSalud = new NgTableParams(param,conf);
	}
	
	$sp.FiltroProgramasDeSalud = function(){
		$sp.tablaProgramasDeSalud.filter({ $: $sp.busquedaProgramasDeSalud });
	};

	ApiProgramaSalud('GET', '/api/programa-salud/', {}, function(datos){
		$sp.ProgramasDeSalud = datos;
		initTablaProgramasDeSalud($sp.ProgramasDeSalud);
	});

	$sp.EditarProgramaSalud = function(obj){

		$sp.Programa = new ProgramaSalud(obj.Id, obj.Nombre, obj.Direccion, obj.Telefono);
		$('#EditProgramaSalud').modal();
	};
	$sp.EditarProgramaSaludOK = function(){		

		if(validarProgramaSalud($sp.Programa)){
			ApiProgramaSalud('PUT','/api/programa-salud/'+$sp.Programa.Id, $sp.Programa, function(datos){

				for (var i = $sp.ProgramasDeSalud.length - 1; i >= 0; i--) {
					if($sp.ProgramasDeSalud[i].Id === datos.Id){
						$sp.ProgramasDeSalud[i] = datos;
						break;
					}
				}

				$('#EditProgramaSalud').modal('hide');
				$sp.mensaje.mostrar = false;
				$sp.Programa = {};
				initTablaProgramasDeSalud($sp.ProgramasDeSalud);			

			}, function(err){
				$sp.mensaje ={mostrar:true,tipo:"edit",descripcion:"¡ERROR!, Ha ocurrido un erro al actualizar los datos"};		
			});
		} else {
			$sp.mensaje ={mostrar:true,tipo:"edit",descripcion:"¡ERROR!, Debe Completar todos los campos"};			
		}	
	};

	$sp.EliminarProgramaSalud = function(obj){
		$('#confirm').modal();
		$sp.Programa = new ProgramaSalud(obj.Id, obj.Nombre, obj.Direccion, obj.Telefono);
	};

	$sp.EliminarProgramaSaludOK = function(){
		ApiProgramaSalud('DELETE','/api/programa-salud/'+$sp.Programa.Id, {}, function (data) {

			for (var i = $sp.ProgramasDeSalud.length - 1; i >= 0; i--) {
				if($sp.ProgramasDeSalud[i].Id === data.Id){
					$sp.ProgramasDeSalud.splice(i, 1);
				}
			}

			initTablaProgramasDeSalud($sp.ProgramasDeSalud);
			$sp.Programa = {};
			$sp.mensaje.mostrar = false;
			$('#confirm').modal('hide');
		}, function (err) {
			$sp.mensaje.mostrar = true;
			$sp.mensaje.descripcion = "¡ERROR!, Ha ocurrio un error al eliminar.";
			$sp.mensaje.tipo = "delete";
		});	
	};

	$sp.AgregarProgramaSalud = function(){
		if(validarProgramaSalud($sp.NuevoPrograma)){

			ApiProgramaSalud('POST', '/api/programa-salud', $sp.NuevoPrograma , function(datos){
				$sp.ProgramasDeSalud.push(datos);
				$('#addProgramaSalud').modal('hide');
				initTablaProgramasDeSalud($sp.ProgramasDeSalud);
				$sp.NuevoPrograma = {};
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

	function validarProgramaSalud(programa) {
		var valido = true;

		if( /^\s*$/.test(programa.Nombre) ){
			valido = false;
		} else if( /^\s*$/.test(programa.Direccion) ){
			valido = false;
		} else if( /^\s*$/.test(programa.Telefono) ){
			valido = false;
		}

		return valido;
	}

	function ApiProgramaSalud(method, url, data, success, error) {
		ApiJovenes.Api(method, url, data)
		.then(function(data){
			switch (method.toUpperCase()) {
				case 'GET':
				try {
					var arrayProgramas = data.programasSalud;
					var programasDeSalud = [];

					for (var i = arrayProgramas.length - 1; i >= 0; i--) {
						var nuevoPrograma = new ProgramaSalud(
							arrayProgramas[i].id,
							arrayProgramas[i].nombre,
							arrayProgramas[i].direccion,
							arrayProgramas[i].telefono
							);

						programasDeSalud.push(nuevoPrograma);
					}

					success(programasDeSalud);					

				} catch(e) {
					console.log(e);
				}
				break;
				case 'POST':
				case 'PUT':
				case 'DELETE':
				try {
					var c = data.programaSalud;
					var programa = new ProgramaSalud(
						c.id,
						c.nombre,
						c.direccion,
						c.telefono
						);

					success(programa);

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