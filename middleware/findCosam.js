const Cosam = require('../model/cosam');
const TokenValido = require('./token');

module.exports = (req,resp,next) => {
	TokenValido(req,resp, () => {
		Cosam.findOne({_id : req.params.id }, (err, cosam) => {
			if (err) return resp.status(500).json({message : "Internal Server Error"});		
			if (!cosam) return resp.status(404).json({message : "Recurso no encontrado"});

			resp.locals.cosam = cosam;
			next();
		});
	});
};