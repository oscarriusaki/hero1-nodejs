const jwt = require('jsonwebtoken');

const generarJWT = (correo = '') => {
    return new Promise(( resolve, reject ) => {
        const payload = {correo};
        jwt.sign(payload, process.env.SECRETORPRIVATEKEY,{
            expiresIn: '420s'
        }, (err, token)=> {
            if(err){
                console.log(err);
                reject('Error no se genero el token');
            }else{
                resolve(token);
            }
        });
    })
}

module.exports ={
    generarJWT,
}