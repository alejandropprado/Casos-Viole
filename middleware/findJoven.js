const Joven = require('../model/joven');
module.exports = (req,resp,next) => {
	Joven.findOne({rut : req.params.rut }, (err, joven) => {
		if (err) return resp.status(500).json({message : "Internal Server Error"});		
		if (!joven) return resp.status(404).json({message : "Recurso no encontrado"});

		resp.locals.joven = joven;
		next();
	});
};