const express = require("express");
const router = express.Router();
const Horario = require('../model/horario');
const Joven = require('../model/joven');
const findHorario = require('../middleware/findHorario');
const formatHorario = require('../middleware/horarioFormato');
const allHorarios = require('../middleware/allHorarios');
const TokenValido = require('../middleware/token.js');


router.get('/horarios', (req,resp) => {
	allHorarios(req, resp, () => {
		let horarios = resp.locals.allHorarios;
		return resp.status(200).json({ horarios });	
	});
});

router.post('/horarios', (req,resp) => {

	Joven.findOne({ rut : req.body.Joven.Rut }, (err, joven) => {
		if(err)	return resp.status(500).json({message : err});
		if(!joven) return resp.status(404).json({message : "Recurso no encontrado"});

		TokenValido(req,resp, (userId) => {
			let horario = {
				lunes: req.body.lunes,
				martes: req.body.martes,
				miercoles: req.body.miercoles,
				jueves: req.body.jueves,
				viernes: req.body.viernes,
				terreno: req.body.terreno,
				joven: joven._id,
				usuario: userId
			};
			let opciones = { 
				upsert: true, 
				new: true, 
				setDefaultsOnInsert: true 
			};

			Horario.findOneAndUpdate({ joven : horario.joven, usuario : horario.usuario }, horario, opciones, (err) => {
				if(err)	return resp.status(500).json({message : err});

				allHorarios(req, resp, () => {
					let horarios = resp.locals.allHorarios;
					return resp.status(200).json({ horarios });	
				});
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
	let horario = {
		lunes: req.body.lunes,
		martes: req.body.martes,
		miercoles: req.body.miercoles,
		jueves: req.body.jueves,
		viernes: req.body.viernes,
		terreno: req.body.terreno
	};

	Horario.findOneAndUpdate({ _id : resp.locals.horario._id }, horario, (err) => {
		if (err) return resp.status(500).json({message : err });

		allHorarios(req, resp, () => {
			let horarios = resp.locals.allHorarios;
			return resp.status(200).json({ horarios });	
		});		
	});
})
.delete( (req,resp) => {
	
	Horario.findOneAndRemove({ _id : resp.locals.horario._id }, (err) => {
		if(err) return resp.status(500).json({message : err });

		allHorarios(req, resp, () => {
			let horarios = resp.locals.allHorarios;
			return resp.status(200).json({ horarios });	
		});
	});
});

module.exports = router;