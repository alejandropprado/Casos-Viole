const express = require("express");
const router = express.Router();
const User = require('../model/user').User;
const jwt = require('jsonwebtoken');
const TokenKey = require('../middleware/tokenKey');

router.post('/login', (req,resp) => {
	let user = {
		email : req.body.email,
		password : req.body.password
	};

	User.findOne(user, (err, usuario) => {
		if(err)	return resp.status(500).json({message : err});
		if(!usuario) return resp.status(404).json({message : "Recurso no encontrado"});

		let token = jwt.sign(usuario, TokenKey);
		return resp.status(200).json( token );
	});

});

router.post('/signup', (req,resp) => {
	let datos = {
		nombre: req.body.nombre,
		email : req.body.email,
		password : req.body.password
	};
	let user = new User(datos);
	user.save( (err,user,numrow) => {
		if(err)	return resp.status(500).json({message : err});

		resp.status(200).json({message : 'OK'});
	});
});

module.exports = router;