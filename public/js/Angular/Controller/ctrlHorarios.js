app.controller('ctrlHorarios', ['$scope','$controller','NgTableParams','$http', function($sp,$controller,NgTableParams,$http){
	$controller('ctrlCasos', {$scope : $sp });

	$sp.instaciaHorario = [		
	];

	//este sera el horario definitivo
	/*$sp.Horarios = [
	new HorarioReal(1,[DiasSemana[0],DiasSemana[1]],['12:20 PM','12:30 PM'],false,$sp.jovenes[0]),
	new HorarioReal(2,[DiasSemana[2]],['12:50 PM'],true,$sp.jovenes[1]),
	new HorarioReal(3,[DiasSemana[3],DiasSemana[4]],['11:00 AM','1:00 PM'],false,$sp.jovenes[2]),
	];*/
	$sp.Horarios = [];

	var param = {
		page:1,
		count:5
	};
	var conf={
		dataset: $sp.Horarios,
		counts:[5,10,15]
	};
	
	$sp.tableHorarios = new NgTableParams(param,conf);
	resetNewHorario();
		

	$http.get('/api/horarios')
	.success(function(data) {
		//$sp.Horarios = data.horarios;
		console.log(data.horarios)
		$sp.tableHorarios = new NgTableParams(param,conf);
	})
	.error(function(data) {
		console.log('Error: ' + data);
	});

	$sp.addHorario = function(){	

		$('#addHorario').modal();
	};

	$sp.EditHorarioFn = function(horario){	

		$sp.editHorario = new HorarioReal(horario.Id,horario.Dia,horario.Hora,horario.Terreno,horario.Joven);
		$('#editHorario').modal();
	};

	$sp.EditHorarioOK = function(){

		console.log($sp.editHorario);


		var Dias=[],Horas=[];

		if($('#lunesEdit > input').val()!==""){
			$sp.editHorario.lunes = $('#lunesEdit > input').val();
			Dias.push(DiasSemana[0]);
			Horas.push($sp.editHorario.lunes);
		}
		if($('#martesEdit > input').val()!==""){
			$sp.editHorario.martes = $('#martesEdit > input').val();
			Dias.push(DiasSemana[1]);
			Horas.push($sp.editHorario.martes);
		}
		if($('#miercolesEdit > input').val()!==""){
			$sp.editHorario.miercoles = $('#miercolesEdit > input').val();
			Dias.push(DiasSemana[2]);
			Horas.push($sp.editHorario.miercoles);
		}
		if($('#juevesEdit > input').val()!==""){
			$sp.editHorario.jueves = $('#juevesEdit > input').val();
			Dias.push(DiasSemana[3]);
			Horas.push($sp.editHorario.jueves);
		}
		if($('#viernesEdit > input').val()!==""){
			$sp.editHorario.viernes = $('#viernesEdit > input').val();
			Dias.push(DiasSemana[4]);
			Horas.push($sp.editHorario.viernes);
		}

		$sp.editHorario.Hora = Horas;
		$sp.editHorario.Dia = Dias;

		console.log($sp.editHorario);



		for (var i = 0; i < $sp.Horarios.length; i++) {
			if($sp.Horarios[i].Id === $sp.editHorario.Id){
				$sp.Horarios[i] = $sp.editHorario;
				break;
			}
		}
		$sp.tableHorarios = new NgTableParams(param,conf);	
		$('#editHorario').modal('hide');
	};

	$sp.addHorarioOK= function(){
		if($sp.newHorario.Joven !==undefined && $sp.newHorario.Joven!==null){
			var valida = false;
			var repetido = false;

			var joven = $sp.newHorario.Joven;
			var terreno = false;		
			if($sp.newHorario.Terreno === "true"){
				terreno = true;
			}

			if($('#lunes > input').val()!==""){
				$sp.newHorario.lunes = $('#lunes > input').val();
			}
			if($('#martes > input').val()!==""){
				$sp.newHorario.martes = $('#martes > input').val();
			}
			if($('#miercoles > input').val()!==""){
				$sp.newHorario.miercoles = $('#miercoles > input').val();
			}
			if($('#jueves > input').val()!==""){
				$sp.newHorario.jueves = $('#jueves > input').val();
			}
			if($('#viernes > input').val()!==""){
				$sp.newHorario.viernes = $('#viernes > input').val();
			}

			/*if($('#lunes > input').val()!==""){
				$sp.newHorario.Dia.push(DiasSemana[0]);
				$sp.newHorario.Hora.push($('#lunes > input').val());
				valida = true;
			}
			if($('#martes > input').val()!==""){
				$sp.newHorario.Dia.push(DiasSemana[1]);
				$sp.newHorario.Hora.push($('#martes > input').val());
				valida = true;
			}
			if($('#miercoles > input').val()!==""){
				$sp.newHorario.Dia.push(DiasSemana[2]);
				$sp.newHorario.Hora.push($('#miercoles > input').val());
				valida = true;
			}
			if($('#jueves > input').val()!==""){
				$sp.newHorario.Dia.push(DiasSemana[3]);
				$sp.newHorario.Hora.push($('#jueves > input').val());
				valida = true;
			}
			if($('#viernes > input').val()!==""){
				$sp.newHorario.Dia.push(DiasSemana[4]);
				$sp.newHorario.Hora.push($('#viernes > input').val());
				valida = true;
			}
			console.log($sp.Horarios.length);
			for (var i = 0; i < $sp.Horarios.length; i++) {
				//console.log($sp.newHorario.Joven.Id +" === "+$sp.Horarios[i].Joven.Id);
				if($sp.newHorario.Joven.Id === $sp.Horarios[i].Joven.Id){	
					repetido = true;			
					for (var j = 0; j < $sp.newHorario.Dia.length; j++) {
						console.log($sp.newHorario.Dia[j].dia);
						switch($sp.newHorario.Dia[j].dia){
							case 'lunes':
							$sp.Horarios[i].lunes=$sp.newHorario.Hora[j];
							console.log("SI -> Lunes");
							break;
							case 'martes':
							$sp.Horarios[i].martes=$sp.newHorario.Hora[j];
							console.log("SI -> Martes");
							break;
							case 'miercoles':
							$sp.Horarios[i].miercoles=$sp.newHorario.Hora[j];
							console.log("SI -> Miercoles");
							break;
							case 'jueves':
							$sp.Horarios[i].jueves=$sp.newHorario.Hora[j];
							console.log("SI -> Jueves");
							break;
							case 'viernes':
							$sp.Horarios[i].viernes=$sp.newHorario.Hora[j];
							console.log("SI -> Viernes");
							break;
						}
					}
					$sp.Horarios[i].Terreno = $sp.newHorario.Terreno;
				}
			}

		//recorro y busco el ultimo id
		if(!repetido){
			var id = 0;
			for (var i = 0; i < $sp.Horarios.length; i++) {
				if($sp.Horarios[i].Id > id){
					id = $sp.Horarios[i].Id + 1;
				}
			}			

			if(valida || terreno){

				$sp.Horarios.push(new HorarioReal(id,$sp.newHorario.Dia,$sp.newHorario.Hora,terreno,joven));
				$sp.tableHorarios = new NgTableParams(param,conf);
				$sp.mensaje ={mostrar:false,tipo:"",descripcion:""};

			}else{
				$sp.mensaje ={mostrar:true,tipo:"addHorario",descripcion:"Debe seleccionar al menos un campo"};
			}
		}*/
		
		resetNewHorario();
	}
};

function resetNewHorario(){
	$sp.newHorario = {};
	$sp.newHorario.Dia = [];
	$sp.newHorario.Hora = [];

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