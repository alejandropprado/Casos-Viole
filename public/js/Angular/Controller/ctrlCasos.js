app.controller('ctrlCasos', ['$scope','NgTableParams','$http','ApiJovenes', function($sp,NgTableParams,$http,ApiJovenes){	
	/*inicialización*/

	$sp.mensaje ={mostrar:false,tipo:"",descripcion:""};
	$sp.nuevoJoven = new Joven();
	$sp.jovenEliminar = {};
	$sp.jovenes = [];
	//limpiarFechas($sp.nuevoJoven);

	$sp.navpills = {
		datos : true,
		consultorio : false,
		cosam: false
	};

	$sp.Consultorios = [
	new Consultorio(1,'Centro de Salud Dra. Haydeé López Casoou','Lo Martínez Nº 862','02-5761451'),
	new Consultorio(2,'Centro de Salud Familiar Orlando Letelier','Lo Moreno 890','800500454'),
	new Consultorio(3,'CESFAM Carlos Lorca ','Claudina Parra #11.028','25470523'),
	new Consultorio(4,'Cesfam Dr. Mario Salcedo Sepúlveda','Pasaje Mar Báltico Nº 13256','600 360 7777'),
	new Consultorio(5,'Cesfam Santa Alselma ','Fernando de Aragon 8365','800 500 457'),
	new Consultorio(6,'CESFAM Santa Laura','Indio Gerónimo 10460','800500453'),
	new Consultorio(7,'Consultorio Eduardo Frei Montalva','Avda. Ossa N° 140','5760900'),
	];                                                        

	$sp.Cosams = [
	new Cosam(1,'Alter Joven','El Pajar #10675, El Bosque','5585997'),
	new Cosam(2,'COSAM Pedro Aguirre Cerda','Avda. La Marina N° 2256','800500020'),
	];

	$sp.Filtros = [
	{id : 1, name: 'Nombre'},
	{id : 2, name: 'Apellido'},
	{id : 3, name: 'Rut'},
	];

	function initTablaJovenes(array) {
		var param = {
			page:1,
			count:5
		};
		var conf={
			dataset: array,
			counts:[5,10,15]
		};
		$sp.tableParams = new NgTableParams(param,conf);
	}

	$sp.FiltrarGlobal = function(){
		var opcion;
		if($sp.tipoFiltro !== undefined && $sp.tipoFiltro !== null){
			opcion = $sp.tipoFiltro.id;
		}

		var term = $sp.busqueda;

		switch(opcion){
			case 1:
			$sp.tableParams.filter({ Nombre : term});
			break;
			case 2:
			$sp.tableParams.filter({ Apellido : term});
			break;
			case 3:
			$sp.tableParams.filter({ Rut : term});
			break;
			default:
			$sp.tableParams.filter({ $: term });
		}
	};

	//Recuperando los datos 
	ActionAPI('GET','/api/jovenes',{},function(jovenes){
		$sp.jovenes = jovenes;
		initTablaJovenes($sp.jovenes);		
	},function(err){
		console.log('ERROR');
	});

	//click para ver los datos del joven seleccionado
	$sp.VerJoven = function(elm){
		$sp.mensaje ={mostrar:false,tipo:"",descripcion:""};
		$sp.editJoven = false;
		$sp.joven = new Joven(elm.Nombre,elm.Apellido,elm.Rut,elm.FechaNacimiento,elm.Direccion,elm.AdultoResponsable,elm.NumContacto,elm.FechaIngreso,elm.Rit,elm.Tribunal,elm.Consultorio,elm.Cosam);

		$('#delete').confirmation('hide');

		$('#modalJoven').modal();
	};

	$sp.addJoven = function(){
		$sp.mensaje ={mostrar:false,tipo:"",descripcion:""};
		$sp.nuevoJoven = new Joven();
		$('#addJoven').modal();
	};

	$sp.addJovenOk = function(){

		$sp.nuevoJoven.FechaNacimiento = $('#dateAddNacimiento > input').val();
		$sp.nuevoJoven.FechaIngreso =$('#dateAddIngreso > input').val();

		ActionAPI('POST','/api/jovenes', $sp.nuevoJoven, function (joven) {

			var repetido = false;
			
			for (var i = $sp.jovenes.length - 1; i >= 0; i--) {
				if($sp.jovenes[i].Rut == joven.Rut){
					$sp.jovenes[i] = joven;
					repetido = true;
					break;
				} 				
			}

			if(!repetido) $sp.jovenes.push(joven);

			$sp.nuevoJoven = new Joven();
			//limpiarFechas($sp.nuevoJoven);
			$('#addJoven').modal('hide');
			initTablaJovenes($sp.jovenes);
		}, function (err) {
			console.log(err);
			$sp.mensaje.mostrar = true;
			$sp.mensaje.descripcion = "¡ERROR!, Debe completar los campos";
			$sp.mensaje.tipo = "add";
			console.log("no guardo");
		});	


	};

	$sp.EditarJoven = function(obj){
		obj.FechaNacimiento = $('#dateEditNacimiento > input').val();
		obj.FechaIngreso = $('#dateEditIngreso > input').val();

		ActionAPI('PUT','/api/jovenes/'+obj.Rut, obj, function (joven) {
			var repetido = false;
			
			for (var i = $sp.jovenes.length - 1; i >= 0; i--) {
				if($sp.jovenes[i].Rut == joven.Rut){
					$sp.jovenes[i] = joven;
					repetido = true;
					break;
				} 				
			}

			if(!repetido) $sp.jovenes.push(joven);

			$sp.nuevoJoven = new Joven();
			//limpiarFechas($sp.nuevoJoven);
			$('#addJoven').modal('hide');
			initTablaJovenes($sp.jovenes);
			$sp.editJoven=false;
			$sp.mensaje.mostrar = false;
		}, function (err) {
			$sp.mensaje.mostrar = true;
			$sp.mensaje.descripcion = "¡ERROR al Acutualizar!, Debe completar los campos";
			$sp.mensaje.tipo = "add";
			console.log("no guardo");
			console.log(err);
		});
	};

	/*
	*	-Confirmation 
	*	metodo para eliminar al joven seleccionado
	*/
	$('#delete').confirmation({
		onConfirm: function() {
			ActionAPI('DELETE','/api/jovenes/'+$sp.joven.Rut,{}, function (joven) {

				for (var i = $sp.jovenes.length - 1; i >= 0; i--) {
					if($sp.jovenes[i].Rut == joven.Rut){
						$sp.jovenes.splice(i, 1);
					}
				}

				$sp.nuevoJoven = new Joven();
				initTablaJovenes($sp.jovenes);
				$('#modalJoven').modal('hide');
			}, function (err) {
				$sp.mensaje.mostrar = true;
				$sp.mensaje.descripcion = "¡ERROR!, Al eliminar";
				$sp.mensaje.tipo = "add";
				console.log("no Elimino");
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


	function ActionAPI(method,url,data,success,error){
		ApiJovenes.Api(method,url, data).then(
			function (data){
				switch (method.toUpperCase()) {
					case 'GET':
					var arrayJovenes = data.jovenes;
					var jovenes = [];
					for (var i = arrayJovenes.length - 1; i >= 0; i--) {          
						var joven = new Joven(
							arrayJovenes[i].nombre, 
							arrayJovenes[i].apellido, 
							arrayJovenes[i].rut, 
							moment(arrayJovenes[i].fecha_nacimiento).format('DD/MM/YYYY'), 
							arrayJovenes[i].direccion, 
							arrayJovenes[i].adulto_responsable, 
							arrayJovenes[i].numero_contacto, 
							moment(arrayJovenes[i].fecha_ingreso).format('DD/MM/YYYY'), 
							arrayJovenes[i].rit, 
							arrayJovenes[i].tribunal
							);

						if(arrayJovenes[i].consultorio){
							var c = arrayJovenes[i].consultorio;
							joven.Consultorio = new Consultorio(c.id, c.nombre, c.direccion, c.telefono);
						}
						if(arrayJovenes[i].cosam){
							var c = arrayJovenes[i].cosam;
							joven.Cosam = new Cosam(c.id, c.nombre, c.direccion, c.telefono);
						}

						jovenes.push(joven);
					}

					try {
						success(jovenes);
					}
					catch(err) {}
					break;
					case 'POST':
					case 'PUT':	
					case 'DELETE':				
					var jovenData = data.joven;
					var joven = new Joven(
						jovenData.nombre, 
						jovenData.apellido, 
						jovenData.rut, 
						moment(jovenData.fecha_nacimiento).format('DD/MM/YYYY'), 
						jovenData.direccion, 
						jovenData.adulto_responsable, 
						jovenData.numero_contacto, 
						moment(jovenData.fecha_ingreso).format('DD/MM/YYYY'), 
						jovenData.rit, 
						jovenData.tribunal
						);

					if(jovenData.consultorio){
						var c = jovenData.consultorio;
						joven.Consultorio = new Consultorio(c.id, c.nombre, c.direccion, c.telefono);
					}
					if(jovenData.cosam){
						var c = jovenData.cosam;
						joven.Cosam = new Cosam(c.id, c.nombre, c.direccion, c.telefono);
					}				

					try {
						success(joven);
					}
					catch(err) {}
					break;
				}
			},function (err){
				try {
					error(err);
				}catch (e){}
			});
	}

	/*funciones datatimepicker jquery*/
	var now = moment(new Date());	
	$('#dateAddNacimiento').datetimepicker({
		format: 'DD/MM/YYYY',
		viewMode: 'years',
		maxDate: now
	});
	$('#dateAddIngreso').datetimepicker({
		format: 'DD/MM/YYYY',
		viewMode: 'years',
		maxDate: now	
	});
	/*EDIT*/
	$('#dateEditNacimiento').datetimepicker({
		format: 'DD/MM/YYYY',
		viewMode: 'years',
		maxDate: now
	});
	$('#dateEditIngreso').datetimepicker({
		format: 'DD/MM/YYYY',
		viewMode: 'years',
		maxDate: now
	});

	
	/*FIN*/


	$sp.verProp =function(e){
		switch(e){
			case 'datos':
			$sp.navpills = {
				datos : true,
				consultorio : false,
				cosam: false
			};break;
			case 'consultorio':
			$sp.navpills = {
				datos : false,
				consultorio : true,
				cosam: false
			};break;
			case 'cosam':
			$sp.navpills = {
				datos : false,
				consultorio : false,
				cosam: true
			};break;
		}
	};

	$('.btnInfo').popover();

}]);