app.controller('ctrlHorarios', ['$scope','$controller','NgTableParams','$http','ApiJovenes', function($sp,$controller,NgTableParams,$http,ApiHorarios){
	$controller('ctrlCasos', {$scope : $sp });

	$sp.instaciaHorario = [];
	$sp.mensaje ={mostrar:false,tipo:"",descripcion:""};
	resetNewHorario();

	function initTablaHorarios(array) {
		var param = {
			page:1,
			count:5
		};
		var conf={
			dataset: array,
			counts:[5,10,15]
		};
		$sp.tableHorarios = new NgTableParams(param,conf);
	}
	
	ActionAPI('GET', '/api/horarios', {}, function(horarios){
		$sp.Horarios = horarios;
		console.log($sp.Horarios);
		initTablaHorarios($sp.Horarios);
	}, function(err){
		console.log(err);
	});

	$sp.addHorario = function(){	
		$('#addHorario').modal();
	};

	$sp.EditHorarioFn = function(horario){	
		console.log(horario);
		$sp.mensaje.mostrar = false;
		$sp.editHorario = new HorarioReal(horario.lunes,horario.martes,horario.miercoles,horario.jueves,horario.viernes,horario.terreno,horario.Joven);
		$('#editHorario').modal();
	};

	$sp.EditHorarioOK = function(){

		console.log($sp.editHorario);

		if($('#lunesEdit > input').val()!==""){
			$sp.editHorario.lunes = $('#lunesEdit > input').val();
		}
		if($('#martesEdit > input').val()!==""){
			$sp.editHorario.martes = $('#martesEdit > input').val();
		}
		if($('#miercolesEdit > input').val()!==""){
			$sp.editHorario.miercoles = $('#miercolesEdit > input').val();
		}
		if($('#juevesEdit > input').val()!==""){
			$sp.editHorario.jueves = $('#juevesEdit > input').val();
		}
		if($('#viernesEdit > input').val()!==""){
			$sp.editHorario.viernes = $('#viernesEdit > input').val();
		}

		ActionAPI('PUT','/api/horarios/'+$sp.editHorario.Joven.Rut,$sp.editHorario,function(horarios){
			$sp.Horarios = horarios;
			initTablaHorarios($sp.Horarios);
			$('#editHorario').modal('hide');
		},function(err){
			console.log(err);
			$sp.mensaje.mostrar = true;
			$sp.mensaje.descripcion = "¡ERROR!, Al modificar el horario";
			$sp.mensaje.tipo = "editHorario";
		});


		
	};

	$('#deleteH').confirmation({
		onConfirm: function() {
			ActionAPI('DELETE','/api/horarios/'+$sp.editHorario.Joven.Rut,{}, function (horarios) {
				$sp.Horarios = horarios;
				$sp.editHorario = new HorarioReal();
				$sp.joven = null;
				initTablaHorarios($sp.Horarios);
				$('#editHorario').modal('hide');
			}, function (err) {
				$sp.mensaje.mostrar = true;
				$sp.mensaje.descripcion = "¡ERROR!, Al eliminar";
				$sp.mensaje.tipo = "editHorario";
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

	$sp.addHorarioOK= function(){
		if($sp.newHorario.Joven !==undefined && $sp.newHorario.Joven!==null){
			var valida = false;

			if($sp.newHorario.terreno){
				valida = true;
			}			
			if($('#lunes > input').val()!==""){
				$sp.newHorario.lunes = $('#lunes > input').val();
				valida = true;
			}
			if($('#martes > input').val()!==""){
				$sp.newHorario.martes = $('#martes > input').val();
				valida = true;
			}
			if($('#miercoles > input').val()!==""){
				$sp.newHorario.miercoles = $('#miercoles > input').val();
				valida = true;
			}
			if($('#jueves > input').val()!==""){
				$sp.newHorario.jueves = $('#jueves > input').val();
				valida = true;
			}
			if($('#viernes > input').val()!==""){
				$sp.newHorario.viernes = $('#viernes > input').val();
				valida = true;
			}

			if(valida){
				ActionAPI('POST','/api/horarios',$sp.newHorario,function(horarios){
					$sp.Horarios = horarios;
					initTablaHorarios($sp.Horarios);
					$('#addHorario').modal('hide');
				},function(err){
					$sp.mensaje.mostrar = true;
					$sp.mensaje.descripcion = "¡ERROR!, Ha ocurrido un error al ingresar los datos.";
					$sp.mensaje.tipo = "addHorario";
					console.log(err);
				});
			}else{
				$sp.mensaje.mostrar = true;
				$sp.mensaje.descripcion = "¡ERROR!, Debe ingresar todos los campos";
				$sp.mensaje.tipo = "addHorario";
				console.log("no Agrego");
			}


			resetNewHorario();
		}
	};

	function ActionAPI(method,url,data,success,error){
		ApiHorarios.Api(method,url, data).then(
			function (data){
				var arrayHorarios = data.horarios;
				var horarios = [] ;
				for (var i = arrayHorarios.length - 1; i >= 0; i--) {  
					var horario = new HorarioReal(
						arrayHorarios[i].lunes,
						arrayHorarios[i].martes,
						arrayHorarios[i].miercoles,
						arrayHorarios[i].jueves,
						arrayHorarios[i].viernes,
						arrayHorarios[i].terreno,
						new Joven(
							arrayHorarios[i].joven.nombre, 
							arrayHorarios[i].joven.apellido, 
							arrayHorarios[i].joven.rut, 
							moment(arrayHorarios[i].joven.fecha_Nacimiento).format('DD/MM/YYYY'), 
							arrayHorarios[i].joven.direccion, 
							arrayHorarios[i].joven.adulto_responsable, 
							arrayHorarios[i].joven.numero_contacto, 
							moment(arrayHorarios[i].joven.fecha_ingreso).format('DD/MM/YYYY'), 
							arrayHorarios[i].joven.rit, 
							arrayHorarios[i].joven.tribunal
							)
						);
					horarios.push(horario);
				}

				try {
					success(horarios);
				}
				catch(err) {}
			},function (err){
				try {
					error(err);
				}catch (e){}
			});
	}

	function resetNewHorario(){
		$sp.newHorario = {};
		$('#lunes > input').val("");
		$('#martes > input').val("");
		$('#miercoles > input').val("");
		$('#jueves > input').val("");
		$('#viernes > input').val("");

	}

	$('#lunes').datetimepicker({
		format: 'LT'
	});
	$('#martes').datetimepicker({
		format: 'LT'
	});
	$('#miercoles').datetimepicker({
		format: 'LT'
	});
	$('#jueves').datetimepicker({
		format: 'LT'
	});
	$('#viernes').datetimepicker({
		format: 'LT'
	});
	/*EDIT*/
	$('#lunesEdit').datetimepicker({
		format: 'LT'
	});
	$('#martesEdit').datetimepicker({
		format: 'LT'
	});
	$('#miercolesEdit').datetimepicker({
		format: 'LT'
	});
	$('#juevesEdit').datetimepicker({
		format: 'LT'
	});
	$('#viernesEdit').datetimepicker({
		format: 'LT'
	});

}]);