import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
    res.render('home', {
        title: 'Lista de productos'
    });
})

router.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts', {
        title: 'Formulario de productos'
    });
})

export default router;