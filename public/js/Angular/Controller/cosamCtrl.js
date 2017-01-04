app.controller('cosamCtrl', ['$scope', 'ApiJovenes', 'NgTableParams', function($sp, ApiJovenes, NgTableParams){
	$sp.Cosams = [];
	$sp.mensaje ={mostrar:false,tipo:"",descripcion:""};
	$sp.Cosam = {};
	$sp.NuevoCosam = {};

	function initTablaCosam(array) {
		var param = {
			page:1,
			count:5
		};
		var conf={
			dataset: array,
			counts:[5,10,15]
		};
		$sp.tablaCosam = new NgTableParams(param,conf);
	}
	$sp.FiltroCosam = function(){
		$sp.tablaCosam.filter({ $: $sp.busquedaCosam });
	};

	ApiCosam('GET', '/api/cosam/', {}, function(datos){
		$sp.Cosams = datos;
		initTablaCosam($sp.Cosams);
	});

	$sp.EditarCosam = function(obj){

		$sp.Cosam = new Cosam(obj.Id, obj.Nombre, obj.Direccion, obj.Telefono);
		$('#EditCosam').modal();
	};
	$sp.EditarCosamOK = function(){		

		if(validarCosam($sp.Cosam)){
			ApiCosam('PUT','/api/cosam/'+$sp.Cosam.Id, $sp.Cosam, function(datos){

				for (var i = $sp.Cosams.length - 1; i >= 0; i--) {
					if($sp.Cosams[i].Id === datos.Id){
						$sp.Cosams[i] = datos;
						break;
					}
				}

				$('#EditCosam').modal('hide');
				$sp.mensaje.mostrar = false;
				$sp.Cosam = {};
				initTablaCosam($sp.Cosams);			

			}, function(err){
				$sp.mensaje ={mostrar:true,tipo:"edit",descripcion:"¡ERROR!, Ha ocurrido un erro al actualizar los datos"};		
			});
		} else {
			$sp.mensaje ={mostrar:true,tipo:"edit",descripcion:"¡ERROR!, Debe Completar todos los campos"};			
		}	
	};

	$sp.EliminarCosam = function(obj){
		$('#confirm').modal();
		$sp.Cosam = new Cosam(obj.Id, obj.Nombre, obj.Direccion, obj.Telefono);
	};

	$sp.EliminarCosamOK = function(){
		ApiCosam('DELETE','/api/cosam/'+$sp.Cosam.Id, {}, function (data) {

			for (var i = $sp.Cosams.length - 1; i >= 0; i--) {
				if($sp.Cosams[i].Id === data.Id){
					$sp.Cosams.splice(i, 1);
				}
			}

			initTablaCosam($sp.Cosams);
			$sp.Cosam = {};
			$sp.mensaje.mostrar = false;
			$('#confirm').modal('hide');
		}, function (err) {
			$sp.mensaje.mostrar = true;
			$sp.mensaje.descripcion = "¡ERROR!, Ha ocurrio un error al eliminar.";
			$sp.mensaje.tipo = "delete";
		});	
	};

	$sp.AgregarCosam = function(){
		if(validarCosam($sp.NuevoCosam)){

			ApiCosam('POST', '/api/cosam', $sp.NuevoCosam , function(datos){
				$sp.Cosams.push(datos);
				$('#addCosam').modal('hide');
				initTablaCosam($sp.Cosams);
				$sp.NuevoCosam = {};
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

	function validarCosam(cosam) {
		var valido = true;

		if( /^\s*$/.test(cosam.Nombre) ){
			valido = false;
		} else if( /^\s*$/.test(cosam.Direccion) ){
			valido = false;
		} else if( /^\s*$/.test(cosam.Telefono) ){
			valido = false;
		}

		return valido;
	}

	function ApiCosam(method, url, data, success, error) {
		ApiJovenes.Api(method, url, data)
		.then(function(data){
			switch (method.toUpperCase()) {
				case 'GET':
				try {
					var arrayCosam = data.cosam;
					var cosam = [];

					for (var i = arrayCosam.length - 1; i >= 0; i--) {
						var nuevoCosam = new Cosam(
							arrayCosam[i].id,
							arrayCosam[i].nombre,
							arrayCosam[i].direccion,
							arrayCosam[i].telefono
							);

						cosam.push(nuevoCosam);
					}

					success(cosam);					

				} catch(e) {
					console.log(e);
				}
				break;
				case 'POST':
				case 'PUT':
				case 'DELETE':
				try {
					var c = data.cosam;
					var cosam = new Cosam(
						c.id,
						c.nombre,
						c.direccion,
						c.telefono
						);

					success(cosam);

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