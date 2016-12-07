const Joven = require('../model/joven');
const TokenValido = require('./token');

module.exports = (req,resp,next) => {
	TokenValido(req,resp, () => {
		Joven.findOne({rut : req.params.rut }, (err, joven) => {
			if (err) return resp.status(500).json({message : "Internal Server Error"});		
			if (!joven) return resp.status(404).json({message : "Recurso no encontrado"});

			resp.locals.joven = joven;
			next();
		});
	});
};