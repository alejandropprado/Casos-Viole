module.exports = (dato) => {
	let formato = null;

	if(dato){
		formato = {
			id : dato._id,
			nombre : dato.nombre,
			direccion : dato.direccion,
			telefono : dato.telefono
		};
	}

	return formato;
};