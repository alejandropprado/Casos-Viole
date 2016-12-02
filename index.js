"use estrict"
/*require*/
const express = require('express');
const mongoose = require('mongoose');
const bodyParser =  require('body-parser');
const rutaJovenes = require('./router/jovenes');
const rutaHorarios = require('./router/horarios');

/*Instancias*/
const app = express();
const puerto = process.env.PORT  || 3500;

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));
app.use('/api',rutaJovenes);
app.use('/api',rutaHorarios);

//Conexion MONGODB
mongoose.connect("mongodb://localhost/casosViole", (err,res) => {
	if(err) return console.log('¡ERROR AL CONECTAR LA BASE DE DATOS!');

	app.listen(puerto, (err) => {
		if(!err){
			console.log(`Conexión iniciada con el puerto ${puerto}`);
		}else{
			console.log(`ERROR -> ${err}`)
		}
	});
});