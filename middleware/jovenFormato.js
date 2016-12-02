module.exports = (joven) => {
	let jovenFormat = {
		nombre : joven.nombre,
		apellido : joven.apellido,
		rut : joven.rut,
		fecha_nacimiento : joven.fecha_nacimiento,
		direccion: joven.direccion,
		adulto_responsable: joven.adulto_responsable,
		numero_contacto: joven.numero_contacto ,
		fecha_ingreso: joven.fecha_ingreso,
		rit: joven.rit,
		tribunal: joven.tribunal
	};

	return jovenFormat ;
};