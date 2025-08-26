import express from 'express';
import handlebars from 'express-handlebars'
import { Server } from 'socket.io';
import productsRoutes from './routes/products.router.js';
import cartsRoutes from './routes/carts.router.js';
import { errorHandler } from './middlewares/error-handler.js';
import path from 'path'
import viewsRouter from './routes/views.router.js'

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/', express.static(path.join(process.cwd(), 'src', 'public')));

// Config Handlebars
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(process.cwd(), 'src', 'views'))


const httpServer = app.listen(8080, () => console.log("Servidor escuchando en el puerto 8080"));

const io = new Server(httpServer);

// Para tener socket en el req para usarlo dentro de las rutas
app.set("io", io);

//Routes
app.use('/', viewsRouter)
app.use('/api/products', productsRoutes);
app.use('/api/carts', cartsRoutes);

app.use(errorHandler);
