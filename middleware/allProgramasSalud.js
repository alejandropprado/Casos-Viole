const ProgramaSalud = require('../model/programaSalud');
const formatoPrograma = require('./formatoConsultorioCosam');
const TokenValido = require('./token');
module.exports = (req, resp, next) => {
	TokenValido( req, resp, () => {

		ProgramaSalud.find( ( err, programas) => {
			if (err) return resp.status(500).json({ message : err });
			if (!programas) return resp.status(404).json({message : "Recurso no encontrado"});

			allProgramasSalud = [];

			for (var i = programas.length - 1; i >= 0; i--) {
				allProgramasSalud.push(formatoPrograma(programas[i]));
			}

			//resp.locals.allProgramasSalud = allProgramasSalud;

			next(allProgramasSalud);
		});
	});
};