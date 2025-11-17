import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import handlebars from 'express-handlebars';
import path from 'path'
import crypto from 'crypto'

import { initPassport } from './config/passport.js';
import { setupCurrentStrategy } from './config/passportCurrent.js'

import sessionsRoutes from './routes/sessions.router.js'
import protectedRoutes from './routes/protected.router.js'
import productsRoutes from './routes/products.router.js';
import cartsRoutes from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js'

import { attachUserFromCookie } from './middlewares/auth-cookie.js';
import { errorHandler } from './middlewares/error-handler.js';

const app = express();

app.use((req, res, next) => {
  res.locals.nonce = crypto.randomBytes(16).toString("base64");
  next();
});

app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "default-src": ["'self'"],
        "script-src": [
          "'self'",
          "'unsafe-inline'", // ⚠️ solo para desarrollo
          "https://cdn.jsdelivr.net",
        ],
        "style-src": [
          "'self'",
          "'unsafe-inline'",
          "https://cdn.jsdelivr.net",
        ],
        "connect-src": [
          "'self'",
          "https://cdn.jsdelivr.net",
          "wss://*", // permite websockets (socket.io)
        ],
        "img-src": ["'self'", "data:", "https://cdn.jsdelivr.net"],
        "font-src": ["'self'", "https://cdn.jsdelivr.net"],
      },
    },
  })
);
app.use(cors({ origin: true, credentials: true }));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('src/public'));

/* Cookies firmadas; necesarias para leer las cookie desde  req.signedCookies */
app.use(cookieParser(process.env.COOKIE_SECRET));

// Config Handlebars
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(process.cwd(), 'src', 'views'))

// Passport stateless
initPassport(app)
setupCurrentStrategy()
app.use(attachUserFromCookie);


//Routes
app.get('/health', (_req, res) => res.json({ ok: true }));
app.use('/api/sessions', sessionsRoutes)
app.use('/private', protectedRoutes)
app.use('/api/products', productsRoutes);
app.use('/api/carts', cartsRoutes);
app.use('/', viewsRouter)

app.use(errorHandler);

export default app
