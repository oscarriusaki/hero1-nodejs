const { response } = require("express");
const { validationResult } = require("express-validator");

const validar = (req, res = response, next) => {
    
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            msg: errors,
        })
    }

    next();

}

module.exports = validar;