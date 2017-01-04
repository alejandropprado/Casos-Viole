const Cosam = require('../model/cosam');
const formatoCosam = require('./formatoConsultorioCosam');
const TokenValido = require('./token');
module.exports = (req, resp, next) => {
	TokenValido( req, resp, () => {

		Cosam.find( ( err, cosam) => {
			if (err) return resp.status(500).json({ message : err });
			if (!cosam) return resp.status(404).json({message : "Recurso no encontrado"});

			allCosam = [];

			for (var i = cosam.length - 1; i >= 0; i--) {
				allCosam.push(formatoCosam(cosam[i]));
			}

			//resp.locals.allConsultorios = allConsultorios;

			next(allCosam);
		});
	});
};