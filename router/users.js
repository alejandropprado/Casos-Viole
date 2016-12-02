const express = require("express");
const router = express.Router();

ruter.post('/login', (req,resp) => {
	let user = {
		email : req.fields.email,
		password : req.fields.password
	};
});
ruter.post('/signup', (req,resp) => {
	let user = {
		nombre: req.fields.nombre,
		apellido: req.fields.apellido,
		email : req.fields.email,
		password : req.fields.password
	};
});