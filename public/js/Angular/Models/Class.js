var Consultorio = (function () {
	function Consultorio(id, nombre, dir, tel) {
		this.Id = id;
		this.Nombre = nombre;
		this.Direccion = dir;
		this.Telefono = tel;
	}
	return Consultorio;
}());

var Cosam = (function(){
	function Cosam(id,nombre,dir,tel){
		this.Id=id;
		this.Nombre=nombre;
		this.Direccion=dir;
		this.Telefono=tel;
	}
	return Cosam;
}());

var HorarioReal = (function(){
	function HorarioReal(lu,ma,mi,ju,vi,terreno,joven){
		this.lunes= lu || "";
		this.martes= ma || "";
		this.miercoles= mi || "";
		this.jueves= ju || "";
		this.viernes= vi || "";	

		this.terreno = terreno || false;
		this.Joven = joven;	
	}
	return HorarioReal;
}());

var Joven = (function () {
	function Joven(nombre, apellido, rut, fechaNacimiento, dire, adulto, contacto, ingreso, rit, tribunal, consultorio,cosam) {
		this.Nombre = nombre;
		this.Apellido = apellido;
		this.Rut = rut;
		this.FechaNacimiento = fechaNacimiento;
		this.Direccion = dire;
		this.AdultoResponsable = adulto;
		this.NumContacto = contacto;
		this.FechaIngreso = ingreso;
		this.Rit = rit;
		this.Tribunal = tribunal;
		this.Consultorio = consultorio || null;
		this.Cosam = cosam || null;
	}
	Joven.prototype.getTiempo = function () {
		var ingresoAnio = (new Date(moment(this.FechaIngreso, "DD/MM/YYYY"))).getFullYear();
		var AnioAhora = (new Date()).getFullYear();
		var ingresomes = (new Date(moment(this.FechaIngreso, "DD/MM/YYYY"))).getMonth();
		var mesAhora = (new Date()).getMonth();
		return ((AnioAhora - ingresoAnio) * 12) + mesAhora - ingresomes;
	};	
	Joven.prototype.Valido = function () {
		if (this.Nombre.trim() === "") {
			console.log(1);
			return false;
		}
		else if (this.Apellido.trim() === "") {
			console.log(2);
			return false;
		}
		else if (this.Rut.trim() === "") {
			console.log(3);
			return false;
		}
		else if (this.FechaNacimiento.trim() === "") {
			console.log(4);
			return false;
		}
		else if (this.Direccion.trim() === "") {
			console.log(5);
			return false;
		}
		else if (this.AdultoResponsable.trim() === "") {
			console.log(6);
			return false;
		}
		else if (this.NumContacto.toString().trim() === "") {
			console.log(7);
			return false;
		}
		else if (this.FechaIngreso.trim() === "") {
			console.log(8);
			return false;
		}
		else if (this.Rit.trim() === "") {
			console.log(1);
			return false;
		}
		else if (this.Tribunal.trim() === "") {
			console.log(1);
			return false;
		}
		return true;
	};
	return Joven;
}());