const Consultorio = require('../model/consultorio');
const TokenValido = require('./token');

module.exports = (req,resp,next) => {
	TokenValido(req,resp, () => {
		Consultorio.findOne({_id : req.params.id }, (err, consultorio) => {
			if (err) return resp.status(500).json({message : "Internal Server Error"});		
			if (!consultorio) return resp.status(404).json({message : "Recurso no encontrado"});

			resp.locals.consultorio = consultorio;
			next();
		});
	});
};