import { Router } from 'express';
import CartManager from '../services/CartManager.js';
import ProductManager from '../services/ProductManager.js';

const router = Router();

const cartManager = new CartManager();

router.post('/', async (req, res) => {
    try {

        const newCart = await cartManager.createCart();
        
        res.status(201).json(newCart);

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error al crear el carrito' });
    }
});

router.get('/:cid', async (req, res) => {
    try {
        const cartId = parseInt(req.params.cid);
        if (!cartId) {
            return res.status(400).json({ error: 'El id del carrito es obligatorio'});
        }

        const cart = await cartManager.getCartById(cartId);
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado'});
        }

        res.json(cart);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error al obtener el carrito' });
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    try {

        const cartId = parseInt(req.params.cid);
        if (!cartId) {
            return res.status(400).json({ error: 'El id del carrito es obligatorio'});
        }

        const productId = parseInt(req.params.pid);
        if (!productId) {
            return res.status(400).json({ error: 'El id del producto es obligatorio'});
        }

        const productManager = new ProductManager();
        await productManager.init();
        const productExists = await productManager.getProductById(productId);
        console.log(productExists);

        if (!productExists) {
            return res.status(404).json({ error: 'Producto no encontrado'});        
        }

        const updatedCart = await cartManager.addProductToCart(cartId, productId);

        if (!updatedCart) {
            return res.status(404).json({ error: 'Carrito o producto no encontrado'});
        }

        res.json(updatedCart);

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error al agregar el producto al carrito' });
    }
});

export default router;