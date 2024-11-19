import { Router } from 'express';
import ProductManager from '../services/ProductManager.js';

const router = Router();

const productManager = new ProductManager();

router.get('/', async (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
        const products = await productManager.getAllProducts(limit);

        res.json(products);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
});

router.get('/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        if (!productId) {
            return res.status(400).json({ error: 'El id del producto es obligatorio'});
        }

        const product = await productManager.getProductById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado'});
        }

        res.json(product);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
});

router.post('/', async (req, res) => {
    try {
        
        const { title, description, price, code, stock, category, thumbnail } = req.body;

        if (!title || !description || !price || !code || !stock || !category) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios excepto thumbnail' });
        }

        const newProduct = await productManager.addProduct({ title, description, price, code, stock, category, thumbnail });

        res.status(201).json(newProduct);
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error al agregar el producto' });
    }
});

router.put('/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        if (!productId) {
            return res.status(400).json({ error: 'El id del producto es obligatorio'});
        }

        const updatedProduct = await productManager.updateProduct(productId, req.body);
        if (!updatedProduct) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.json(updatedProduct);

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
});

router.delete('/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        if (!productId) {
            return res.status(400).json({ error: 'El id del producto debe ser un número válido'});
        }
        
        const deletedProduct = await productManager.deleteProduct(productId);
        if (deletedProduct) {
            res.json(deletedProduct);
        } else {
            res.status(404).json({ error: 'No se pudo eliminar el producto' });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
});


export default router;