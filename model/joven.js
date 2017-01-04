const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
const Horario = require('./horario');

let schema_joven = new Schema({
	nombre :{type:String,minlength:[3,"Nombre Muy Corto"]},
	apellido :{type:String,minlength:[3,"Apellido Muy Corto"]},
	rut :{type:String},
	fecha_nacimiento :{type:Date, default: new Date()},
	direccion:String,
	adulto_responsable:{type:String,default:''},
	numero_contacto:{type:String,default:''},
	fecha_ingreso:{type:Date,default: new Date()},
	rit:{type:String,default: ''},
	tribunal:String,
	consultorio : { type : Schema.Types.ObjectId, ref : 'Consultorio' },
	cosam : { type : Schema.Types.ObjectId, ref : 'Cosam' },
	programaSalud : { type : Schema.Types.ObjectId, ref : 'ProgramaSalud' }
});

schema_joven.post('remove', (data) => {
	Horario.remove({ joven:data.id}).exec();
});

let Joven =  mongoose.model("Joven",schema_joven);

module.exports = Joven;