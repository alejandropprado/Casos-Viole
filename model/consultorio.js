const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

let schema_consu = new Schema({
	nombre :{type:String,minlength:[3,"Nombre Muy Corto"]},	
	direccion:String,
	telefono:String
});

let Consultorio =  mongoose.model("Consultorio",schema_consu);

module.exports = Consultorio;