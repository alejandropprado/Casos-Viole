const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

let schema_cosam = new Schema({
	nombre :{type:String,minlength:[3,"Nombre Muy Corto"]},	
	direccion:String,
	telefono:String
});

let Cosam =  mongoose.model("Cosam",schema_cosam);

module.exports = Cosam;