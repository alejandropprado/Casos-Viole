const express = require("express");
const router = express.Router();
const Joven = require('../model/joven');
const findJoven = require('../middleware/findJoven');
const formatJoven = require('../middleware/jovenFormato');
const allJovenes = require('../middleware/allJovenes');
const moment = require('moment');

router.get('/jovenes', (req,resp) => {
	allJovenes(req, resp, () => {
		let jovenes = resp.locals.allJovenes
		return resp.status(200).json({ jovenes });	
	});
});
router.post('/jovenes', (req,resp) => {
	let joven = {
		nombre :req.body.Nombre,
		apellido :req.body.Apellido,
		rut :req.body.Rut,
		fecha_nacimiento : new Date(moment(req.body.FechaNacimiento, 'DD/MM/YYYY')),
		direccion:req.body.Direccion,
		adulto_responsable:req.body.AdultoResponsable,
		numero_contacto:req.body.NumContacto,
		fecha_ingreso: new Date(moment(req.body.FechaIngreso, 'DD/MM/YYYY')),
		rit:req.body.Rit,
		tribunal:req.body.Tribunal
	};
	let opciones = { 
		upsert: true, 
		new: true, 
		setDefaultsOnInsert: true 
	};

	Joven.findOneAndUpdate({rut:joven.rut}, joven, opciones, (err,_joven) => {
		if (err) return resp.status(500).json({message : err });

		return resp.status(200).json({ joven: formatJoven(_joven) });

		/*allJovenes(req, resp, () => {
			let jovenes = resp.locals.allJovenes;
			return resp.status(200).json({ jovenes });	
		});*/
	});
});

router.all("/jovenes/:rut",findJoven);

router.route("/jovenes/:rut")
.get( (req,resp) => {
	let joven = formatJoven(resp.locals.joven);	
	return resp.status(200).json({joven});
})
.put( (req,resp) => {
	let joven = {
		nombre :req.body.Nombre,
		apellido :req.body.Apellido,
		rut :req.body.Rut,
		fecha_nacimiento : new Date(moment(req.body.FechaNacimiento, 'DD/MM/YYYY')),
		direccion:req.body.Direccion,
		adulto_responsable:req.body.AdultoResponsable,
		numero_contacto:req.body.NumContacto,
		fecha_ingreso: new Date(moment(req.body.FechaIngreso, 'DD/MM/YYYY')),
		rit:req.body.Rit,
		tribunal:req.body.Tribunal
	};
	
	Joven.findOneAndUpdate({ rut:resp.locals.joven.rut }, joven, { new : true } ,(err,_joven) => {
		if (err) return resp.status(500).json({message : err });

		console.log(_joven);

		return resp.status(200).json({ joven: formatJoven(_joven) });

		/*allJovenes(req, resp, () => {
			let jovenes = resp.locals.allJovenes;
			return resp.status(200).json({ jovenes });	
		});*/
	});	
})
.delete( (req,resp) => {
	Joven.findOne({ rut : resp.locals.joven.rut }, (err,joven) => {
		if(err) return resp.status(500).json({message : err });
		if(!joven) return resp.status(404).json({message : 'No se ha encontraado el Registro.' });

		joven.remove();

		return resp.status(200).json({ joven: formatJoven(joven) });

		/*allJovenes(req, resp, () => {
			let jovenes = resp.locals.allJovenes;
			return resp.status(200).json({ jovenes });	
		});*/
	});
});

module.exports = router;