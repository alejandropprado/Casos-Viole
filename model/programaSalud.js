const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

let schema_programa = new Schema({
	nombre :{type:String,minlength:[3,"Nombre Muy Corto"]},	
	direccion:String,
	telefono:String
});

let programaSalud =  mongoose.model("ProgramaSalud",schema_programa);

module.exports = programaSalud;