const Horario = require('../model/horario');
const Joven = require('../model/joven');
module.exports = (req,resp,next) => {
	Joven.findOne({ rut: req.params.rutJoven } ,(err, joven) => {
		if(err)	return resp.status(500).json({message : 'Internal Server Error'});
		if(!joven) return resp.status(404).json({message : "Recurso no encontrado"});

		Horario.findOne({joven : joven._id})
		.populate("joven")
		.exec( (err,horario) => {
			if(err)	return resp.status(500).json({message : 'Internal Server Error'});
			if(!horario) return resp.status(404).json({message : "Recurso no encontrado"});
			
			resp.locals.horario = horario;
			next();

		});		
	});	
};