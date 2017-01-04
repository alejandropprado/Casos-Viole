const express = require("express");
const router = express.Router();
const Consultorio = require('../model/consultorio');
const TokenValido = require('../middleware/token');
const allConsultorios = require('../middleware/allConsultorios');
const findConsultorio = require('../middleware/findConsultorio');
const formatoConsultorio = require('../middleware/formatoConsultorioCosam');


router.get( '/consultorios', (req, resp) => {
	allConsultorios( req, resp, (consultorios) => {
		return resp.status(200).json( { consultorios : consultorios } );
	});
});

router.post( '/consultorios', (req, resp) => {

	data = {
		nombre: req.body.Nombre,
		direccion : req.body.Direccion,
		telefono : req.body.Telefono
	};

	let consultorio = new Consultorio(data);

	consultorio.save( (err, nuevoCosnultorio) => {
		if (err) if (err) return resp.status(500).json( {message : err });

		resp.status(200).json({ consultorio : formatoConsultorio(nuevoCosnultorio) });

	});
});

router.all('/consultorios/:id', findConsultorio);

router.route('/consultorios/:id')
.get( (req, resp) => {
	return resp.status(200).json({ consultorio : formatoConsultorio(resp.locals.consultorio) });
})
.put( (req, resp) => {
	let consultorio = resp.locals.consultorio;
	let datos = {
		nombre : req.body.Nombre,
		direccion : req.body.Direccion,
		telefono : req.body.Telefono
	}

	Consultorio.findOneAndUpdate( {_id : consultorio._id }, datos, { new : true}, (err, _consultorio) => {
		if (err) return resp.status(500).json({message : err });

		return resp.status(200).json( { consultorio : formatoConsultorio(_consultorio) } );
	});
})
.delete( (req, resp) => {
	let consultorio = resp.locals.consultorio;
	Consultorio.findOne({ _id : consultorio._id }, (err,_consultorio) => {
		if(err) return resp.status(500).json({message : err });
		if(!_consultorio) return resp.status(404).json({message : 'No se ha encontraado el Registro.' });

		_consultorio.remove();

		return resp.status(200).json({ consultorio: formatoConsultorio(_consultorio) });
	});
});


module.exports = router;