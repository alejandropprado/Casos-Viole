const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

let propiedadesSchema = {
	toObject: { virtuals: true },
	toJSON: { virtuals: true }
};

//validadores 
let exp_reg_correo = [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/,"Ingresa un Email valido"];

//ESQUEMA 
const schemaUser = new Schema({
	nombre:{ 
		type : String, 
		minLength: [3,'El Nombre es muy corto'],
		required: "El campo Email es obligatorio."
	},	
	email:{ 
		type: String, 
		required: "El campo Email es obligatorio.", 
		match:exp_reg_correo,
		index: { unique: true, required : true }
	},
	password:{
		type: String, 
		minLenght: [8,"Contraseña muy corta"]
	},
	proveedor: String,
	idProveedor: String,
	imagen : { type:String, default: '/img/default.png'}
}, propiedadesSchema);

//Virtuals 
schemaUser.virtual("RePassword")
.get( () => {
	return this.rePass;
})
.set( (rp) => {
	this.rePass = rp;
});

//Validaciones por campo
schemaUser.path('password').validate(function (v, next) {
	next(v === this.RePassword);
}, 'Las contraseñas no coinciden.'); 

let User = mongoose.model("User",schemaUser);

module.exports.User = User;