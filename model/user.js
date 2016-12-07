const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

let exp_reg_correo = [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/,"Ingresa un Email valido"];

let chemaUser = new Schema({
	nombre:{ type:String, minLength: [3,'El Nombre es muy corto']},
	password:{
		type: String, 
		required: "El campo Contraseña es obligatorio.", 
		minLenght: [8,"Contraseña muy corta"]
	},
	email:{ type: String, required: "El campo Email es obligatorio.", match:exp_reg_correo }
});

var User = mongoose.model("User",chemaUser);

module.exports.User = User;