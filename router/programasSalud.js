const express = require("express");
const router = express.Router();
const ProgramaSalud = require('../model/programaSalud');
const TokenValido = require('../middleware/token');
const allProgramasSalud = require('../middleware/allProgramasSalud');
const findProgramaSalud = require('../middleware/findProgramaSalud');
const formatoProgramaSalud = require('../middleware/formatoConsultorioCosam');

router.get( '/programa-salud', (req, resp) => {
	allProgramasSalud( req, resp, (programasSalud) => {
		return resp.status(200).json( { programasSalud : programasSalud } );
	});
});

router.post( '/programa-salud', (req, resp) => {

	data = {
		nombre: req.body.Nombre,
		direccion : req.body.Direccion,
		telefono : req.body.Telefono
	};

	let programaSalud = new ProgramaSalud(data);

	programaSalud.save( (err, nuevoPrograma) => {
		if (err) if (err) return resp.status(500).json( {message : err });

		resp.status(200).json({ programaSalud : formatoProgramaSalud(nuevoPrograma) });

	});
});

router.all('/programa-salud/:id', findProgramaSalud);

router.route('/programa-salud/:id')
.get( (req, resp) => {
	return resp.status(200).json({ programaSalud : formatoProgramaSalud(resp.locals.programaSalud) });
})
.put( (req, resp) => {
	let programaSalud = resp.locals.programaSalud;
	let datos = {
		nombre : req.body.Nombre,
		direccion : req.body.Direccion,
		telefono : req.body.Telefono
	}

	ProgramaSalud.findOneAndUpdate( {_id : programaSalud._id }, datos, { new : true}, (err, _programaSalud) => {
		if (err) return resp.status(500).json({message : err });

		return resp.status(200).json( { programaSalud : formatoProgramaSalud(_programaSalud) } );
	});
})
.delete( (req, resp) => {
	let programaSalud = resp.locals.programaSalud;
	ProgramaSalud.findOne({ _id : programaSalud._id }, (err,_programaSalud) => {
		if(err) return resp.status(500).json({message : err });
		if(!programaSalud) return resp.status(404).json({message : 'No se ha encontraado el Registro.' });

		programaSalud.remove();

		return resp.status(200).json({ programaSalud : formatoProgramaSalud(_programaSalud) });
	});
});

module.exports = router;