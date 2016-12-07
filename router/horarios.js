const express = require("express");
const router = express.Router();
const Horario = require('../model/horario');
const Joven = require('../model/joven');
const findHorario = require('../middleware/findHorario');
const formatHorario = require('../middleware/horarioFormato');
const allHorarios = require('../middleware/allHorarios');


router.get('/horarios', (req,resp) => {
	allHorarios(req, resp, () => {
		let horarios = resp.locals.allHorarios;
		return resp.status(200).json({ horarios });	
	});
});

router.post('/horarios', (req,resp) => {
	console.log(req.body);
	console.log('\n');

	Joven.findOne({ rut : req.body.Joven.Rut }, (err, joven) => {
		if(err)	return resp.status(500).json({message : err});
		if(!joven) return resp.status(404).json({message : "Recurso no encontrado"});

		let horario = {
			lunes: req.body.lunes,
			martes: req.body.martes,
			miercoles: req.body.miercoles,
			jueves: req.body.jueves,
			viernes: req.body.viernes,
			terreno: req.body.terreno,
			joven: joven._id
		};
		let opciones = { 
			upsert: true, 
			new: true, 
			setDefaultsOnInsert: true 
		};

		Horario.findOneAndUpdate({ joven : horario.joven }, horario, opciones, (err) => {
			if(err)	return resp.status(500).json({message : err});

			allHorarios(req, resp, () => {
				let horarios = resp.locals.allHorarios;
				return resp.status(200).json({ horarios });	
			});
		});

	});
});

router.all("/horarios/:rutJoven",findHorario);

router.route("/horarios/:rutJoven")
.get( (req,resp) => {
	let horario = formatHorario(resp.locals.horario);
	resp.status(200).json({ horario });
})
.put( (req,resp) => {
	let idJoven = resp.locals.horario.joven._id;
	let horario = {
		lunes: req.body.lunes,
		martes: req.body.martes,
		miercoles: req.body.miercoles,
		jueves: req.body.jueves,
		viernes: req.body.viernes,
		terreno: req.body.terreno
	};

	console.log('id -> '+idJoven);
	console.log(horario);

	Horario.findOneAndUpdate({ joven : idJoven }, horario, (err) => {
		if (err) return resp.status(500).json({message : err });

		allHorarios(req, resp, () => {
			let horarios = resp.locals.allHorarios;
			return resp.status(200).json({ horarios });	
		});		
	});
})
.delete( (req,resp) => {
	let idJoven = resp.locals.horario.joven._id;
	Horario.findOneAndRemove({ joven : idJoven }, (err) => {
		if(err) return resp.status(500).json({message : err });

		allHorarios(req, resp, () => {
			let horarios = resp.locals.allHorarios;
			return resp.status(200).json({ horarios });	
		});
	});
});

module.exports = router;