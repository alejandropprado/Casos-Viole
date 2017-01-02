const express = require("express");
const router = express.Router();
const Cosam = require('../model/cosam');
const TokenValido = require('../middleware/token');

router.get( '/cosam', (req, resp) => {
	Cosam.find( (err, cosams) => {
		if (err) return resp.status(500).json( {message : err });
		if(!cosams) return resp.status(404).json( { message : 'No hay registros'} );

		return resp.status(200).json( { cosams } );
	});
});

router.post( '/cosam', (req, resp) => {

	data = {
		nombre: req.body.nombre,
		direccion : req.body.direccion,
		telefono : req.body.telefono
	};

	let cosam = new Cosam(data);

	cosam.save( (err, nuevoCosam) => {
		if (err) if (err) return resp.status(500).json( {message : err });

		resp.status(200).json({nuevoCosam});

	});
});

module.exports = router;