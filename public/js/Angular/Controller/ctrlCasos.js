app.controller('ctrlCasos', ['$scope','NgTableParams','$http','ApiJovenes', function($sp,NgTableParams,$http,ApiJovenes){	
	/*inicialización*/
	$sp.mensaje ={mostrar:false,tipo:"",descripcion:""};
	$sp.nuevoJoven = new Joven();
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
		console.log(typeof $sp.tipoFiltro);
		if($sp.tipoFiltro !== undefined && $sp.tipoFiltro !== null){
			opcion = $sp.tipoFiltro.id;
		}

		var term = $sp.busqueda;
		console.log(term);

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

	ApiJovenes.Api('GET','/api/jovenes',{}, function (jovenes) {
		console.log('recibi -> ');
		console.log(jovenes);
		$sp.jovenes = jovenes;
		initTablaJovenes($sp.jovenes);
	});	

	$sp.VerJoven = function(elm){
		$sp.mensaje ={mostrar:false,tipo:"",descripcion:""};
		$sp.editJoven = false;
		$sp.joven = new Joven(elm.Nombre,elm.Apellido,elm.Rut,elm.FechaNacimiento,elm.Direccion,elm.AdultoResponsable,elm.NumContacto,elm.FechaIngreso,elm.Rit,elm.Tribunal,elm.Consultorio,elm.Cosam);

		$('#modalJoven').modal();

	};

	$sp.addJoven = function(){
		$sp.mensaje ={mostrar:false,tipo:"",descripcion:""};
		$sp.nuevoJoven = new Joven();
		$('#addJoven').modal();
	};

	$sp.addJovenOk = function(){

		console.log($sp.nuevoJoven);

		$sp.nuevoJoven.FechaNacimiento = $('#dateAddNacimiento > input').val();
		$sp.nuevoJoven.FechaIngreso =$('#dateAddIngreso > input').val();

		ApiJovenes.Api('POST','/api/jovenes', $sp.nuevoJoven, function (jovenes) {
			$sp.jovenes = jovenes;
			$sp.nuevoJoven = new Joven();
			//limpiarFechas($sp.nuevoJoven);
			$('#addJoven').modal('hide');
			initTablaJovenes($sp.jovenes);
		}, function (err) {
			$sp.mensaje.mostrar = true;
			$sp.mensaje.descripcion = "¡ERROR!, Debe completar los campos";
			$sp.mensaje.tipo = "add";
			console.log("no guardo");
		});

	};

	/*$sp.EditarJoven = function(obj){

		obj.FechaNacimiento = $('#dateEditNacimiento > input').val();
		obj.FechaIngreso = $('#dateEditIngreso > input').val();

		console.log(obj.FechaNacimiento);
		console.log(obj.FechaIngreso);

		if(obj.Valido()){

			for (var i = 0; i < $sp.jovenes.length; i++) {
				if($sp.jovenes[i].Id === obj.Id){
					$sp.jovenes[i] = obj;
					break;
				}
			}

			$sp.joven = obj;

			$sp.tableParams = new NgTableParams(param,conf);

			$sp.editJoven=false;
			$sp.mensaje.mostrar = false;
			console.log("ok edit");
		}else{
			$sp.mensaje.mostrar = true;
			$sp.mensaje.descripcion = "¡ERROR!, Debe completar los campos";
			$sp.mensaje.tipo = "edit";
			console.log(obj);
		}
	};

	function limpiarFechas(el){
		el.FechaNacimiento = "";
		el.FechaIngreso = "";
	}

	$sp.cambiarFecha= function(tipo){
		var fecha;
		if(tipo === 'edit'){
			fecha = moment($('#dateEditNacimiento > input').val(),"DD/MM/YYYY");
			$('#dateEditIngreso').data("DateTimePicker").minDate(fecha);
			$('#dateEditIngreso > input').val('');
		}else{
			fecha = moment($('#dateAddNacimiento > input').val(),"DD/MM/YYYY");
			$('#dateAddIngreso').data("DateTimePicker").minDate(fecha);
			$('#dateAddIngreso > input').val('');
		}
		fecha = "";
	};

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
	});/*FIN*/


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

	$('.modal-backdrop.fade.in').hide();

}]);