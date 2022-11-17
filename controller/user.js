const { response, json } = require("express");
const pool = require("../database/config");
const bcryptjs = require('bcryptjs');
const { generarJWT } = require("../helpers/generarJWT");

const getUsers = async ( req, res = response) => {

    try{
        const pg = await pool;
        const sql = 'SELECT * FROM USUARIO WHERE estado = $1 order by id_usuario desc'
        pg.query(sql, [ true ], (err, result) => {

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

                if(result.rows.length === 0){
                    return res.status(404).json({
                        msg: 'No se encontro ningun registro'
                    })
                }else{
                    return res.status(200).json({
                        msg: result.rows
                    })
                }

            }
        })

    }catch(err){
        
        return res.status(500).json({
            msg: err
        })

    }
    
}
const getUser = async ( req, res = response) => {
    
    try{

        const pg = await pool;
        const { id } = req.params;
        const sql = 'SELECT * FROM USUARIO WHERE id_usuario =  $1 and estado = $2';

        pg.query(sql, [ id, true], (err, result) => {

            if(err){
                return res.status(500).json({
                    code: err.code, 
                    name: err.name, 
                    hint: err.hint,
                    detail: err.detail,
                    where: err.where,
                    file: err.file
                })
            }else{
                
                if(result.rows.length === 1 ){
                    return res.status(200).json({
                        msg: result.rows
                    })
                }else{
                    return res.status(404).json({
                        msg: `Usuario no encontrado con el id ${id}`
                    })
                }

            }

        })

    }catch(err){
        return res.stutus(500).json({
            msg: err
        })
    }

}
const postUser = async( req, res = response) => {
 
    try{

        const pg = await pool;
        const { id_heroe, ...user } = req.body;

        const yy = new Date().getFullYear();
        const mm = new Date().getMonth() +1 ;
        const dd = new Date().getDate();

        
        const sql = 'SELECT * FROM USUARIO WHERE correo = $1';
        const sql2 = 'INSERT INTO USUARIO(nombre, correo, pas, fecha, estado, tokens) values ($1, $2, $3, $4, $5, $6)';

        pg.query( sql, [ user.correo ], async (err, result) => {
            
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

                if(result.rows.length === 0){

                    try{
                        
                        // generamos la salt
                        const salt = bcryptjs.genSaltSync();
                        user.pas = bcryptjs.hashSync(user.pas, salt)

                        // generamos el token
                        const token = await generarJWT(user.correo);

                        pg.query(sql2, [user.nombre, user.correo, user.pas, (yy+'/'+mm+'/'+dd), true, token], ( err, result ) => {
                            
                            if(err){
                                
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
                                        msg: 'Se registro correctamente',
                                        token
                                    })
                                }else{
                                    return res.status(400).json({
                                        msg: 'Hubo un error al registrar'
                                    })
                                }
                                
                            }
                            
                        })

                    }catch(err){
                        return res.status(500).json({
                            err
                        })
                    }

                }else{

                    return res.status(400).json({
                        msg: 'Ya existe el correo'
                    })

                }

            }
            
        })

    }catch(err){
        return res.status(500).json({
            msg: err
        })
    }

}

const putUser = async ( req, res = response) => {
    
    const pg = await pool;
    const { id_usuario, ...user } = req.body;

    const usuarioLogueado = req.user.correo;
    const token = req.user.tokens;

    const yy = new Date().getFullYear();
    const mm = new Date().getMonth() +1 ;
    const dd = new Date().getDate();


    const sql = 'SELECT * FROM USUARIO WHERE correo = $1';
    const sql2 = 'UPDATE USUARIO SET nombre = $1, correo = $2, pas = $3, fecha = $4 , tokens = $5 WHERE correo = $6';

    pg.query(sql , [ user.correo ] , (err, result) => {

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
            if((result.rows.length === 0) || ((result.rows.length === 1 ) && (result.rows[0].estado === true))){

                if(usuarioLogueado === result.rows[0].correo){
        
                    try{
                        
                        const salt = bcryptjs.genSaltSync();
                        user.pas = bcryptjs.hashSync(user.pas, salt);
                        
                        pg.query(sql2, [user.nombre, user.correo, user.pas, (yy+"/"+mm+"/"+dd), token, user.correo], (err, result) =>{
                        
                        if(err){
                            // console.log(err)
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
                                    msg: 'Actualizado'
                                })
                            }else{
                                return res.status(400).json({
                                    msg:'Error al actualizar'
                                })
                            }
                        }
                        
                    })

                    }catch(err){
                        return res.status(500).json({
                            msg: 'Error'+ err
                        })
                    }
    
                }else{
                    return res.status(401).json({
                        msg: `El token no pertenece al usuario con correo ${user.correo}`
                    })
                }   
                
                
            }else{
                return res.status(400).json({
                    msg: 'El correo ya esta registrado en la base de datos'
                })
            }
        }

    })

}

const deleteUser = async ( req, res = response) => {
    
    const pg = await pool;
    const { correo } = req.body;
    
    const usuarioLogueado = req.user.correo;

    const sql = 'SELECT * FROM USUARIO WHERE correo = $1 and estado = $2';
    const sql2 = 'UPDATE USUARIO SET estado = $1 WHERE correo = $2';

    pg.query(sql ,[ correo, true] , (err, result) =>  {

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

                if(result.rows[0].correo === usuarioLogueado){

                    
                    pg.query(sql2, [ false, correo] , (err, result) => {
                        
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

                            if(result.rowCount){
                                
                                return res.status(200).json({
                                    msg: 'Eliminado con exito'
                                })
                                
                            }else{
                                return res.status(400).json({
                                    msg: 'Error al eliminar un usuario'
                                })
                            }
                            
                        }
                        
                    });

                }else{

                    return res.status(404).json({
                        msg: `El token no pertenece al usuario con correo ${correo}`
                    })
                    
                }

            }else{
                
                return res.status(404).json({
                    msg: `no se encontro al usuario con correo ${correo}`
                })

            }
        }

    })

}

module.exports = {
    getUsers,
    getUser,
    postUser,
    putUser,
    deleteUser
}