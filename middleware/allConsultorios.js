const Consultorio = require('../model/consultorio');
const formatoConsultorio = require('./formatoConsultorioCosam');
const TokenValido = require('./token');
module.exports = (req, resp, next) => {
	TokenValido( req, resp, () => {

		Consultorio.find( ( err, consultorios) => {
			if (err) return resp.status(500).json({ message : err });
			if (!consultorios) return resp.status(404).json({message : "Recurso no encontrado"});

			allConsultorios = [];

			for (var i = consultorios.length - 1; i >= 0; i--) {
				allConsultorios.push(formatoConsultorio(consultorios[i]));
			}

			//resp.locals.allConsultorios = allConsultorios;

			next(allConsultorios);
		});
	});
};