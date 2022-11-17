const { response } = require("express");
const pool = require("../database/config");

const getHeroes = async (req, res = response) => {
    const pg = await pool;

    const sql = 'SELECT * FROM HEROE WHERE estado = $1 ORDER BY id_heroe desc';

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

            if(result.rows.length >= 1){
                
                return res.status(200).json(
                    result.rows
                )

            }else{
                return res.status(404).json({
                    msg: 'No encontro registro de heroes'
                })
            }

        }

    })

}
const getHeroe = async(req, res = response) => {
    
    const pg = await pool;
    const { id } = req.params;

    const sql = 'SELECT * FROM HEROE WHERE id_heroe = $1 and estado = true';
    pg.query(sql, [ id ], (err, result) => {
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
                return res.status(200).json(
                    result.rows
                )
            }else{
                return res.status(404).json({
                    msg: `No se encontro al heroe con el id ${id}`
                })
            }

        }
    });

}
const postHeroe = async (req, res = response) => {
    
    const pg = await pool;
    const id_usuario_logueado = req.user.id_usuario;
    const { id_heroe, ... resto } = req.body

    const sql = 'INSERT INTO HEROE (id_usuario, nombre, bio, img, aparicion, casa, estado) values ($1,$2,$3,$4,$5,$6,$7)';
    pg.query(sql, [ id_usuario_logueado, resto.nombre, resto.bio, resto.img, resto.aparicion, resto.casa, true], (err, result) => {
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
                    msg: 'Se registro correctamente'
                })
            }else{
                return res.status(400).json({
                    msg: 'Hubo un error al registrar heroe'
                })
            }
        }
    })

}

const putHeroe = async (req, res = response) => {
    const pg = await pool;
    const id_usuario_logueado = req.user.id_usuario
    const { id } = req.params;
    const { id_heroe, id_usuario, ...resto } = req.body;

    const sql = 'SELECT * FROM HEROE WHERE id_heroe = $1 AND estado = $2';
    const sql2 = 'UPDATE HEROE SET nombre = $1, bio = $2, img = $3, aparicion = $4, casa = $5 WHERE id_heroe = $6 ';

    pg.query(sql, [ id, true], (err , result) => {
        if(err){
            console.log(id)
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
                

                console.log(result)
                if(result.rows[0].id_usuario === id_usuario_logueado){
                 
                    pg.query(sql2, [ resto.nombre, resto.bio, resto.img, resto.aparicion, resto.casa, id ], (err, result) => {
                        if(err){
                            return res.status(500).json({
                                code: err.code, 
                                name: serr.name, 
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
                                    msg: 'Hubo un error al actualizar el heroe'
                                })
                            }
                        }
                    })
                }else{

                    return res.status(404).json({
                        msg: `El heroe con id ${id} no pertenece al usuario con id ${id_usuario_logueado}`
                    })

                }

            }else{
                    
                    return res.status(404).json({
                        msg: `No exise el hero con id ${id}`
                    })

            }
        }
    })
}

const deleteHeroe = async (req, res = response) => {

    const pg = await pool;
    const id_usuario_logueado = req.user.id_usuario;
    const { id } = req.params;

    const sql = 'SELECT * FROM HEROE WHERE id_heroe = $1 AND estado = $2';
    const sql2 = 'UPDATE HEROE SET estado = $1 WHERE id_heroe = $2';

    pg.query(sql, [id, true], (err, result) => {

        if(err){
            return res.status(500).json({
                code: err.code, 
                name: serr.name, 
                hint: err.hint,
                detail: err.detail,
                where: err.where,
                file: err.file,
            })
        }else{

            if(result.rows.length === 1){

                if(id_usuario_logueado === result.rows[0].id_usuario){
                    
                    pg.query(sql2, [ false, id ], (err, result) => {
                        
                        if(err){
                            return res.status(500).json({
                                code: err.code, 
                                name: serr.name, 
                                hint: err.hint,
                                detail: err.detail,
                                where: err.where,
                                file: err.file,
                            })
                        }else{
                            
                            if(result.rowCount === 1){
                                return res.status(200).json({
                                    msg: 'Se elimino correctamente'
                                });
                            }else{
                                return res.status(400).json({
                                    msg: 'Error No se pudo eliminar'
                                });
                            }
                            
                        }
                        
                    });

                }else{
                    return res.status(400).json({
                        msg: `El usuario con id ${id_usuario_logueado} no pertenece al heroe con id ${id}`
                    })
                }
                
            }else{
                return res.status(404).json({
                    msg: `No se encontro ningun heroe con el id ${id}`
                });
            }
            
        }
        
    })
}

module.exports = {
    getHeroes,
    getHeroe,
    postHeroe,
    putHeroe,
    deleteHeroe,
}
