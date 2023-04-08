import express from 'express';
import { cartManager, manager } from '../app.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    await cartManager.addCart();
    res.json({ status: 'success', message: 'Carrito añadido.' });
  } catch (error) {
    res.status(404).json({ status: 'error', error: `${error}` });
  }
});

router.get('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartManager.getCartProducts(cid);
    res.json({ status: 'success', payload: cart });
  } catch (error) {
    res.status(404).json({ status: 'error', error: `${error}` });
  }
});

router.post('/:cid/products/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const product = await manager.getProductById(pid);
    await cartManager.addProductToCart(product, cid);
    const cartProducts = await cartManager.getCartProducts(cid);
    res.json({ status: 'success', payload: cartProducts });
  } catch (error) {
    res.status(404).json({ status: 'error', error: `${error}` });
  }
});

router.delete('/:cid/products/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    await cartManager.deleteProductInCart(cid, pid);
    res.json({ status: 'success', message: 'Producto eliminado.' });
  } catch (error) {
    res.status(404).json({ status: 'error', error: `${error}` });
  }
});

export default router;
