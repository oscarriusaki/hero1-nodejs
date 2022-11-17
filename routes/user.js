const { Router } = require('express');
const { check } = require('express-validator');
const { getUsers, getUser, postUser, putUser, deleteUser } = require('../controller/user');
const validar = require('../middlewares/validar');
const { validarJWT } = require('../middlewares/validarJWT');

const router = Router();

router.get('/', getUsers);

router.get('/:id', [
    check('id', 'No es valido').isNumeric(),
    validar
], getUser);

router.post('/',[
    check('nombre', 'El nombre no es requerido').not().isEmpty(),
    check('correo', 'El correo es requerido').not().isEmpty(),
    check('correo', 'El correo no es valido').isEmail(),
    check('pas', 'El password es requerido').not().isEmpty(),
    check('pas', 'El password tiene que ser mas de 4 letras').isLength({min:5}),
    validar
], postUser);

router.put('/', [
    validarJWT,
    // check('id', 'El id no es valido').isNumeric(),
    check('nombre','El nombre es requerido').not().isEmpty(),
    check('correo','El correo es requerido').not().isEmpty(),
    check('correo','El correo no es valido').isEmail(),
    check('pas','EL password es requerido').not().isEmpty(),
    check('pas','El password debe ser de mas de 5 letras').isLength({min: 5}),
    validar
], putUser);

router.delete('/', [
    validarJWT,
    check('correo', 'El correo es requerido').not().isEmpty(),
    check('correo', 'El correo no es valido').isEmail(),
    validar
], deleteUser);

module.exports = router;
