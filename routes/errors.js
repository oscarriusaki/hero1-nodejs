const { Router } = require('express');

const router = Router();

router.get('*', (req, res) => {
   res.sendFile(__dirname.substring(0, __dirname.search('routes')) + 'public/404.html') 
});

router.post('*', (req, res) => {
   return res.status(404).json({
      msg: 'Error no se encontro la ruta revise la ruta'
   })
});
router.put('*', (req, res) => {
   return res.status(404).json({
      msg: 'Error no se encontro la ruta revise la ruta'
   })
});
router.delete('*', (req, res) => {
   return res.status(404).json({
      msg: 'Error no se encontro la ruta revise la ruta'
   })
});

module.exports = router;
