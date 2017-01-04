const express = require("express");
const router = express.Router();
const Cosam = require('../model/cosam');
const TokenValido = require('../middleware/token');
const allCosam = require('../middleware/allCosam');
const findCosam = require('../middleware/findCosam');
const formatoCosam = require('../middleware/formatoConsultorioCosam');

router.get( '/cosam', (req, resp) => {
	allCosam( req, resp, (cosam) => {
		return resp.status(200).json( { cosam : cosam } );
	});
});

router.post( '/cosam', (req, resp) => {

	data = {
		nombre: req.body.Nombre,
		direccion : req.body.Direccion,
		telefono : req.body.Telefono
	};

	let cosam = new Cosam(data);

	cosam.save( (err, nuevoCosam) => {
		if (err) if (err) return resp.status(500).json( {message : err });

		resp.status(200).json({ cosam : formatoCosam(nuevoCosam) });

	});
});

router.all('/cosam/:id', findCosam);

router.route('/cosam/:id')
.get( (req, resp) => {
	return resp.status(200).json({ cosam : formatoCosam(resp.locals.cosam) });
})
.put( (req, resp) => {
	let cosam = resp.locals.cosam;
	let datos = {
		nombre : req.body.Nombre,
		direccion : req.body.Direccion,
		telefono : req.body.Telefono
	}

	Cosam.findOneAndUpdate( {_id : cosam._id }, datos, { new : true}, (err, _cosam) => {
		if (err) return resp.status(500).json({message : err });

		return resp.status(200).json( { cosam : formatoCosam(_cosam) } );
	});
})
.delete( (req, resp) => {
	let cosam = resp.locals.cosam;
	Cosam.findOne({ _id : cosam._id }, (err,_cosam) => {
		if(err) return resp.status(500).json({message : err });
		if(!_cosam) return resp.status(404).json({message : 'No se ha encontraado el Registro.' });

		_cosam.remove();

		return resp.status(200).json({ cosam: formatoCosam(_cosam) });
	});
});

module.exports = router;