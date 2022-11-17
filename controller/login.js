const { response } = require("express");
const pool = require("../database/config");
const bcryptjs = require('bcryptjs');
const { generarJWT } = require("../helpers/generarJWT");
const { googleVerify } = require("../helpers/google-verify");

const login = async ( req, res = response ) => {
    
    const pg = await pool;
    const { correo, pas} = req.body;
    
    const sql = 'SELECT * FROM usuario WHERE correo = $1 AND estado = $2';
    pg.query(sql, [ correo, true], async( err, result ) => {
        
        if(err){
            return res.status(500).json({
                code: err.code, 
                name: err.name, 
                hint: err.hint,
                detail: err.detail,
                where: err.where,
                file: err.file
            });
        }else{
            if(result.rows.length === 1){

                try{
                    const passwordVerify = bcryptjs.compareSync(pas, result.rows[0].pas);
                    if(passwordVerify){
                        // generar token
                        const token = await generarJWT(correo);

                        return res.status(200).json({
                            msg: 'Usuario logueado',
                            token,
                        });

                    }else{
                        return res.status(400).json({
                            msg: 'El password no coincide'
                        })
                    }

                }catch(err){
                    console.log(err);
                    return res.status(500).json({
                        msg: 'Error hable con el administrador'
                    });
                }

            }else{
                return res.status(400).json({
                    msg: `Error no se encontro el usuario con correo ${correo}`
                })
            }
        }

    })

}

const googleSignIn = async (req, res) => {
    const pg = await pool;

    const {id_token} = req.body;

    try{

        const { nombre, img, correo} = await googleVerify( id_token );
        
        const sql = 'SELECT * FROM USUARIO WHERE correo = $1 AND estado = $2';
        pg.query(sql, [correo, true], async (err, result) => {
            
            if(err){
                return res.status(500).json({
                    code: err.code, 
                    name: err.name, 
                    hint: err.hint,
                    detail: err.detail,
                    where: err.where,
                    file: err.file
                });
            }else{
                
                if(result.rows.length === 1){
                    return res.status(200).json({
                        msg: 'Usuario logueado'
                    })
                }else{

                    if(result.rows.length === 0){

                        try{
                            // registramos

                            const yy = new Date().getFullYear();
                            const mm = new Date().getMonth() + 1;
                            const dd = new Date().getDate();

                            const sql2 = 'INSERT INTO USUARIO (nombre, pas, correo, fecha, estado, tokens)values($1,$2,$3,$4,$5,$6)';
                            
                            const tokenGenerado = await generarJWT(correo) ;

                            // encriptando password
                            const salt = bcryptjs.genSaltSync();
                            const passwordG = bcryptjs.hashSync('google', salt);

                            pg.query(sql2, [ nombre, passwordG, correo, (yy +'/'+ mm +'/'+ dd), true, tokenGenerado], (err, result) => {

                                if(err){
                                    console.log(err);
                                    return res.status(500).json({
                                        code: err.code, 
                                        name: err.name, 
                                        hint: err.hint,
                                        detail: err.detail,
                                        where: err.where,
                                        file: err.file
                                    })
                                }else{
                                    if(result.rowCount === 1){
                                        return res.status(200).json({
                                            msg: 'Usuario registrado correctamente',
                                            id_token
                                        })
                                    }else{
                                        return res.status(400).json({
                                            msg: 'Error al registrar el usuario'
                                        })
                                    }
                                }

                            })
                        }catch(err){
                            return res.status(500).json({
                                msg: 'Error hable cone el administrador'
                            })
                        }
                        
                    }else{   
                        return res.status(404).json({
                            msg: `No se encontro al usuario cone correo ${correo}`
                        })
                    }
                }
            }

        })

/*         res.status(200).json({
            msg: 'Todo Ok',
            id_token
        })
 */
    }catch(err){

        res.status(400).json({
            ok: false,
            msg: 'El token no se pudo verificar'
        })

    }
}

module.exports = {
    login,
    googleSignIn
}