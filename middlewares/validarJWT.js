const jwt = require('jsonwebtoken');
const pool = require('../database/config');

const validarJWT = async(req, res, next) =>{
    
    const pg = await pool;

    const token = req.header('x-token');
    if(!token){
        return res.status(404).json({
            msg: 'Token no se ha enviado',
        })
    }

    try{

        const { correo } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        
        const sql = 'SELECT * FROM USUARIO WHERE correo = $1 and estado = $2';

        pg.query(sql,[correo, true] , (err, result) => {

            if(err){
                return res.status(500).json({
                    code: err.code, 
                    name: err.name, 
                    hint: err.hint,
                    detail: err.detail,
                })
            }else{
                
                if(result.rows.length === 1){
                    
                    req.user = result.rows[0];
                    
                    next();

                }else{
                    return res.status(404).json({
                        msg: `No se encontro al usuario con el correo ${correo}`
                    })
                }
            }

        })
        

    }catch(err){
        console.log(err)
        return res.status(401).json({
            msg: 'Token expiro o error al validar el token'
        })
    }

}

module.exports = {
    validarJWT
}