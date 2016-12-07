const jwt = require('jsonwebtoken');
const TokenKey = require('./tokenKey')
module.exports = (req, resp, next) => {

	try {
		let token = null;
		let authorization = req.headers.authorization.split(' ');
		if(authorization.length === 2){
			let key = authorization[0];
			let val = authorization[1];

			if(/^Bearer$/i.test(key)){
				token = val.replace(/"/g,'');
				jwt.verify(token, TokenKey, (err,decode) => {
					if (err) return resp.status(401).json({message : "No esta autorizado para realizar esta acción"});

					next();
				});
			}
		}else {
			return resp.status(401).json({message : "No esta autorizado para realizar esta acción"});
		}
	} catch(e) {
		return resp.status(401).json({message : "No esta autorizado para realizar esta acción"});
	}

	
};