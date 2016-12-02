const express = require("express");
const router = express.Router();
const Horario = require('../model/horario');
const Joven = require('../model/joven');
const findHorario = require('../middleware/findHorario');
const formatHorario = require('../middleware/horarioFormato');


router.get('/horarios', (req,resp) => {
	Horario.find()
	.populate("joven")
	.exec( (err,horarios) => {
		if(err)	return resp.status(500).json({message : 'Internal Server Error'});
		if(!horarios) return resp.status(404).json({message : "Recurso no encontrado"});

		let todos = [];

		for (let i = horarios.length - 1; i >= 0; i--) {
			todos.push(formatHorario(horarios[i]));
		}

		resp.status(200).json({ horarios:todos });
	});
});

router.all("/horarios/:rutJoven",findHorario);

router.route("/horarios/:rutJoven")
.get( (req,resp) => {
	let horario = formatHorario(resp.locals.horario);
	resp.status(200).json({ horario });
})
.put( (req,resp) => {
	let horario = resp.locals.horario;
})
.delete( (req,resp) => {
	let horario = resp.locals.horario;
});

module.exports = router;