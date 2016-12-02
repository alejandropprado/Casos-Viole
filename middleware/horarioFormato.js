const formatJoven = require('./jovenFormato');
module.exports = (horario) => {
	let horarioFormat = {
		lunes: horario.lunes,
		martes: horario.martes,
		miercoles: horario.miercoles,
		jueves: horario.jueves,
		viernes: horario.viernes,
		terreno: horario.terreno,
		joven: formatJoven(horario.joven)
	};

	return horarioFormat;
};