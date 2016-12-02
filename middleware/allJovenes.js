const Joven = require('../model/joven');
const formatJoven = require('../middleware/jovenFormato');
module.exports = (req, resp, next) => {
	Joven.find((err, jovenes) => {
		if (err) return resp.status(500).json({message : "Internal Server Error"});
		if (!jovenes) return resp.status(404).json({message : "Recurso no encontrado"});

		let todos = [];
		for (var i = jovenes.length - 1; i >= 0; i--) {
			todos.push(formatJoven(jovenes[i]));
		}			

		resp.locals.allJovenes = todos; 

		next();
	});
};