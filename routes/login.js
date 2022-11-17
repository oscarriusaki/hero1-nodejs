const { Router } = require('express');
const { check } = require('express-validator');
const { login, googleSignIn } = require('../controller/login');
const validar = require('../middlewares/validar');

const router = Router();

router.post('/',[
    check('pas', 'El password es requerido').not().isEmpty(),
    check('pas', 'El password tiene que ser masde 5 caracteres').isLength({min: 5}),
    check('correo', 'El correo no es valido').isEmail(),
    validar
], login);

router.post('/google', [
    check('id_token', 'El token google es obligatorio').not().isEmpty(),
    validar
], googleSignIn )

module.exports = router;