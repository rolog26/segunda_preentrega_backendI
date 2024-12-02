import express from 'express';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import handlebars from 'express-handlebars';
import __dirname from './utils.js';
import viewsRouter from './routes/views.router.js';
import { Server } from 'socket.io';

const app = express();

const PORT = 8080;
const httpServer = app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`)
});
const io = new Server(httpServer);

app.engine('handlebars', handlebars.engine());

app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + '/public'));
app.use('/', viewsRouter);

io.on('connection', socket => {
    console.log('Nuevo cliente conectado');

    socket.on('product-added', (product) => {
        console.log('Nuevo producto recibido:', product);
        io.emit('product-added', product);
    });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/products', productsRouter);

app.use('/api/carts', cartsRouter);
