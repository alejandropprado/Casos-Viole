const Horario = require('../model/horario');
const Joven = require('../model/joven');
const formatHorario = require('../middleware/horarioFormato');
module.exports = (req, resp, next) => {
	Horario.find()
	.populate("joven")
	.exec( (err,horarios) => {
		if(err)	return resp.status(500).json({message : err});
		if(!horarios) return resp.status(404).json({message : "Recurso no encontrado"});

		let todos = [];

		for (let i = horarios.length - 1; i >= 0; i--) {
			todos.push(formatHorario(horarios[i]));
		}

		resp.locals.allHorarios = todos;

		next();
	});
};