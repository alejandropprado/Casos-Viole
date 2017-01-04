const ProgramaSalud = require('../model/programaSalud');
const TokenValido = require('./token');

module.exports = (req,resp,next) => {
	TokenValido(req,resp, () => {
		ProgramaSalud.findOne({_id : req.params.id }, (err, programaSalud) => {
			if (err) return resp.status(500).json({message : "Internal Server Error"});		
			if (!programaSalud) return resp.status(404).json({message : "Recurso no encontrado"});

			resp.locals.programaSalud = programaSalud;
			next();
		});
	});
};