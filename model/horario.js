const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;


let schema_horario = new Schema({
	lunes:String,
	martes:String,
	miercoles:String,
	jueves:String,
	viernes:String,
	terreno:{type:Boolean,default:false},
	joven:{type:Schema.Types.ObjectId,ref:'Joven'},
	usuario:{type:Schema.Types.ObjectId,ref:'User'}
});

let Horario =  mongoose.model("Horario",schema_horario);

module.exports = Horario;