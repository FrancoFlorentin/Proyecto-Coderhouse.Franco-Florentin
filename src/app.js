import express from 'express';
import productsRoutes from './routes/products.js';
import cartsRoutes from './routes/carts.js';
import { errorHandler } from './middlewares/error-handler.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

//Routes
app.use('/api/products', productsRoutes);
app.use('/api/carts', cartsRoutes);

app.use(errorHandler);

app.listen(8080, () => console.log("Servidor escuchando en el puerto 8080"));