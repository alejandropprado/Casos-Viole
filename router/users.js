const express = require("express");
const router = express.Router();
const User = require('../model/user').User;
const jwt = require('jsonwebtoken');
const TokenKey = require('../middleware/tokenKey');

router.post('/login', (req,resp) => {
	let data = {
		proveedor: req.body.proveedor,
		idProveedor: req.body.idProveedor,
		nombre : req.body.nombre,
		email : req.body.email,
		password : (req.body.idProveedor +'_'+req.body.nombre+'_'+req.body.proveedor),
		imagen : req.body.imagen
	}

	console.log(req.body);

	if(data.proveedor){
		let opciones = { 
			upsert: true, 
			new: true, 
			setDefaultsOnInsert: true 
		};

		console.log(data);

		User.findOneAndUpdate({ idProveedor:data.idProveedor }, data, opciones, (err, usuario) => {
			if (err) return resp.status(500).json({message : err });
			if(!usuario) return resp.status(404).json({message : "Recurso no encontrado"});

			let token = jwt.sign(usuario, TokenKey);

			let token_user = {
				token: token,				
				usuario : {
					nombre : usuario.nombre,
					email : usuario.email,
					proveedor: data.proveedor,
					imagen: data.imagen
				}
			}

			return resp.status(200).json( token_user );			
		});
	}else{
		User.findOne({
			email : req.body.email,
			password : req.body.password
		}, (err, usuario) => {
			if(err)	return resp.status(500).json({message : err});
			if(!usuario) return resp.status(404).json({message : "Recurso no encontrado"});

			let token = jwt.sign(usuario, TokenKey);

			let token_user = {
				token: token,				
				usuario : {
					nombre : usuario.nombre,
					mail : usuario.mail,
					imagen: data.imagen
				}
			}

			return resp.status(200).json( token_user );
		});
	}

});

router.post('/signup', (req,resp) => {
	let datos = {
		nombre: req.body.nombre,
		email : req.body.email,		
		RePassword: req.body.pass_conf,
		password : req.body.password
	};

	if(!/^\s*$/.test(datos.email)){
		let user = new User(datos);
		user.save( (err, user, numrow) => {
			if(err)	return resp.status(500).json({message : err});

			resp.status(200).json({message : 'OK'});
		});
	}

	
});

module.exports = router;