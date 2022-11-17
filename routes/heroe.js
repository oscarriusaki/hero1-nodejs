const { Router } = require('express');
const { check } = require('express-validator');
const { getHeroes, getHeroe, postHeroe, putHeroe, deleteHeroe } = require('../controller/heroe');
const validar = require('../middlewares/validar');
const { validarJWT } = require('../middlewares/validarJWT');

const router = Router();

router.get('/', getHeroes);
router.get('/:id',[
    check('id', 'El id no es valido').isNumeric(),
    validar
], getHeroe);
router.post('/',[
    validarJWT,
    check('nombre', 'El nobre es requerido'),
    check('bio', 'La bio es requerido'),
    check('img', 'La img es requerido'),
    check('aparicion', 'La aparicion es requerida'),
    check('casa', 'La casa es requerida'),
    validar
], postHeroe);

router.put('/:id',[
    validarJWT,
    check('id', 'El id no es valido').isNumeric(),
    check('nombre', 'El nobre es requerido'),
    check('bio', 'La bio es requerido'),
    check('img', 'La img es requerido'),
    check('aparicion', 'La aparicion es requerida'),
    check('casa', 'La casa es requerida'),
    validar
], putHeroe);

router.delete('/:id',[
    validarJWT,
    check('id', 'El id no es valido').isNumeric(),
    validar
], deleteHeroe);

module.exports = router;
